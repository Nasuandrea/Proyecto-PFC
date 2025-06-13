package com.hrmanager.controller;

import com.hrmanager.model.Parte;
import com.hrmanager.model.Proyecto;
import com.hrmanager.service.ParteService;
import com.hrmanager.repository.ProyectoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/parte")
@CrossOrigin
public class ParteController {

    @Autowired
    private ParteService parteService;

    @Autowired
    private ProyectoRepository proyectoRepository;

    // Obtener todos los partes de horas (solo ADMIN)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Parte> getAll() {
        return parteService.getAll();
    }

    // Crear un parte de horas (cualquier usuario)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USUARIO')")
    public Parte create(@RequestBody Parte parte) {
        // Asegúrate de que el proyectoId no sea nulo antes de intentar crear el parte
        if (parte.getProyecto() == null || parte.getProyecto().getId() == null) {
            throw new IllegalArgumentException("El proyecto no puede ser nulo");
        }

        // Convertir el proyectoId a Long si es un String
        Long proyectoId = Long.parseLong(parte.getProyecto().getId().toString());

        // Buscar el proyecto en la base de datos usando el ID
        Optional<Proyecto> proyectoOpt = proyectoRepository.findById(proyectoId);
        if (proyectoOpt.isEmpty()) {
            throw new IllegalArgumentException("Proyecto no encontrado");
        }

        // Asignar el proyecto al parte
        parte.setProyecto(proyectoOpt.get());

        return parteService.create(parte);
    }

    // Eliminar un parte de horas (solo ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        parteService.delete(id);
    }

    // Obtener los partes de horas de un usuario específico (solo el usuario o ADMIN)
    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurityService.isCurrentUser(#usuarioId)")
    public List<Parte> getByUsuarioId(@PathVariable Long usuarioId) {
        return parteService.getByUsuarioId(usuarioId);
    }
}
