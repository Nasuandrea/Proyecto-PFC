package com.hrmanager.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "HistorialContrato")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HistorialContrato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fechaModificacion;
    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "contrato_id", nullable = false)
    private Contrato contrato;

}

