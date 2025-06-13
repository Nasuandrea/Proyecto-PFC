package com.hrmanager.repository;

import com.hrmanager.model.Parte;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParteRepository extends JpaRepository<Parte, Long> {
    List<Parte> findByUsuarioId(Long usuarioId);
    List<Parte> findByProyectoId(Long proyectoId);
}
