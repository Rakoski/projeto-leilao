package com.leilao.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leilao.backend.exception.NaoEncontradoExcecao;
import com.leilao.backend.exception.NegocioExcecao;
import com.leilao.backend.model.Leilao;
import com.leilao.backend.model.Pagamento;
import com.leilao.backend.repository.PagamentoRepository;

@Service
public class PagamentoService {
    
    @Autowired
    private PagamentoRepository pagamentoRepository;
    
    public List<Pagamento> listarTodos() {
        return pagamentoRepository.findAll();
    }
    
    public Pagamento buscarPorId(Long id) {
        return pagamentoRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoExcecao("Pagamento não encontrado"));
    }
    
    public Pagamento salvar(Pagamento pagamento) {
        validarPagamento(pagamento);
        pagamento.setDataHora(LocalDateTime.now());
        return pagamentoRepository.save(pagamento);
    }
    
    public Pagamento atualizar(Long id, Pagamento pagamento) {
        Pagamento pagamentoExistente = buscarPorId(id);
        pagamentoExistente.setStatus(pagamento.getStatus());
        return pagamentoRepository.save(pagamentoExistente);
    }
    
    public void deletar(Long id) {
        Pagamento pagamento = buscarPorId(id);
        pagamentoRepository.delete(pagamento);
    }
    
    public Optional<Pagamento> buscarPorLeilao(Leilao leilao) {
        return pagamentoRepository.findByLeilao(leilao);
    }
    
    public List<Pagamento> buscarPorStatus(String status) {
        return pagamentoRepository.findByStatus(status);
    }
    
    private void validarPagamento(Pagamento pagamento) {
        if (pagamento.getValor() <= 0) {
            throw new NegocioExcecao("Valor do pagamento deve ser maior que zero");
        }
        
        Optional<Pagamento> pagamentoExistente = buscarPorLeilao(pagamento.getLeilao());
        if (pagamentoExistente.isPresent()) {
            throw new NegocioExcecao("Já existe um pagamento para este leilão");
        }
    }
}
