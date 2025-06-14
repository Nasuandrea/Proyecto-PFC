document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const mensaje = document.getElementById("mensaje-usuario");
    const usuarioSelect = document.getElementById("usuarioSelect");
    const listaHistorial = document.getElementById("listaHistorial");

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
        cargarUsuarios();
    } catch (error) {
        mensaje.textContent = "Error de autenticación";
        console.error(error);
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }

    usuarioSelect.addEventListener("change", cargarHistorial);

    async function cargarUsuarios() {
        try {
            const res = await fetch("http://localhost:8080/api/usuario", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const usuarios = await res.json();
            usuarioSelect.innerHTML = '<option value="">Seleccionar Trabajador</option>';
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

    async function cargarHistorial() {
        const usuarioId = usuarioSelect.value;
        if (!usuarioId) return;
        try {
            const res = await fetch(`http://localhost:8080/api/historial/usuario/${usuarioId}`, {
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