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
fetch('proyectos.html')
.then(response => response.text())
.then(data => {
    document.getElementById('proyectos').innerHTML = data;
});
fetch('form.html')
.then(response => response.text())
.then(data => {
    document.getElementById('form').innerHTML = data;
});
fetch('final.html')
.then(response => response.text())
.then(data => {
    document.getElementById('final').innerHTML = data;
});



// Mail

var form = document.getElementById("my-form");
    
    async function handleSubmit(event) {
      event.preventDefault();
      var status = document.getElementById("my-form-status");
      var data = new FormData(event.target);
      fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          status.innerHTML = "Thanks for your submission!";
          form.reset()
        } else {
          response.json().then(data => {
            if (Object.hasOwn(data, 'errors')) {
              status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
            } else {
              status.innerHTML = "Oops! There was a problem submitting your form"
            }
          })
        }
      }).catch(error => {
        status.innerHTML = "Oops! There was a problem submitting your form"
      });
    }
    form.addEventListener("submit", handleSubmit)


