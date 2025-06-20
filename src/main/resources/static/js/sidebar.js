export function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    const links = sidebar.querySelectorAll('a');
    const current = window.location.pathname.split('/').pop();
    let activeLink = null;
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.split('/').pop() === current) {
            link.classList.add('active');
            activeLink = link;
        }
    });

    const collapsed = document.querySelector('.sidebar-collapsed');
    if (!collapsed) return;
    const label = collapsed.querySelector('#sidebar-active');
    if (label) label.textContent = activeLink ? activeLink.textContent : 'Menú';

    const toggle = collapsed.querySelector('.sidebar-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !collapsed.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });

    links.forEach(link => {
        link.addEventListener('click', () => sidebar.classList.remove('open'));
    });
}