package com.hrmanager.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "Ausencia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ausencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    @Enumerated(EnumType.STRING)
    private Tipo tipo;

    @Enumerated(EnumType.STRING)
    private Estado estado = Estado.PENDIENTE;

    private String motivo;
    private String comentarioAdmin;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    public enum Tipo {
        VACACIONES, PERMISO, ENFERMEDAD, OTRO
    }

    public enum Estado {
        PENDIENTE, APROBADA, RECHAZADA
    }
}
