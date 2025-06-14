package com.hrmanager.controller;

import com.hrmanager.model.Ausencia;
import com.hrmanager.model.Rol;
import com.hrmanager.model.Usuario;
import com.hrmanager.service.AusenciaService;
import com.hrmanager.service.JwtService;
import com.hrmanager.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuario/parteAusencias")
public class ParteAusenciasController {

    @Autowired
    private AusenciaService ausenciaService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtService jwtService;


    /**
     * Obtener todas las ausencias del usuario o todas las ausencias si es un administrador.
     * @return Lista de ausencias.
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USUARIO')")
    public ResponseEntity<List<Ausencia>> getAllAusencias(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String correo = jwtService.extractUsername(token);
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        if (usuario.getRol().getNombre() == Rol.RolNombre.ADMIN) {
            return ResponseEntity.ok(ausenciaService.getAllAusencias());
        }

        return ResponseEntity.ok(ausenciaService.getAusenciasByUsuario(usuario));
    }

    /**
     * Crear una nueva solicitud de ausencia. Solo un ADMIN puede crear ausencias para otros usuarios.
     * @param ausencia La solicitud de ausencia.
     * @return La ausencia creada.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USUARIO')")
    public ResponseEntity<Ausencia> crearAusencia(@RequestBody Ausencia ausencia,
                                                  @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String correo = jwtService.extractUsername(token);
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        ausencia.setUsuario(usuario);
        ausencia.setEstado(Ausencia.Estado.PENDIENTE);

        return ResponseEntity.ok(ausenciaService.createAusencia(ausencia));
    }

    /**
     * Aprobar o rechazar una solicitud de ausencia. Solo un ADMIN puede gestionar las solicitudes de ausencia.
     * @param id El ID de la ausencia.
     * @param ausencia Los cambios de la solicitud (aprobación o rechazo).
     * @return La ausencia actualizada.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Ausencia> aprobarRechazarAusencia(@PathVariable Long id, @RequestBody Ausencia ausencia) {
        return ResponseEntity.ok(ausenciaService.updateAusencia(id, ausencia));
    }

    /**
     * Rechazar una solicitud de ausencia. Solo un ADMIN puede rechazar ausencias.
     * @param id El ID de la ausencia a rechazar.
     * @return Un mensaje de éxito.
     */
    @PutMapping("/{id}/rechazar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> rechazarAusencia(@PathVariable Long id) {
        ausenciaService.rechazarAusencia(id);
        return ResponseEntity.ok("Ausencia rechazada correctamente.");
    }

    /**
     * Aprobar una solicitud de ausencia. Solo un ADMIN puede aprobar ausencias.
     * @param id El ID de la ausencia a aprobar.
     * @return Un mensaje de éxito.
     */
    @PutMapping("/{id}/aprobar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> aprobarAusencia(@PathVariable Long id) {
        ausenciaService.aprobarAusencia(id);
        return ResponseEntity.ok("Ausencia aprobada correctamente.");
    }
}
