package com.hrmanager.controller;

import com.hrmanager.model.Contrato;
import com.hrmanager.model.Historial;
import com.hrmanager.repository.ContratoRepository;
import com.hrmanager.repository.HistorialRepository;
import com.hrmanager.dto.ActualizarContratoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/contrato")
@CrossOrigin
public class ContratoController {

    @Autowired
    private ContratoRepository contratoRepository;

    @Autowired
    private HistorialRepository historialRepository;


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
    public ResponseEntity<Contrato> update(@PathVariable Long id, @RequestBody ActualizarContratoDTO dto) {
        return contratoRepository.findById(id).map(c -> {
            c.setTipo(dto.tipo);
            if (dto.fechaInicio != null) {
                c.setFechaInicio(LocalDate.parse(dto.fechaInicio));
            }
            if (dto.fechaFin != null) {
                c.setFechaFin(LocalDate.parse(dto.fechaFin));
            }
            Contrato saved = contratoRepository.save(c);

            Historial h = new Historial();
            h.setFechaModificacion(LocalDate.now());
            h.setObservaciones(dto.observaciones);
            h.setContrato(saved);
            historialRepository.save(h);

            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        contratoRepository.deleteById(id);
    }
}


