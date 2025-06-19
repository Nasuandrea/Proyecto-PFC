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

    @Column(name = "hora_entrada")
    private LocalTime horaEntrada;

    @Column(name = "hora_salida")
    private LocalTime horaSalida;

    @Column(name = "hora_inicio_descanso")
    private LocalTime horaInicioDescanso;

    @Column(name = "hora_fin_descanso")
    private LocalTime horaFinDescanso;

    @Column(name = "descanso")
    private LocalTime descanso;

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
