package com.hrmanager.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "Parte")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Parte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fecha;
    private Double horasTrabajadas;
    private Double descanso;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "proyecto_id", nullable = false)
    private Proyecto proyecto;
}
