const niveles = {
    facil: { filas: 5, columnas: 5, minas: 3 },
    medio: { filas: 8, columnas: 8, minas: 10 },
    dificil: { filas: 15, columnas: 15, minas: 30 },
    muyDificil: { filas: 20, columnas: 20, minas: 50 },
    hardcore: { filas: 30, columnas: 30, minas: 100 },
    leyenda: { filas: 32, columnas: 32, minas: 180 },
    personalizado: null
};

// si es personalizado
document.getElementById("nivel").addEventListener("change", function() {
    const nivel = document.getElementById("nivel").value
    const isPersonalizado = nivel === "personalizado"
    const config = niveles[nivel]

    if (isPersonalizado) {

        document.getElementById("filas").disabled = false
        document.getElementById("columnas").disabled = false
        document.getElementById("minas").disabled = false

    } else {

        document.getElementById("filas").value = config.filas
        document.getElementById("columnas").value = config.columnas
        document.getElementById("minas").value = config.minas

        document.getElementById("filas").disabled = true
        document.getElementById("columnas").disabled = true
        document.getElementById("minas").disabled = true
    }

});

// pasar info
document.getElementById("config").addEventListener("submit", function(event) {
    event.preventDefault()

    const nivel = document.getElementById("nivel").value
    const filas = parseInt(document.getElementById("filas").value)
    const columnas = parseInt(document.getElementById("columnas").value)
    const minas = parseInt(document.getElementById("minas").value)

    // localStorage
    localStorage.setItem("nivel", nivel)
    localStorage.setItem("filas", filas)
    localStorage.setItem("columnas", columnas)
    localStorage.setItem("minas", minas)

    // redirigir
    window.location.href = "buscaminas.html"

});
