document.addEventListener("DOMContentLoaded", function () {
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.getElementById("navbarNavAltMarkup");

    // Ahora manejamos el clic en todo el enlace, incluyendo el span
    navbarCollapse.addEventListener("click", function (event) {
        if (event.target.tagName === "A" || event.target.tagName === "SPAN") {
            if (navbarCollapse.classList.contains("show")) {
                navbarToggler.click(); // Simula un clic para cerrar el menú
            }
        }
    });
});
fetch('cardPresentacion.html')
.then(response => response.text())
.then(data => {
    document.getElementById('cardPresentacion').innerHTML = data;
});
fetch('sobreMi.html')
.then(response => response.text())
.then(data => {
    document.getElementById('sobreMi').innerHTML = data;
});


  