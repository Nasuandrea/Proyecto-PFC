import { API_BASE_URL } from "./api.js";

async function init() {
    const mensaje = document.getElementById("mensaje-usuario");
    const icon = document.getElementById("profile-icon");
    const dropdown = document.getElementById("profile-dropdown");
    const emailField = document.getElementById("dropdown-email");
    const logoutLink = document.getElementById("logout-link");

    const token = localStorage.getItem("token");
    if (!token) {
        if (mensaje) mensaje.textContent = "No hay token. Redirigiendo al login...";
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/api/usuario/me`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("No autorizado");
        const user = await res.json();
        if (mensaje) mensaje.textContent = `${user.nombre} (${user.rol.nombre})`;
        if (emailField) emailField.textContent = user.correo || "";
        if (icon) icon.textContent = user.rol.nombre === "ADMIN" ? "👑" : "👤";
    } catch (err) {
        if (mensaje) mensaje.textContent = "Error de autenticación";
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return;
    }

    if (icon && dropdown) {
        icon.addEventListener("click", () => dropdown.classList.toggle("show"));
    }

    if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            window.location.href = "login.html";
        });
    }
}

document.addEventListener("DOMContentLoaded", init);