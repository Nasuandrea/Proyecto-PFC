package com.hrmanager.repository;

import com.hrmanager.model.HistorialContrato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface HistorialContratoRepository extends JpaRepository<HistorialContrato, Long> {
    List<HistorialContrato> findByContratoId(Long contratoId);
    List<HistorialContrato> findByContrato_Usuario_Id(Long usuarioId);
    @Query("SELECT hc FROM HistorialContrato hc WHERE hc.contrato.usuario.id IN (SELECT up.usuarioId.id FROM UsuarioProyecto up WHERE up.proyectoId.id = :proyectoId)")
    List<HistorialContrato> findByProyectoId(@Param("proyectoId") Long proyectoId);
}