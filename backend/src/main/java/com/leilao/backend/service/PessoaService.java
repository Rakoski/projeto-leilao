package com.leilao.backend.service;

import com.leilao.backend.dto.PessoaCriacaoDTO;
import com.leilao.backend.dto.PessoaRespostaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import com.leilao.backend.exception.NaoEncontradoExcecao;
import com.leilao.backend.model.Pessoa;
import com.leilao.backend.repository.PessoaRepository;

@Service
public class PessoaService implements UserDetailsService {
    @Autowired
    private PessoaRepository pessoaRepository;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private EmailService emailService;

    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    public Pessoa inserir(PessoaCriacaoDTO pessoaCriacaoDTO) {
        Pessoa pessoa = new Pessoa();
        if (pessoaCriacaoDTO.getNome() != null && !pessoaCriacaoDTO.getNome().isEmpty()) {
            pessoa.setNome(pessoaCriacaoDTO.getNome());
        }
        if (pessoaCriacaoDTO.getEmail() != null && !pessoaCriacaoDTO.getEmail().isEmpty()) {
            pessoa.setEmail(pessoaCriacaoDTO.getEmail());
        }
        if (pessoaCriacaoDTO.getSenha() != null && !pessoaCriacaoDTO.getSenha().isEmpty()) {
            pessoa.setSenha(passwordEncoder.encode(pessoaCriacaoDTO.getSenha()));
        }
        if (pessoaCriacaoDTO.getFotoPerfil() != null) {
            pessoa.setFotoPerfil(pessoaCriacaoDTO.getFotoPerfil());
        }

        Pessoa pessoaCadastrada = pessoaRepository.save(pessoa);
//        enviarEmailSucesso(pessoaCadastrada);
        return pessoaCadastrada;
    }

    private void enviarEmailSucesso(Pessoa pessoa) {
        Context context = new Context();
        context.setVariable("nome", pessoa.getNome());
        emailService.emailTemplate(pessoa.getEmail(), "Cadastro Sucesso", context, "cadastroSucesso");
    }

    public Pessoa alterar(Pessoa pessoa) {
        Pessoa pessoaBanco = buscarPorId(pessoa.getId());
        pessoaBanco.setNome(pessoa.getNome());
        pessoaBanco.setEmail(pessoa.getEmail());

        if (pessoa.getSenha() != null && !pessoa.getSenha().isEmpty()) {
            pessoaBanco.setSenha(passwordEncoder.encode(pessoa.getSenha()));
        }

        return pessoaRepository.save(pessoaBanco);
    }

    public void excluir(Long id) {
        Pessoa pessoaBanco = buscarPorId(id);
        pessoaRepository.delete(pessoaBanco);
    }

    public Pessoa buscarPorId(Long id) {
        return pessoaRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoExcecao(messageSource.getMessage("pessoa.notfound",
                        new Object[] { id }, LocaleContextHolder.getLocale())));
    }

    public Page<Pessoa> buscarTodos(Pageable pageable) {
        return pessoaRepository.findAll(pageable);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return pessoaRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Pessoa não encontrada"));
    }

    public Pessoa buscarPorEmail(String email) {
        return pessoaRepository.findByEmail(email)
                .orElseThrow(() -> new NaoEncontradoExcecao("Pessoa não encontrada com email: " + email));
    }

    public boolean verificarSenha(String email, String senhaTextoClaro) {
        Pessoa pessoa = buscarPorEmail(email);
        return passwordEncoder.matches(senhaTextoClaro, pessoa.getSenha());
    }

    public PessoaRespostaDTO converterParaDTO(Pessoa pessoa) {
        return new PessoaRespostaDTO(
            pessoa.getId(),
            pessoa.getNome(),
            pessoa.getEmail(),
            pessoa.getCodigoValidacao(),
            pessoa.getValidadeCodigoValidacao(),
            pessoa.getAtivo(),
            pessoa.getFotoPerfil(),
            pessoa.getPessoaPerfil()
        );
    }

}
