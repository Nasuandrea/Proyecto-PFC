package com.hrmanager.repository;

import com.hrmanager.model.Documento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentoRepository extends JpaRepository<Documento, Long> {
    List<Documento> findByUsuarioId(Long usuarioId);
}
