package com.leilao.backend.service;

import com.leilao.backend.exception.NaoEncontradoExcecao;
import com.leilao.backend.exception.NegocioExcecao;
import com.leilao.backend.model.Perfil;
import com.leilao.backend.model.Pessoa;
import com.leilao.backend.model.PessoaPerfil;
import com.leilao.backend.repository.PessoaPerfilRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PessoaPerfilService {

    @Autowired
    private PessoaPerfilRepository pessoaPerfilRepository;

    @Autowired
    private PessoaService pessoaService;

    @Autowired
    private PerfilService perfilService;

    @Transactional
    public PessoaPerfil adicionarPerfil(Long pessoaId, Long perfilId) {
        Pessoa pessoa = pessoaService.buscarPorId(pessoaId);
        Perfil perfil = perfilService.buscarPorId(perfilId);

        // Verificar se já existe
        if (pessoaPerfilRepository.findByPessoaAndPerfil(pessoa, perfil).isPresent()) {
            throw new NegocioExcecao("Pessoa já possui este perfil");
        }

        PessoaPerfil pessoaPerfil = new PessoaPerfil();
        pessoaPerfil.setPessoa(pessoa);
        pessoaPerfil.setPerfil(perfil);

        return pessoaPerfilRepository.save(pessoaPerfil);
    }

    @Transactional
    public void removerPerfil(Long pessoaId, Long perfilId) {
        Pessoa pessoa = pessoaService.buscarPorId(pessoaId);
        Perfil perfil = perfilService.buscarPorId(perfilId);

        PessoaPerfil pessoaPerfil = pessoaPerfilRepository.findByPessoaAndPerfil(pessoa, perfil)
            .orElseThrow(() -> new NaoEncontradoExcecao("Pessoa não possui este perfil"));

        pessoaPerfilRepository.delete(pessoaPerfil);
    }

    public List<PessoaPerfil> listarPerfisPessoa(Long pessoaId) {
        Pessoa pessoa = pessoaService.buscarPorId(pessoaId);
        return pessoaPerfilRepository.findByPessoa(pessoa);
    }
}

