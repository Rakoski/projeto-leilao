package com.leilao.backend.controller;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import com.leilao.backend.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.leilao.backend.enums.StatusLeilao;
import com.leilao.backend.model.Categoria;
import com.leilao.backend.model.Leilao;
import com.leilao.backend.model.Pessoa;
import com.leilao.backend.service.CategoriaService;
import com.leilao.backend.service.LeilaoService;
import com.leilao.backend.service.PessoaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/leiloes")
public class LeilaoController {

    @Autowired
    private LeilaoService leilaoService;

    @Autowired
    private PessoaService pessoaService;

    @Autowired
    private CategoriaService categoriaService;

    /**
     * Converte string de data ISO 8601 (com ou sem timezone) para LocalDateTime
     */
    private LocalDateTime parseDateTime(String dateTimeStr) {
        if (dateTimeStr == null || dateTimeStr.isEmpty()) {
            return null;
        }
        try {
            // Tenta primeiro com timezone (formato ISO 8601: 2025-11-11T01:19:57.000Z)
            return ZonedDateTime.parse(dateTimeStr, DateTimeFormatter.ISO_DATE_TIME).toLocalDateTime();
        } catch (Exception e) {
            // Se falhar, tenta sem timezone (formato: 2025-11-11T01:19:57)
            return LocalDateTime.parse(dateTimeStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        }
    }

    @GetMapping
    public ResponseEntity<List<LeilaoDTO>> listar() {
        List<Leilao> leiloes = leilaoService.listarTodos();
        List<LeilaoDTO> leioesDTO = leiloes.stream()
                .map(LeilaoService::converterParaDTO)
                .toList();
        return ResponseEntity.ok(leioesDTO);
    }

    @GetMapping("/filtros")
    public ResponseEntity<PaginaDTO<LeilaoResponseDTO>> listarComFiltros(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) StatusLeilao status,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) String categoriaNome,
            @RequestParam(required = false) Long vendedorId,
            @RequestParam(required = false) String vendedorNome,
            @RequestParam(required = false) String dataHoraInicioFrom,
            @RequestParam(required = false) String dataHoraInicioTo,
            @RequestParam(required = false) String dataHoraFimFrom,
            @RequestParam(required = false) String dataHoraFimTo,
            @RequestParam(required = false) Float lanceMinFrom,
            @RequestParam(required = false) Float lanceMinTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dataHoraInicio") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        LeilaoFilterDTO filtros = new LeilaoFilterDTO();
        filtros.setId(id);
        filtros.setTitulo(titulo);
        filtros.setStatus(status);
        filtros.setCategoriaId(categoriaId);
        filtros.setCategoriaNome(categoriaNome);
        filtros.setVendedorId(vendedorId);
        filtros.setVendedorNome(vendedorNome);

        // Usando método helper para parsear datas ISO 8601 com ou sem timezone
        filtros.setDataHoraInicioFrom(parseDateTime(dataHoraInicioFrom));
        filtros.setDataHoraInicioTo(parseDateTime(dataHoraInicioTo));
        filtros.setDataHoraFimFrom(parseDateTime(dataHoraFimFrom));
        filtros.setDataHoraFimTo(parseDateTime(dataHoraFimTo));

        filtros.setLanceMinFrom(lanceMinFrom);
        filtros.setLanceMinTo(lanceMinTo);

        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<LeilaoResponseDTO> pageResultado = leilaoService.listarComFiltros(filtros, pageable);
        PaginaDTO<LeilaoResponseDTO> resultado = new PaginaDTO<>(pageResultado);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeilaoResponseDTO> buscarPorId(@PathVariable Long id) {
        Leilao leilao = leilaoService.buscarPorId(id);
        LeilaoResponseDTO dto = leilaoService.converterParaResponseDTO(leilao);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'VENDEDOR')")
    public ResponseEntity<LeilaoResponseDTO> criar(@Valid @RequestBody LeilaoCreateDTO dto, Authentication auth) {
        Pessoa vendedor = pessoaService.buscarPorEmail(auth.getName());
        LeilaoResponseDTO leilaoSalvo = leilaoService.criarComDTO(dto, vendedor);
        return ResponseEntity.status(HttpStatus.CREATED).body(leilaoSalvo);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'VENDEDOR')")
    public ResponseEntity<LeilaoResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody LeilaoUpdateDTO dto) {
        LeilaoResponseDTO leilaoAtualizado = leilaoService.atualizarComDTO(id, dto);
        return ResponseEntity.ok(leilaoAtualizado);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        leilaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<LeilaoResponseDTO>> buscarPorStatus(@PathVariable StatusLeilao status) {
        List<Leilao> leiloes = leilaoService.buscarPorStatus(status);
        List<LeilaoResponseDTO> leioesDTO = leiloes.stream()
                .map(leilaoService::converterParaResponseDTO)
                .toList();
        return ResponseEntity.ok(leioesDTO);
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<LeilaoResponseDTO>> buscarPorCategoria(@PathVariable Long categoriaId) {
        Categoria categoria = categoriaService.buscarPorId(categoriaId);
        List<Leilao> leiloes = leilaoService.buscarPorCategoria(categoria);
        List<LeilaoResponseDTO> leioesDTO = leiloes.stream()
                .map(leilaoService::converterParaResponseDTO)
                .toList();
        return ResponseEntity.ok(leioesDTO);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<LeilaoResponseDTO>> buscarPorTitulo(@RequestParam String titulo) {
        List<Leilao> leiloes = leilaoService.buscarPorTitulo(titulo);
        List<LeilaoResponseDTO> leioesDTO = leiloes.stream()
                .map(leilaoService::converterParaResponseDTO)
                .toList();
        return ResponseEntity.ok(leioesDTO);
    }

    @GetMapping("/meus")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'VENDEDOR')")
    public ResponseEntity<List<LeilaoResponseDTO>> buscarMeusLeiloes(Authentication auth) {
        Pessoa vendedor = pessoaService.buscarPorEmail(auth.getName());
        List<Leilao> leiloes = leilaoService.buscarPorVendedor(vendedor);
        List<LeilaoResponseDTO> leioesDTO = leiloes.stream()
                .map(leilaoService::converterParaResponseDTO)
                .toList();
        return ResponseEntity.ok(leioesDTO);
    }

    @PutMapping("/{id}/abrir")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<LeilaoResponseDTO> abrirLeilao(@PathVariable Long id) {
        Leilao leilao = leilaoService.abrirLeilao(id);
        LeilaoResponseDTO dto = leilaoService.converterParaResponseDTO(leilao);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}/encerrar")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<LeilaoResponseDTO> encerrarLeilao(@PathVariable Long id) {
        Leilao leilao = leilaoService.encerrarLeilao(id);
        LeilaoResponseDTO dto = leilaoService.converterParaResponseDTO(leilao);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}/cancelar")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<LeilaoResponseDTO> cancelarLeilao(@PathVariable Long id) {
        Leilao leilao = leilaoService.cancelarLeilao(id);
        LeilaoResponseDTO dto = leilaoService.converterParaResponseDTO(leilao);
        return ResponseEntity.ok(dto);
    }
}
