package com.leilao.backend.dto;

import com.leilao.backend.enums.TipoPerfil;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PerfilDTO {
    private Long id;

    @NotNull(message = "Tipo de perfil é obrigatório")
    private TipoPerfil tipo;
}

