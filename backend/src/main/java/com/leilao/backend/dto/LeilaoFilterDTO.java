package com.leilao.backend.dto;

import com.leilao.backend.enums.StatusLeilao;
import java.time.LocalDateTime;

public class LeilaoFilterDTO {

    private Long id;
    private String titulo;
    private StatusLeilao status;
    private Long categoriaId;
    private String categoriaNome;
    private Long vendedorId;
    private String vendedorNome;
    private LocalDateTime dataHoraInicioFrom;
    private LocalDateTime dataHoraInicioTo;
    private LocalDateTime dataHoraFimFrom;
    private LocalDateTime dataHoraFimTo;
    private Float lanceMinFrom;
    private Float lanceMinTo;

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public StatusLeilao getStatus() {
        return status;
    }

    public void setStatus(StatusLeilao status) {
        this.status = status;
    }

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }

    public String getCategoriaNome() {
        return categoriaNome;
    }

    public void setCategoriaNome(String categoriaNome) {
        this.categoriaNome = categoriaNome;
    }

    public Long getVendedorId() {
        return vendedorId;
    }

    public void setVendedorId(Long vendedorId) {
        this.vendedorId = vendedorId;
    }

    public String getVendedorNome() {
        return vendedorNome;
    }

    public void setVendedorNome(String vendedorNome) {
        this.vendedorNome = vendedorNome;
    }

    public LocalDateTime getDataHoraInicioFrom() {
        return dataHoraInicioFrom;
    }

    public void setDataHoraInicioFrom(LocalDateTime dataHoraInicioFrom) {
        this.dataHoraInicioFrom = dataHoraInicioFrom;
    }

    public LocalDateTime getDataHoraInicioTo() {
        return dataHoraInicioTo;
    }

    public void setDataHoraInicioTo(LocalDateTime dataHoraInicioTo) {
        this.dataHoraInicioTo = dataHoraInicioTo;
    }

    public LocalDateTime getDataHoraFimFrom() {
        return dataHoraFimFrom;
    }

    public void setDataHoraFimFrom(LocalDateTime dataHoraFimFrom) {
        this.dataHoraFimFrom = dataHoraFimFrom;
    }

    public LocalDateTime getDataHoraFimTo() {
        return dataHoraFimTo;
    }

    public void setDataHoraFimTo(LocalDateTime dataHoraFimTo) {
        this.dataHoraFimTo = dataHoraFimTo;
    }

    public Float getLanceMinFrom() {
        return lanceMinFrom;
    }

    public void setLanceMinFrom(Float lanceMinFrom) {
        this.lanceMinFrom = lanceMinFrom;
    }

    public Float getLanceMinTo() {
        return lanceMinTo;
    }

    public void setLanceMinTo(Float lanceMinTo) {
        this.lanceMinTo = lanceMinTo;
    }
}

