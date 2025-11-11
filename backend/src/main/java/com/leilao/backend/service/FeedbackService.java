package com.leilao.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import com.leilao.backend.dto.FeedbackDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.leilao.backend.exception.NaoEncontradoExcecao;
import com.leilao.backend.exception.NegocioExcecao;
import com.leilao.backend.model.Feedback;
import com.leilao.backend.model.Pessoa;
import com.leilao.backend.repository.FeedbackRepository;

@Service
public class FeedbackService {
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private PessoaService pessoaService;

    public List<Feedback> listarTodos() {
        return feedbackRepository.findAll();
    }
    
    public Page<Feedback> listarTodosPaginado(Pageable pageable) {
        return feedbackRepository.findAll(pageable);
    }

    public Feedback buscarPorId(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoExcecao("Feedback não encontrado"));
    }
    
    public Feedback criar(FeedbackDTO dto, Pessoa autor) {
        Pessoa destinatario = pessoaService.buscarPorId(dto.getDestinatarioId());

        // Validações
        if (autor.getId().equals(destinatario.getId())) {
            throw new NegocioExcecao("Não é possível avaliar a si mesmo");
        }

        Feedback feedback = new Feedback();
        feedback.setComentario(dto.getComentario());
        feedback.setNota(dto.getNota());
        feedback.setAutor(autor);
        feedback.setDestinatario(destinatario);
        feedback.setDataHora(LocalDateTime.now());

        return feedbackRepository.save(feedback);
    }
    
    public Feedback atualizar(Long id, FeedbackDTO dto, Pessoa autor) {
        Feedback feedbackExistente = buscarPorId(id);

        // Validar se é o autor
        if (!feedbackExistente.getAutor().getId().equals(autor.getId())) {
            throw new NegocioExcecao("Você não pode editar feedback de outro usuário");
        }

        feedbackExistente.setComentario(dto.getComentario());
        feedbackExistente.setNota(dto.getNota());
        return feedbackRepository.save(feedbackExistente);
    }
    
    public void deletar(Long id, Pessoa autor, boolean isAdmin) {
        Feedback feedback = buscarPorId(id);

        // Apenas o autor ou ADMIN podem deletar
        if (!isAdmin && !feedback.getAutor().getId().equals(autor.getId())) {
            throw new NegocioExcecao("Você não pode excluir feedback de outro usuário");
        }

        feedbackRepository.delete(feedback);
    }
    
    public List<Feedback> buscarPorAutor(Pessoa autor) {
        return feedbackRepository.findByAutor(autor);
    }
    
    public List<Feedback> buscarPorDestinatario(Pessoa destinatario) {
        return feedbackRepository.findByDestinatario(destinatario);
    }
    
    public Double calcularMediaNota(Pessoa destinatario) {
        Double media = feedbackRepository.findMediaNotasByDestinatario(destinatario);
        return media != null ? media : 0.0;
    }
    
    public FeedbackDTO converterParaDTO(Feedback feedback) {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setId(feedback.getId());
        dto.setComentario(feedback.getComentario());
        dto.setNota(feedback.getNota());
        dto.setDataHora(feedback.getDataHora());

        if (feedback.getAutor() != null) {
            dto.setAutorId(feedback.getAutor().getId());
            dto.setAutorNome(feedback.getAutor().getNome());
        }

        if (feedback.getDestinatario() != null) {
            dto.setDestinatarioId(feedback.getDestinatario().getId());
            dto.setDestinatarioNome(feedback.getDestinatario().getNome());
        }

        return dto;
    }
}
