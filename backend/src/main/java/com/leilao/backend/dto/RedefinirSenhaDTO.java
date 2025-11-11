package com.leilao.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RedefinirSenhaDTO {
    
    @NotBlank(message = "Código de validação é obrigatório")
    private String codigoValidacao;
    
    @NotBlank(message = "Nova senha é obrigatória")
    @Size(min = 6, message = "Nova senha deve ter no mínimo 6 caracteres")
    private String novaSenha;
}

