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
     * Obtener todas las ausencias del usuario autenticado.
     * @param authHeader Cabecera con el token JWT.
     * @return Lista de ausencias del usuario.
     */
    @GetMapping
    public ResponseEntity<List<Ausencia>> getAllAusencias(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String correo = jwtService.extractUsername(token);
        Usuario usuario = usuarioRepository.findByCorreo(correo).orElse(null);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        List<Ausencia> ausencias = ausenciaService.getAusenciasByUsuario(usuario);
        return ResponseEntity.ok(ausencias);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Ausencia>> getAllAusenciasAdmin() {
        return ResponseEntity.ok(ausenciaService.getAllAusencias());
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
    public ResponseEntity<String> rechazarAusencia(@PathVariable Long id,
                                                   @RequestBody(required = false) Ausencia ausencia) {
        ausenciaService.rechazarAusencia(id, ausencia);
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

    @PutMapping("/{id}/editar")
    @PreAuthorize("hasRole('ADMIN') or @userSecurityService.isOwnerAusencia(#id)")
    public ResponseEntity<Ausencia> editarAusencia(@PathVariable Long id, @RequestBody Ausencia ausencia) {
        return ResponseEntity.ok(ausenciaService.editarAusencia(id, ausencia));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurityService.isOwnerAusencia(#id)")
    public ResponseEntity<Void> deleteAusencia(@PathVariable Long id) {
        ausenciaService.deleteAusencia(id);
        return ResponseEntity.noContent().build();
    }
}

