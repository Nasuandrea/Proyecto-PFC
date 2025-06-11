package com.hrmanager.dto;

import lombok.Getter;
import lombok.Setter;

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
    private String fechaNacimiento; // formato: "yyyy-MM-dd"
    private String rol; // "ADMIN" o "USUARIO"
}
