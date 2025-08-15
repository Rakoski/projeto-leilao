package com.leilao.backend.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
@Table(name = "pagamento")
public class Pagamento {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull(message = "Valor é obrigatório")
    private Float valor;

    @NotNull(message = "Data e hora são obrigatórias")
    private LocalDateTime dataHora = LocalDateTime.now();

    @NotBlank(message = "Status é obrigatório")
    private String status;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leilao_id")
    @JsonIgnore
    private Leilao leilao;
}
