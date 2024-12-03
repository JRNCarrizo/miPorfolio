


fetch('barraNavegacion.html')
.then(response => response.text())
.then(data => {
    document.getElementById('barraNavegacion').innerHTML = data;
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

  