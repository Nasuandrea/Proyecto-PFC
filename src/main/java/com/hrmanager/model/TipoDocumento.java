package com.hrmanager.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "TipoDocumento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TipoDocumento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String descripcion;
}
