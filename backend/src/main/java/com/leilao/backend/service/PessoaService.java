package com.leilao.backend.service;

import com.leilao.backend.dto.*;
import com.leilao.backend.exception.NegocioExcecao;
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

import java.util.Date;
import java.util.UUID;

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
        // Validar email único
        if (pessoaRepository.existsByEmail(pessoaCriacaoDTO.getEmail())) {
            throw new NegocioExcecao("Email já cadastrado no sistema");
        }

        Pessoa pessoa = new Pessoa();
        pessoa.setNome(pessoaCriacaoDTO.getNome());
        pessoa.setEmail(pessoaCriacaoDTO.getEmail());
        pessoa.setSenha(passwordEncoder.encode(pessoaCriacaoDTO.getSenha()));
        pessoa.setAtivo(true);

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

    public Pessoa alterar(Long id, PessoaUpdateDTO dto) {
        Pessoa pessoaBanco = buscarPorId(id);

        // Validar email único se foi alterado
        if (!pessoaBanco.getEmail().equals(dto.getEmail()) &&
            pessoaRepository.existsByEmail(dto.getEmail())) {
            throw new NegocioExcecao("Email já cadastrado no sistema");
        }

        pessoaBanco.setNome(dto.getNome());
        pessoaBanco.setEmail(dto.getEmail());

        if (dto.getFotoPerfil() != null) {
            pessoaBanco.setFotoPerfil(dto.getFotoPerfil());
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

    public Page<Pessoa> buscarComFiltros(PessoaFilterDTO filtros, Pageable pageable) {
        return pessoaRepository.findByFiltros(
            filtros.getNome(),
            filtros.getEmail(),
            filtros.getAtivo(),
            pageable
        );
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

    public void alterarSenha(String email, AlterarSenhaDTO dto) {
        Pessoa pessoa = buscarPorEmail(email);

        // Validar senha atual
        if (!passwordEncoder.matches(dto.getSenhaAtual(), pessoa.getSenha())) {
            throw new NegocioExcecao("Senha atual incorreta");
        }

        // Validar confirmação de senha
        if (!dto.getNovaSenha().equals(dto.getConfirmacaoSenha())) {
            throw new NegocioExcecao("Nova senha e confirmação não conferem");
        }

        pessoa.setSenha(passwordEncoder.encode(dto.getNovaSenha()));
        pessoaRepository.save(pessoa);
    }

    public void solicitarRecuperacaoSenha(RecuperarSenhaDTO dto) {
        Pessoa pessoa = buscarPorEmail(dto.getEmail());

        // Gerar código de validação
        String codigo = UUID.randomUUID().toString();
        pessoa.setCodigoValidacao(codigo);

        // Validade de 24 horas
        Date validade = new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000);
        pessoa.setValidadeCodigoValidacao(validade);

        pessoaRepository.save(pessoa);

        // Enviar email com código
        Context context = new Context();
        context.setVariable("nome", pessoa.getNome());
        context.setVariable("codigo", codigo);
        emailService.emailTemplate(pessoa.getEmail(), "Recuperação de Senha", context, "recuperacaoSenha");
    }

    public void redefinirSenha(String email, RedefinirSenhaDTO dto) {
        Pessoa pessoa = buscarPorEmail(email);

        // Validar código
        if (pessoa.getCodigoValidacao() == null ||
            !pessoa.getCodigoValidacao().equals(dto.getCodigoValidacao())) {
            throw new NegocioExcecao("Código de validação inválido");
        }

        // Validar validade
        if (pessoa.getValidadeCodigoValidacao() == null ||
            pessoa.getValidadeCodigoValidacao().before(new Date())) {
            throw new NegocioExcecao("Código de validação expirado");
        }

        // Redefinir senha
        pessoa.setSenha(passwordEncoder.encode(dto.getNovaSenha()));
        pessoa.setCodigoValidacao(null);
        pessoa.setValidadeCodigoValidacao(null);

        pessoaRepository.save(pessoa);
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
