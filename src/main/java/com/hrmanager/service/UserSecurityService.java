package com.hrmanager.service;

import com.hrmanager.model.Usuario;
import com.hrmanager.model.Parte;
import com.hrmanager.model.Ausencia;
import com.hrmanager.repository.UsuarioRepository;
import com.hrmanager.repository.ParteRepository;
import com.hrmanager.repository.AusenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class UserSecurityService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ParteRepository parteRepository;

    @Autowired
    private AusenciaRepository ausenciaRepository;

    // Método para obtener el usuario autenticado
    public Usuario getAuthenticatedUser() {
        // Obtener el nombre de usuario (correo) desde el SecurityContextHolder
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        return usuarioRepository.findByCorreo(username).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    // Método para comprobar si el usuario autenticado es el mismo que el que se pasa como parámetro
    public boolean isCurrentUser(Long userId) {
        Usuario usuario = getAuthenticatedUser();
        return usuario.getId().equals(userId);
    }

    // Comprobar si el usuario autenticado es propietario de un Parte
    public boolean isOwnerParte(Long parteId) {
        Usuario usuario = getAuthenticatedUser();
        Parte parte = parteRepository.findById(parteId).orElse(null);
        return parte != null && parte.getUsuario().getId().equals(usuario.getId());
    }

    // Comprobar si el usuario autenticado es propietario de una Ausencia
    public boolean isOwnerAusencia(Long ausenciaId) {
        Usuario usuario = getAuthenticatedUser();
        Ausencia ausencia = ausenciaRepository.findById(ausenciaId).orElse(null);
        return ausencia != null && ausencia.getUsuario().getId().equals(usuario.getId());
    }
}