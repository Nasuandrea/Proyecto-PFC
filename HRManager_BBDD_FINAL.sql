# Script SQL final completo para la BBDD funcional de HR Manager
-- Base de datos: HRManager
DROP DATABASE IF EXISTS HRManager;
CREATE DATABASE HRManager;
USE HRManager;

-- Tabla: Rol
CREATE TABLE Rol (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre ENUM('ADMIN', 'USUARIO') NOT NULL
);

-- Tabla: Usuario
CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150),
    dni VARCHAR(15) UNIQUE,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    fecha_nacimiento DATE,
    activo BOOLEAN DEFAULT TRUE,
    rol_id INT NOT NULL,
    FOREIGN KEY (rol_id) REFERENCES Rol(id)
);

-- Tabla: Proyecto
CREATE TABLE Proyecto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATE,
    fecha_fin DATE,
    horas_estimadas INT
);

-- Relación N:M entre Usuario y Proyecto
CREATE TABLE Usuario_Proyecto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    proyecto_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
    FOREIGN KEY (proyecto_id) REFERENCES Proyecto(id)
);

-- Tabla: Contrato
CREATE TABLE Contrato (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- Tabla: HistorialContrato
CREATE TABLE HistorialContrato (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contrato_id INT NOT NULL,
    fecha_modificacion DATE,
    observaciones TEXT,
    FOREIGN KEY (contrato_id) REFERENCES Contrato(id)
);

-- Tabla: Parte (fichaje de jornada laboral)
CREATE TABLE Parte (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    proyecto_id INT NOT NULL,
    fecha DATE NOT NULL,
    horas_trabajadas DECIMAL(4,2),
    descanso DECIMAL(4,2),
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
    FOREIGN KEY (proyecto_id) REFERENCES Proyecto(id)
);

-- Tabla: TipoDocumento
CREATE TABLE TipoDocumento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- Tabla: Documento
CREATE TABLE Documento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo_documento_id INT,
    nombre_archivo VARCHAR(255),
    url_archivo VARCHAR(255),
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
    FOREIGN KEY (tipo_documento_id) REFERENCES TipoDocumento(id)
);

-- Tabla: Ausencia
CREATE TABLE Ausencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    tipo ENUM('VACACIONES', 'PERMISO', 'ENFERMEDAD', 'OTRO') NOT NULL,
    estado ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA') DEFAULT 'PENDIENTE',
    motivo TEXT,
    comentario_admin TEXT,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

