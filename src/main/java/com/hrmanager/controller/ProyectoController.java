package com.hrmanager.controller;

import com.hrmanager.dto.ProyectoInfoDTO;
import com.hrmanager.dto.ActualizarProyectoDTO;
import com.hrmanager.model.Historial;
import com.hrmanager.model.Proyecto;
import com.hrmanager.model.Usuario;
import com.hrmanager.model.UsuarioProyecto;
import com.hrmanager.repository.HistorialRepository;
import com.hrmanager.repository.ParteRepository;
import com.hrmanager.repository.ProyectoRepository;
import com.hrmanager.repository.UsuarioProyectoRepository;
import com.hrmanager.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/proyectos")
@CrossOrigin
public class ProyectoController {

    @Autowired
    private ProyectoRepository proyectoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ParteRepository parteRepository;

    @Autowired
    private UsuarioProyectoRepository usuarioProyectoRepository;

    @Autowired
    private HistorialRepository historialRepository;

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
    public ResponseEntity<Proyecto> updateProyecto(@PathVariable Long id, @RequestBody ActualizarProyectoDTO dto) {
        return proyectoRepository.findById(id).map(proyecto -> {
            proyecto.setNombre(dto.nombre);
            proyecto.setDescripcion(dto.descripcion);
            if (dto.fechaInicio != null) {
                proyecto.setFechaInicio(LocalDate.parse(dto.fechaInicio));
            } else {
                proyecto.setFechaInicio(null);
            }
            if (dto.fechaFin != null) {
                proyecto.setFechaFin(LocalDate.parse(dto.fechaFin));
            } else {
                proyecto.setFechaFin(null);
            }
            proyecto.setHorasEstimadas(dto.horasEstimadas);

            Proyecto saved = proyectoRepository.save(proyecto);

            Historial h = new Historial();
            h.setFechaModificacion(LocalDate.now());
            h.setObservaciones(dto.observaciones);
            h.setProyecto(saved);
            historialRepository.save(h);

            return ResponseEntity.ok(saved);
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

    @GetMapping("/{id}/info")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProyectoInfoDTO> getProyectoInfo(@PathVariable Long id) {
        Optional<Proyecto> proyectoOpt = proyectoRepository.findById(id);
        if (proyectoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Proyecto proyecto = proyectoOpt.get();
        ProyectoInfoDTO dto = new ProyectoInfoDTO();
        dto.proyecto = proyecto;
        dto.trabajadores = usuarioProyectoRepository.findByProyectoId(proyecto)
                .stream()
                .map(UsuarioProyecto::getUsuarioId)
                .toList();
        dto.partes = parteRepository.findByProyectoId(id);
        dto.historial = historialRepository.findByProyectoId(id);

        return ResponseEntity.ok(dto);
    }
}