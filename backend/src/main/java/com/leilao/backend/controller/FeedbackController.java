package com.leilao.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import com.leilao.backend.dto.FeedbackDTO;
import com.leilao.backend.dto.PaginaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PaginaDTO<FeedbackDTO>> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dataHora") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Feedback> pageResultado = feedbackService.listarTodosPaginado(pageable);
        Page<FeedbackDTO> pageDTOs = pageResultado.map(feedbackService::converterParaDTO);

        return ResponseEntity.ok(new PaginaDTO<>(pageDTOs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeedbackDTO> buscarPorId(@PathVariable Long id) {
        Feedback feedback = feedbackService.buscarPorId(id);
        return ResponseEntity.ok(feedbackService.converterParaDTO(feedback));
    }

    @PostMapping
    public ResponseEntity<FeedbackDTO> criar(@Valid @RequestBody FeedbackDTO dto, Authentication auth) {
        Pessoa autor = pessoaService.buscarPorEmail(auth.getName());
        Feedback feedbackSalvo = feedbackService.criar(dto, autor);
        return ResponseEntity.status(HttpStatus.CREATED).body(feedbackService.converterParaDTO(feedbackSalvo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeedbackDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody FeedbackDTO dto,
            Authentication auth) {
        Pessoa autor = pessoaService.buscarPorEmail(auth.getName());
        Feedback feedbackAtualizado = feedbackService.atualizar(id, dto, autor);
        return ResponseEntity.ok(feedbackService.converterParaDTO(feedbackAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id, Authentication auth) {
        Pessoa autor = pessoaService.buscarPorEmail(auth.getName());
        boolean isAdmin = autor.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ADMIN"));

        feedbackService.deletar(id, autor, isAdmin);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/meus")
    public ResponseEntity<List<FeedbackDTO>> buscarMeusFeedbacks(Authentication auth) {
        Pessoa autor = pessoaService.buscarPorEmail(auth.getName());
        List<FeedbackDTO> feedbacks = feedbackService.buscarPorAutor(autor).stream()
            .map(feedbackService::converterParaDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/recebidos")
    public ResponseEntity<List<FeedbackDTO>> buscarFeedbacksRecebidos(Authentication auth) {
        Pessoa destinatario = pessoaService.buscarPorEmail(auth.getName());
        List<FeedbackDTO> feedbacks = feedbackService.buscarPorDestinatario(destinatario).stream()
            .map(feedbackService::converterParaDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/pessoa/{pessoaId}")
    public ResponseEntity<List<FeedbackDTO>> buscarPorDestinatario(@PathVariable Long pessoaId) {
        Pessoa destinatario = pessoaService.buscarPorId(pessoaId);
        List<FeedbackDTO> feedbacks = feedbackService.buscarPorDestinatario(destinatario).stream()
            .map(feedbackService::converterParaDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/pessoa/{pessoaId}/media")
    public ResponseEntity<Double> calcularMediaNota(@PathVariable Long pessoaId) {
        Pessoa destinatario = pessoaService.buscarPorId(pessoaId);
        Double media = feedbackService.calcularMediaNota(destinatario);
        return ResponseEntity.ok(media);
    }
}
