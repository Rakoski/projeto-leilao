package com.leilao.backend.dto;

import java.util.Date;
import java.util.List;

import com.leilao.backend.model.PessoaPerfil;

public class PessoaRespostaDTO {
    private Long id;
    private String nome;
    private String email;
    private String codigoValidacao;
    private Date validadeCodigoValidacao;
    private Boolean ativo;
    private byte[] fotoPerfil;
    private List<PessoaPerfil> pessoaPerfil;

    // Construtores
    public PessoaRespostaDTO() {}

    public PessoaRespostaDTO(Long id, String nome, String email, String codigoValidacao,
                           Date validadeCodigoValidacao, Boolean ativo, byte[] fotoPerfil,
                           List<PessoaPerfil> pessoaPerfil) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.codigoValidacao = codigoValidacao;
        this.validadeCodigoValidacao = validadeCodigoValidacao;
        this.ativo = ativo;
        this.fotoPerfil = fotoPerfil;
        this.pessoaPerfil = pessoaPerfil;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCodigoValidacao() {
        return codigoValidacao;
    }

    public void setCodigoValidacao(String codigoValidacao) {
        this.codigoValidacao = codigoValidacao;
    }

    public Date getValidadeCodigoValidacao() {
        return validadeCodigoValidacao;
    }

    public void setValidadeCodigoValidacao(Date validadeCodigoValidacao) {
        this.validadeCodigoValidacao = validadeCodigoValidacao;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public byte[] getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(byte[] fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    public List<PessoaPerfil> getPessoaPerfil() {
        return pessoaPerfil;
    }

    public void setPessoaPerfil(List<PessoaPerfil> pessoaPerfil) {
        this.pessoaPerfil = pessoaPerfil;
    }
}
