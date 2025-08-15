package com.leilao.backend.controller;

import java.util.List;

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

import com.leilao.backend.model.Categoria;
import com.leilao.backend.model.Pessoa;
import com.leilao.backend.service.CategoriaService;
import com.leilao.backend.service.PessoaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {
    
    @Autowired
    private CategoriaService categoriaService;
    
    @Autowired
    private PessoaService pessoaService;
    
    @GetMapping
    public ResponseEntity<List<Categoria>> listar() {
        List<Categoria> categorias = categoriaService.listarTodas();
        return ResponseEntity.ok(categorias);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> buscarPorId(@PathVariable Long id) {
        Categoria categoria = categoriaService.buscarPorId(id);
        return ResponseEntity.ok(categoria);
    }
    
    @PostMapping
    public ResponseEntity<Categoria> criar(@Valid @RequestBody Categoria categoria, Authentication auth) {
        Pessoa criador = pessoaService.buscarPorEmail(auth.getName());
        categoria.setCriador(criador);
        Categoria categoriaSalva = categoriaService.salvar(categoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaSalva);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> atualizar(@PathVariable Long id, @Valid @RequestBody Categoria categoria) {
        Categoria categoriaAtualizada = categoriaService.atualizar(id, categoria);
        return ResponseEntity.ok(categoriaAtualizada);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        categoriaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/buscar")
    public ResponseEntity<List<Categoria>> buscarPorNome(@RequestParam String nome) {
        List<Categoria> categorias = categoriaService.buscarPorNome(nome);
        return ResponseEntity.ok(categorias);
    }
    
    @GetMapping("/minhas")
    public ResponseEntity<List<Categoria>> buscarMinhasCategorias(Authentication auth) {
        Pessoa criador = pessoaService.buscarPorEmail(auth.getName());
        List<Categoria> categorias = categoriaService.buscarPorCriador(criador);
        return ResponseEntity.ok(categorias);
    }
}
