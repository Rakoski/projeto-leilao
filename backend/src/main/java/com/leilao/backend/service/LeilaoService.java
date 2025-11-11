package com.leilao.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import com.leilao.backend.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.leilao.backend.enums.StatusLeilao;
import com.leilao.backend.exception.NaoEncontradoExcecao;
import com.leilao.backend.exception.NegocioExcecao;
import com.leilao.backend.model.Categoria;
import com.leilao.backend.model.Leilao;
import com.leilao.backend.model.Pessoa;
import com.leilao.backend.repository.LeilaoRepository;

@Service
public class LeilaoService {
    
    @Autowired
    private LeilaoRepository leilaoRepository;

    @Autowired
    private CategoriaService categoriaService;

    public List<Leilao> listarTodos() {
        return leilaoRepository.findAll();
    }

    public Page<LeilaoResponseDTO> listarComFiltros(LeilaoFilterDTO filtros, Pageable pageable) {
        Page<Leilao> leiloes = leilaoRepository.findWithFilters(filtros, pageable);
        return leiloes.map(this::converterParaResponseDTO);
    }

    public LeilaoResponseDTO criarComDTO(LeilaoCreateDTO dto, Pessoa vendedor) {
        Categoria categoria = categoriaService.buscarPorId(dto.getCategoriaId());

        Leilao leilao = new Leilao();
        leilao.setTitulo(dto.getTitulo());
        leilao.setDescricao(dto.getDescricao());
        leilao.setDescricaoDetalhada(dto.getDescricaoDetalhada());
        leilao.setDataHoraInicio(dto.getDataHoraInicio());
        leilao.setDataHoraFim(dto.getDataHoraFim());
        leilao.setObservacao(dto.getObservacao());
        leilao.setValorIncremento(dto.getValorIncremento());
        leilao.setLanceMinimo(dto.getLanceMinimo());
        leilao.setCategoria(categoria);
        leilao.setVendedor(vendedor);
        leilao.setStatus(StatusLeilao.EM_ANALISE);

        validarDatas(leilao);
        validarValores(leilao);

        Leilao leilaoSalvo = leilaoRepository.save(leilao);
        return converterParaResponseDTO(leilaoSalvo);
    }

    public LeilaoResponseDTO atualizarComDTO(Long id, LeilaoUpdateDTO dto) {
        Leilao leilaoExistente = buscarPorId(id);

        if (leilaoExistente.getStatus() == StatusLeilao.ENCERRADO ||
            leilaoExistente.getStatus() == StatusLeilao.CANCELADO) {
            throw new NegocioExcecao("Não é possível atualizar leilão encerrado ou cancelado");
        }

        Categoria categoria = categoriaService.buscarPorId(dto.getCategoriaId());

        leilaoExistente.setTitulo(dto.getTitulo());
        leilaoExistente.setDescricao(dto.getDescricao());
        leilaoExistente.setDescricaoDetalhada(dto.getDescricaoDetalhada());
        leilaoExistente.setDataHoraInicio(dto.getDataHoraInicio());
        leilaoExistente.setDataHoraFim(dto.getDataHoraFim());
        leilaoExistente.setObservacao(dto.getObservacao());
        leilaoExistente.setValorIncremento(dto.getValorIncremento());
        leilaoExistente.setLanceMinimo(dto.getLanceMinimo());
        leilaoExistente.setCategoria(categoria);

        validarDatas(leilaoExistente);
        validarValores(leilaoExistente);

        Leilao leilaoAtualizado = leilaoRepository.save(leilaoExistente);
        return converterParaResponseDTO(leilaoAtualizado);
    }

    public LeilaoResponseDTO converterParaResponseDTO(Leilao leilao) {
        LeilaoResponseDTO dto = new LeilaoResponseDTO();
        dto.setId(leilao.getId());
        dto.setTitulo(leilao.getTitulo());
        dto.setDescricao(leilao.getDescricao());
        dto.setDescricaoDetalhada(leilao.getDescricaoDetalhada());
        dto.setDataHoraInicio(leilao.getDataHoraInicio());
        dto.setDataHoraFim(leilao.getDataHoraFim());
        dto.setStatus(leilao.getStatus());
        dto.setObservacao(leilao.getObservacao());
        dto.setValorIncremento(leilao.getValorIncremento());
        dto.setLanceMinimo(leilao.getLanceMinimo());

        if (leilao.getCategoria() != null) {
            dto.setCategoriaId(leilao.getCategoria().getId());
            dto.setCategoriaNome(leilao.getCategoria().getNome());
        }

        if (leilao.getVendedor() != null) {
            dto.setVendedorId(leilao.getVendedor().getId());
            dto.setVendedorNome(leilao.getVendedor().getNome());
            dto.setVendedorEmail(leilao.getVendedor().getEmail());
        }

        return dto;
    }

    public Leilao buscarPorId(Long id) {
        return leilaoRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoExcecao("Leilão não encontrado"));
    }
    
    public Leilao salvar(Leilao leilao) {
        validarDatas(leilao);
        validarValores(leilao);
        return leilaoRepository.save(leilao);
    }
    
    public Leilao atualizar(Long id, Leilao leilao) {
        Leilao leilaoExistente = buscarPorId(id);
        
        if (leilaoExistente.getStatus() == StatusLeilao.ENCERRADO || 
            leilaoExistente.getStatus() == StatusLeilao.CANCELADO) {
            throw new NegocioExcecao("Não é possível atualizar leilão encerrado ou cancelado");
        }
        
        leilaoExistente.setTitulo(leilao.getTitulo());
        leilaoExistente.setDescricao(leilao.getDescricao());
        leilaoExistente.setDescricaoDetalhada(leilao.getDescricaoDetalhada());
        leilaoExistente.setDataHoraInicio(leilao.getDataHoraInicio());
        leilaoExistente.setDataHoraFim(leilao.getDataHoraFim());
        leilaoExistente.setObservacao(leilao.getObservacao());
        leilaoExistente.setValorIncremento(leilao.getValorIncremento());
        leilaoExistente.setLanceMinimo(leilao.getLanceMinimo());
        leilaoExistente.setCategoria(leilao.getCategoria());
        
        validarDatas(leilaoExistente);
        validarValores(leilaoExistente);
        
        return leilaoRepository.save(leilaoExistente);
    }
    
    public void deletar(Long id) {
        Leilao leilao = buscarPorId(id);
        if (leilao.getStatus() == StatusLeilao.ABERTO) {
            throw new NegocioExcecao("Não é possível deletar leilão em andamento");
        }
        leilaoRepository.delete(leilao);
    }
    
    public List<Leilao> buscarPorVendedor(Pessoa vendedor) {
        return leilaoRepository.findByVendedor(vendedor);
    }
    
    public List<Leilao> buscarPorCategoria(Categoria categoria) {
        return leilaoRepository.findByCategoria(categoria);
    }
    
    public List<Leilao> buscarPorStatus(StatusLeilao status) {
        return leilaoRepository.findByStatus(status);
    }
    
    public List<Leilao> buscarPorTitulo(String titulo) {
        return leilaoRepository.findByTituloContainingIgnoreCase(titulo);
    }
    
    public Leilao abrirLeilao(Long id) {
        Leilao leilao = buscarPorId(id);
        if (leilao.getStatus() != StatusLeilao.EM_ANALISE) {
            throw new NegocioExcecao("Apenas leilões em análise podem ser abertos");
        }
        leilao.setStatus(StatusLeilao.ABERTO);
        return leilaoRepository.save(leilao);
    }
    
    public Leilao encerrarLeilao(Long id) {
        Leilao leilao = buscarPorId(id);
        if (leilao.getStatus() != StatusLeilao.ABERTO) {
            throw new NegocioExcecao("Apenas leilões abertos podem ser encerrados");
        }
        leilao.setStatus(StatusLeilao.ENCERRADO);
        return leilaoRepository.save(leilao);
    }
    
    public Leilao cancelarLeilao(Long id) {
        Leilao leilao = buscarPorId(id);
        if (leilao.getStatus() == StatusLeilao.ENCERRADO) {
            throw new NegocioExcecao("Não é possível cancelar leilão já encerrado");
        }
        leilao.setStatus(StatusLeilao.CANCELADO);
        return leilaoRepository.save(leilao);
    }
    
    private void validarDatas(Leilao leilao) {
        if (leilao.getDataHoraInicio().isAfter(leilao.getDataHoraFim())) {
            throw new NegocioExcecao("Data de início deve ser anterior à data de fim");
        }
        if (leilao.getDataHoraInicio().isBefore(LocalDateTime.now())) {
            throw new NegocioExcecao("Data de início não pode ser no passado");
        }
    }
    
    private void validarValores(Leilao leilao) {
        if (leilao.getValorIncremento() <= 0) {
            throw new NegocioExcecao("Valor do incremento deve ser maior que zero");
        }
        if (leilao.getLanceMinimo() <= 0) {
            throw new NegocioExcecao("Lance mínimo deve ser maior que zero");
        }
    }

    public static LeilaoDTO converterParaDTO(Leilao leilao) {
        LeilaoDTO dto = new LeilaoDTO();
        dto.setId(leilao.getId());
        dto.setTitulo(leilao.getTitulo());
        dto.setDescricao(leilao.getDescricao());
        dto.setLanceMinimo(leilao.getLanceMinimo());
        dto.setDataHoraInicio(leilao.getDataHoraInicio());
        dto.setDataHoraFim(leilao.getDataHoraFim());
        dto.setStatus(leilao.getStatus());
        dto.setValorIncremento(leilao.getValorIncremento());
        if (leilao.getCategoria() != null) {
            dto.setCategoriaNome(leilao.getCategoria().getNome());
        }
        return dto;
    }
}
