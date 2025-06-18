package com.hrmanager.repository;

import com.hrmanager.model.Historial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface HistorialRepository extends JpaRepository<Historial, Long> {
    List<Historial> findByContratoId(Long contratoId);
    List<Historial> findByContrato_Usuario_Id(Long usuarioId);
    @Query("SELECT hc FROM Historial hc WHERE hc.contrato.usuario.id IN (SELECT up.usuarioId.id FROM UsuarioProyecto up WHERE up.proyectoId.id = :proyectoId)")
    List<Historial> findByProyectoId(@Param("proyectoId") Long proyectoId);
}