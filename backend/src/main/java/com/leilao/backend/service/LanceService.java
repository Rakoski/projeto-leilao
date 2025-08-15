package com.leilao.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leilao.backend.enums.StatusLeilao;
import com.leilao.backend.exception.NaoEncontradoExcecao;
import com.leilao.backend.exception.NegocioExcecao;
import com.leilao.backend.model.Lance;
import com.leilao.backend.model.Leilao;
import com.leilao.backend.model.Pessoa;
import com.leilao.backend.repository.LanceRepository;

@Service
public class LanceService {
    
    @Autowired
    private LanceRepository lanceRepository;
    
    @Autowired
    private LeilaoService leilaoService;
    
    public List<Lance> listarTodos() {
        return lanceRepository.findAll();
    }
    
    public Lance buscarPorId(Long id) {
        return lanceRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoExcecao("Lance não encontrado"));
    }
    
    public Lance salvar(Lance lance) {
        validarLance(lance);
        lance.setDataHora(LocalDateTime.now());
        return lanceRepository.save(lance);
    }
    
    public void deletar(Long id) {
        Lance lance = buscarPorId(id);
        lanceRepository.delete(lance);
    }
    
    public List<Lance> buscarPorComprador(Pessoa comprador) {
        return lanceRepository.findByComprador(comprador);
    }
    
    public List<Lance> buscarPorLeilao(Leilao leilao) {
        return lanceRepository.findByLeilao(leilao);
    }
    
    public List<Lance> buscarPorLeilaoOrdenado(Leilao leilao) {
        return lanceRepository.findByLeilaoOrderByValorLanceDesc(leilao);
    }
    
    public Optional<Lance> buscarMaiorLance(Leilao leilao) {
        return lanceRepository.findMaiorLanceByLeilao(leilao);
    }
    
    private void validarLance(Lance lance) {
        Leilao leilao = lance.getLeilao();
        
        // Verificar se o leilão está aberto
        if (leilao.getStatus() != StatusLeilao.ABERTO) {
            throw new NegocioExcecao("Leilão não está aberto para lances");
        }
        
        // Verificar se está dentro do período do leilão
        LocalDateTime agora = LocalDateTime.now();
        if (agora.isBefore(leilao.getDataHoraInicio()) || agora.isAfter(leilao.getDataHoraFim())) {
            throw new NegocioExcecao("Lance fora do período do leilão");
        }
        
        // Verificar se o comprador não é o vendedor
        if (lance.getComprador().equals(leilao.getVendedor())) {
            throw new NegocioExcecao("Vendedor não pode dar lance no próprio leilão");
        }
        
        // Verificar valor mínimo
        Optional<Lance> maiorLance = buscarMaiorLance(leilao);
        float valorMinimo = maiorLance.isPresent() 
            ? maiorLance.get().getValorLance() + leilao.getValorIncremento()
            : leilao.getLanceMinimo();
            
        if (lance.getValorLance() < valorMinimo) {
            throw new NegocioExcecao("Lance deve ser no mínimo " + valorMinimo);
        }
    }
}
