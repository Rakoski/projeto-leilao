package com.leilao.backend.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class LeilaoCreateDTO {

    @NotBlank(message = "Título é obrigatório")
    @Size(max = 150, message = "Título deve ter no máximo 150 caracteres")
    private String titulo;

    @NotBlank(message = "Descrição é obrigatória")
    @Size(max = 1000, message = "Descrição deve ter no máximo 1000 caracteres")
    private String descricao;

    @Size(max = 5000, message = "Descrição detalhada deve ter no máximo 5000 caracteres")
    private String descricaoDetalhada;

    @NotNull(message = "Data e hora de início são obrigatórias")
    @Future(message = "Data de início deve ser no futuro")
    private LocalDateTime dataHoraInicio;

    @NotNull(message = "Data e hora de fim são obrigatórias")
    @Future(message = "Data de fim deve ser no futuro")
    private LocalDateTime dataHoraFim;

    private String observacao;

    @NotNull(message = "Valor do incremento é obrigatório")
    @Positive(message = "Valor do incremento deve ser maior que zero")
    private Float valorIncremento;

    @NotNull(message = "Lance mínimo é obrigatório")
    @Positive(message = "Lance mínimo deve ser maior que zero")
    private Float lanceMinimo;

    @NotNull(message = "Categoria é obrigatória")
    private Long categoriaId;

    // Getters e Setters
    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricaoDetalhada() {
        return descricaoDetalhada;
    }

    public void setDescricaoDetalhada(String descricaoDetalhada) {
        this.descricaoDetalhada = descricaoDetalhada;
    }

    public LocalDateTime getDataHoraInicio() {
        return dataHoraInicio;
    }

    public void setDataHoraInicio(LocalDateTime dataHoraInicio) {
        this.dataHoraInicio = dataHoraInicio;
    }

    public LocalDateTime getDataHoraFim() {
        return dataHoraFim;
    }

    public void setDataHoraFim(LocalDateTime dataHoraFim) {
        this.dataHoraFim = dataHoraFim;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public Float getValorIncremento() {
        return valorIncremento;
    }

    public void setValorIncremento(Float valorIncremento) {
        this.valorIncremento = valorIncremento;
    }

    public Float getLanceMinimo() {
        return lanceMinimo;
    }

    public void setLanceMinimo(Float lanceMinimo) {
        this.lanceMinimo = lanceMinimo;
    }

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }

    @AssertTrue(message = "Data de fim deve ser posterior à data de início")
    public boolean isDataFimValida() {
        if (dataHoraInicio == null || dataHoraFim == null) {
            return true; // Deixa outros validadores tratarem nulls
        }
        return dataHoraFim.isAfter(dataHoraInicio);
    }
}

