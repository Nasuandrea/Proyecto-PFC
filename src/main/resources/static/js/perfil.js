import { API_BASE_URL } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const form = document.getElementById("perfilForm");
    const nombre = document.getElementById("nombre");
    const apellidos = document.getElementById("apellidos");
    const correo = document.getElementById("correo");
    const telefono = document.getElementById("telefono");
    const direccion = document.getElementById("direccion");
    const fechaNacimiento = document.getElementById("fechaNacimiento");
    const avatarInput = document.getElementById("avatar");
    const avatarPreview = document.getElementById("avatar-preview");
    const uploadBtn = document.getElementById("uploadAvatarBtn");

    try {
        const res = await fetch(`${API_BASE_URL}/api/usuario/me`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
            const u = await res.json();
            nombre.value = u.nombre || "";
            apellidos.value = u.apellidos || "";
            correo.value = u.correo || "";
            telefono.value = u.telefono || "";
            direccion.value = u.direccion || "";
            if (u.fechaNacimiento) fechaNacimiento.value = u.fechaNacimiento;
            if (u.avatarUrl) avatarPreview.src = u.avatarUrl;
        }
    } catch (err) {
        console.error(err);
    }

    form.addEventListener("submit", async e => {
        e.preventDefault();
        const payload = {
            nombre: nombre.value,
            apellidos: apellidos.value,
            telefono: telefono.value,
            direccion: direccion.value,
            fechaNacimiento: fechaNacimiento.value
        };
        try {
            const res = await fetch(`${API_BASE_URL}/api/usuario/perfil`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error();
            alert("Perfil actualizado");
        } catch (err) {
            console.error(err);
            alert("Error al actualizar");
        }
    });

    uploadBtn.addEventListener("click", async e => {
        e.preventDefault();
        if (!avatarInput.files.length) return;
        const data = new FormData();
        data.append("file", avatarInput.files[0]);
        try {
            const res = await fetch(`${API_BASE_URL}/api/usuario/avatar`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: data
            });
            if (!res.ok) throw new Error();
            const url = await res.text();
            avatarPreview.src = url;
        } catch (err) {
            console.error(err);
            alert("Error al subir avatar");
        }
    });
});