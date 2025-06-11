package com.hrmanager.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Usuario_Proyecto")
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
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "proyecto_id", nullable = false)
    private Proyecto proyecto;
}
