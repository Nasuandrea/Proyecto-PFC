import {API_BASE_URL} from "./api.js";
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const mensaje = document.getElementById("mensaje-usuario");
    const proyectoSelect = document.getElementById("proyectoSelect");
    const listaHistorial = document.getElementById("listaHistorialProyecto");
    const tablaTrabajadoresBody = document.getElementById("tablaTrabajadoresBody");
    const tablaPartesBody = document.getElementById("tablaPartesBody");
    const tablaHistorialBody = document.getElementById("tablaHistorialBody");

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
        mensaje.textContent = `${user.nombre} (${user.rol.nombre})`;
        if (user.rol.nombre === "ADMIN") {
            document.querySelectorAll(".admin").forEach(e => e.style.display = "block");
        } else {
            document.querySelectorAll(".admin").forEach(e => e.style.display = "none");
        }
        cargarProyectos();
    } catch (error) {
        mensaje.textContent = "Error de autenticación";
        console.error(error);
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }

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
        if (!proyectoId) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/proyectos/${proyectoId}/info`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const info = await res.json();

            tablaTrabajadoresBody.innerHTML = "";
            (info.trabajadores || []).forEach(t => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${t.nombre}</td>
                    <td>${t.apellidos}</td>
                    <td>${t.correo}</td>`;
                tablaTrabajadoresBody.appendChild(tr);
            });

            tablaPartesBody.innerHTML = "";
            (info.partes || []).forEach(p => {
                const tr = document.createElement("tr");
                const trabajador = p.usuario ? `${p.usuario.nombre} ${p.usuario.apellidos}` : "";
                tr.innerHTML = `
                    <td>${p.fecha}</td>
                    <td>${trabajador}</td>
                    <td>${p.horasTrabajadas}</td>
                    <td>${p.descanso}</td>`;
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