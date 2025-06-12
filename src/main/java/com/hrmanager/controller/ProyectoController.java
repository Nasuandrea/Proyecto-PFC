package com.hrmanager.controller;

import com.hrmanager.model.Proyecto;
import com.hrmanager.model.Usuario;
import com.hrmanager.repository.ProyectoRepository;
import com.hrmanager.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/proyectos")
public class ProyectoController {

    @Autowired
    private ProyectoRepository proyectoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Obtener todos los proyectos
    @GetMapping
    public ResponseEntity<?> getAllProyectos() {
        return ResponseEntity.ok(proyectoRepository.findAll());
    }

    // Obtener un proyecto por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProyectoById(@PathVariable Long id) {
        Optional<Proyecto> proyecto = proyectoRepository.findById(id);
        return proyecto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Crear un nuevo proyecto
    @PostMapping
    public ResponseEntity<Proyecto> createProyecto(@RequestBody Proyecto proyecto) {
        return ResponseEntity.ok(proyectoRepository.save(proyecto));
    }

    // Actualizar un proyecto existente
    @PutMapping("/{id}")
    public ResponseEntity<Proyecto> updateProyecto(@PathVariable Long id, @RequestBody Proyecto proyectoActualizado) {
        return proyectoRepository.findById(id).map(proyecto -> {
            proyecto.setNombre(proyectoActualizado.getNombre());
            proyecto.setDescripcion(proyectoActualizado.getDescripcion());
            proyecto.setFechaInicio(proyectoActualizado.getFechaInicio());
            proyecto.setFechaFin(proyectoActualizado.getFechaFin());
            return ResponseEntity.ok(proyectoRepository.save(proyecto));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Eliminar un proyecto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProyecto(@PathVariable Long id) {
        if (proyectoRepository.existsById(id)) {
            proyectoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Asignar un trabajador a un proyecto
    @PostMapping("/{proyectoId}/trabajadores/{usuarioId}")
    public ResponseEntity<Proyecto> addTrabajadorToProyecto(@PathVariable Long proyectoId, @PathVariable Long usuarioId) {
        Optional<Proyecto> proyectoOpt = proyectoRepository.findById(proyectoId);
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioId);

        if (proyectoOpt.isPresent() && usuarioOpt.isPresent()) {
            Proyecto proyecto = proyectoOpt.get();
            Usuario usuario = usuarioOpt.get();
            if (!proyecto.getTrabajadores().contains(usuario)) {
                proyecto.getTrabajadores().add(usuario);
                return ResponseEntity.ok(proyectoRepository.save(proyecto));
            } else {
                return ResponseEntity.badRequest().body(proyecto);
            }
        }
        return ResponseEntity.notFound().build();
    }

    // Eliminar un trabajador de un proyecto
    @DeleteMapping("/{proyectoId}/trabajadores/{usuarioId}")
    public ResponseEntity<Proyecto> removeTrabajadorFromProyecto(@PathVariable Long proyectoId, @PathVariable Long usuarioId) {
        Optional<Proyecto> proyectoOpt = proyectoRepository.findById(proyectoId);
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioId);

        if (proyectoOpt.isPresent() && usuarioOpt.isPresent()) {
            Proyecto proyecto = proyectoOpt.get();
            Usuario usuario = usuarioOpt.get();
            proyecto.getTrabajadores().remove(usuario);
            return ResponseEntity.ok(proyectoRepository.save(proyecto));
        }
        return ResponseEntity.notFound().build();
    }
}
