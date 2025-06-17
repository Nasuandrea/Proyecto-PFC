package com.hrmanager.dto;

import com.hrmanager.model.Proyecto;
import com.hrmanager.model.Usuario;
import com.hrmanager.model.Parte;
import com.hrmanager.model.HistorialContrato;

import java.util.List;

public class ProyectoInfoDTO {
    public Proyecto proyecto;
    public List<Usuario> trabajadores;
    public List<Parte> partes;
    public List<HistorialContrato> historial;
}