package com.hrmanager.dto;

import com.hrmanager.model.*;
import java.util.List;

public class TrabajadorInfoDTO {
    public Usuario usuario;
    public List<Parte> partes;
    public List<Proyecto> proyectos;
    public List<Ausencia> ausencias;
    public List<Contrato> contratos;
    public List<HistorialContrato> historial;
    public List<Documento> documentos;
}