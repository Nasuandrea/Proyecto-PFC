import { initSidebar } from './sidebar.js';
export async function loadLayout() {
    const [headerRes, sidebarRes] = await Promise.all([
        fetch('partials/header.html'),
        fetch('partials/sidebar.html')
    ]);
    const headerHtml = await headerRes.text();
    const sidebarHtml = await sidebarRes.text();
    document.getElementById('header-container').innerHTML = headerHtml;
    document.getElementById('sidebar-container').innerHTML = sidebarHtml;
    initSidebar();
    document.dispatchEvent(new Event('layoutLoaded'));
}

document.addEventListener('DOMContentLoaded', loadLayout);