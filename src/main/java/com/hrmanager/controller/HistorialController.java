package com.hrmanager.controller;

import com.hrmanager.model.HistorialContrato;
import com.hrmanager.repository.HistorialContratoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial")
@CrossOrigin
public class HistorialController {

    @Autowired
    private HistorialContratoRepository historialContratoRepository;

    @GetMapping
    public List<HistorialContrato> getAll() {
        return historialContratoRepository.findAll();
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<HistorialContrato> getByUsuario(@PathVariable Long usuarioId) {
        return historialContratoRepository.findByContrato_Usuario_Id(usuarioId);
    }
    @GetMapping("/proyecto/{proyectoId}")
    public List<HistorialContrato> getByProyecto(@PathVariable Long proyectoId) {
        return historialContratoRepository.findByProyectoId(proyectoId);
    }

    @PostMapping
    public HistorialContrato create(@RequestBody HistorialContrato historialContrato) {
        return historialContratoRepository.save(historialContrato);
    }
}
