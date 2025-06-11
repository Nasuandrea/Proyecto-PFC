package com.hrmanager.repository;

import com.hrmanager.model.Contrato;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContratoRepository extends JpaRepository<Contrato, Long> {
    List<Contrato> findByUsuarioId(Long usuarioId);
}