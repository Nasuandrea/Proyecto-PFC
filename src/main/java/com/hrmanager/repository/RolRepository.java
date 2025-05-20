package com.hrmanager.repository;

import com.hrmanager.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Long> {
    Optional<Rol> findByNombre(Rol.RolNombre nombre);
}
