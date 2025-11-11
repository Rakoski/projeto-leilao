package com.leilao.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import com.leilao.backend.dto.PaginaDTO;
import com.leilao.backend.dto.PerfilDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.leilao.backend.model.Perfil;
import com.leilao.backend.service.PerfilService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/perfil")
@PreAuthorize("hasAuthority('ADMIN')")
public class PerfilController {

    @Autowired
    private PerfilService perfilService;

    @GetMapping
    public ResponseEntity<PaginaDTO<PerfilDTO>> buscarTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "tipo") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Perfil> pageResultado = perfilService.buscarTodos(pageable);
        Page<PerfilDTO> pageDTOs = pageResultado.map(perfilService::converterParaDTO);

        return ResponseEntity.ok(new PaginaDTO<>(pageDTOs));
    }

    @GetMapping("/lista")
    public ResponseEntity<List<PerfilDTO>> listarTodos() {
        List<PerfilDTO> perfis = perfilService.listarTodos().stream()
            .map(perfilService::converterParaDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(perfis);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PerfilDTO> buscarPorId(@PathVariable Long id) {
        Perfil perfil = perfilService.buscarPorId(id);
        return ResponseEntity.ok(perfilService.converterParaDTO(perfil));
    }

    @PostMapping
    public ResponseEntity<PerfilDTO> inserir(@Valid @RequestBody PerfilDTO dto) {
        Perfil perfil = perfilService.inserir(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(perfilService.converterParaDTO(perfil));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PerfilDTO> alterar(@PathVariable Long id, @Valid @RequestBody PerfilDTO dto) {
        Perfil perfil = perfilService.alterar(id, dto);
        return ResponseEntity.ok(perfilService.converterParaDTO(perfil));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        perfilService.excluir(id);
        return ResponseEntity.noContent().build();
    }

}
