+10
-20

import { API_BASE_URL } from "./api.js";
import { initAuth } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const userData = await initAuth();
    if (!userData) return;

    const form = document.getElementById("perfilForm");
    const nombre = document.getElementById("nombre");
    const apellidos = document.getElementById("apellidos");
    const correo = document.getElementById("correo");
    const telefono = document.getElementById("telefono");
    const direccion = document.getElementById("direccion");
    const fechaNacimiento = document.getElementById("fechaNacimiento");

    const u = userData;
    nombre.value = u.nombre || "";
    apellidos.value = u.apellidos || "";
    correo.value = u.correo || "";
    telefono.value = u.telefono || "";
    direccion.value = u.direccion || "";
    if (u.fechaNacimiento) fechaNacimiento.value = u.fechaNacimiento;

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
});