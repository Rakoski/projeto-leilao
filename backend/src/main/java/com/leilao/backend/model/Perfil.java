package com.leilao.backend.model;

import com.leilao.backend.enums.TipoPerfil;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "perfil")
public class Perfil {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TipoPerfil tipo;

    // Mantendo o nome para compatibilidade com o sistema de segurança existente
    public String getNome() {
        return tipo != null ? tipo.name() : null;
    }
}
