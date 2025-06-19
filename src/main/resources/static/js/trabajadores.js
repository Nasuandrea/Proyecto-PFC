import { API_BASE_URL } from "./api.js";
import { initAuth } from "./auth.js";
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    const user = await initAuth();
    if (!user) return;

    const form = document.getElementById("crearUsuarioForm");
    const lista = document.getElementById("listaUsuarios");
    const cancelarBtn = document.getElementById("cancelarBtn");
    const guardarBtn = document.getElementById("guardarBtn");
    const searchInput = document.getElementById("searchTrabajadores");
    const proyectosSelect = document.getElementById("proyectosDisponibles");
    const proyectosAsignadosLista = document.getElementById("proyectosAsignados");

    let editando = false;

    cargarUsuarios();
    cargarProyectos();

    // Filtrar trabajadores según el cuadro de búsqueda
    searchInput.addEventListener("input", () => {
        const searchValue = searchInput.value.toLowerCase();
        const filas = document.querySelectorAll("#listaUsuarios tr");

        filas.forEach(fila => {
            const nombre = fila.cells[0]?.textContent.toLowerCase() || "";
            const apellidos = fila.cells[1]?.textContent.toLowerCase() || "";
            const id = fila.dataset.id ? fila.dataset.id.toLowerCase() : "";
            const texto = `${nombre} ${apellidos} ${id}`;

            if (texto.includes(searchValue)) {
                fila.style.display = "";
            } else {
                fila.style.display = "none";
            }
        });
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usuario = {
            nombre: document.getElementById("nombre").value,
            apellidos: document.getElementById("apellidos").value,
            dni: document.getElementById("dni").value,
            correo: document.getElementById("correo").value,
            password: document.getElementById("password").value,
            telefono: document.getElementById("telefono").value,
            direccion: document.getElementById("direccion").value,
            fechaNacimiento: document.getElementById("fechaNacimiento").value,
            rol: document.getElementById("rol").value,
            proyectoId: proyectosSelect.value // Proyecto asignado
        };

        try {
            if (editando) {
                const id = document.getElementById("usuarioId").value;
                await fetch(`${API_BASE_URL}/api/usuario/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(usuario)
                });
                alert("Usuario actualizado");
            } else {
                await fetch(`${API_BASE_URL}/api/auth/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(usuario)
                });
                alert("Usuario creado");
            }

            form.reset();
            cancelarBtn.style.display = "none";
            guardarBtn.textContent = "Crear usuario";
            editando = false;
            cargarUsuarios();
        } catch (err) {
            alert("Error: " + err.message);
        }
    });

    cancelarBtn.addEventListener("click", () => {
        form.reset();
        editando = false;
        cancelarBtn.style.display = "none";
        guardarBtn.textContent = "Crear usuario";
        proyectosAsignadosLista.innerHTML = "";
        cargarProyectos();
    });

    async function cargarUsuarios() {
        try {
            const res = await fetch(`${API_BASE_URL}/api/usuario`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const usuarios = await res.json();
            lista.innerHTML = "";
            usuarios.forEach(u => {
                const tr = document.createElement("tr");
                tr.dataset.id = u.id;

                const nombreTd = document.createElement("td");
                nombreTd.textContent = u.nombre;
                tr.appendChild(nombreTd);

                const apellidosTd = document.createElement("td");
                apellidosTd.textContent = u.apellidos;
                tr.appendChild(apellidosTd);

                const rolTd = document.createElement("td");
                rolTd.textContent = u.rol?.nombre || 'Sin rol';
                tr.appendChild(rolTd);

                const estadoTd = document.createElement("td");
                estadoTd.textContent = u.activo ? "Activo" : "Inactivo";
                tr.appendChild(estadoTd);

                if (!u.activo) {
                    tr.classList.add("usuario-inactivo");
                }

                const accionesTd = document.createElement("td");
                accionesTd.classList.add("acciones");

                const editarBtn = document.createElement("span");
                editarBtn.innerHTML = "✏️";
                editarBtn.title = "Editar";
                editarBtn.style.cursor = "pointer";
                editarBtn.onclick = () => editar(u);

                const eliminarBtn = document.createElement("span");
                eliminarBtn.innerHTML = "🗑️";
                eliminarBtn.title = "Eliminar";
                eliminarBtn.style.cursor = "pointer";
                eliminarBtn.onclick = () => eliminar(u.id);

                accionesTd.appendChild(editarBtn);
                accionesTd.appendChild(eliminarBtn);
                tr.appendChild(accionesTd);

                lista.appendChild(tr);
            });
        } catch (err) {
            console.error("Error al cargar usuarios", err);
        }
    }

    async function cargarProyectos() {
        try {
            const res = await fetch(`${API_BASE_URL}/api/proyectos`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const proyectos = await res.json();
            proyectosSelect.innerHTML = `<option value="">Seleccionar Proyecto</option>`; // Limpiar y agregar un valor por defecto

            proyectos.forEach(p => {
                const option = document.createElement("option");
                option.value = p.id;
                option.textContent = `${p.nombre}`;
                proyectosSelect.appendChild(option);
            });
        } catch (err) {
            console.error("Error al cargar proyectos", err);
        }
    }

    async function eliminar(id) {
        if (confirm("¿Estás seguro de desactivar este usuario?")) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/usuario/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.status === 403) {
                    alert("No tienes permisos para eliminar este usuario.");
                } else if (response.status === 200) {
                    alert("Usuario desactivado correctamente.");
                    cargarUsuarios(); // Recargar la lista de usuarios después de la desactivación
                } else {
                    alert("Error al eliminar el usuario. Código de estado: " + response.status);
                }
            } catch (err) {
                alert("Error al intentar eliminar el usuario: " + err.message);
            }
        }
    }

    window.editar = async (usuario) => {
        document.getElementById("usuarioId").value = usuario.id;
        document.getElementById("nombre").value = usuario.nombre;
        document.getElementById("apellidos").value = usuario.apellidos;
        document.getElementById("dni").value = usuario.dni;
        document.getElementById("correo").value = usuario.correo;
        document.getElementById("password").value = "";  // no rellenamos el password
        document.getElementById("telefono").value = usuario.telefono || "";
        document.getElementById("direccion").value = usuario.direccion || "";
        document.getElementById("fechaNacimiento").value = usuario.fechaNacimiento || "";
        document.getElementById("rol").value = usuario.rol?.nombre || "USUARIO";

        guardarBtn.textContent = "Guardar cambios";
        cancelarBtn.style.display = "inline-block";
        editando = true;

        try {
            const resAsignados = await fetch(`${API_BASE_URL}/api/usuario/${usuario.id}/proyectos`,
                {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const asignados = await resAsignados.json();
            proyectosAsignadosLista.innerHTML = "";
            asignados.forEach(p => {
                const li = document.createElement("li");
                li.textContent = p.nombre;
                proyectosAsignadosLista.appendChild(li);
            });

            const resDisponibles = await fetch(`${API_BASE_URL}/api/usuario/${usuario.id}/proyectos/disponibles`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const disponibles = await resDisponibles.json();
            proyectosSelect.innerHTML = `<option value="">Seleccionar Proyecto</option>`;
            disponibles.forEach(p => {
                const option = document.createElement("option");
                option.value = p.id;
                option.textContent = p.nombre;
                proyectosSelect.appendChild(option);
            });
        } catch (err) {
            console.error("Error al cargar proyectos", err);
        }
    };
});