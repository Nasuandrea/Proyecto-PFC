package com.hrmanager.controller;

import com.hrmanager.model.Parte;
import com.hrmanager.model.Proyecto;
import com.hrmanager.model.Usuario;
import com.hrmanager.service.ParteService;
import com.hrmanager.security.JwtService;
import com.hrmanager.repository.ProyectoRepository;
import com.hrmanager.repository.UsuarioRepository;
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

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtService jwtService;

    // Obtener todos los partes de horas (solo ADMIN)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Parte> getAll() {
        return parteService.getAll();
    }

    // Crear un parte de horas (cualquier usuario)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USUARIO')")
    public Parte create(@RequestBody Parte parte,
                        @RequestHeader("Authorization") String authHeader) {
        // Verificar que el proyectoId no sea nulo antes de intentar crear el parte
        if (parte.getProyecto() == null || parte.getProyecto().getId() == null) {
            throw new IllegalArgumentException("El proyecto no puede ser nulo");
        }

        // Obtener el identificador del proyecto como Long
        Long proyectoId = parte.getProyecto().getId();

        // Buscar el proyecto en la base de datos usando el ID
        Optional<Proyecto> proyectoOpt = proyectoRepository.findById(proyectoId);
        if (proyectoOpt.isEmpty()) {
            throw new IllegalArgumentException("Proyecto no encontrado");
        }

        // Obtener el usuario a partir del token
        String token = authHeader.replace("Bearer ", "");
        String correo = jwtService.extractUsername(token);
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Asignar el proyecto y el usuario al parte
        parte.setProyecto(proyectoOpt.get());
        parte.setUsuario(usuario);

        return parteService.create(parte);
    }

    // Actualizar un parte de horas
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurityService.isOwnerParte(#id)")
    public Parte update(@PathVariable Long id, @RequestBody Parte parte) {
        return parteService.update(id, parte);
    }

    // Eliminar un parte de horas
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurityService.isOwnerParte(#id)")
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
