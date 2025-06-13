package com.hrmanager.repository;

import com.hrmanager.model.Ausencia;
import com.hrmanager.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AusenciaRepository extends JpaRepository<Ausencia, Long> {
    // Método para obtener las ausencias por usuario
    List<Ausencia> findByUsuario(Usuario usuario);
}