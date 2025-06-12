package com.hrmanager.controller;

import com.hrmanager.dto.UsuarioDTO;
import com.hrmanager.model.Rol;
import com.hrmanager.model.Usuario;
import com.hrmanager.repository.RolRepository;
import com.hrmanager.repository.UsuarioRepository;
import com.hrmanager.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/api/usuario")
@CrossOrigin
public class UsuarioController {
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired private JwtService jwtService;
    @Autowired private RolRepository rolRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String correo = jwtService.extractUsername(token);
        Usuario usuario = usuarioRepository.findByCorreo(correo).orElse(null);
        return ResponseEntity.ok(usuario);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Usuario> getAll() {
        return usuarioRepository.findAll();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        usuarioRepository.deleteById(id);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Usuario> getById(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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

            usuarioRepository.save(usuario);
            return ResponseEntity.ok("Usuario actualizado correctamente");
        }).orElse(ResponseEntity.notFound().build());
    }
}




