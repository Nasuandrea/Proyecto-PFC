package com.hrmanager;

import com.hrmanager.model.Contrato;
import com.hrmanager.model.Usuario;
import com.hrmanager.repository.ContratoRepository;
import com.hrmanager.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class UserDeletionTest {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ContratoRepository contratoRepository;

    @Test
    void deleteUserWithHistoricalContracts() {
        Usuario u = new Usuario();
        u.setCorreo("user@test.local");
        usuarioRepository.save(u);

        Contrato c = new Contrato();
        c.setTipo("TEMP");
        c.setUsuario(u);
        contratoRepository.save(c);

        // Detach user from contracts before deleting
        c.setUsuario(null);
        contratoRepository.save(c);

        usuarioRepository.deleteById(u.getId());
        // If no exception is thrown the test passes
    }
}