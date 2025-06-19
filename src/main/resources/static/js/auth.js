import { API_BASE_URL } from './api.js';

export async function initAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return null;
    }
    try {
        const res = await fetch(`${API_BASE_URL}/api/usuario/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('No autorizado');
        const user = await res.json();
        document.querySelectorAll('.admin').forEach(el => {
            el.style.display = user.rol.nombre === 'ADMIN' ? 'block' : 'none';
        });
        return user;
    } catch (err) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
        return null;
    }
}