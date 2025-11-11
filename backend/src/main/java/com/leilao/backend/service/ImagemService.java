package com.leilao.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.leilao.backend.dto.ImagemDTO;
import com.leilao.backend.exception.NegocioExcecao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.leilao.backend.exception.NaoEncontradoExcecao;
import com.leilao.backend.model.Imagem;
import com.leilao.backend.model.Leilao;
import com.leilao.backend.repository.ImagemRepository;

@Service
public class ImagemService {

    @Autowired
    private ImagemRepository imagemRepository;

    @Autowired
    private LeilaoService leilaoService;

    @Value("${app.upload.dir:uploads/imagens}")
    private String uploadDir;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_TYPES = List.of("image/jpeg", "image/jpg", "image/png", "image/gif");

    public List<Imagem> listarTodas() {
        return imagemRepository.findAll();
    }

    public Page<Imagem> listarTodasPaginado(Pageable pageable) {
        return imagemRepository.findAll(pageable);
    }

    public Imagem buscarPorId(Long id) {
        return imagemRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoExcecao("Imagem não encontrada"));
    }

    public Imagem salvar(Imagem imagem) {
        imagem.setDataHoraCadastro(LocalDateTime.now());
        return imagemRepository.save(imagem);
    }

    public Imagem uploadImagem(MultipartFile file, Long leilaoId) throws IOException {
        // Validações
        if (file.isEmpty()) {
            throw new NegocioExcecao("Arquivo vazio");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new NegocioExcecao("Arquivo muito grande. Tamanho máximo: 5MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new NegocioExcecao("Tipo de arquivo não permitido. Use: JPEG, PNG ou GIF");
        }

        Leilao leilao = leilaoService.buscarPorId(leilaoId);

        // Gerar nome único
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
            ? originalFilename.substring(originalFilename.lastIndexOf("."))
            : "";
        String nomeUnico = UUID.randomUUID().toString() + extension;

        // Criar diretório se não existir
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Salvar arquivo
        Path filePath = uploadPath.resolve(nomeUnico);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Salvar no banco
        Imagem imagem = new Imagem();
        imagem.setNomeImagem(nomeUnico);
        imagem.setLeilao(leilao);
        imagem.setDataHoraCadastro(LocalDateTime.now());

        return imagemRepository.save(imagem);
    }

    public void deletar(Long id) {
        Imagem imagem = buscarPorId(id);

        // Deletar arquivo físico
        try {
            Path filePath = Paths.get(uploadDir, imagem.getNomeImagem());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log do erro mas continua a exclusão do registro
            System.err.println("Erro ao deletar arquivo: " + e.getMessage());
        }

        imagemRepository.delete(imagem);
    }

    public List<Imagem> buscarPorLeilao(Leilao leilao) {
        return imagemRepository.findByLeilao(leilao);
    }

    public List<ImagemDTO> buscarPorLeilaoDTO(Long leilaoId) {
        Leilao leilao = leilaoService.buscarPorId(leilaoId);
        return imagemRepository.findByLeilao(leilao).stream()
            .map(this::converterParaDTO)
            .collect(Collectors.toList());
    }

    public ImagemDTO converterParaDTO(Imagem imagem) {
        ImagemDTO dto = new ImagemDTO();
        dto.setId(imagem.getId());
        dto.setNomeImagem(imagem.getNomeImagem());
        dto.setUrlImagem("/uploads/imagens/" + imagem.getNomeImagem());
        dto.setDataHoraCadastro(imagem.getDataHoraCadastro());

        if (imagem.getLeilao() != null) {
            dto.setLeilaoId(imagem.getLeilao().getId());
        }

        return dto;
    }
}
