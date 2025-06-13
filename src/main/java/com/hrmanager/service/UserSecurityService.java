package com.hrmanager.service;

import com.hrmanager.model.Usuario;
import com.hrmanager.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

@Service
public class UserSecurityService {

    @Autowired
    private UsuarioRepository usuarioRepository;

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
}