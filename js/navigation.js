document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector("#main-menu");

    if (!menuToggle || !menu) {
        return;
    }

    function setMenuState(isOpen) {
        menu.classList.toggle("is-open", isOpen);
        menuToggle.classList.toggle("is-open", isOpen);

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Cerrar menú de navegación"
                : "Abrir menú de navegación"
        );
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        setMenuState(!isOpen);
    });

    menu.addEventListener("click", (event) => {
        const clickedLink = event.target.closest("a");

        if (clickedLink) {
            setMenuState(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenuState(false);
            menuToggle.focus();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            setMenuState(false);
        }
    });
});