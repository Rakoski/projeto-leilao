package com.leilao.backend.repository;

import com.leilao.backend.enums.TipoPerfil;
import org.springframework.data.jpa.repository.JpaRepository;

import com.leilao.backend.model.Perfil;

import java.util.Optional;

public interface PerfilRepository extends JpaRepository<Perfil, Long> {

    Optional<Perfil> findByTipo(TipoPerfil tipo);

    boolean existsByTipo(TipoPerfil tipo);
}
