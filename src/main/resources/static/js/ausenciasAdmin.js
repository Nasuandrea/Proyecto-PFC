import { API_BASE_URL } from "./api.js";
import { initAuth } from "./auth.js";
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const tbody = document.querySelector("#tablaAusencias tbody");

    const user = await initAuth();
    if (!user) return;
    cargarAusencias();

    async function cargarAusencias() {
        try {
            const res = await fetch(`${API_BASE_URL}/api/usuario/parteAusencias/admin`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const ausencias = await res.json();

            tbody.innerHTML = "";
            ausencias.forEach(a => {
                const tr = document.createElement("tr");

                const usuarioTd = document.createElement("td");
                usuarioTd.textContent = `${a.usuario?.nombre || ''} ${a.usuario?.apellidos || ''}`;
                tr.appendChild(usuarioTd);

                const inicioTd = document.createElement("td");
                inicioTd.textContent = a.fechaInicio;
                tr.appendChild(inicioTd);

                const finTd = document.createElement("td");
                finTd.textContent = a.fechaFin;
                tr.appendChild(finTd);

                const tipoTd = document.createElement("td");
                tipoTd.textContent = a.tipo;
                tr.appendChild(tipoTd);

                const motivoTd = document.createElement("td");
                motivoTd.textContent = a.motivo;
                tr.appendChild(motivoTd);

                const accionesTd = document.createElement("td");
                if (a.estado === "PENDIENTE") {
                    const aprobarBtn = document.createElement("button");
                    aprobarBtn.textContent = "Aprobar";
                    aprobarBtn.classList.add("btn-save");
                    aprobarBtn.onclick = () => aprobarAusencia(a.id);
                    accionesTd.appendChild(aprobarBtn);

                    const rechazarBtn = document.createElement("button");
                    rechazarBtn.textContent = "Rechazar";
                    rechazarBtn.classList.add("btn-cancel");
                    rechazarBtn.onclick = () => rechazarAusencia(a.id);
                    accionesTd.appendChild(rechazarBtn);
                } else {
                    accionesTd.textContent = a.estado;
                }
                tr.appendChild(accionesTd);

                tbody.appendChild(tr);
            });
        } catch (err) {
            console.error("Error al cargar ausencias", err);
        }
    }

    async function aprobarAusencia(id) {
        try {
            await fetch(`${API_BASE_URL}/api/usuario/parteAusencias/${id}/aprobar`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            cargarAusencias();
        } catch (err) {
            alert("Error al aprobar la ausencia");
        }
    }

    async function rechazarAusencia(id) {
        const comentario = prompt("Introduce un comentario para rechazar la ausencia:");
        if (comentario === null) return;
        try {
            const body = { estado: "RECHAZADA", comentarioAdmin: comentario };
            await fetch(`${API_BASE_URL}/api/usuario/parteAusencias/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            cargarAusencias();
        } catch (err) {
            alert("Error al rechazar la ausencia");
        }
    }
});