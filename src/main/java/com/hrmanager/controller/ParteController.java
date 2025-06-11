package com.hrmanager.controller;

import com.hrmanager.model.Parte;
import com.hrmanager.repository.ParteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parte")
@CrossOrigin
public class ParteController {

    @Autowired
    private ParteRepository parteRepository;

    @GetMapping
    public List<Parte> getAll() {
        return parteRepository.findAll();
    }

    @PostMapping
    public Parte create(@RequestBody Parte parte) {
        return parteRepository.save(parte);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        parteRepository.deleteById(id);
    }
}
