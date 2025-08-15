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
import org.springframework.web.bind.annotation.RestController;

import com.leilao.backend.model.Feedback;
import com.leilao.backend.model.Pessoa;
import com.leilao.backend.service.FeedbackService;
import com.leilao.backend.service.PessoaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/feedbacks")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private PessoaService pessoaService;

    @GetMapping
    public ResponseEntity<List<Feedback>> listar() {
        List<Feedback> feedbacks = feedbackService.listarTodos();
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feedback> buscarPorId(@PathVariable Long id) {
        Feedback feedback = feedbackService.buscarPorId(id);
        return ResponseEntity.ok(feedback);
    }

    @PostMapping
    public ResponseEntity<Feedback> criar(@Valid @RequestBody Feedback feedback, Authentication auth) {
        Pessoa autor = pessoaService.buscarPorEmail(auth.getName());
        feedback.setAutor(autor);
        Feedback feedbackSalvo = feedbackService.salvar(feedback);
        return ResponseEntity.status(HttpStatus.CREATED).body(feedbackSalvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Feedback> atualizar(@PathVariable Long id, @Valid @RequestBody Feedback feedback) {
        Feedback feedbackAtualizado = feedbackService.atualizar(id, feedback);
        return ResponseEntity.ok(feedbackAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        feedbackService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/meus")
    public ResponseEntity<List<Feedback>> buscarMeusFeedbacks(Authentication auth) {
        Pessoa autor = pessoaService.buscarPorEmail(auth.getName());
        List<Feedback> feedbacks = feedbackService.buscarPorAutor(autor);
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/recebidos")
    public ResponseEntity<List<Feedback>> buscarFeedbacksRecebidos(Authentication auth) {
        Pessoa destinatario = pessoaService.buscarPorEmail(auth.getName());
        List<Feedback> feedbacks = feedbackService.buscarPorDestinatario(destinatario);
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/pessoa/{pessoaId}")
    public ResponseEntity<List<Feedback>> buscarPorDestinatario(@PathVariable Long pessoaId) {
        Pessoa destinatario = pessoaService.buscarPorId(pessoaId);
        List<Feedback> feedbacks = feedbackService.buscarPorDestinatario(destinatario);
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/pessoa/{pessoaId}/media")
    public ResponseEntity<Double> calcularMediaNota(@PathVariable Long pessoaId) {
        Pessoa destinatario = pessoaService.buscarPorId(pessoaId);
        Double media = feedbackService.calcularMediaNota(destinatario);
        return ResponseEntity.ok(media != null ? media : 0.0);
    }
}
