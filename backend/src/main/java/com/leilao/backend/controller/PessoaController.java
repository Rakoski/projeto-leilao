package com.leilao.backend.controller;

import com.leilao.backend.dto.*;
import com.leilao.backend.exception.NegocioExcecao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import com.leilao.backend.model.Pessoa;
import com.leilao.backend.service.PessoaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/pessoa")
public class PessoaController {

    @Autowired
    private PessoaService pessoaService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PaginaDTO<PessoaRespostaDTO>> buscarTodos(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Boolean ativo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nome") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir) {

        PessoaFilterDTO filtros = new PessoaFilterDTO();
        filtros.setNome(nome);
        filtros.setEmail(email);
        filtros.setAtivo(ativo);

        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Pessoa> pageResultado = pessoaService.buscarComFiltros(filtros, pageable);
        Page<PessoaRespostaDTO> pageDTOs = pageResultado.map(pessoaService::converterParaDTO);

        return ResponseEntity.ok(new PaginaDTO<>(pageDTOs));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<PessoaRespostaDTO> buscarPorId(@PathVariable Long id) {
        Pessoa pessoa = pessoaService.buscarPorId(id);
        return ResponseEntity.ok(pessoaService.converterParaDTO(pessoa));
    }

    @GetMapping("/me")
    public ResponseEntity<PessoaRespostaDTO> buscarPerfil(Authentication auth) {
        Pessoa pessoa = pessoaService.buscarPorEmail(auth.getName());
        return ResponseEntity.ok(pessoaService.converterParaDTO(pessoa));
    }

    @PostMapping
    public ResponseEntity<PessoaRespostaDTO> inserir(@Valid @RequestBody PessoaCriacaoDTO pessoaCriacaoDTO) {
        Pessoa pessoaCadastrada = pessoaService.inserir(pessoaCriacaoDTO);
        PessoaRespostaDTO resposta = pessoaService.converterParaDTO(pessoaCadastrada);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PessoaRespostaDTO> alterar(
            @PathVariable Long id,
            @Valid @RequestBody PessoaUpdateDTO dto,
            Authentication auth) {

        Pessoa pessoaAutenticada = pessoaService.buscarPorEmail(auth.getName());
        boolean isAdmin = pessoaAutenticada.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ADMIN"));

        // Usuário só pode editar seus próprios dados, exceto ADMIN
        if (!isAdmin && !pessoaAutenticada.getId().equals(id)) {
            throw new NegocioExcecao("Você só pode editar seus próprios dados");
        }

        Pessoa pessoaAlterada = pessoaService.alterar(id, dto);
        PessoaRespostaDTO resposta = pessoaService.converterParaDTO(pessoaAlterada);
        return ResponseEntity.ok(resposta);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        pessoaService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/alterar-senha")
    public ResponseEntity<Void> alterarSenha(
            @Valid @RequestBody AlterarSenhaDTO dto,
            Authentication auth) {
        pessoaService.alterarSenha(auth.getName(), dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/recuperar-senha")
    public ResponseEntity<Void> recuperarSenha(@Valid @RequestBody RecuperarSenhaDTO dto) {
        pessoaService.solicitarRecuperacaoSenha(dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<Void> redefinirSenha(
            @RequestParam String email,
            @Valid @RequestBody RedefinirSenhaDTO dto) {
        pessoaService.redefinirSenha(email, dto);
        return ResponseEntity.ok().build();
    }

}
