package com.leilao.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.leilao.backend.model.Categoria;
import com.leilao.backend.model.Pessoa;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByCriador(Pessoa criador);
    List<Categoria> findByNomeContainingIgnoreCase(String nome);

    @Query("SELECT c FROM Categoria c WHERE LOWER(c.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    Page<Categoria> findByNomeContainingIgnoreCasePage(@Param("nome") String nome, Pageable pageable);
}
