package com.leilao.backend.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
@Table(name = "imagem")
public class Imagem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull(message = "Data e hora de cadastro são obrigatórias")
    private LocalDateTime dataHoraCadastro = LocalDateTime.now();

    @NotBlank(message = "Nome da imagem é obrigatório")
    private String nomeImagem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leilao_id")
    @JsonIgnore
    private Leilao leilao;
}
