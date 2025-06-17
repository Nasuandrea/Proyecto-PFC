document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const mensaje = document.getElementById("mensaje-usuario");
    const usuarioSelect = document.getElementById("usuarioSelect");
    const listaHistorial = document.getElementById("listaHistorial");
    const listaPartes = document.getElementById("listaPartes");
    const listaProyectos = document.getElementById("listaProyectos");
    const listaAusencias = document.getElementById("listaAusencias");
    const listaContratos = document.getElementById("listaContratos");
    const listaDocumentos = document.getElementById("listaDocumentos");

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
            const res = await fetch(`http://localhost:8080/api/usuario/${usuarioId}/info`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const info = await res.json();
            listaHistorial.innerHTML = "";
            listaPartes.innerHTML = "";
            listaProyectos.innerHTML = "";
            listaAusencias.innerHTML = "";
            listaContratos.innerHTML = "";
            listaDocumentos.innerHTML = "";

            info.historial.forEach(h => {
                const li = document.createElement("li");
                li.textContent = `${h.fechaModificacion} - ${h.observaciones || ''}`;
                listaHistorial.appendChild(li);
            });
            info.partes.forEach(p => {
                const li = document.createElement("li");
                li.textContent = `${p.fecha} - ${p.proyecto?.nombre || ''}`;
                listaPartes.appendChild(li);
            });
            info.proyectos.forEach(p => {
                const li = document.createElement("li");
                li.textContent = p.nombre;
                listaProyectos.appendChild(li);
            });
            info.ausencias.forEach(a => {
                const li = document.createElement("li");
                li.textContent = `${a.fechaInicio} - ${a.fechaFin} (${a.tipo})`;
                listaAusencias.appendChild(li);
            });
            info.contratos.forEach(c => {
                const li = document.createElement("li");
                li.textContent = `${c.tipo} ${c.fechaInicio} - ${c.fechaFin || ''}`;
                listaContratos.appendChild(li);
            });
            info.documentos.forEach(d => {
                const li = document.createElement("li");
                li.textContent = d.nombreArchivo;
                listaDocumentos.appendChild(li);
            });
        } catch (err) {
            console.error("Error al cargar historial", err);
        }
    }
});