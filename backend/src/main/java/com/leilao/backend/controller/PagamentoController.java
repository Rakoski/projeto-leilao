package com.leilao.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.leilao.backend.model.Leilao;
import com.leilao.backend.model.Pagamento;
import com.leilao.backend.service.LeilaoService;
import com.leilao.backend.service.PagamentoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/pagamentos")
public class PagamentoController {
    
    @Autowired
    private PagamentoService pagamentoService;
    
    @Autowired
    private LeilaoService leilaoService;
    
    @GetMapping
    public ResponseEntity<List<Pagamento>> listar() {
        List<Pagamento> pagamentos = pagamentoService.listarTodos();
        return ResponseEntity.ok(pagamentos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Pagamento> buscarPorId(@PathVariable Long id) {
        Pagamento pagamento = pagamentoService.buscarPorId(id);
        return ResponseEntity.ok(pagamento);
    }
    
    @PostMapping
    public ResponseEntity<Pagamento> criar(@Valid @RequestBody Pagamento pagamento) {
        Pagamento pagamentoSalvo = pagamentoService.salvar(pagamento);
        return ResponseEntity.status(HttpStatus.CREATED).body(pagamentoSalvo);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Pagamento> atualizar(@PathVariable Long id, @Valid @RequestBody Pagamento pagamento) {
        Pagamento pagamentoAtualizado = pagamentoService.atualizar(id, pagamento);
        return ResponseEntity.ok(pagamentoAtualizado);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        pagamentoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/leilao/{leilaoId}")
    public ResponseEntity<Pagamento> buscarPorLeilao(@PathVariable Long leilaoId) {
        Leilao leilao = leilaoService.buscarPorId(leilaoId);
        Optional<Pagamento> pagamento = pagamentoService.buscarPorLeilao(leilao);
        return pagamento.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/status")
    public ResponseEntity<List<Pagamento>> buscarPorStatus(@RequestParam String status) {
        List<Pagamento> pagamentos = pagamentoService.buscarPorStatus(status);
        return ResponseEntity.ok(pagamentos);
    }
}
