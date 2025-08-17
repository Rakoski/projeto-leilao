package com.leilao.backend.dto;

import com.leilao.backend.enums.StatusLeilao;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LeilaoDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private String descricaoDetalhada;
    private LocalDateTime dataHoraInicio;
    private LocalDateTime dataHoraFim;
    private StatusLeilao status;
    private String observacao;
    private Float valorIncremento;
    private Float lanceMinimo;
    private String categoriaNome;
}