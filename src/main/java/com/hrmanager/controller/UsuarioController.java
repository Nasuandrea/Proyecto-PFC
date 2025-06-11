package com.hrmanager.controller;

import com.hrmanager.model.Usuario;
import com.hrmanager.repository.UsuarioRepository;
import com.hrmanager.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuario")
@CrossOrigin
public class UsuarioController {
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired private JwtService jwtService;

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
}




