package com.hrmanager;

import com.hrmanager.controller.UsuarioController;
import com.hrmanager.dto.ActualizarPerfilDTO;
import com.hrmanager.model.Usuario;
import com.hrmanager.repository.*;
import com.hrmanager.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UsuarioControllerTest {

    @InjectMocks
    private UsuarioController controller;

    @Mock private UsuarioRepository usuarioRepository;
    @Mock private JwtService jwtService;
    @Mock private RolRepository rolRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private ProyectoRepository proyectoRepository;
    @Mock private UsuarioProyectoRepository usuarioProyectoRepository;
    @Mock private ParteRepository parteRepository;
    @Mock private AusenciaRepository ausenciaRepository;
    @Mock private ContratoRepository contratoRepository;
    @Mock private HistorialRepository historialRepository;
    @Mock private DocumentoRepository documentoRepository;

    @BeforeEach
    void setup() {
    }

    @Test
    void actualizarPerfilActualizaUsuario() {
        ActualizarPerfilDTO dto = new ActualizarPerfilDTO();
        dto.nombre = "Nuevo";
        dto.apellidos = "Apellido";
        dto.telefono = "123";
        dto.direccion = "Calle";
        dto.fechaNacimiento = "2000-01-01";

        Usuario user = new Usuario();
        user.setCorreo("user@mail.com");
        user.setNombre("Old");
        user.setApellidos("Old");
        user.setTelefono("000");
        user.setDireccion("OldDir");
        user.setFechaNacimiento(LocalDate.of(1990,1,1));

        when(jwtService.extractUsername("token")).thenReturn("user@mail.com");
        when(usuarioRepository.findByCorreo("user@mail.com")).thenReturn(Optional.of(user));
        when(usuarioRepository.save(any())).thenReturn(user);

        ResponseEntity<?> resp = controller.actualizarPerfil(dto, "Bearer token");

        assertEquals(HttpStatus.OK, resp.getStatusCode());
        assertEquals("Perfil actualizado correctamente", resp.getBody());

        assertEquals("Nuevo", user.getNombre());
        assertEquals("Apellido", user.getApellidos());
        assertEquals("123", user.getTelefono());
        assertEquals("Calle", user.getDireccion());
        assertEquals(LocalDate.parse("2000-01-01"), user.getFechaNacimiento());

        verify(usuarioRepository).save(user);
    }
}