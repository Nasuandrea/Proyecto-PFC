document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("error-msg");

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                correo: email,
                password: password
            })
        });

        if (!response.ok) {
            throw new Error("Credenciales incorrectas");
        }

        const data = await response.json();
        const token = data.token;

        // Guardar el token en localStorage
        localStorage.setItem("jwt", token);

        // Redirigir al dashboard
        window.location.href = "dashboard.html";
    } catch (error) {
        errorMsg.textContent = error.message;
    }
});
