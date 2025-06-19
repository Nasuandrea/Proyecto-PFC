import {API_BASE_URL} from "./api.js";
import { initAuth } from "./auth.js";

function formatDurationISO(iso) {
    if (!iso) return "";
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!m) return "";
    const h = String(parseInt(m[1] || 0)).padStart(2, '0');
    const min = String(parseInt(m[2] || 0)).padStart(2, '0');
    return `${h}:${min}`;
}

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const usuarioSelect = document.getElementById("usuarioSelect");
    const infoTrabajador = document.getElementById("infoTrabajador");
    const tablaPartesBody = document.getElementById("tablaPartesBody");
    const tablaProyectosBody = document.getElementById("tablaProyectosBody");
    const tablaAusenciasBody = document.getElementById("tablaAusenciasBody");
    const tablaContratosBody = document.getElementById("tablaContratosBody");
    const tablaHistorialBody = document.getElementById("tablaHistorialBody");
    const tablaDocumentosBody = document.getElementById("tablaDocumentosBody");

    const user = await initAuth();
    if (!user) return;
    cargarUsuarios();

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
        if (!usuarioId) {
            infoTrabajador.innerHTML = "";
            infoTrabajador.style.display = "none";
            return;
        }
        infoTrabajador.style.display = "block";
        try {
            const res = await fetch(`${API_BASE_URL}/api/usuario/${usuarioId}/info`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const info = await res.json();
            const u = info.usuario || {};
            infoTrabajador.innerHTML = `
                <p><strong>Nombre:</strong> ${u.nombre || ""}</p>
                <p><strong>Apellidos:</strong> ${u.apellidos || ""}</p>
                <p><strong>Correo:</strong> ${u.correo || ""}</p>
                <p><strong>Teléfono:</strong> ${u.telefono || ""}</p>
                <p><strong>Dirección:</strong> ${u.direccion || ""}</p>
                <p><strong>DNI:</strong> ${u.dni || ""}</p>
                <p><strong>Fecha Nacimiento:</strong> ${u.fechaNacimiento || ""}</p>
                <p><strong>Activo:</strong> ${u.activo ? 'Sí' : 'No'}</p>`;

            if (!u.activo) {
                infoTrabajador.classList.add("usuario-inactivo");
            } else {
                infoTrabajador.classList.remove("usuario-inactivo");
            }
            tablaPartesBody.innerHTML = "";
            info.partes.forEach(p => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${p.fecha}</td>
                    <td>${p.proyecto?.nombre || ""}</td>
                    <td>${p.horaEntrada}</td>
                    <td>${p.horaSalida}</td>
                    <td>${p.horaInicioDescanso}</td>
                    <td>${p.horaFinDescanso}</td>
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
                    <td>${formatDurationISO(p.horasTotales)}</td>`;
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
                const tipo = h.contrato ? 'Contrato' : 'Proyecto';
                const nombre = h.contrato ? (h.contrato.tipo || '') : (h.proyecto?.nombre || '');
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${tipo}</td>
                    <td>${nombre}</td>
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