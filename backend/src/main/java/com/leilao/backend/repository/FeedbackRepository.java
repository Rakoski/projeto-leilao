package com.leilao.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.leilao.backend.model.Feedback;
import com.leilao.backend.model.Pessoa;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByAutor(Pessoa autor);
    List<Feedback> findByDestinatario(Pessoa destinatario);

    @Query("SELECT AVG(f.nota) FROM Feedback f WHERE f.destinatario = :pessoa")
    Double findMediaNotasByDestinatario(@Param("pessoa") Pessoa pessoa);
}
