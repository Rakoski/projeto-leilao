package com.leilao.backend.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ImagemDTO {
    private Long id;
    private String nomeImagem;
    private String urlImagem;
    private LocalDateTime dataHoraCadastro;
    private Long leilaoId;
}

