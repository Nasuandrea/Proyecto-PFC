package com.hrmanager.controller;

import com.hrmanager.model.Ausencia;
import com.hrmanager.model.Ausencia.Estado;
import com.hrmanager.repository.AusenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ausencia")
@CrossOrigin
public class AusenciaController {

    @Autowired
    private AusenciaRepository ausenciaRepository;

    @GetMapping
    public List<Ausencia> getAll() {
        return ausenciaRepository.findAll();
    }

    @PostMapping
    public Ausencia create(@RequestBody Ausencia ausencia) {
        return ausenciaRepository.save(ausencia);
    }

    @PutMapping("/{id}/aprobar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Ausencia> aprobar(@PathVariable Long id) {
        return ausenciaRepository.findById(id).map(a -> {
            a.setEstado(Estado.APROBADA);
            return ResponseEntity.ok(ausenciaRepository.save(a));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/rechazar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Ausencia> rechazar(@PathVariable Long id, @RequestBody String comentario) {
        return ausenciaRepository.findById(id).map(a -> {
            a.setEstado(Estado.RECHAZADA);
            a.setComentarioAdmin(comentario);
            return ResponseEntity.ok(ausenciaRepository.save(a));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        ausenciaRepository.deleteById(id);
    }
}
