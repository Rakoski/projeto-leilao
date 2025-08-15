package com.leilao.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.leilao.backend.model.Imagem;
import com.leilao.backend.model.Leilao;

@Repository
public interface ImagemRepository extends JpaRepository<Imagem, Long> {
    List<Imagem> findByLeilao(Leilao leilao);
}
