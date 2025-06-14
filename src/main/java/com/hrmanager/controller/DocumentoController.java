package com.hrmanager.controller;

import com.hrmanager.model.Documento;
import com.hrmanager.repository.DocumentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documento")
@CrossOrigin
public class DocumentoController {

    @Autowired
    private DocumentoRepository documentoRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Documento> getAll() {
        return documentoRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Documento create(@RequestBody Documento documento) {
        return documentoRepository.save(documento);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        documentoRepository.deleteById(id);
    }
}

