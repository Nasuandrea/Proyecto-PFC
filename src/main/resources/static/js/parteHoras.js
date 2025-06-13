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

    const form = document.getElementById("parteForm");
    const cancelarBtn = document.getElementById("cancelarBtn");
    const guardarBtn = document.getElementById("guardarBtn");
    const proyectoSelect = document.getElementById("proyectoSelect");

    let editando = false;

    cargarProyectos();

    // Cargar proyectos disponibles
    async function cargarProyectos() {
        try {
            const res = await fetch("http://localhost:8080/api/usuario/mis-proyectos", {
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
                await fetch(`http://localhost:8080/api/parte/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(parte)
                });
                alert("Parte actualizado");
            } else {
                await fetch("http://localhost:8080/api/parte", {
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
        } catch (err) {
            console.error("Error en la solicitud:", err);  // Depuración de error
            alert("Error: " + err.message);
        }
    });

    cancelarBtn.addEventListener("click", () => {
        form.reset();
        editando = false;
        cancelarBtn.style.display = "none";
        guardarBtn.textContent = "Crear parte";
    });
});
