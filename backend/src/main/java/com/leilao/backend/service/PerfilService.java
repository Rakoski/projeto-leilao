package com.leilao.backend.service;

import com.leilao.backend.dto.PerfilDTO;
import com.leilao.backend.exception.NegocioExcecao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.leilao.backend.exception.NaoEncontradoExcecao;
import com.leilao.backend.model.Perfil;
import com.leilao.backend.repository.PerfilRepository;

import java.util.List;

@Service
public class PerfilService {
    @Autowired
    private PerfilRepository perfilRepository;

    @Autowired
    private MessageSource messageSource;

    public Perfil inserir(PerfilDTO dto) {
        // Verificar se já existe perfil com este tipo
        if (perfilRepository.existsByTipo(dto.getTipo())) {
            throw new NegocioExcecao("Já existe um perfil com este tipo");
        }

        Perfil perfil = new Perfil();
        perfil.setTipo(dto.getTipo());

        return perfilRepository.save(perfil);
    }

    public Perfil alterar(Long id, PerfilDTO dto) {
        Perfil perfilBanco = buscarPorId(id);

        // Verificar se o novo tipo já existe em outro perfil
        if (!perfilBanco.getTipo().equals(dto.getTipo()) &&
            perfilRepository.existsByTipo(dto.getTipo())) {
            throw new NegocioExcecao("Já existe um perfil com este tipo");
        }

        perfilBanco.setTipo(dto.getTipo());
        return perfilRepository.save(perfilBanco);
    }

    public void excluir(Long id) {
        Perfil perfilBanco = buscarPorId(id);
        perfilRepository.delete(perfilBanco);
    }

    public Perfil buscarPorId(Long id) {
        return perfilRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoExcecao(messageSource.getMessage("perfil.notfound",
                        new Object[] { id }, LocaleContextHolder.getLocale())));
    }

    public Page<Perfil> buscarTodos(Pageable pageable) {
        return perfilRepository.findAll(pageable);
    }

    public List<Perfil> listarTodos() {
        return perfilRepository.findAll();
    }

    public PerfilDTO converterParaDTO(Perfil perfil) {
        PerfilDTO dto = new PerfilDTO();
        dto.setId(perfil.getId());
        dto.setTipo(perfil.getTipo());
        return dto;
    }

}
