document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No autenticado");
        window.location.href = "login.html";
        return;
    }

    const form = document.getElementById("crearUsuarioForm");
    const lista = document.getElementById("listaUsuarios");
    const cancelarBtn = document.getElementById("cancelarBtn");
    const guardarBtn = document.getElementById("guardarBtn");
    const searchInput = document.getElementById("searchTrabajadores");
    const proyectosSelect = document.getElementById("proyectosDisponibles");

    let editando = false;

    cargarUsuarios();
    cargarProyectos();

    // Filtrar trabajadores según el cuadro de búsqueda
    searchInput.addEventListener("input", () => {
        const searchValue = searchInput.value.toLowerCase();
        const items = document.querySelectorAll("#listaUsuarios li");

        items.forEach(item => {
            const nombre = item.querySelector(".info").textContent.toLowerCase();
            if (nombre.includes(searchValue)) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
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
                await fetch(`http://localhost:8080/api/usuario/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(usuario)
                });
                alert("Usuario actualizado");
            } else {
                await fetch("http://localhost:8080/api/auth/register", {
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
    });

    async function cargarUsuarios() {
        try {
            const res = await fetch("http://localhost:8080/api/usuario", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const usuarios = await res.json();
            lista.innerHTML = "";
            usuarios.forEach(u => {
                const li = document.createElement("li");

                const info = document.createElement("span");
                info.classList.add("info");
                info.textContent = `${u.nombre} ${u.apellidos} - ${u.rol?.nombre || 'Sin rol'}`;

                const acciones = document.createElement("span");
                acciones.classList.add("acciones");

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

                acciones.appendChild(editarBtn);
                acciones.appendChild(eliminarBtn);

                li.appendChild(info);
                li.appendChild(acciones);

                lista.appendChild(li);
            });
        } catch (err) {
            console.error("Error al cargar usuarios", err);
        }
    }

    async function cargarProyectos() {
        try {
            const res = await fetch("http://localhost:8080/api/proyectos", {
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
        if (confirm("¿Estás seguro de eliminar este usuario?")) {
            try {
                const response = await fetch(`http://localhost:8080/api/usuario/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.status === 403) {
                    alert("No tienes permisos para eliminar este usuario.");
                } else if (response.status === 200) {
                    alert("Usuario eliminado correctamente.");
                    cargarUsuarios(); // Recargar la lista de usuarios después de la eliminación
                } else {
                    alert("Error al eliminar el usuario. Código de estado: " + response.status);
                }
            } catch (err) {
                alert("Error al intentar eliminar el usuario: " + err.message);
            }
        }
    }

    window.editar = (usuario) => {
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
        document.getElementById("proyectosDisponibles").value = usuario.proyectoId || ""; // Asignar el proyecto actual
        guardarBtn.textContent = "Guardar cambios";
        cancelarBtn.style.display = "inline-block";
        editando = true;
    };
});



