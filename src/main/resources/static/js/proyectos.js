import {API_BASE_URL} from "./api.js";
import { initAuth } from "./auth.js";

function formatDurationISO(iso) {
    if (!iso) return "";
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!m) return "";
    const h = String(parseInt(m[1] || 0)).padStart(2, '0');
    const min = String(parseInt(m[2] || 0)).padStart(2, '0');
    return `${h}:${min}`;
}

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    let esAdmin = false;

    const user = await initAuth();
    if (!user) return;
    esAdmin = user.rol.nombre === "ADMIN";

    const form = document.getElementById("crearProyectoForm");
    const lista = document.getElementById("listaProyectos");
    const cancelarBtn = document.getElementById("cancelarBtn");
    const crearBtn = document.getElementById("crearBtn");
    const guardarBtn = document.getElementById("guardarBtn");
    const horasEstimadasInput = document.getElementById("horasEstimadas");
    const horasTotalesInput = document.getElementById("horasTotales");
    const observacionesRow = document.getElementById("observacionesRow");
    const observacionesInput = document.getElementById("observaciones");
    const trabajadoresSelect = document.getElementById("trabajadoresDisponibles");
    const trabajadoresLista = document.getElementById("trabajadoresAsignados");
    const asignarTrabajadorBtn = document.getElementById("asignarTrabajadorBtn");

    crearBtn.style.display = "inline-block";
    guardarBtn.style.display = "none";
    cancelarBtn.style.display = "none";
    horasTotalesInput.style.display = "none";

    asignarTrabajadorBtn.addEventListener("click", asignarTrabajador);

    let editando = false;
    let editId = null;

    cargarProyectos();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const proyectoNuevo = {
            nombre: document.getElementById("nombre").value,
            descripcion: document.getElementById("descripcion").value,
            fechaInicio: document.getElementById("fechaInicio").value,
            fechaFin: document.getElementById("fechaFin").value,
            horasEstimadas: horasEstimadasInput.value
        };

        const proyectoActualizado = {
            nombre: document.getElementById("nombre").value,
            descripcion: document.getElementById("descripcion").value,
            fechaInicio: document.getElementById("fechaInicio").value,
            fechaFin: document.getElementById("fechaFin").value,
            horasEstimadas: horasEstimadasInput.value,
            observaciones: observacionesInput.value
        };

        try {
            if (editando) {
                const id = document.getElementById("proyectoId").value;
                await fetch(`${API_BASE_URL}/api/proyectos/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(proyectoActualizado)
                });
                alert("Proyecto actualizado");
            } else {
                await fetch(`${API_BASE_URL}/api/proyectos`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(proyectoNuevo)
                });
                alert("Proyecto creado");
            }

            form.reset();
            observacionesInput.value = "";
            cancelarBtn.style.display = "none";
            crearBtn.style.display = "inline-block";
            guardarBtn.style.display = "none";
            observacionesRow.style.display = "none";
            horasTotalesInput.style.display = "none";
            editando = false;
            cargarProyectos();
        } catch (err) {
            alert("Error: " + err.message);
        }
    });

    cancelarBtn.addEventListener("click", () => {
        form.reset();
        editando = false;
        editId = null;
        crearBtn.style.display = "inline-block";
        guardarBtn.style.display = "none";
        cancelarBtn.style.display = "none";
        observacionesInput.value = "";
        observacionesRow.style.display = "none";
        horasTotalesInput.style.display = "none";
        trabajadoresLista.innerHTML = "";
        trabajadoresSelect.innerHTML = '<option value="">Seleccionar Trabajador</option>';
    });

    async function cargarProyectos() {
        try {
            const url = esAdmin
                ? `${API_BASE_URL}/api/proyectos`
                : `${API_BASE_URL}/api/usuario/mis-proyectos`;
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
    }

    async function cargarTrabajadoresProyecto(id) {
        try {
            const resInfo = await fetch(`${API_BASE_URL}/api/proyectos/${id}/info`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const info = await resInfo.json();
            const asignados = info.trabajadores || [];
            trabajadoresLista.innerHTML = "";
            asignados.forEach(t => {
                const li = document.createElement("li");
                li.textContent = `${t.nombre} ${t.apellidos}`;
                const del = document.createElement("span");
                del.innerHTML = "🗑️";
                del.style.cursor = "pointer";
                del.title = "Desasignar";
                del.onclick = () => desasignarTrabajador(id, t.id);
                li.appendChild(del);
                trabajadoresLista.appendChild(li);
            });

            const resUsuarios = await fetch(`${API_BASE_URL}/api/usuario`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const usuarios = await resUsuarios.json();
            trabajadoresSelect.innerHTML = '<option value="">Seleccionar Trabajador</option>';
            usuarios.forEach(u => {
                if (!asignados.some(a => a.id === u.id)) {
                    const option = document.createElement("option");
                    option.value = u.id;
                    option.textContent = `${u.nombre} ${u.apellidos}`;
                    trabajadoresSelect.appendChild(option);
                }
            });
        } catch (err) {
            console.error("Error al cargar trabajadores", err);
        }
    }

    async function asignarTrabajador() {
        if (!editId || !trabajadoresSelect.value) return;
        try {
            await fetch(`${API_BASE_URL}/api/proyectos/${editId}/trabajadores/${trabajadoresSelect.value}`, {
                method: 'POST',
                headers: { "Authorization": `Bearer ${token}` }
            });
            trabajadoresSelect.value = '';
            await cargarTrabajadoresProyecto(editId);
        } catch (err) {
            console.error("Error al asignar trabajador", err);
        }
    }

    async function desasignarTrabajador(proyectoId, usuarioId) {
        try {
            await fetch(`${API_BASE_URL}/api/proyectos/${proyectoId}/trabajadores/${usuarioId}`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${token}` }
            });
            await cargarTrabajadoresProyecto(proyectoId);
        } catch (err) {
            console.error("Error al desasignar trabajador", err);
        }
    }

    window.editar = (proyecto) => {
        document.getElementById("proyectoId").value = proyecto.id;
        document.getElementById("nombre").value = proyecto.nombre;
        document.getElementById("descripcion").value = proyecto.descripcion;
        document.getElementById("fechaInicio").value = proyecto.fechaInicio;
        document.getElementById("fechaFin").value = proyecto.fechaFin;
        horasEstimadasInput.value = proyecto.horasEstimadas || "";
        horasTotalesInput.value = formatDurationISO(proyecto.horasTotales);
        horasTotalesInput.style.display = "inline-block";
        crearBtn.style.display = "none";
        guardarBtn.style.display = "inline-block";
        cancelarBtn.style.display = "inline-block";
        observacionesRow.style.display = "flex";
        editando = true;
        editId = proyecto.id;
        cargarTrabajadoresProyecto(proyecto.id);
    };
});
