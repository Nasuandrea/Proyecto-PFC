package com.hrmanager.repository;

import com.hrmanager.model.Historial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface HistorialRepository extends JpaRepository<Historial, Long> {
    List<Historial> findByContratoId(Long contratoId);
    List<Historial> findByContrato_Usuario_Id(Long usuarioId);
    List<Historial> findByProyectoId(Long proyectoId);

    @Query("SELECT h FROM Historial h WHERE h.proyecto.id IN " +
            "(SELECT up.proyectoId.id FROM UsuarioProyecto up WHERE up.usuarioId.id = :usuarioId)")
    List<Historial> findProyectoHistorialByUsuarioId(@Param("usuarioId") Long usuarioId);
}