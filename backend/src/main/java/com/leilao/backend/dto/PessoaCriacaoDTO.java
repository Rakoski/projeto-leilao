package com.leilao.backend.dto;

import jakarta.persistence.Lob;
import lombok.Data;

@Data
public class PessoaCriacaoDTO {
    private String nome;
    private String email;
    private String senha;
    @Lob
    private byte[] fotoPerfil;
}