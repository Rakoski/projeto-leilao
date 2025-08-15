package com.leilao.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
    
    public List<Feedback> listarTodos() {
        return feedbackRepository.findAll();
    }
    
    public Feedback buscarPorId(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoExcecao("Feedback não encontrado"));
    }
    
    public Feedback salvar(Feedback feedback) {
        validarFeedback(feedback);
        feedback.setDataHora(LocalDateTime.now());
        return feedbackRepository.save(feedback);
    }
    
    public Feedback atualizar(Long id, Feedback feedback) {
        Feedback feedbackExistente = buscarPorId(id);
        feedbackExistente.setComentario(feedback.getComentario());
        feedbackExistente.setNota(feedback.getNota());
        return feedbackRepository.save(feedbackExistente);
    }
    
    public void deletar(Long id) {
        Feedback feedback = buscarPorId(id);
        feedbackRepository.delete(feedback);
    }
    
    public List<Feedback> buscarPorAutor(Pessoa autor) {
        return feedbackRepository.findByAutor(autor);
    }
    
    public List<Feedback> buscarPorDestinatario(Pessoa destinatario) {
        return feedbackRepository.findByDestinatario(destinatario);
    }
    
    public Double calcularMediaNota(Pessoa destinatario) {
        return feedbackRepository.findMediaNotasByDestinatario(destinatario);
    }
    
    private void validarFeedback(Feedback feedback) {
        if (feedback.getAutor().equals(feedback.getDestinatario())) {
            throw new NegocioExcecao("Não é possível avaliar a si mesmo");
        }
        if (feedback.getNota() < 1 || feedback.getNota() > 5) {
            throw new NegocioExcecao("Nota deve estar entre 1 e 5");
        }
    }
}
