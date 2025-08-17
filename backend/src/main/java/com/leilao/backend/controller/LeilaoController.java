package com.leilao.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import com.leilao.backend.dto.LeilaoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.leilao.backend.enums.StatusLeilao;
import com.leilao.backend.model.Categoria;
import com.leilao.backend.model.Leilao;
import com.leilao.backend.model.Pessoa;
import com.leilao.backend.service.CategoriaService;
import com.leilao.backend.service.LeilaoService;
import com.leilao.backend.service.PessoaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/leiloes")
public class LeilaoController {

    @Autowired
    private LeilaoService leilaoService;

    @Autowired
    private PessoaService pessoaService;

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public ResponseEntity<List<LeilaoDTO>> listar() {
        List<Leilao> leiloes = leilaoService.listarTodos();
        List<LeilaoDTO> leioesDTO = leiloes.stream()
                .map(LeilaoService::converterParaDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(leioesDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Leilao> buscarPorId(@PathVariable Long id) {
        Leilao leilao = leilaoService.buscarPorId(id);
        return ResponseEntity.ok(leilao);
    }

    @PostMapping
    public ResponseEntity<Leilao> criar(@Valid @RequestBody Leilao leilao, Authentication auth) {
        Pessoa vendedor = pessoaService.buscarPorEmail(auth.getName());
        leilao.setVendedor(vendedor);
        Leilao leilaoSalvo = leilaoService.salvar(leilao);
        return ResponseEntity.status(HttpStatus.CREATED).body(leilaoSalvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Leilao> atualizar(@PathVariable Long id, @Valid @RequestBody Leilao leilao) {
        Leilao leilaoAtualizado = leilaoService.atualizar(id, leilao);
        return ResponseEntity.ok(leilaoAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        leilaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Leilao>> buscarPorStatus(@PathVariable StatusLeilao status) {
        List<Leilao> leiloes = leilaoService.buscarPorStatus(status);
        return ResponseEntity.ok(leiloes);
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<Leilao>> buscarPorCategoria(@PathVariable Long categoriaId) {
        Categoria categoria = categoriaService.buscarPorId(categoriaId);
        List<Leilao> leiloes = leilaoService.buscarPorCategoria(categoria);
        return ResponseEntity.ok(leiloes);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Leilao>> buscarPorTitulo(@RequestParam String titulo) {
        List<Leilao> leiloes = leilaoService.buscarPorTitulo(titulo);
        return ResponseEntity.ok(leiloes);
    }

    @GetMapping("/meus")
    public ResponseEntity<List<Leilao>> buscarMeusLeiloes(Authentication auth) {
        Pessoa vendedor = pessoaService.buscarPorEmail(auth.getName());
        List<Leilao> leiloes = leilaoService.buscarPorVendedor(vendedor);
        return ResponseEntity.ok(leiloes);
    }

    @PutMapping("/{id}/abrir")
    public ResponseEntity<Leilao> abrirLeilao(@PathVariable Long id) {
        Leilao leilao = leilaoService.abrirLeilao(id);
        return ResponseEntity.ok(leilao);
    }

    @PutMapping("/{id}/encerrar")
    public ResponseEntity<Leilao> encerrarLeilao(@PathVariable Long id) {
        Leilao leilao = leilaoService.encerrarLeilao(id);
        return ResponseEntity.ok(leilao);
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Leilao> cancelarLeilao(@PathVariable Long id) {
        Leilao leilao = leilaoService.cancelarLeilao(id);
        return ResponseEntity.ok(leilao);
    }
}
