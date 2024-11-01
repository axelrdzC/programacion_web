const niveles = {
    facil: { filas: 5, columnas: 5, minas: 3 },
    medio: { filas: 8, columnas: 8, minas: 10 },
    dificil: { filas: 15, columnas: 15, minas: 30 },
    muyDificil: { filas: 20, columnas: 20, minas: 50 },
    hardcore: { filas: 30, columnas: 30, minas: 100 },
    leyenda: { filas: 32, columnas: 32, minas: 180 },
    personalizado: null
};

// recuperar del localstorage
let nivel = localStorage.getItem("nivel") || 'facil'
let filas = parseInt(localStorage.getItem("filas")) || niveles[nivel].filas
let columnas = parseInt(localStorage.getItem("columnas")) || niveles[nivel].columnas
let minas = parseInt(localStorage.getItem("minas")) || niveles[nivel].minas

let lado = 30
let html = ""
const tablero = Array.from({ length: filas }, () => Array(columnas).fill(0))
let minaPosiciones = []
let primerTurno = true
let verificar = true

// onclick del boton para cambiar de nivel
document.getElementById("play").addEventListener("click", function() {
    const selectNivel = document.getElementById("nivel-h").value
    const config = niveles[selectNivel]

    localStorage.setItem("nivel", selectNivel)
    localStorage.setItem("filas", config.filas)
    localStorage.setItem("columnas", config.columnas)
    localStorage.setItem("minas", config.minas)

    location.reload()
});

function crearTablero(filas, columnas, minas) {

    // poner las minas
    let minasPuestas = 0;
    while (minasPuestas < minas) {
        // se obtiene un valor random menor al numero de columnas o filas y se redonde hacia abajo
        const randomFila = Math.floor(Math.random() * filas)
        const randomCol = Math.floor(Math.random() * columnas)
        // si no hay una mina ahi...
        if (tablero[randomFila][randomCol] === 0) { 
            tablero[randomFila][randomCol] = "M"
            minaPosiciones.push([randomFila, randomCol])
            minasPuestas++
        }
    }

    // get numero de minas alrededor
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {

            if (tablero[i][j] !== "M") {
                let contador = 0
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        if (i + x >= 0 && i + x < filas && j + y >= 0 && j + y < columnas) {
                            if (tablero[i + x][j + y] === "M") {
                                contador++
                            }
                        }
                    }
                }
                tablero[i][j] = contador
            }

        }
    }

    // render del html
    const tableroHTML = document.getElementById("tablero")
    tableroHTML.innerHTML = ""

    for (let i = 0; i < filas; i++) {
        let fila = document.createElement("tr")

        for (let j = 0; j < columnas; j++) {
            let celda = document.createElement("td")
            celda.style.width = `${lado}px`
            celda.style.height = `${lado}px`
            celda.dataset.fila = i
            celda.dataset.col = j
            celda.addEventListener("click", destaparCelda)
            celda.addEventListener('contextmenu', ponerBanderita)
            fila.appendChild(celda)
        }
        tableroHTML.appendChild(fila)

    }

}

function ponerBanderita(event) {
    event.preventDefault()

    const celda = event.target

    if (celda.classList.contains("destapada")) return

    if (celda.classList.contains("bandera")) {
        celda.classList.remove("bandera")
        celda.innerText = ""
        celda.style.backgroundColor = "";
    } else {
        celda.classList.add("bandera")
        celda.innerText = "🚩"
        celda.style.backgroundColor = "#6925b7"
    }
}

function destaparCelda(event) {
    const celda = event.target
    const fila = parseInt(celda.dataset.fila)
    const col = parseInt(celda.dataset.col)

    if (celda.classList.contains("destapada") || celda.classList.contains("bandera")) return

    // mostrar mensajes si cae en una mina
    if (tablero[fila][col] === "M") {
        if (primerTurno) {
            showAlertaReset("recargando tablero...")
            return
        } else {
            primerTurno = false;
            alert("PISASTE UNA MINA, NOOOOOOOOOOOOOOOOOOOOOOOO")
            reiniciarJuego()
            return
        }
    }

    celda.classList.add("destapada")
    celda.innerText = tablero[fila][col] === 0 ? "" : tablero[fila][col]
    celda.style.backgroundColor = "#6fd70f"

    if (tablero[fila][col] === 0) {

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {

                if (x !== 0 || y !== 0) {
                    const nwFila = fila + x
                    const nwCol = col + y
                    // checar si esta en los limites del tablero
                    if (nwFila >= 0 && nwFila < filas && nwCol >= 0 && nwCol < columnas) {
                        const celda = document.querySelector(`td[data-fila="${nwFila}"][data-col="${nwCol}"]`)
                        destaparCelda({ target: celda })
                    }
                }

            }
        }

    }

    primerTurno = false
    if (verificar) { verificarVictoria() }
}

function verificarVictoria() {
    let casillasDestapadasSinMinas = 0

    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            const celda = document.querySelector(`td[data-fila="${i}"][data-col="${j}"]`)

            if (celda.classList.contains("destapada") && tablero[i][j] !== "M") {
                casillasDestapadasSinMinas++;
            }

        }
    }

    const casillasSinMinas = filas * columnas - minas

    if (casillasDestapadasSinMinas === casillasSinMinas) {
        verificar = false
        setTimeout(() => {
            alert("ganaste brooooo")
            reiniciarJuego()
        }, 100)
    }
}

function reiniciarJuego() {
    primerTurno = true
    location.reload()
}

// funcion para reiniciar en caso de que el jugador haya caido en una mina
function showAlertaReset(mensaje) {
    const alerta = document.getElementById("temporal-alert")
    alerta.textContent = mensaje
    alerta.style.display = "block"

    setTimeout(() => {
        alerta.style.display = "none"
        reiniciarJuego()
    }, 500)
}

crearTablero(filas, columnas, minas)
