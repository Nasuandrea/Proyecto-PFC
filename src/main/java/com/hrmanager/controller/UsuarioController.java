package com.hrmanager.controller;

import com.hrmanager.dto.UsuarioDTO;
import com.hrmanager.model.Rol;
import com.hrmanager.model.Proyecto;
import com.hrmanager.model.Usuario;
import com.hrmanager.model.UsuarioProyecto;
import com.hrmanager.repository.RolRepository;
import com.hrmanager.repository.ProyectoRepository;
import com.hrmanager.repository.UsuarioProyectoRepository;
import com.hrmanager.repository.UsuarioRepository;
import com.hrmanager.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuario")
@CrossOrigin
public class UsuarioController {
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private JwtService jwtService;
    @Autowired private RolRepository rolRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private ProyectoRepository proyectoRepository;
    @Autowired private UsuarioProyectoRepository usuarioProyectoRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String correo = jwtService.extractUsername(token);
        Usuario usuario = usuarioRepository.findByCorreo(correo).orElse(null);
        return ResponseEntity.ok(usuario);
    }
    @GetMapping("/mis-proyectos")
    public ResponseEntity<?> getMisProyectos(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String correo = jwtService.extractUsername(token);
        Usuario usuario = usuarioRepository.findByCorreo(correo).orElse(null);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }

        List<UsuarioProyecto> relaciones = usuarioProyectoRepository.findByUsuarioId(usuario);
        List<Proyecto> proyectos = relaciones.stream()
                .map(UsuarioProyecto::getProyectoId)
                .toList();

        return ResponseEntity.ok(proyectos);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Usuario> getAll() {
        return usuarioRepository.findAll();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        if (!usuario.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        usuarioRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Usuario> getById(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/{id}/proyectos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Proyecto>> getProyectosUsuario(@PathVariable Long id) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<Proyecto> proyectos = usuarioProyectoRepository.findProyectosByUsuario(usuarioOpt.get());
        return ResponseEntity.ok(proyectos);
    }

    @GetMapping("/{id}/proyectos/disponibles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Proyecto>> getProyectosDisponibles(@PathVariable Long id) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<Proyecto> asignados = usuarioProyectoRepository.findProyectosByUsuario(usuarioOpt.get());
        List<Long> asignadosIds = asignados.stream().map(Proyecto::getId).toList();
        List<Proyecto> disponibles = proyectoRepository.findAll().stream()
                .filter(p -> !asignadosIds.contains(p.getId()))
                .toList();
        return ResponseEntity.ok(disponibles);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody UsuarioDTO dto) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setNombre(dto.nombre);
            usuario.setApellidos(dto.apellidos);
            usuario.setDni(dto.dni);
            usuario.setCorreo(dto.correo);
            usuario.setTelefono(dto.telefono);
            usuario.setDireccion(dto.direccion);
            usuario.setFechaNacimiento(LocalDate.parse(dto.fechaNacimiento));
            usuario.setPassword(passwordEncoder.encode(dto.password));

            // Buscar el rol por nombre
            Rol.RolNombre rolNombre = Rol.RolNombre.valueOf(dto.rol);  // Convierte "ADMIN" a RolNombre.ADMIN
            Rol rol = rolRepository.findByNombre(rolNombre)
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

            usuario.setRol(rol);

            // Asignar el proyecto si se proporciona un proyectoId
            if (dto.proyectoId != null) {
                Optional<Proyecto> proyecto = proyectoRepository.findById(dto.proyectoId);
                if (proyecto.isPresent()) {
                    // Crear la relación en la tabla Usuario_Proyecto solo si no existe
                    if (!usuarioProyectoRepository.existsByUsuarioIdAndProyectoId(usuario, proyecto.get())) {
                        UsuarioProyecto usuarioProyecto = new UsuarioProyecto();
                        usuarioProyecto.setUsuarioId(usuario);
                        usuarioProyecto.setProyectoId(proyecto.get());
                        usuarioProyectoRepository.save(usuarioProyecto);
                    }
                }
            }

            usuarioRepository.save(usuario);
            return ResponseEntity.ok("Usuario actualizado correctamente");
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> crear(@RequestBody UsuarioDTO dto) {
        // Crear un nuevo usuario
        Usuario usuario = new Usuario();
        usuario.setNombre(dto.nombre);
        usuario.setApellidos(dto.apellidos);
        usuario.setDni(dto.dni);
        usuario.setCorreo(dto.correo);
        usuario.setTelefono(dto.telefono);
        usuario.setDireccion(dto.direccion);
        usuario.setFechaNacimiento(LocalDate.parse(dto.fechaNacimiento));
        usuario.setPassword(passwordEncoder.encode(dto.password));

        // Asignar el rol
        Rol.RolNombre rolNombre = Rol.RolNombre.valueOf(dto.rol);
        Rol rol = rolRepository.findByNombre(rolNombre)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        usuario.setRol(rol);

        // Crear el usuario y asignar un proyecto si es necesario
        Usuario savedUsuario = usuarioRepository.save(usuario);

        // Si el proyecto está presente, agregar la relación
        if (dto.proyectoId != null) {
            Optional<Proyecto> proyecto = proyectoRepository.findById(dto.proyectoId);
            if (proyecto.isPresent()) {
                if (!usuarioProyectoRepository.existsByUsuarioIdAndProyectoId(savedUsuario, proyecto.get())) {
                UsuarioProyecto usuarioProyecto = new UsuarioProyecto();
                usuarioProyecto.setUsuarioId(savedUsuario);
                usuarioProyecto.setProyectoId(proyecto.get());
                usuarioProyectoRepository.save(usuarioProyecto);
            }
            }
        }

        return ResponseEntity.ok("Usuario creado correctamente");
    }
}





