package com.leilao.backend.controller;

import java.io.IOException;
import java.util.List;

import com.leilao.backend.dto.ImagemDTO;
import com.leilao.backend.dto.PaginaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.leilao.backend.model.Imagem;
import com.leilao.backend.service.ImagemService;

@RestController
@RequestMapping("/imagens")
public class ImagemController {
    
    @Autowired
    private ImagemService imagemService;
    
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PaginaDTO<ImagemDTO>> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dataHoraCadastro") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Imagem> pageResultado = imagemService.listarTodasPaginado(pageable);
        Page<ImagemDTO> pageDTOs = pageResultado.map(imagemService::converterParaDTO);

        return ResponseEntity.ok(new PaginaDTO<>(pageDTOs));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ImagemDTO> buscarPorId(@PathVariable Long id) {
        Imagem imagem = imagemService.buscarPorId(id);
        return ResponseEntity.ok(imagemService.converterParaDTO(imagem));
    }
    
    @PostMapping("/upload")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'VENDEDOR')")
    public ResponseEntity<ImagemDTO> uploadImagem(
            @RequestParam("file") MultipartFile file,
            @RequestParam("leilaoId") Long leilaoId) throws IOException {
        Imagem imagemSalva = imagemService.uploadImagem(file, leilaoId);
        return ResponseEntity.status(HttpStatus.CREATED).body(imagemService.converterParaDTO(imagemSalva));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'VENDEDOR')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        imagemService.deletar(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/leilao/{leilaoId}")
    public ResponseEntity<List<ImagemDTO>> buscarPorLeilao(@PathVariable Long leilaoId) {
        List<ImagemDTO> imagens = imagemService.buscarPorLeilaoDTO(leilaoId);
        return ResponseEntity.ok(imagens);
    }
}
