import { initAuth } from "./auth.js";
async function init() {
    const mensaje = document.getElementById("mensaje-usuario");
    const icon = document.getElementById("profile-icon");
    const dropdown = document.getElementById("profile-dropdown");
    const emailField = document.getElementById("dropdown-email");
    const logoutLink = document.getElementById("logout-link");

    const user = await initAuth();
    if (!user) return;
    if (mensaje) mensaje.textContent = `${user.nombre} (${user.rol.nombre})`;
    if (emailField) emailField.textContent = user.correo || "";
    if (icon) icon.src = user.rol.nombre === "ADMIN" ? "/icons/admin.png" : "/icons/user.png";

    const container = document.querySelector('.profile-container');
    if (container && dropdown) {
        container.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });
        document.addEventListener('click', () => dropdown.classList.remove('show'));
    }

    if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            window.location.href = "login.html";
        });
    }
}

document.addEventListener("layoutLoaded", init);