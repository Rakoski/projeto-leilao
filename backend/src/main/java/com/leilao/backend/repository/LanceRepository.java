package com.leilao.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.leilao.backend.model.Lance;
import com.leilao.backend.model.Leilao;
import com.leilao.backend.model.Pessoa;

@Repository
public interface LanceRepository extends JpaRepository<Lance, Long> {
    List<Lance> findByComprador(Pessoa comprador);
    List<Lance> findByLeilao(Leilao leilao);

    @Query("SELECT l FROM Lance l WHERE l.leilao = :leilao ORDER BY l.valorLance DESC")
    List<Lance> findByLeilaoOrderByValorLanceDesc(@Param("leilao") Leilao leilao);

    @Query("SELECT l FROM Lance l WHERE l.leilao = :leilao ORDER BY l.valorLance DESC LIMIT 1")
    Optional<Lance> findMaiorLanceByLeilao(@Param("leilao") Leilao leilao);
}
