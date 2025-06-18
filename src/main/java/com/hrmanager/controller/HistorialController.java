package com.hrmanager.controller;

import com.hrmanager.model.Historial;
import com.hrmanager.repository.HistorialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial")
@CrossOrigin
public class HistorialController {

    @Autowired
    private HistorialRepository historialRepository;

    @GetMapping
    public List<Historial> getAll() {
        return historialRepository.findAll();
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Historial> getByUsuario(@PathVariable Long usuarioId) {
        return historialRepository.findByContrato_Usuario_Id(usuarioId);
    }
    @GetMapping("/proyecto/{proyectoId}")
    public List<Historial> getByProyecto(@PathVariable Long proyectoId) {
        return historialRepository.findByProyectoId(proyectoId);
    }

    @PostMapping
    public Historial create(@RequestBody Historial historialContrato) {
        return historialRepository.save(historialContrato);
    }
}
