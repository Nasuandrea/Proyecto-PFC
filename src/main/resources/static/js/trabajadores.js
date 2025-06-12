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

    let editando = false;

    cargarUsuarios();
    cargarUsuarioActual();

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
            rol: document.getElementById("rol").value
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

    async function eliminar(id) {
        if (confirm("¿Estás seguro de eliminar este usuario?")) {
            await fetch(`http://localhost:8080/api/usuario/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            cargarUsuarios();
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
        guardarBtn.textContent = "Guardar cambios";
        cancelarBtn.style.display = "inline-block";
        editando = true;
    };

    async function cargarUsuarioActual() {
        try {
            const res = await fetch("http://localhost:8080/api/usuario/me", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const user = await res.json();
            document.getElementById("userHeader").textContent = `${user.nombre} (${user.rol.nombre})`;
        } catch (err) {
            console.warn("No se pudo cargar el usuario actual");
        }
    }
});


