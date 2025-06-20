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
    const proyectoSelect = document.getElementById("proyectoSelect");
    const listaHistorial = document.getElementById("listaHistorialProyecto");
    const tablaTrabajadoresBody = document.getElementById("tablaTrabajadoresBody");
    const tablaPartesBody = document.getElementById("tablaPartesBody");
    const tablaHistorialBody = document.getElementById("tablaHistorialBody");
    const infoProyectoDiv = document.getElementById("infoProyecto");

    const user = await initAuth();
    if (!user) return;
    cargarProyectos();

    proyectoSelect.addEventListener("change", cargarInfo);

    async function cargarProyectos() {
        try {
            const res = await fetch(`${API_BASE_URL}/api/proyectos`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const proyectos = await res.json();
            proyectoSelect.innerHTML = '<option value="">Seleccionar Proyecto</option>';
            proyectos.forEach(p => {
                const option = document.createElement("option");
                option.value = p.id;
                option.textContent = p.nombre;
                proyectoSelect.appendChild(option);
            });
        } catch (err) {
            console.error("Error al cargar proyectos", err);
        }
    }

    async function cargarInfo() {
        const proyectoId = proyectoSelect.value;
        if (!proyectoId) {
            infoProyectoDiv.innerHTML = "";
            tablaTrabajadoresBody.innerHTML = "";
            tablaPartesBody.innerHTML = "";
            tablaHistorialBody.innerHTML = "";
            return;
        }
        if (!proyectoId) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/proyectos/${proyectoId}/info`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const info = await res.json();

            const proyectoInfo = info.proyecto || {};
            infoProyectoDiv.innerHTML = `
                <p><strong>Nombre:</strong> ${proyectoInfo.nombre || ""}</p>
                <p><strong>Descripción:</strong> ${proyectoInfo.descripcion || ""}</p>
                <p><strong>Inicio:</strong> ${proyectoInfo.fechaInicio || ""}</p>
                <p><strong>Fin:</strong> ${proyectoInfo.fechaFin || ""}</p>
                <p><strong>Horas estimadas:</strong> ${proyectoInfo.horasEstimadas || ""}</p>
                <p><strong>Horas totales:</strong> ${formatDurationISO(proyectoInfo.horasTotales)}</p>
            `;

            tablaTrabajadoresBody.innerHTML = "";
            (info.trabajadores || []).forEach(t => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${t.nombre}</td>
                    <td>${t.apellidos}</td>
                    <td>${t.correo}</td>
                    <td>${t.activo ? "Activo" : "Inactivo"}</td>`;
                if (!t.activo) {
                    tr.classList.add("usuario-inactivo");
                }
                tablaTrabajadoresBody.appendChild(tr);
            });

            tablaPartesBody.innerHTML = "";
            (info.partes || []).forEach(p => {
                const tr = document.createElement("tr");
                const trabajador = p.usuario ? `${p.usuario.nombre} ${p.usuario.apellidos}` : "";
                tr.innerHTML = `
                    <td>${p.fecha}</td>
                    <td>${trabajador}</td>
                    <td>${p.horaEntrada}</td>
                    <td>${p.horaSalida}</td>
                    <td>${p.horaInicioDescanso}</td>
                    <td>${p.horaFinDescanso}</td>
                    <td>${p.descanso}</td>
                    <td>${p.horasTrabajadas}</td>`;
                tablaPartesBody.appendChild(tr);
            });

            tablaHistorialBody.innerHTML = "";
            (info.historial || []).forEach(h => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${h.fechaModificacion}</td>
                    <td>${h.observaciones || ""}</td>`;
                tablaHistorialBody.appendChild(tr);
            });
        } catch (err) {
            console.error("Error al cargar información", err);
        }
    }
});