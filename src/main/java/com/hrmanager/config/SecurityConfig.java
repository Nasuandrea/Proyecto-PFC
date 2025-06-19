package com.hrmanager.config;

import com.hrmanager.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@EnableMethodSecurity
@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(JwtFilter jwtFilter, UserDetailsService userDetailsService) {
        this.jwtFilter = jwtFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                    corsConfig.setAllowedOrigins(List.of("http://localhost:63342", "https://hrmanager.up.railway.app"));
                    corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    corsConfig.setAllowedHeaders(List.of("*"));
                    corsConfig.setAllowCredentials(true);
                    return corsConfig;
                }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/api/usuario/me", "/css/**", "/js/**", "/images/**", "/partials/**", "/icons/**", "/favicon.ico", "/index.html", "/**.html").permitAll() // Permitir rutas públicas
                        .requestMatchers("/api/usuario/**").hasAnyRole("ADMIN", "USUARIO")  // Los usuarios y administradores pueden acceder a sus datos
                        .requestMatchers("/api/parte/**").hasAnyRole("ADMIN", "USUARIO")  // Los usuarios y administradores pueden acceder a crear/editar partes
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")  // Solo los administradores pueden acceder a rutas de administración
                        .requestMatchers("/api/ausencias/**").hasRole("ADMIN")  // Solo administradores pueden gestionar ausencias
                        .requestMatchers("/api/usuario/parteAusencias/**").hasAnyRole("ADMIN", "USUARIO") // Usuarios y administradores pueden ver sus ausencias
                        .anyRequest().authenticated()  // Cualquier otra ruta requiere autenticación
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authProvider())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationProvider authProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // algoritmo seguro de hashing
    }

    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}
