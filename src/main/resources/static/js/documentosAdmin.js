import { API_BASE_URL } from "./api.js";
import { initAuth } from "./auth.js";
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const tbody = document.querySelector("#tablaDocumentos tbody");
    const form = document.getElementById("documentoForm");
    const usuarioSelect = document.getElementById("usuarioSelect");

    const user = await initAuth();
    if (!user) return;

    cargarUsuarios();
    cargarDocumentos();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const doc = {
            nombreArchivo: document.getElementById("nombreArchivo").value,
            urlArchivo: document.getElementById("urlArchivo").value,
            usuario: { id: usuarioSelect.value }
        };
        try {
            await fetch(`${API_BASE_URL}/api/documento`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(doc)
            });
            form.reset();
            cargarDocumentos();
        } catch (err) {
            alert("Error al crear documento");
        }
    });

    async function cargarUsuarios() {
        try {
            const res = await fetch(`${API_BASE_URL}/api/usuario`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const usuarios = await res.json();
            usuarioSelect.innerHTML = "<option value=''>Seleccionar Usuario</option>";
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

    async function cargarDocumentos() {
        try {
            const res = await fetch(`${API_BASE_URL}/api/documento`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const docs = await res.json();
            tbody.innerHTML = "";
            docs.forEach(d => {
                const tr = document.createElement("tr");
                const usuarioTd = document.createElement("td");
                usuarioTd.textContent = `${d.usuario?.nombre || ''} ${d.usuario?.apellidos || ''}`;
                tr.appendChild(usuarioTd);

                const estadoTd = document.createElement("td");
                estadoTd.textContent = d.usuario?.activo ? "Activo" : "Inactivo";
                tr.appendChild(estadoTd);
                if (!d.usuario?.activo) {
                    tr.classList.add("usuario-inactivo");
                }

                const nombreTd = document.createElement("td");
                nombreTd.textContent = d.nombreArchivo;
                tr.appendChild(nombreTd);

                const urlTd = document.createElement("td");
                const enlace = document.createElement("a");
                enlace.href = d.urlArchivo;
                enlace.textContent = "Ver";
                enlace.target = "_blank";
                urlTd.appendChild(enlace);
                tr.appendChild(urlTd);

                const fechaTd = document.createElement("td");
                fechaTd.textContent = d.fechaSubida;
                tr.appendChild(fechaTd);

                const accionesTd = document.createElement("td");
                const eliminarBtn = document.createElement("span");
                eliminarBtn.innerHTML = "🗑️";
                eliminarBtn.style.cursor = "pointer";
                eliminarBtn.onclick = () => eliminar(d.id);
                accionesTd.appendChild(eliminarBtn);
                tr.appendChild(accionesTd);

                tbody.appendChild(tr);
            });
        } catch (err) {
            console.error("Error al cargar documentos", err);
        }
    }

    async function eliminar(id) {
        if (!confirm("¿Eliminar documento?")) return;
        try {
            await fetch(`${API_BASE_URL}/api/documento/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            cargarDocumentos();
        } catch (err) {
            alert("Error al eliminar documento");
        }
    }
});