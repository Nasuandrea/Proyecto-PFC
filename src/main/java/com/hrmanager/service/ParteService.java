package com.hrmanager.service;

import com.hrmanager.model.Parte;
import com.hrmanager.repository.ParteRepository;
import com.hrmanager.repository.ProyectoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.Duration;
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

        validateTimes(parte);
        parte.setHorasTrabajadas(calculateHorasTrabajadas(parte));

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
        existente.setHoraEntrada(datos.getHoraEntrada());
        existente.setHoraSalida(datos.getHoraSalida());
        existente.setHoraInicioDescanso(datos.getHoraInicioDescanso());
        existente.setHoraFinDescanso(datos.getHoraFinDescanso());
        existente.setDescanso(datos.getDescanso());
        existente.setHorasTrabajadas(datos.getHorasTrabajadas());

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
        Duration total = Duration.ZERO;
        for (Parte parte : partes) {
            total = total.plus(Duration.between(LocalTime.MIDNIGHT, parte.getHorasTrabajadas()));


            // Actualizar el proyecto con el total de horas trabajadas
            LocalTime finalTotalHoras = LocalTime.MIDNIGHT.plus(total);
            proyectoRepository.findById(proyectoId).ifPresent(proyecto -> {
                proyecto.setHorasTotales(finalTotalHoras);
                proyectoRepository.save(proyecto);
            });
        }
    }
    private void validateTimes(Parte parte) {
        if (parte.getHoraEntrada() == null || parte.getHoraSalida() == null
                || parte.getHoraInicioDescanso() == null || parte.getHoraFinDescanso() == null) {
            throw new IllegalArgumentException("Horas de entrada, salida e intervalos de descanso son obligatorios");
        }

        if (!parte.getHoraSalida().isAfter(parte.getHoraEntrada())) {
            throw new IllegalArgumentException("La hora de salida debe ser posterior a la de entrada");
        }

        if (parte.getHoraInicioDescanso().isBefore(parte.getHoraEntrada())
                || parte.getHoraFinDescanso().isAfter(parte.getHoraSalida())
                || !parte.getHoraFinDescanso().isAfter(parte.getHoraInicioDescanso())) {
            throw new IllegalArgumentException("El descanso debe estar dentro de la jornada laboral");
        }
    }

    private LocalTime calculateHorasTrabajadas(Parte parte) {
        Duration jornada = Duration.between(parte.getHoraEntrada(), parte.getHoraSalida());
        Duration descanso = Duration.between(parte.getHoraInicioDescanso(), parte.getHoraFinDescanso());
        Duration neto = jornada.minus(descanso);
        return LocalTime.MIDNIGHT.plus(neto);
    }
}
