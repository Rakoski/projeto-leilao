package com.leilao.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.leilao.backend.enums.StatusLeilao;
import com.leilao.backend.model.Categoria;
import com.leilao.backend.model.Leilao;
import com.leilao.backend.model.Pessoa;

@Repository
public interface LeilaoRepository extends JpaRepository<Leilao, Long> {
    List<Leilao> findByVendedor(Pessoa vendedor);
    List<Leilao> findByCategoria(Categoria categoria);
    List<Leilao> findByStatus(StatusLeilao status);
    List<Leilao> findByTituloContainingIgnoreCase(String titulo);

    @Query("SELECT l FROM Leilao l WHERE l.status = :status ORDER BY l.dataHoraInicio ASC")
    List<Leilao> findByStatusOrderByDataHoraInicio(@Param("status") StatusLeilao status);
}
