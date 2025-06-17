package com.hrmanager.service;

import com.hrmanager.model.Usuario;
import com.hrmanager.model.Parte;
import com.hrmanager.repository.UsuarioRepository;
import com.hrmanager.repository.ParteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

@Service
public class UserSecurityService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ParteRepository parteRepository;

    // Método para obtener el usuario autenticado
    public Usuario getAuthenticatedUser() {
        // Obtener el nombre de usuario (correo) desde el SecurityContextHolder
        String username = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
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
}