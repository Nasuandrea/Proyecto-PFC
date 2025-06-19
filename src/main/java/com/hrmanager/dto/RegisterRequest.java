package com.hrmanager.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class RegisterRequest {
    private String nombre;
    private String apellidos;
    private String dni;
    private String correo;
    private String password;
    private String telefono;
    private String direccion;
    private LocalDate fechaNacimiento;
    private String rol; // "ADMIN" o "USUARIO"
    private Boolean activo;
}
