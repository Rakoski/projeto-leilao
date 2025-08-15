package com.leilao.backend.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.leilao.backend.enums.StatusLeilao;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
@Table(name = "leilao")
public class Leilao {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "Título é obrigatório")
    private String titulo;

    @NotBlank(message = "Descrição é obrigatória")
    private String descricao;

    private String descricaoDetalhada;

    @NotNull(message = "Data e hora de início são obrigatórias")
    private LocalDateTime dataHoraInicio;

    @NotNull(message = "Data e hora de fim são obrigatórias")
    private LocalDateTime dataHoraFim;

    @Enumerated(EnumType.STRING)
    private StatusLeilao status = StatusLeilao.EM_ANALISE;

    private String observacao;

    @NotNull(message = "Valor do incremento é obrigatório")
    private Float valorIncremento;

    @NotNull(message = "Lance mínimo é obrigatório")
    private Float lanceMinimo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendedor_id")
    @JsonIgnore
    private Pessoa vendedor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @OneToMany(mappedBy = "leilao", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Imagem> imagens;

    @OneToMany(mappedBy = "leilao", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Lance> lances;

    @OneToOne(mappedBy = "leilao", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Pagamento pagamento;
}
