package com.leilao.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

    public Categoria buscarPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoExcecao("Categoria não encontrada"));
    }

    public Categoria salvar(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    public Categoria atualizar(Long id, Categoria categoria) {
        Categoria categoriaExistente = buscarPorId(id);
        categoriaExistente.setNome(categoria.getNome());
        categoriaExistente.setObservacao(categoria.getObservacao());
        return categoriaRepository.save(categoriaExistente);
    }

    public void deletar(Long id) {
        Categoria categoria = buscarPorId(id);
        categoriaRepository.delete(categoria);
    }

    public List<Categoria> buscarPorCriador(Pessoa criador) {
        return categoriaRepository.findByCriador(criador);
    }

    public List<Categoria> buscarPorNome(String nome) {
        return categoriaRepository.findByNomeContainingIgnoreCase(nome);
    }
}
