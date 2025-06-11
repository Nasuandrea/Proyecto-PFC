package com.hrmanager.controller;

import com.hrmanager.dto.LoginRequest;
import com.hrmanager.dto.LoginResponse;
import com.hrmanager.dto.RegisterRequest;
import com.hrmanager.model.Rol;
import com.hrmanager.model.Usuario;
import com.hrmanager.repository.RolRepository;
import com.hrmanager.repository.UsuarioRepository;
import com.hrmanager.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.secret}")
    private String secret;

    public AuthController(UsuarioRepository usuarioRepository,
                          RolRepository rolRepository,
                          JwtService jwtService,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(loginRequest.getCorreo());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no encontrado");
        }

        Usuario usuario = usuarioOpt.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
        }

        String token = jwtService.generateToken(usuario.getCorreo());
        return ResponseEntity.ok(new LoginResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (usuarioRepository.findByCorreo(req.getCorreo()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El correo ya está en uso.");
        }

        Rol.RolNombre rolNombre = Rol.RolNombre.valueOf(req.getRol());
        Rol rol = rolRepository.findByNombre(rolNombre)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        Usuario nuevo = new Usuario();
        nuevo.setNombre(req.getNombre());
        nuevo.setApellidos(req.getApellidos());
        nuevo.setDni(req.getDni());
        nuevo.setCorreo(req.getCorreo());
        nuevo.setPassword(passwordEncoder.encode(req.getPassword()));
        nuevo.setTelefono(req.getTelefono());
        nuevo.setDireccion(req.getDireccion());
        nuevo.setFechaNacimiento(req.getFechaNacimiento());
        nuevo.setActivo(true);
        nuevo.setRol(rol);

        usuarioRepository.save(nuevo);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuario registrado con éxito.");
    }
}
