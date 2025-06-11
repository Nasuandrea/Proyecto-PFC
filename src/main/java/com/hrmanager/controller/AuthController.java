package com.hrmanager.controller;

import java.time.LocalDate;
import java.util.Optional;

import com.hrmanager.dto.RegisterRequest;
import com.hrmanager.model.Rol;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hrmanager.dto.LoginRequest;
import com.hrmanager.dto.LoginResponse;
import com.hrmanager.model.Usuario;
import com.hrmanager.repository.UsuarioRepository;
import com.hrmanager.repository.RolRepository;
import com.hrmanager.service.JwtService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RolRepository rolRepository;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(loginRequest.getCorreo());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Usuario no encontrado");
        }

        Usuario usuario = usuarioOpt.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
            return ResponseEntity.status(401).body("Contraseña incorrecta");
        }

        String token = jwtService.generateToken(usuario.getCorreo());
        return ResponseEntity.ok(new LoginResponse(token));
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (usuarioRepository.findByCorreo(request.getCorreo()).isPresent()) {
            return ResponseEntity.badRequest().body("El correo ya está registrado");
        }

        Rol.RolNombre rolNombre;
        try {
            rolNombre = Rol.RolNombre.valueOf(request.getRol().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Rol no válido. Usa ADMIN o USUARIO.");
        }

        Rol rol = rolRepository.findByNombre(rolNombre)
                .orElseGet(() -> rolRepository.save(new Rol(null, rolNombre)));

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre(request.getNombre());
        nuevoUsuario.setApellidos(request.getApellidos());
        nuevoUsuario.setDni(request.getDni());
        nuevoUsuario.setCorreo(request.getCorreo());
        nuevoUsuario.setPassword(passwordEncoder.encode(request.getPassword()));
        nuevoUsuario.setTelefono(request.getTelefono());
        nuevoUsuario.setDireccion(request.getDireccion());
        nuevoUsuario.setActivo(true);
        nuevoUsuario.setRol(rol);
        nuevoUsuario.setFechaNacimiento(LocalDate.parse(request.getFechaNacimiento()));

        usuarioRepository.save(nuevoUsuario);
        return ResponseEntity.ok("Usuario registrado con éxito");
    }
}
