package com.hrmanager.service;

import com.hrmanager.model.Parte;
import com.hrmanager.repository.ParteRepository;
import com.hrmanager.repository.ProyectoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParteService {

    @Autowired
    private ParteRepository parteRepository;
    @Autowired
    private ProyectoRepository proyectoRepository;

    public List<Parte> getAll() {
        return parteRepository.findAll();
    }

    public Parte create(Parte parte) {
        // Asegurarse de que el proyecto_id no sea nulo
        if (parte.getProyecto() == null || parte.getProyecto().getId() == null) {
            throw new IllegalArgumentException("El proyecto es obligatorio.");
        }

        // Verificar que el proyecto existe
        parte.setProyecto(proyectoRepository.findById(parte.getProyecto().getId()).orElseThrow(() -> new RuntimeException("Proyecto no encontrado")));

        return parteRepository.save(parte);
    }

    public void delete(Long id) {
        parteRepository.deleteById(id);
    }

    public List<Parte> getByUsuarioId(Long usuarioId) {
        return parteRepository.findByUsuarioId(usuarioId);
    }
}
