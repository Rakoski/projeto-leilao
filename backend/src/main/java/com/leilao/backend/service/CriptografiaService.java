package com.leilao.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CriptografiaService {
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Criptografa uma senha usando BCrypt
     * @param senhaTextoClaro A senha em texto claro
     * @return A senha criptografada
     */
    public String criptografarSenha(String senhaTextoClaro) {
        if (senhaTextoClaro == null || senhaTextoClaro.isEmpty()) {
            return null;
        }
        return passwordEncoder.encode(senhaTextoClaro);
    }
    
    /**
     * Verifica se uma senha em texto claro corresponde à senha criptografada
     * @param senhaTextoClaro A senha em texto claro
     * @param senhaCriptografada A senha criptografada
     * @return true se as senhas correspondem, false caso contrário
     */
    public boolean verificarSenha(String senhaTextoClaro, String senhaCriptografada) {
        if (senhaTextoClaro == null || senhaCriptografada == null) {
            return false;
        }
        return passwordEncoder.matches(senhaTextoClaro, senhaCriptografada);
    }
    
    /**
     * NOTA IMPORTANTE: BCrypt é um algoritmo de hash unidirecional.
     * Isso significa que não é possível "descriptografar" uma senha BCrypt
     * para obter o texto original. Isso é uma característica de segurança.
     * 
     * Para verificar uma senha, use o método verificarSenha() acima.
     * 
     * Se você realmente precisar de criptografia reversível (não recomendado
     * para senhas), você precisaria implementar um algoritmo diferente como AES.
     */
    
    /**
     * Gera um hash da senha para comparação
     * @param senha A senha a ser hashada
     * @return O hash da senha
     */
    public String gerarHashSenha(String senha) {
        return criptografarSenha(senha);
    }
}
