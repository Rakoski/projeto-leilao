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
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
@Table(name = "lance")
public class Lance {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @NotNull(message = "Valor do lance é obrigatório")
    private Float valorLance;
    
    @NotNull(message = "Data e hora são obrigatórias")
    private LocalDateTime dataHora = LocalDateTime.now();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comprador_id")
    @JsonIgnore
    private Pessoa comprador;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leilao_id")
    @JsonIgnore
    private Leilao leilao;
}
