package com.hrmanager.service;

import com.hrmanager.model.Ausencia;
import com.hrmanager.model.Usuario;
import com.hrmanager.repository.AusenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AusenciaService {

    @Autowired
    private AusenciaRepository ausenciaRepository;

    /**
     * Obtener todas las ausencias de un usuario.
     * @param usuario El usuario cuyas ausencias estamos buscando.
     * @return Lista de ausencias del usuario.
     */
    public List<Ausencia> getAusenciasByUsuario(Usuario usuario) {
        return ausenciaRepository.findByUsuario(usuario);
    }

    /**
     * Obtener todas las ausencias (solo para administradores).
     * @return Lista de todas las ausencias.
     */
    public List<Ausencia> getAllAusencias() {
        return ausenciaRepository.findAll();
    }

    /**
     * Crear una nueva solicitud de ausencia.
     * @param ausencia La solicitud de ausencia a crear.
     * @return La ausencia creada.
     */
    public Ausencia createAusencia(Ausencia ausencia) {
        return ausenciaRepository.save(ausencia);
    }

    /**
     * Aprobar o rechazar una solicitud de ausencia.
     * @param id El ID de la ausencia a actualizar.
     * @param ausencia Los cambios de la solicitud (aprobación o rechazo).
     * @return La ausencia actualizada.
     */
    public Ausencia updateAusencia(Long id, Ausencia ausencia) {
        Ausencia existingAusencia = ausenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ausencia no encontrada"));

        existingAusencia.setEstado(Ausencia.Estado.valueOf(ausencia.getEstado().name())); // Convertir String a Enum

        // Actualizar el comentario del administrador si se proporciona
        existingAusencia.setComentarioAdmin(ausencia.getComentarioAdmin());

        return ausenciaRepository.save(existingAusencia);
    }

    /**
     * Rechazar una solicitud de ausencia.
     * @param id El ID de la ausencia a rechazar.
     */
    public void rechazarAusencia(Long id, Ausencia datosAusencia) {
        Ausencia ausencia = ausenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ausencia no encontrada"));

        ausencia.setEstado(Ausencia.Estado.RECHAZADA); // Establecer el estado a RECHAZADA

        // Conservar el comentario del administrador si está presente
        if (datosAusencia != null) {
            ausencia.setComentarioAdmin(datosAusencia.getComentarioAdmin());
        }

        ausenciaRepository.save(ausencia);
    }

    /**
     * Aprobar una solicitud de ausencia.
     * @param id El ID de la ausencia a aprobar.
     */
    public void aprobarAusencia(Long id) {
        Ausencia ausencia = ausenciaRepository.findById(id).orElseThrow(() -> new RuntimeException("Ausencia no encontrada"));
        ausencia.setEstado(Ausencia.Estado.APROBADA); // Establecer el estado a APROBADA
        ausenciaRepository.save(ausencia);
    }
}
