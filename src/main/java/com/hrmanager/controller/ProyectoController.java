package com.hrmanager.controller;

import com.hrmanager.model.Proyecto;
import com.hrmanager.repository.ProyectoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proyecto")
@CrossOrigin
public class ProyectoController {

    @Autowired
    private ProyectoRepository proyectoRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Proyecto> getAll() {
        return proyectoRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Proyecto> getById(@PathVariable Long id) {
        return proyectoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Proyecto create(@RequestBody Proyecto proyecto) {
        return proyectoRepository.save(proyecto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Proyecto> update(@PathVariable Long id, @RequestBody Proyecto updated) {
        return proyectoRepository.findById(id).map(p -> {
            p.setNombre(updated.getNombre());
            p.setDescripcion(updated.getDescripcion());
            p.setFechaInicio(updated.getFechaInicio());
            p.setFechaFin(updated.getFechaFin());
            p.setHorasEstimadas(updated.getHorasEstimadas());
            return ResponseEntity.ok(proyectoRepository.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        proyectoRepository.deleteById(id);
    }
}

