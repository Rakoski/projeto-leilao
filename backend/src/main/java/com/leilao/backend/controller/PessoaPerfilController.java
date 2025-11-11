package com.leilao.backend.controller;

import com.leilao.backend.model.PessoaPerfil;
import com.leilao.backend.service.PessoaPerfilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pessoa-perfil")
@PreAuthorize("hasAuthority('ADMIN')")
public class PessoaPerfilController {
    
    @Autowired
    private PessoaPerfilService pessoaPerfilService;
    
    @GetMapping("/pessoa/{pessoaId}")
    public ResponseEntity<List<PessoaPerfil>> listarPerfisPessoa(@PathVariable Long pessoaId) {
        List<PessoaPerfil> perfis = pessoaPerfilService.listarPerfisPessoa(pessoaId);
        return ResponseEntity.ok(perfis);
    }
    
    @PostMapping("/pessoa/{pessoaId}/perfil/{perfilId}")
    public ResponseEntity<PessoaPerfil> adicionarPerfil(
            @PathVariable Long pessoaId,
            @PathVariable Long perfilId) {
        PessoaPerfil pessoaPerfil = pessoaPerfilService.adicionarPerfil(pessoaId, perfilId);
        return ResponseEntity.status(HttpStatus.CREATED).body(pessoaPerfil);
    }
    
    @DeleteMapping("/pessoa/{pessoaId}/perfil/{perfilId}")
    public ResponseEntity<Void> removerPerfil(
            @PathVariable Long pessoaId,
            @PathVariable Long perfilId) {
        pessoaPerfilService.removerPerfil(pessoaId, perfilId);
        return ResponseEntity.noContent().build();
    }
}

