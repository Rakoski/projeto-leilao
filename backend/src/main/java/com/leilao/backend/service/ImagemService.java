package com.leilao.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leilao.backend.exception.NaoEncontradoExcecao;
import com.leilao.backend.model.Imagem;
import com.leilao.backend.model.Leilao;
import com.leilao.backend.repository.ImagemRepository;

@Service
public class ImagemService {

    @Autowired
    private ImagemRepository imagemRepository;

    public List<Imagem> listarTodas() {
        return imagemRepository.findAll();
    }

    public Imagem buscarPorId(Long id) {
        return imagemRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoExcecao("Imagem não encontrada"));
    }

    public Imagem salvar(Imagem imagem) {
        imagem.setDataHoraCadastro(LocalDateTime.now());
        return imagemRepository.save(imagem);
    }

    public void deletar(Long id) {
        Imagem imagem = buscarPorId(id);
        imagemRepository.delete(imagem);
    }

    public List<Imagem> buscarPorLeilao(Leilao leilao) {
        return imagemRepository.findByLeilao(leilao);
    }
}
