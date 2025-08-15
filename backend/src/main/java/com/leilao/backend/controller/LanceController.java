package com.leilao.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leilao.backend.model.Lance;
import com.leilao.backend.model.Leilao;
import com.leilao.backend.model.Pessoa;
import com.leilao.backend.service.LanceService;
import com.leilao.backend.service.LeilaoService;
import com.leilao.backend.service.PessoaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/lances")
public class LanceController {
    
    @Autowired
    private LanceService lanceService;
    
    @Autowired
    private PessoaService pessoaService;
    
    @Autowired
    private LeilaoService leilaoService;
    
    @GetMapping
    public ResponseEntity<List<Lance>> listar() {
        List<Lance> lances = lanceService.listarTodos();
        return ResponseEntity.ok(lances);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Lance> buscarPorId(@PathVariable Long id) {
        Lance lance = lanceService.buscarPorId(id);
        return ResponseEntity.ok(lance);
    }
    
    @PostMapping
    public ResponseEntity<Lance> criar(@Valid @RequestBody Lance lance, Authentication auth) {
        Pessoa comprador = pessoaService.buscarPorEmail(auth.getName());
        lance.setComprador(comprador);
        Lance lanceSalvo = lanceService.salvar(lance);
        return ResponseEntity.status(HttpStatus.CREATED).body(lanceSalvo);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        lanceService.deletar(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/meus")
    public ResponseEntity<List<Lance>> buscarMeusLances(Authentication auth) {
        Pessoa comprador = pessoaService.buscarPorEmail(auth.getName());
        List<Lance> lances = lanceService.buscarPorComprador(comprador);
        return ResponseEntity.ok(lances);
    }
    
    @GetMapping("/leilao/{leilaoId}")
    public ResponseEntity<List<Lance>> buscarPorLeilao(@PathVariable Long leilaoId) {
        Leilao leilao = leilaoService.buscarPorId(leilaoId);
        List<Lance> lances = lanceService.buscarPorLeilaoOrdenado(leilao);
        return ResponseEntity.ok(lances);
    }
    
    @GetMapping("/leilao/{leilaoId}/maior")
    public ResponseEntity<Lance> buscarMaiorLance(@PathVariable Long leilaoId) {
        Leilao leilao = leilaoService.buscarPorId(leilaoId);
        Optional<Lance> maiorLance = lanceService.buscarMaiorLance(leilao);
        return maiorLance.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }
}
