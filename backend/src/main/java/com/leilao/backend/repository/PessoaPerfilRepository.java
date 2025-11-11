package com.leilao.backend.repository;
import com.leilao.backend.model.Perfil;
import com.leilao.backend.model.Pessoa;
import com.leilao.backend.model.PessoaPerfil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface PessoaPerfilRepository extends JpaRepository<PessoaPerfil, Long> {
    List<PessoaPerfil> findByPessoa(Pessoa pessoa);
    Optional<PessoaPerfil> findByPessoaAndPerfil(Pessoa pessoa, Perfil perfil);
    void deleteByPessoaAndPerfil(Pessoa pessoa, Perfil perfil);
}
