package com.leilao.backend.model;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

@Entity
@Data
@Table(name = "pessoa")
public class Pessoa implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "{validation.name.notblank}")
    private String nome;

    @NotBlank(message = "{validation.email.notblank}")
    @Email(message = "{validation.email.notvalid}")
    private String email;

    @JsonIgnore
    private String senha;

    private String codigoValidacao;

    @Temporal(TemporalType.TIMESTAMP)
    private Date validadeCodigoValidacao;

    private Boolean ativo = true;

    @Lob
    private byte[] fotoPerfil;

    @OneToMany(mappedBy = "pessoa", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Setter(value = AccessLevel.NONE)
    private List<PessoaPerfil> pessoaPerfil;

    @OneToMany(mappedBy = "criador", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Categoria> categoriasCriadas;

    @OneToMany(mappedBy = "vendedor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Leilao> leiloesPublicados;

    @OneToMany(mappedBy = "comprador", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Lance> lances;

    @OneToMany(mappedBy = "autor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Feedback> feedbacksEscritos;

    @OneToMany(mappedBy = "destinatario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Feedback> feedbacksRecebidos;

    public void setPessoaPerfil(List<PessoaPerfil> pessoaPerfil) {
        for (PessoaPerfil p : pessoaPerfil) {
            p.setPessoa(this);
        }
        this.pessoaPerfil = pessoaPerfil;
    }

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return pessoaPerfil.stream().map(user -> new SimpleGrantedAuthority(user.getPerfil().getNome()))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return senha;
    }

    @Override
    public String getUsername() {
        return email;
    }
}