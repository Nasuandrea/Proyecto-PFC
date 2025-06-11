package com.hrmanager.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Documento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Documento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreArchivo;
    private String urlArchivo;

    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime fechaSubida = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "tipo_documento_id")
    private TipoDocumento tipoDocumento;
}

