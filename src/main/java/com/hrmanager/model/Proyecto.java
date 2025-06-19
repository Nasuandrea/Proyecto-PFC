package com.hrmanager.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.Duration;
import java.util.List;

@Entity
@Table(name = "Proyecto")
@NoArgsConstructor
@AllArgsConstructor
public class Proyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String descripcion;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "horas_estimadas")
    private Integer horasEstimadas;

    @Column(name = "horas_totales", columnDefinition = "BIGINT")
    private Duration horasTotales;

    @ManyToMany
    @JoinTable(
            name = "Usuario_Proyecto",
            joinColumns = @JoinColumn(name = "proyecto_id"),
            inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private List<Usuario> trabajadores;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public Integer getHorasEstimadas() {
        return horasEstimadas;
    }

    public void setHorasEstimadas(Integer horasEstimadas) {
        this.horasEstimadas = horasEstimadas;
    }

    public List<Usuario> getTrabajadores() {
        return trabajadores;
    }

    public void setTrabajadores(List<Usuario> trabajadores) {
        this.trabajadores = trabajadores;
    }

    public Duration getHorasTotales() {
        return horasTotales;
    }

    public void setHorasTotales(Duration horasTotales) {
        this.horasTotales = horasTotales;
    }
}