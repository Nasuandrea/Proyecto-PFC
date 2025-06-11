package com.hrmanager.controller;

import com.hrmanager.model.Contrato;
import com.hrmanager.repository.ContratoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contrato")
@CrossOrigin
public class ContratoController {

    @Autowired
    private ContratoRepository contratoRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Contrato> getAll() {
        return contratoRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Contrato> getById(@PathVariable Long id) {
        return contratoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Contrato create(@RequestBody Contrato contrato) {
        return contratoRepository.save(contrato);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Contrato> update(@PathVariable Long id, @RequestBody Contrato updated) {
        return contratoRepository.findById(id).map(c -> {
            c.setTipo(updated.getTipo());
            c.setFechaInicio(updated.getFechaInicio());
            c.setFechaFin(updated.getFechaFin());
            return ResponseEntity.ok(contratoRepository.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        contratoRepository.deleteById(id);
    }
}


