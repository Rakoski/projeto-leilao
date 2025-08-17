package com.leilao.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CriptografiaService {
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public String criptografarSenha(String senhaTextoClaro) {
        if (senhaTextoClaro == null || senhaTextoClaro.isEmpty()) {
            return null;
        }
        return passwordEncoder.encode(senhaTextoClaro);
    }
    
    public boolean verificarSenha(String senhaTextoClaro, String senhaCriptografada) {
        if (senhaTextoClaro == null || senhaCriptografada == null) {
            return false;
        }
        return passwordEncoder.matches(senhaTextoClaro, senhaCriptografada);
    }
    
    public String gerarHashSenha(String senha) {
        return criptografarSenha(senha);
    }
}
