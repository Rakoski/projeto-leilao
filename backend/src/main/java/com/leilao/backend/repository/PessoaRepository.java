package com.leilao.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.leilao.backend.model.Pessoa;

public interface PessoaRepository extends JpaRepository<Pessoa, Long> {

    @Query("from Pessoa where email=:email")
    Page<Pessoa> buscarEmail(@Param("email") String email, Pageable pageable);

    Optional<Pessoa> findByEmail(String email);

    @Query("SELECT p FROM Pessoa p WHERE " +
           "(:nome IS NULL OR LOWER(p.nome) LIKE LOWER(CONCAT('%', :nome, '%'))) AND " +
           "(:email IS NULL OR LOWER(p.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND " +
           "(:ativo IS NULL OR p.ativo = :ativo)")
    Page<Pessoa> findByFiltros(@Param("nome") String nome,
                                @Param("email") String email,
                                @Param("ativo") Boolean ativo,
                                Pageable pageable);

    boolean existsByEmail(String email);
}
