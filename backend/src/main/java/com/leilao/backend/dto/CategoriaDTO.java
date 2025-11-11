package com.leilao.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoriaDTO {
    private Long id;
    
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 100, message = "Nome deve ter entre 3 e 100 caracteres")
    private String nome;
    
    @Size(max = 500, message = "Observação deve ter no máximo 500 caracteres")
    private String observacao;
    
    private Long criadorId;
    private String criadorNome;
}

