import {API_BASE_URL} from "./api.js";
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const mensaje = document.getElementById("mensaje-usuario");
    const usuarioSelect = document.getElementById("usuarioSelect");
    const tablaPartesBody = document.getElementById("tablaPartesBody");
    const tablaProyectosBody = document.getElementById("tablaProyectosBody");
    const tablaAusenciasBody = document.getElementById("tablaAusenciasBody");
    const tablaContratosBody = document.getElementById("tablaContratosBody");
    const tablaHistorialBody = document.getElementById("tablaHistorialBody");
    const tablaDocumentosBody = document.getElementById("tablaDocumentosBody");

    if (!token) {
        mensaje.textContent = "No hay token. Redirigiendo al login...";
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/usuario/me`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) {
            throw new Error("No autorizado");
        }
        const user = await response.json();
        mensaje.textContent = `Hola, ${user.nombre} (${user.rol.nombre})`;
        if (user.rol.nombre === "ADMIN") {
            document.querySelectorAll(".admin").forEach(e => e.style.display = "block");
        } else {
            document.querySelectorAll(".admin").forEach(e => e.style.display = "none");
        }
        cargarUsuarios();
    } catch (error) {
        mensaje.textContent = "Error de autenticación";
        console.error(error);
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }

    usuarioSelect.addEventListener("change", cargarInfo);

    async function cargarUsuarios() {
        try {
            const res = await fetch(`${API_BASE_URL}/api/usuario`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const usuarios = await res.json();
            usuarioSelect.innerHTML = '<option value="">Seleccionar Trabajador</option>';
            usuarios.forEach(u => {
                const option = document.createElement("option");
                option.value = u.id;
                option.textContent = `${u.nombre} ${u.apellidos}`;
                usuarioSelect.appendChild(option);
            });
        } catch (err) {
            console.error("Error al cargar usuarios", err);
        }
    }

    async function cargarInfo() {
        const usuarioId = usuarioSelect.value;
        if (!usuarioId) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/usuario/${usuarioId}/info`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const info = await res.json();

            tablaPartesBody.innerHTML = "";
            info.partes.forEach(p => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${p.fecha}</td>
                    <td>${p.proyecto?.nombre || ""}</td>
                    <td>${p.horasTrabajadas}</td>
                    <td>${p.descanso}</td>`;
                tablaPartesBody.appendChild(tr);
            });

            tablaProyectosBody.innerHTML = "";
            info.proyectos.forEach(p => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${p.nombre}</td>
                    <td>${p.descripcion}</td>
                    <td>${p.fechaInicio}</td>
                    <td>${p.fechaFin || ""}</td>
                    <td>${p.horasEstimadas}</td>
                    <td>${p.horasTotales}</td>`;
                tablaProyectosBody.appendChild(tr);
            });

            tablaAusenciasBody.innerHTML = "";
            info.ausencias.forEach(a => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${a.fechaInicio}</td>
                    <td>${a.fechaFin}</td>
                    <td>${a.tipo}</td>
                    <td>${a.estado}</td>
                    <td>${a.motivo}</td>
                    <td>${a.comentarioAdmin || ""}</td>`;
                tablaAusenciasBody.appendChild(tr);
            });

            tablaContratosBody.innerHTML = "";
            info.contratos.forEach(c => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${c.tipo}</td>
                    <td>${c.fechaInicio}</td>
                    <td>${c.fechaFin || ""}</td>`;
                tablaContratosBody.appendChild(tr);
            });

            tablaHistorialBody.innerHTML = "";
            info.historial.forEach(h => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${h.fechaModificacion}</td>
                    <td>${h.observaciones || ""}</td>`;
                tablaHistorialBody.appendChild(tr);
            });

            tablaDocumentosBody.innerHTML = "";
            info.documentos.forEach(d => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${d.nombreArchivo}</td>
                    <td><a href="${d.urlArchivo}" target="_blank">Ver</a></td>
                    <td>${d.fechaSubida}</td>
                    <td>${d.tipoDocumento?.nombre || ""}</td>`;
                tablaDocumentosBody.appendChild(tr);
            });
        } catch (err) {
            console.error("Error al cargar información", err);
        }
    }
});