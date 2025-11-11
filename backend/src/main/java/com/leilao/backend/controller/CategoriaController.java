package com.leilao.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import com.leilao.backend.dto.CategoriaDTO;
import com.leilao.backend.dto.PaginaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.leilao.backend.model.Categoria;
import com.leilao.backend.model.Pessoa;
import com.leilao.backend.service.CategoriaService;
import com.leilao.backend.service.PessoaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {
    
    @Autowired
    private CategoriaService categoriaService;
    
    @Autowired
    private PessoaService pessoaService;
    
    @GetMapping
    public ResponseEntity<PaginaDTO<CategoriaDTO>> listar(
            @RequestParam(required = false) String nome,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nome") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Categoria> pageResultado;
        if (nome != null && !nome.isEmpty()) {
            pageResultado = categoriaService.buscarPorNomePaginado(nome, pageable);
        } else {
            pageResultado = categoriaService.listarTodasPaginado(pageable);
        }

        Page<CategoriaDTO> pageDTOs = pageResultado.map(categoriaService::converterParaDTO);
        return ResponseEntity.ok(new PaginaDTO<>(pageDTOs));
    }

    @GetMapping("/lista")
    public ResponseEntity<List<CategoriaDTO>> listarTodas() {
        List<CategoriaDTO> categorias = categoriaService.listarTodas().stream()
            .map(categoriaService::converterParaDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(categorias);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDTO> buscarPorId(@PathVariable Long id) {
        Categoria categoria = categoriaService.buscarPorId(id);
        return ResponseEntity.ok(categoriaService.converterParaDTO(categoria));
    }
    
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'VENDEDOR')")
    public ResponseEntity<CategoriaDTO> criar(@Valid @RequestBody CategoriaDTO dto, Authentication auth) {
        Pessoa criador = pessoaService.buscarPorEmail(auth.getName());
        Categoria categoriaSalva = categoriaService.criar(dto, criador);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.converterParaDTO(categoriaSalva));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<CategoriaDTO> atualizar(@PathVariable Long id, @Valid @RequestBody CategoriaDTO dto) {
        Categoria categoriaAtualizada = categoriaService.atualizar(id, dto);
        return ResponseEntity.ok(categoriaService.converterParaDTO(categoriaAtualizada));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        categoriaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/buscar")
    public ResponseEntity<List<CategoriaDTO>> buscarPorNome(@RequestParam String nome) {
        List<CategoriaDTO> categorias = categoriaService.buscarPorNome(nome).stream()
            .map(categoriaService::converterParaDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(categorias);
    }
    
    @GetMapping("/minhas")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'VENDEDOR')")
    public ResponseEntity<List<CategoriaDTO>> buscarMinhasCategorias(Authentication auth) {
        Pessoa criador = pessoaService.buscarPorEmail(auth.getName());
        List<CategoriaDTO> categorias = categoriaService.buscarPorCriador(criador).stream()
            .map(categoriaService::converterParaDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(categorias);
    }
}
