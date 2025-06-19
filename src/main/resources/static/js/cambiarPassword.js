import { API_BASE_URL } from "./api.js";
import { initAuth } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const user = await initAuth();
    if (!user) return;

    const form = document.getElementById("passwordForm");
    const nueva = document.getElementById("nuevaPassword");
    const confirmar = document.getElementById("confirmarPassword");

    form.addEventListener("submit", async e => {
        e.preventDefault();
        if (nueva.value !== confirmar.value) {
            alert("Las contrase\u00f1as no coinciden");
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/api/usuario/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ nuevaPassword: nueva.value })
            });
            if (!res.ok) throw new Error();
            alert("Contrase\u00f1a actualizada");
            form.reset();
        } catch (err) {
            alert("Error al actualizar contrase\u00f1a");
        }
    });
});