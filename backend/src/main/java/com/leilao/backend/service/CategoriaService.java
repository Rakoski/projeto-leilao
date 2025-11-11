package com.leilao.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import com.leilao.backend.dto.CategoriaDTO;
import com.leilao.backend.exception.NegocioExcecao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.leilao.backend.exception.NaoEncontradoExcecao;
import com.leilao.backend.model.Categoria;
import com.leilao.backend.model.Pessoa;
import com.leilao.backend.repository.CategoriaRepository;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll();
    }

    public Page<Categoria> listarTodasPaginado(Pageable pageable) {
        return categoriaRepository.findAll(pageable);
    }

    public Categoria buscarPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoExcecao("Categoria não encontrada"));
    }

    public Categoria salvar(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    public Categoria criar(CategoriaDTO dto, Pessoa criador) {
        Categoria categoria = new Categoria();
        categoria.setNome(dto.getNome());
        categoria.setObservacao(dto.getObservacao());
        categoria.setCriador(criador);

        return categoriaRepository.save(categoria);
    }

    public Categoria atualizar(Long id, CategoriaDTO dto) {
        Categoria categoriaExistente = buscarPorId(id);
        categoriaExistente.setNome(dto.getNome());
        categoriaExistente.setObservacao(dto.getObservacao());
        return categoriaRepository.save(categoriaExistente);
    }

    public void deletar(Long id) {
        Categoria categoria = buscarPorId(id);

        // Verificar se há leilões vinculados
        if (categoria.getLeiloes() != null && !categoria.getLeiloes().isEmpty()) {
            throw new NegocioExcecao("Não é possível excluir categoria com leilões vinculados");
        }

        categoriaRepository.delete(categoria);
    }

    public List<Categoria> buscarPorCriador(Pessoa criador) {
        return categoriaRepository.findByCriador(criador);
    }

    public List<Categoria> buscarPorNome(String nome) {
        return categoriaRepository.findByNomeContainingIgnoreCase(nome);
    }

    public Page<Categoria> buscarPorNomePaginado(String nome, Pageable pageable) {
        return categoriaRepository.findByNomeContainingIgnoreCasePage(nome, pageable);
    }

    public CategoriaDTO converterParaDTO(Categoria categoria) {
        CategoriaDTO dto = new CategoriaDTO();
        dto.setId(categoria.getId());
        dto.setNome(categoria.getNome());
        dto.setObservacao(categoria.getObservacao());

        if (categoria.getCriador() != null) {
            dto.setCriadorId(categoria.getCriador().getId());
            dto.setCriadorNome(categoria.getCriador().getNome());
        }

        return dto;
    }
}
