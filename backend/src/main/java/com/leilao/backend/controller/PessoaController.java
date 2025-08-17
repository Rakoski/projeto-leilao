package com.leilao.backend.controller;

import java.util.List;

import com.leilao.backend.dto.PessoaCriacaoDTO;
import com.leilao.backend.dto.PessoaRespostaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leilao.backend.model.Pessoa;
import com.leilao.backend.service.PessoaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/pessoa")
public class PessoaController {

    @Autowired
    private PessoaService pessoaService;

    @GetMapping
    public ResponseEntity<Page<Pessoa>> buscarTodos(Pageable pageable) {
        return ResponseEntity.ok(pessoaService.buscarTodos(pageable));
    }

    @PostMapping
    public ResponseEntity<PessoaRespostaDTO> inserir(@Valid @RequestBody PessoaCriacaoDTO pessoaCriacaoDTO) {
        Pessoa pessoaCadastrada = pessoaService.inserir(pessoaCriacaoDTO);
        PessoaRespostaDTO resposta = pessoaService.converterParaDTO(pessoaCadastrada);
        return ResponseEntity.ok(resposta);
    }

    @PutMapping
    public ResponseEntity<PessoaRespostaDTO> alterar(@Valid @RequestBody Pessoa pessoa) {
        Pessoa pessoaAlterada = pessoaService.alterar(pessoa);
        PessoaRespostaDTO resposta = pessoaService.converterParaDTO(pessoaAlterada);
        return ResponseEntity.ok(resposta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> excluir(@PathVariable("id") Long id) {
        pessoaService.excluir(id);
        return ResponseEntity.ok("Excluído");
    }

}
