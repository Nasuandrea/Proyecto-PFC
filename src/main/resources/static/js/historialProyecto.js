document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const mensaje = document.getElementById("mensaje-usuario");
    const proyectoSelect = document.getElementById("proyectoSelect");
    const listaHistorial = document.getElementById("listaHistorialProyecto");

    if (!token) {
        mensaje.textContent = "No hay token. Redirigiendo al login...";
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/usuario/me", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) {
            throw new Error("No autorizado");
        }
        const user = await response.json();
        mensaje.textContent = `Hola, ${user.nombre} (${user.rol.nombre})`;
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

    proyectoSelect.addEventListener("change", cargarHistorial);

    async function cargarProyectos() {
        try {
            const res = await fetch("http://localhost:8080/api/proyectos", {
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

    async function cargarHistorial() {
        const proyectoId = proyectoSelect.value;
        if (!proyectoId) return;
        try {
            const res = await fetch(`http://localhost:8080/api/historial/proyecto/${proyectoId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const historial = await res.json();
            listaHistorial.innerHTML = "";
            historial.forEach(h => {
                const li = document.createElement("li");
                li.textContent = `${h.fechaModificacion} - ${h.observaciones || ''}`;
                listaHistorial.appendChild(li);
            });
        } catch (err) {
            console.error("Error al cargar historial", err);
        }
    }
});