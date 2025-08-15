package com.leilao.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leilao.backend.model.Imagem;
import com.leilao.backend.model.Leilao;
import com.leilao.backend.service.ImagemService;
import com.leilao.backend.service.LeilaoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/imagens")
public class ImagemController {
    
    @Autowired
    private ImagemService imagemService;
    
    @Autowired
    private LeilaoService leilaoService;
    
    @GetMapping
    public ResponseEntity<List<Imagem>> listar() {
        List<Imagem> imagens = imagemService.listarTodas();
        return ResponseEntity.ok(imagens);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Imagem> buscarPorId(@PathVariable Long id) {
        Imagem imagem = imagemService.buscarPorId(id);
        return ResponseEntity.ok(imagem);
    }
    
    @PostMapping
    public ResponseEntity<Imagem> criar(@Valid @RequestBody Imagem imagem) {
        Imagem imagemSalva = imagemService.salvar(imagem);
        return ResponseEntity.status(HttpStatus.CREATED).body(imagemSalva);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        imagemService.deletar(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/leilao/{leilaoId}")
    public ResponseEntity<List<Imagem>> buscarPorLeilao(@PathVariable Long leilaoId) {
        Leilao leilao = leilaoService.buscarPorId(leilaoId);
        List<Imagem> imagens = imagemService.buscarPorLeilao(leilao);
        return ResponseEntity.ok(imagens);
    }
}
