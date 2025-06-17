import {API_BASE_URL} from "./api.js";
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const errorMessage = document.getElementById("error");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const correo = document.getElementById("correo").value;
        const password = document.getElementById("password").value;

        try {
            // 1. Llamada a /api/auth/login para obtener el token
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ correo, password })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Credenciales incorrectas");
            }

            const data = await response.json();
            const token = data.token;

            // 2. Guardar token en localStorage
            localStorage.setItem("token", token);

            // 3. Obtener los datos del usuario
            const meResponse = await fetch(`${API_BASE_URL}/api/usuario/me`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!meResponse.ok) {
                throw new Error("Error al obtener datos del usuario");
            }

            const usuario = await meResponse.json();
            const rol = usuario.rol.nombre;

            // 4. Redirigir según rol
            if (rol === "ADMIN") {
                window.location.href = "dashboard.html";
            } else if (rol === "USUARIO") {
                window.location.href = "parteHoras.html";
            } else {
                throw new Error("Rol desconocido");
            }

        } catch (error) {
            console.error("Error:", error);
            errorMessage.textContent = error.message || "Error al iniciar sesión";
        }
    });
});

