document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const mensaje = document.getElementById("mensaje-usuario");
    const tbody = document.querySelector("#tablaContratos tbody");
    const form = document.getElementById("contratoForm");
    const usuarioSelect = document.getElementById("usuarioSelect");
    const cancelarBtn = document.getElementById("cancelarBtn");
    const guardarBtn = document.getElementById("guardarBtn");

    let editando = false;
    let editId = null;

    if (!token) {
        mensaje.textContent = "No hay token. Redirigiendo al login...";
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/usuario/me", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("No autorizado");
        const user = await response.json();
        mensaje.textContent = `Hola, ${user.nombre} (${user.rol.nombre})`;
        if (user.rol.nombre === "ADMIN") {
            document.querySelectorAll(".admin").forEach(e => e.style.display = "block");
        } else {
            document.querySelectorAll(".admin").forEach(e => e.style.display = "none");
        }
    } catch (err) {
        mensaje.textContent = "Error de autenticación";
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return;
    }

    cargarUsuarios();
    cargarContratos();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const contrato = {
            tipo: document.getElementById("tipo").value,
            fechaInicio: document.getElementById("fechaInicio").value,
            fechaFin: document.getElementById("fechaFin").value,
            usuario: { id: usuarioSelect.value }
        };
        try {
            if (editando) {
                await fetch(`http://localhost:8080/api/contrato/${editId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(contrato)
                });
            } else {
                await fetch("http://localhost:8080/api/contrato", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(contrato)
                });
            }
            form.reset();
            cancelarBtn.style.display = "none";
            guardarBtn.textContent = "Crear contrato";
            editando = false;
            cargarContratos();
        } catch (err) {
            alert("Error al guardar contrato");
        }
    });

    cancelarBtn.addEventListener("click", () => {
        form.reset();
        editando = false;
        cancelarBtn.style.display = "none";
        guardarBtn.textContent = "Crear contrato";
    });

    async function cargarUsuarios() {
        try {
            const res = await fetch("http://localhost:8080/api/usuario", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const usuarios = await res.json();
            usuarioSelect.innerHTML = "<option value=''>Seleccionar Usuario</option>";
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

    async function cargarContratos() {
        try {
            const res = await fetch("http://localhost:8080/api/contrato", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const contratos = await res.json();
            tbody.innerHTML = "";
            contratos.forEach(c => {
                const tr = document.createElement("tr");
                const usuarioTd = document.createElement("td");
                usuarioTd.textContent = `${c.usuario?.nombre || ''} ${c.usuario?.apellidos || ''}`;
                tr.appendChild(usuarioTd);

                const tipoTd = document.createElement("td");
                tipoTd.textContent = c.tipo;
                tr.appendChild(tipoTd);

                const inicioTd = document.createElement("td");
                inicioTd.textContent = c.fechaInicio;
                tr.appendChild(inicioTd);

                const finTd = document.createElement("td");
                finTd.textContent = c.fechaFin || "";
                tr.appendChild(finTd);

                const accionesTd = document.createElement("td");
                const editarBtn = document.createElement("span");
                editarBtn.innerHTML = "✏️";
                editarBtn.style.cursor = "pointer";
                editarBtn.onclick = () => editar(c);

                const eliminarBtn = document.createElement("span");
                eliminarBtn.innerHTML = "🗑️";
                eliminarBtn.style.cursor = "pointer";
                eliminarBtn.onclick = () => eliminar(c.id);

                accionesTd.appendChild(editarBtn);
                accionesTd.appendChild(eliminarBtn);
                tr.appendChild(accionesTd);

                tbody.appendChild(tr);
            });
        } catch (err) {
            console.error("Error al cargar contratos", err);
        }
    }

    async function eliminar(id) {
        if (!confirm("¿Eliminar contrato?")) return;
        try {
            await fetch(`http://localhost:8080/api/contrato/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            cargarContratos();
        } catch (err) {
            alert("Error al eliminar contrato");
        }
    }

    window.editar = (contrato) => {
        editando = true;
        editId = contrato.id;
        usuarioSelect.value = contrato.usuario?.id || "";
        document.getElementById("tipo").value = contrato.tipo;
        document.getElementById("fechaInicio").value = contrato.fechaInicio;
        document.getElementById("fechaFin").value = contrato.fechaFin || "";
        cancelarBtn.style.display = "inline-block";
        guardarBtn.textContent = "Guardar";
    };
});