package com.leilao.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.leilao.backend.model.Categoria;
import com.leilao.backend.model.Pessoa;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByCriador(Pessoa criador);
    List<Categoria> findByNomeContainingIgnoreCase(String nome);
}
