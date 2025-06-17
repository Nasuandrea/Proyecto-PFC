document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const mensaje = document.getElementById("mensaje-usuario");
    let esAdmin = false;

    if (!token) {
        mensaje.textContent = "No hay token. Redirigiendo al login...";
        window.location.href = "login.html";
        return;
    }

    try {
        // Verificamos la información del usuario
        const response = await fetch("http://localhost:8080/api/usuario/me", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("No autorizado");
        }

        const user = await response.json();
        esAdmin = user.rol.nombre === "ADMIN";
        mensaje.textContent = `Hola, ${user.nombre} (${user.rol.nombre})`;

        // Mostrar u ocultar elementos del sidebar según el rol
        if (user.rol.nombre === "ADMIN") {
            // Si es admin, mostrar todos los elementos
            document.querySelectorAll(".admin").forEach(e => e.style.display = "block");
            document.querySelectorAll(".user").forEach(e => e.style.display = "block");
        } else {
            // Si es usuario, ocultar las secciones de admin
            document.querySelectorAll(".admin").forEach(e => e.style.display = "none");
            document.querySelectorAll(".user").forEach(e => e.style.display = "block");
        }

    } catch (error) {
        mensaje.textContent = "Error de autenticación";
        console.error(error);
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
    const form = document.getElementById("solicitarAusenciaForm");
    const cancelarBtn = document.getElementById("cancelarBtn");
    const guardarBtn = document.getElementById("guardarBtn");
    const ausenciaIdInput = document.getElementById("ausenciaId");
    const tablaPendientes = document.querySelector("#tablaPendientes tbody");
    const tablaAprobadas = document.querySelector("#tablaAprobadas tbody");
    const tablaRechazadas = document.querySelector("#tablaRechazadas tbody");

    let editando = false;

    cargarAusencias();  // Cargar las ausencias cuando se cargue la página

    // Manejo del formulario para solicitar una ausencia
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const ausencia = {
            fechaInicio: document.getElementById("fechaInicio").value,
            fechaFin: document.getElementById("fechaFin").value,
            tipo: document.getElementById("tipoAusencia").value,
            motivo: document.getElementById("motivo").value
        };

        try {
            if (editando) {
                const id = ausenciaIdInput.value;
                await fetch(`http://localhost:8080/api/usuario/parteAusencias/${id}/editar`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(ausencia)
                });
                alert("Ausencia actualizada");
            } else {
                await fetch("http://localhost:8080/api/usuario/parteAusencias", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(ausencia)
                });
                alert("Solicitud de ausencia enviada");
            }

            form.reset();
            cancelarBtn.style.display = "none";
            guardarBtn.textContent = "Solicitar Ausencia";
            editando = false;
            ausenciaIdInput.value = "";
            cargarAusencias();
        } catch (err) {
            alert("Error al guardar ausencia: " + err.message);
        }
    });

    // Función para cargar todas las ausencias
    async function cargarAusencias() {
        try {
            const res = await fetch("http://localhost:8080/api/usuario/parteAusencias", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const ausencias = await res.json();

            // Limpiar las tablas antes de recargarlas
            tablaPendientes.innerHTML = '';
            tablaAprobadas.innerHTML = '';
            tablaRechazadas.innerHTML = '';

            ausencias.forEach(a => {
                if (a.estado === "PENDIENTE") {
                    const tr = document.createElement("tr");

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
                    const editarBtn = document.createElement("span");
                    editarBtn.innerHTML = "✏️";
                    editarBtn.style.cursor = "pointer";
                    editarBtn.title = "Editar";
                    editarBtn.onclick = () => editarAusencia(a);

                    const eliminarBtn = document.createElement("span");
                    eliminarBtn.innerHTML = "🗑️";
                    eliminarBtn.style.cursor = "pointer";
                    eliminarBtn.title = "Eliminar";
                    eliminarBtn.onclick = () => eliminarAusencia(a.id);

                    accionesTd.appendChild(editarBtn);
                    accionesTd.appendChild(eliminarBtn);

                    tr.appendChild(accionesTd);
                    tablaPendientes.appendChild(tr);
                }

                if (a.estado === "APROBADA") {
                    const tr = document.createElement("tr");

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

                    tablaAprobadas.appendChild(tr);
                }

                if (a.estado === "RECHAZADA") {
                    const tr = document.createElement("tr");

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

                    const comentarioTd = document.createElement("td");
                    comentarioTd.textContent = a.comentarioAdmin || '';
                    tr.appendChild(comentarioTd);

                    tablaRechazadas.appendChild(tr);
                }
            });
        } catch (err) {
            console.error("Error al cargar las ausencias", err);
        }
    }

    function editarAusencia(a) {
        ausenciaIdInput.value = a.id;
        document.getElementById("fechaInicio").value = a.fechaInicio;
        document.getElementById("fechaFin").value = a.fechaFin;
        document.getElementById("tipoAusencia").value = a.tipo;
        document.getElementById("motivo").value = a.motivo;
        guardarBtn.textContent = "Guardar cambios";
        cancelarBtn.style.display = "inline-block";
        editando = true;
    }

    async function eliminarAusencia(id) {
        if (!confirm("¿Eliminar ausencia?")) return;
        try {
            await fetch(`http://localhost:8080/api/usuario/parteAusencias/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            cargarAusencias();
        } catch (err) {
            alert("Error al eliminar ausencia: " + err.message);
        }
    }

    cancelarBtn.addEventListener("click", () => {
        form.reset();
        cancelarBtn.style.display = "none";
        guardarBtn.textContent = "Solicitar Ausencia";
        editando = false;
        ausenciaIdInput.value = "";
    });

});
