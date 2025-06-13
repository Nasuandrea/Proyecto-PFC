package com.hrmanager.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Usuario_Proyecto",
        uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id", "proyecto_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioProyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuarioId;

    @ManyToOne
    @JoinColumn(name = "proyecto_id", nullable = false)
    private Proyecto proyectoId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Usuario usuario) {
        this.usuarioId = usuario;
    }

    public Proyecto getProyectoId() {
        return proyectoId;
    }

    public void setProyectoId(Proyecto proyecto) {
        this.proyectoId = proyecto;
    }
}
