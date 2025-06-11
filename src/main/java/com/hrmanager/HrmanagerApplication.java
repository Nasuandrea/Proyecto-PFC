package com.hrmanager;

import com.hrmanager.model.Rol;
import com.hrmanager.model.Rol.RolNombre;
import com.hrmanager.repository.RolRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class HrmanagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(HrmanagerApplication.class, args);
	}

	@Bean
	public CommandLineRunner initRoles(RolRepository rolRepository) {
		return args -> {
			if (rolRepository.findByNombre(Rol.RolNombre.ADMIN).isEmpty()) {
				Rol adminRol = new Rol();
				adminRol.setNombre(Rol.RolNombre.ADMIN);
				rolRepository.save(adminRol);
			}

			if (rolRepository.findByNombre(Rol.RolNombre.USUARIO).isEmpty()) {
				Rol userRol = new Rol();
				userRol.setNombre(Rol.RolNombre.USUARIO);
				rolRepository.save(userRol);
			}
		};
	}
}