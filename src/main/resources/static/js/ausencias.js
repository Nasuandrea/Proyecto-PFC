document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const mensaje = document.getElementById("mensaje-usuario");

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
    const tablaPendientes = document.querySelector("#tablaPendientes tbody");
    const tablaAprobadas = document.querySelector("#tablaAprobadas tbody");
    const tablaRechazadas = document.querySelector("#tablaRechazadas tbody");

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
            await fetch("http://localhost:8080/api/usuario/parteAusencias", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(ausencia)
            });

            alert("Solicitud de ausencia enviada");
            form.reset();
            cargarAusencias();  // Volver a cargar la lista después de enviar la solicitud
        } catch (err) {
            alert("Error al solicitar ausencia: " + err.message);
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
                    const aprobarBtn = document.createElement("button");
                    aprobarBtn.textContent = "Aceptar";
                    aprobarBtn.onclick = () => actualizarEstado(a.id, "APROBADA");
                    accionesTd.appendChild(aprobarBtn);

                    const denegarBtn = document.createElement("button");
                    denegarBtn.textContent = "Denegar";
                    denegarBtn.onclick = () => actualizarEstado(a.id, "RECHAZADA");
                    accionesTd.appendChild(denegarBtn);

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

    // Función para actualizar el estado de una ausencia
    async function actualizarEstado(id, estado) {
        try {
            const comentarioAdmin = prompt("Introduce un comentario para la ausencia:");

            await fetch(`http://localhost:8080/api/usuario/parteAusencias/${id}?estado=${estado}&comentarioAdmin=
            ${comentarioAdmin}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            alert("Estado actualizado");
            cargarAusencias();  // Recargar la lista después de actualizar el estado
        } catch (err) {
            alert("Error al actualizar el estado: " + err.message);
        }
    }
});
