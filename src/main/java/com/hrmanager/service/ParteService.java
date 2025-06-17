package com.hrmanager.service;

import com.hrmanager.model.Parte;
import com.hrmanager.repository.ParteRepository;
import com.hrmanager.repository.ProyectoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
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
        parte.setProyecto(proyectoRepository.findById(parte.getProyecto().getId()).orElseThrow(()
                -> new RuntimeException("Proyecto no encontrado")));

        Parte saved = parteRepository.save(parte);
        updateHorasTotales(saved.getProyecto().getId());
        return saved;
    }

    public void delete(Long id) {
        Parte parte = parteRepository.findById(id).orElse(null);
        if (parte != null) {
            Long proyectoId = parte.getProyecto().getId();
            parteRepository.deleteById(id);
            updateHorasTotales(proyectoId);
        }
    }

    public List<Parte> getByUsuarioId(Long usuarioId) {
        return parteRepository.findByUsuarioId(usuarioId);
    }

    public Parte update(Long id, Parte datos) {
        Parte existente = parteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parte no encontrado"));

        existente.setFecha(datos.getFecha());
        existente.setHorasTrabajadas(datos.getHorasTrabajadas());
        existente.setDescanso(datos.getDescanso());

        if (datos.getProyecto() != null && datos.getProyecto().getId() != null) {
            existente.setProyecto(
                    proyectoRepository.findById(datos.getProyecto().getId())
                            .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"))
            );
        }

        Parte guardado = parteRepository.save(existente);
        updateHorasTotales(guardado.getProyecto().getId());
        return guardado;
    }

    public Parte getById(Long id) {
        return parteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parte no encontrado"));
    }


    private void updateHorasTotales(Long proyectoId) {
        List<Parte> partes = parteRepository.findByProyectoId(proyectoId);
        LocalTime totalHoras = LocalTime.of(0, 0, 0);
        for (Parte parte : partes) {
            totalHoras = totalHoras.plusHours(parte.getHorasTrabajadas().getHour())
                    .plusMinutes(parte.getHorasTrabajadas().getMinute())
                    .plusSeconds(parte.getHorasTrabajadas().getSecond());
        }

        // Actualizar el proyecto con el total de horas trabajadas
        LocalTime finalTotalHoras = totalHoras;
        proyectoRepository.findById(proyectoId).ifPresent(proyecto -> {
            proyecto.setHorasTotales(finalTotalHoras);
            proyectoRepository.save(proyecto);
        });
    }

}
