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

        // Mostrar u ocultar según el rol
        if (user.rol.nombre === "ADMIN") {
            document.querySelectorAll(".admin").forEach(e => e.style.display = "block");
        } else {
            document.querySelectorAll(".admin").forEach(e => e.style.display = "none");
        }

    } catch (error) {
        mensaje.textContent = "Error de autenticación";
        console.error(error);
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }

    const form = document.getElementById("crearProyectoForm");
    const lista = document.getElementById("listaProyectos");
    const cancelarBtn = document.getElementById("cancelarBtn");
    const crearBtn = document.getElementById("crearBtn");
    const guardarBtn = document.getElementById("guardarBtn");
    const horasEstimadasInput = document.getElementById("horasEstimadas");
    const horasTotalesInput = document.getElementById("horasTotales");

    crearBtn.style.display = "inline-block";
    guardarBtn.style.display = "none";
    cancelarBtn.style.display = "none";
    horasTotalesInput.style.display = "none";

    let editando = false;

    cargarProyectos();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const proyecto = {
            nombre: document.getElementById("nombre").value,
            descripcion: document.getElementById("descripcion").value,
            fechaInicio: document.getElementById("fechaInicio").value,
            fechaFin: document.getElementById("fechaFin").value,
            horasEstimadas: horasEstimadasInput.value
        };

        try {
            if (editando) {
                const id = document.getElementById("proyectoId").value;
                await fetch(`http://localhost:8080/api/proyectos/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(proyecto)
                });
                alert("Proyecto creado");
            }

            form.reset();
            cancelarBtn.style.display = "none";
            guardarBtn.textContent = "Crear Proyecto";
            editando = false;
            cargarProyectos();
        } catch (err) {
            alert("Error: " + err.message);
        }
    });

    cancelarBtn.addEventListener("click", () => {
        form.reset();
        editando = false;
        cancelarBtn.style.display = "none";
        guardarBtn.textContent = "Crear Proyecto";
    });

    async function cargarProyectos() {
        try {
            const url = esAdmin
                ? "http://localhost:8080/api/proyectos"
                : "http://localhost:8080/api/usuario/mis-proyectos";
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const proyectos = await res.json();
            lista.innerHTML = "";
            proyectos.forEach(p => {
                const li = document.createElement("li");

                const info = document.createElement("span");
                info.classList.add("info");
                info.textContent = `${p.nombre} (${p.fechaInicio} - ${p.fechaFin})`;
                li.appendChild(info);

                if (esAdmin) {
                    const acciones = document.createElement("span");
                    acciones.classList.add("acciones");

                    const editarBtn = document.createElement("span");
                    editarBtn.innerHTML = "✏️";
                    editarBtn.title = "Editar";
                    editarBtn.style.cursor = "pointer";
                    editarBtn.onclick = () => editar(p);

                    const eliminarBtn = document.createElement("span");
                    eliminarBtn.innerHTML = "🗑️";
                    eliminarBtn.title = "Eliminar";
                    eliminarBtn.style.cursor = "pointer";
                    eliminarBtn.onclick = () => eliminar(p.id);

                    acciones.appendChild(editarBtn);
                    acciones.appendChild(eliminarBtn);

                    li.appendChild(acciones);
                }

                lista.appendChild(li);
            });
        } catch (err) {
            console.error("Error al cargar proyectos", err);
        }
    }

    function eliminar(id) {
        alert("No es posible eliminar este proyecto.");

    window.editar = (proyecto) => {
        document.getElementById("proyectoId").value = proyecto.id;
        document.getElementById("nombre").value = proyecto.nombre;
        document.getElementById("descripcion").value = proyecto.descripcion;
        document.getElementById("fechaInicio").value = proyecto.fechaInicio;
        document.getElementById("fechaFin").value = proyecto.fechaFin;
        horasEstimadasInput.value = proyecto.horasEstimadas || "";
        horasTotalesInput.value = proyecto.horasTotales || "";
        horasTotalesInput.style.display = "inline-block";
        crearBtn.style.display = "none";
        guardarBtn.style.display = "inline-block";
        cancelarBtn.style.display = "inline-block";
        editando = true;
    };
});
