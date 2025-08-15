package com.leilao.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.leilao.backend.model.Leilao;
import com.leilao.backend.model.Pagamento;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
    Optional<Pagamento> findByLeilao(Leilao leilao);
    List<Pagamento> findByStatus(String status);
}
