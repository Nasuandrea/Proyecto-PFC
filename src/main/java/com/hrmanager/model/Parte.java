package com.hrmanager.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

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

    @Column(name = "horas_trabajadas")
    private LocalTime horasTrabajadas;

    // Usamos LocalTime para manejar el descanso en horas:minutos
    @Column(name = "descanso")
    private LocalTime descanso;  // Cambio a LocalTime

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "proyecto_id", nullable = false)
    private Proyecto proyecto;

    // Getters y setters
    public Proyecto getProyecto() {
        return proyecto;
    }

    public void setProyecto(Proyecto proyecto) {
        this.proyecto = proyecto;
    }

}
