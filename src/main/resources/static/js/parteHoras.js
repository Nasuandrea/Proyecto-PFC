import {API_BASE_URL} from "./api.js";
import { initAuth } from "./auth.js";
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    let userId = null;
    const user = await initAuth();
    if (!user) return;
    userId = user.id;
    cargarPartes();

    const form = document.getElementById("parteForm");
    const cancelarBtn = document.getElementById("cancelarBtn");
    const guardarBtn = document.getElementById("guardarBtn");
    const proyectoSelect = document.getElementById("proyectoSelect");
    const tablaBody = document.querySelector("#tablaPartes tbody");

    let editando = false;
    let parteId = null;

    cargarProyectos();

    async function cargarPartes() {
        if (!userId) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/parte/usuario/${userId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const partes = await res.json();
            tablaBody.innerHTML = "";
            partes.forEach(p => {
                const tr = document.createElement("tr");

                const fechaTd = document.createElement("td");
                fechaTd.textContent = p.fecha;
                tr.appendChild(fechaTd);

                const proyectoTd = document.createElement("td");
                proyectoTd.textContent = p.proyecto?.nombre || "";
                tr.appendChild(proyectoTd);

                const horasTd = document.createElement("td");
                horasTd.textContent = p.horasTrabajadas;
                tr.appendChild(horasTd);

                const descansoTd = document.createElement("td");
                descansoTd.textContent = p.descanso;
                tr.appendChild(descansoTd);

                const accionesTd = document.createElement("td");
                const editarBtn = document.createElement("span");
                editarBtn.innerHTML = "✏️";
                editarBtn.title = "Editar";
                editarBtn.style.cursor = "pointer";
                editarBtn.onclick = () => editarParte(p);
                accionesTd.appendChild(editarBtn);

                const eliminarBtn = document.createElement("span");
                eliminarBtn.innerHTML = "🗑️";
                eliminarBtn.title = "Eliminar";
                eliminarBtn.style.cursor = "pointer";
                eliminarBtn.onclick = () => eliminarParte(p.id);
                accionesTd.appendChild(eliminarBtn);

                tr.appendChild(accionesTd);

                tablaBody.appendChild(tr);
            });
        } catch (err) {
            console.error("Error al cargar partes", err);
        }
    }

    function editarParte(parte) {
        parteId = parte.id;
        document.getElementById("parteId").value = parte.id;
        document.getElementById("fecha").value = parte.fecha;
        document.getElementById("horasTrabajadas").value = parte.horasTrabajadas;
        document.getElementById("descanso").value = parte.descanso;
        proyectoSelect.value = parte.proyecto?.id || "";
        guardarBtn.textContent = "Guardar cambios";
        cancelarBtn.style.display = "inline-block";
        editando = true;
    }

    async function eliminarParte(id) {
        if (!confirm("¿Estás seguro de eliminar este parte?")) return;
        try {
            await fetch(`${API_BASE_URL}/api/parte/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            cargarPartes();
        } catch (err) {
            console.error("Error al eliminar parte", err);
        }
    }



    // Cargar proyectos disponibles
    async function cargarProyectos() {
        try {
            const res = await fetch(`${API_BASE_URL}/api/usuario/mis-proyectos`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const proyectos = await res.json();
            console.log("Proyectos cargados:", proyectos); // Verifica los proyectos cargados

            proyectoSelect.innerHTML = "<option value=''>Seleccionar Proyecto</option>"; // Limpiar y agregar un valor por defecto

            proyectos.forEach(p => {
                const option = document.createElement("option");
                option.value = p.id;  // Asegúrate de que p.id es el ID del proyecto
                option.textContent = p.nombre;
                proyectoSelect.appendChild(option);
            });
        } catch (err) {
            console.error("Error al cargar proyectos", err);
        }
    }

    // Formulario de submit
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const proyectoId = proyectoSelect.value;
        console.log("ID del Proyecto seleccionado:", proyectoId); // Depuración

        // Verificar que un proyecto esté seleccionado
        if (!proyectoId) {
            alert("Por favor, seleccione un proyecto.");
            return;
        }

        const parte = {
            fecha: document.getElementById("fecha").value,
            horasTrabajadas: document.getElementById("horasTrabajadas").value,
            descanso: document.getElementById("descanso").value,
            proyecto: {id: proyectoId} // Proyecto ID debe ser enviado correctamente
        };

        console.log("Parte a enviar:", JSON.stringify(parte));  // Depuración

        try {
            if (editando) {
                const id = document.getElementById("parteId").value;
                await fetch(`${API_BASE_URL}/api/parte/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(parte)
                });
                alert("Parte actualizado");
            } else {
                await fetch(`${API_BASE_URL}/api/parte`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(parte)
                });
                alert("Parte creado");
            }

            form.reset();
            cancelarBtn.style.display = "none";
            guardarBtn.textContent = "Crear parte";
            editando = false;
            parteId = null;
            cargarPartes();
        } catch (err) {
            console.error("Error en la solicitud:", err);  // Depuración de error
            alert("Error: " + err.message);
        }
    });

    cancelarBtn.addEventListener("click", () => {
        form.reset();
        editando = false;
        parteId = null;
        cancelarBtn.style.display = "none";
        guardarBtn.textContent = "Crear parte";
    });
});