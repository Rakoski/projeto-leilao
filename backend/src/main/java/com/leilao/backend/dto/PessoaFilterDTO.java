package com.leilao.backend.dto;

import lombok.Data;

@Data
public class PessoaFilterDTO {
    private String nome;
    private String email;
    private Boolean ativo;
}

