package com.leilao.backend.repository;

import java.util.List;

import com.leilao.backend.dto.LeilaoFilterDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query("SELECT l FROM Leilao l " +
            "LEFT JOIN l.categoria c " +
            "LEFT JOIN l.vendedor v " +
            "WHERE 1=1 " +
            "AND (:#{#filters.id} IS NULL OR l.id = :#{#filters.id}) " +
            "AND (:#{#filters.titulo} IS NULL OR LOWER(l.titulo) LIKE LOWER(CONCAT('%', :#{#filters.titulo}, '%'))) " +
            "AND (:#{#filters.status} IS NULL OR l.status = :#{#filters.status}) " +
            "AND (:#{#filters.categoriaId} IS NULL OR c.id = :#{#filters.categoriaId}) " +
            "AND (:#{#filters.categoriaNome} IS NULL OR LOWER(c.nome) LIKE LOWER(CONCAT('%', :#{#filters.categoriaNome}, '%'))) " +
            "AND (:#{#filters.vendedorId} IS NULL OR v.id = :#{#filters.vendedorId}) " +
            "AND (:#{#filters.vendedorNome} IS NULL OR LOWER(v.nome) LIKE LOWER(CONCAT('%', :#{#filters.vendedorNome}, '%'))) " +
            "AND (:#{#filters.dataHoraInicioFrom} IS NULL OR l.dataHoraInicio >= :#{#filters.dataHoraInicioFrom}) " +
            "AND (:#{#filters.dataHoraInicioTo} IS NULL OR l.dataHoraInicio <= :#{#filters.dataHoraInicioTo}) " +
            "AND (:#{#filters.dataHoraFimFrom} IS NULL OR l.dataHoraFim >= :#{#filters.dataHoraFimFrom}) " +
            "AND (:#{#filters.dataHoraFimTo} IS NULL OR l.dataHoraFim <= :#{#filters.dataHoraFimTo}) " +
            "AND (:#{#filters.lanceMinFrom} IS NULL OR l.lanceMinimo >= :#{#filters.lanceMinFrom}) " +
            "AND (:#{#filters.lanceMinTo} IS NULL OR l.lanceMinimo <= :#{#filters.lanceMinTo})")
    Page<Leilao> findWithFilters(@Param("filters") LeilaoFilterDTO filters, Pageable pageable);
}
