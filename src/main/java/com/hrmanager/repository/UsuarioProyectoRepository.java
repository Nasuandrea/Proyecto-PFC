package com.hrmanager.repository;

import com.hrmanager.model.UsuarioProyecto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsuarioProyectoRepository extends JpaRepository<UsuarioProyecto, Long> {
    List<UsuarioProyecto> findByUsuarioId(Long usuarioId);
    List<UsuarioProyecto> findByProyectoId(Long proyectoId);
}
