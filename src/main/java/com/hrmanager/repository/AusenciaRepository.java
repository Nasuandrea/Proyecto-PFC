package com.hrmanager.repository;

import com.hrmanager.model.Ausencia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AusenciaRepository extends JpaRepository<Ausencia, Long> {
    List<Ausencia> findByUsuarioId(Long usuarioId);
}
