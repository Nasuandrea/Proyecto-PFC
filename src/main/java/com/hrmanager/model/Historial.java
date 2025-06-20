package com.hrmanager.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "Historial")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Historial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_modificacion")
    private LocalDate fechaModificacion;

    @Column(name = "observaciones")
    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "contrato_id", nullable = true)
    private Contrato contrato;

    @ManyToOne
    @JoinColumn(name = "proyecto_id", nullable = true)
    private Proyecto proyecto;

}

