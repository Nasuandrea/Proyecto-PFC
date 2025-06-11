package com.hrmanager.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "Proyecto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Proyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String descripcion;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Integer horasEstimadas;
}
