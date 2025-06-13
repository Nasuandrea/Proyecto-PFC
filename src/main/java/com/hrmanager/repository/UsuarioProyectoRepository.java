package com.hrmanager.repository;

import com.hrmanager.model.Proyecto;
import com.hrmanager.model.Usuario;
import com.hrmanager.model.UsuarioProyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UsuarioProyectoRepository extends JpaRepository<UsuarioProyecto, Long> {
    List<UsuarioProyecto> findByUsuarioId(Usuario usuario);
    List<UsuarioProyecto> findByProyectoId(Proyecto proyecto);
    boolean existsByUsuarioIdAndProyectoId(Usuario usuario, Proyecto proyecto);

    @Query("select up.proyectoId from UsuarioProyecto up where up.usuarioId = :usuario")
    List<Proyecto> findProyectosByUsuario(@Param("usuario") Usuario usuario);
}
