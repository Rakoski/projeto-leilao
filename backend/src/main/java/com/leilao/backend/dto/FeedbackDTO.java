package com.leilao.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FeedbackDTO {
    private Long id;

    @NotBlank(message = "Comentário é obrigatório")
    @Size(min = 10, max = 500, message = "Comentário deve ter entre 10 e 500 caracteres")
    private String comentario;

    @NotNull(message = "Nota é obrigatória")
    @Min(value = 1, message = "Nota mínima é 1")
    @Max(value = 5, message = "Nota máxima é 5")
    private Integer nota;

    @NotNull(message = "Destinatário é obrigatório")
    private Long destinatarioId;

    private Long autorId;
    private String autorNome;
    private String destinatarioNome;
    private LocalDateTime dataHora;
}

