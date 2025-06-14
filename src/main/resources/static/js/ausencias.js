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
    const listaPendientes = document.getElementById("listaPendientes");
    const listaAprobadas = document.getElementById("listaAprobadas");
    const listaRechazadas = document.getElementById("listaRechazadas");

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

            // Limpiar las listas antes de recargarlas
            listaPendientes.innerHTML = '';
            listaAprobadas.innerHTML = '';
            listaRechazadas.innerHTML = '';

            ausencias.forEach(a => {
                const li = document.createElement("li");
                li.textContent = `${a.tipo} - ${a.motivo} - del ${a.fechaInicio} al ${a.fechaFin}`;

                // Botón para aprobar
                if (a.estado === "PENDIENTE") {
                    const aprobarBtn = document.createElement("button");
                    aprobarBtn.textContent = "Aceptar";
                    aprobarBtn.onclick = () => actualizarEstado(a.id, "APROBADA");
                    li.appendChild(aprobarBtn);

                    // Botón para denegar
                    const denegarBtn = document.createElement("button");
                    denegarBtn.textContent = "Denegar";
                    denegarBtn.onclick = () => actualizarEstado(a.id, "RECHAZADA");
                    li.appendChild(denegarBtn);

                    listaPendientes.appendChild(li);
                }

                // Muestra las aprobadas y rechazadas
                if (a.estado === "APROBADA") {
                    listaAprobadas.appendChild(li);
                }

                if (a.estado === "RECHAZADA") {
                    listaRechazadas.appendChild(li);
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
