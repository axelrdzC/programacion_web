// obtener los componentes
const titulo = document.querySelector('#texto')
const cells = document.querySelectorAll('.celda')
const btnReiniciar = document.querySelector('#reiniciar')
const name = document.querySelector('#playerName');
const btnStart = document.querySelector('#start'); 
const leaderboard = document.querySelector('#personasTop');

// variables utiles
let player = 'X'
let maquina = 'O'
let isEnPausa = false
let isJuegoStarted = false
let name2 = ''
let tiempoInicio;
let topTiempos = JSON.parse(localStorage.getItem('topTiempos')) || [];

// el valor d las celdas
const inputs = ['', '', '',
                '', '', '',
                '', '', '',]

// muestra las celdas q deben estar llenos para ganar
const comoGanar = [
    [0,1,2], [3,4,5], [6,7,8], // horizontal
    [0,3,6], [1,4,7], [2,5,8], // vertical
    [0,4,8], [2,4,6] // diagonal
]

// funcion para empezar el juego q no deja jugar si no pones tu nombre primero
btnStart.addEventListener('click', () => {
    if (name.value == '') {
        alert('debes ponerte un nombre primero!');
        return;
    } else {
        name2 = name.value;
        titulo.textContent = `Partida de ${name2}`;
        isJuegoStarted = true;
        tiempoInicio = new Date();
    }
});

// agregar evento onclick para las celdas
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => tapCell(cell, index))
})

// funcion q maneja lo q se hace cuando se toca una celda
function tapCell(cell, index) {

    if (!isJuegoStarted) {
        alert('debes ponerte un nombre primero!');
        return;
    }

    // si el juego esta en pausa o se acabo ya no permitira mas clicks
    if (isEnPausa || cell.textContent !== '') {
        return;
    }

    updateCell(cell, index);

    if (!verificarGanador()) {

        cambiarJugador();
        turnoMaquina();

        if (seLleno()) {
            titulo.textContent = "Empate!";
            btnReiniciar.style.visibility = 'visible';
            isEnPausa = true;
        }

    } else {
        guardarTiempo();
    }

}

// dar formato al tiempo de los jugadores top
function formatearTiempo(milisegundos) {
    const totalSegundos = Math.floor(milisegundos / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    const milis = milisegundos % 1000;

    return `${minutos}m ${segundos}s ${milis}ms`;
}

// guardar el tiempo de cada jugador
function guardarTiempo() {
    const tiempoFin = new Date();
    const tiempoJuego = tiempoFin - tiempoInicio;

    const personitaNueva = {
        nombre: name2,
        tiempo: tiempoJuego,
        fecha: tiempoFin.toLocaleString()
    };

    const tiemposGuardados = JSON.parse(localStorage.getItem('topTiempos')) || [];
    tiemposGuardados.push(personitaNueva);

    tiemposGuardados.sort((a, b) => a.tiempo - b.tiempo);
    topTiempos = tiemposGuardados.slice(0, 10);
    
    localStorage.setItem('topTiempos', JSON.stringify(topTiempos));

    mostrarLeaderboard();
}

function mostrarLeaderboard() {
    leaderboard.innerHTML = ''; 
    topTiempos.forEach((registro, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${registro.nombre}</td>
            <td>${formatearTiempo(registro.tiempo)}</td> <!-- Formatear el tiempo aquí -->
            <td>${registro.fecha}</td>
        `;
        leaderboard.appendChild(tr);
    });
}

// cargar el leaderboard al cargar la pagina
document.addEventListener('DOMContentLoaded', () => {
    const tiemposGuardados = JSON.parse(localStorage.getItem('topTiempos')) || [];
    topTiempos = tiemposGuardados.slice(0, 10);
    mostrarLeaderboard();
});

function cambiarJugador() {
    player = (player == 'X') ? 'O' : 'X'
}

function turnoMaquina() {
    isEnPausa = true

    setTimeout(() => {
        let randomIndex
        do {
            randomIndex = Math.floor(Math.random() * inputs.length)
        } while ( inputs[randomIndex] != '' )

        updateCell(cells[randomIndex], randomIndex, player)
        
        if (!verificarGanador()) {
            cambiarJugador()
            isEnPausa = false

            if (seLleno()) {
                titulo.textContent = "Empate!";
                btnReiniciar.style.visibility = 'visible'
            }

            return
        }

        player = (player == 'X') ? 'O' : 'X'

    }, 500)
}

// actualizar el contenido de las celdas
function updateCell(cell, index) {
    cell.textContent = player
    inputs[index] = player
    cell.style.color = (player == 'X') ? '#9fcce8' : '#bae53c'
    console.log(inputs)
}

// verificar si los inputs puestos son los ganadores
function verificarGanador() {
    for (const [a,b,c] of comoGanar) {
        if (inputs[a] == player &&
            inputs[b] == player &&
            inputs[c] == player
        ) {
            declararGanador([a,b,c])
            return true
        }
    }
}

// funcion bool q checa si la tabla esta llena o no
function seLleno() {
    return inputs.every(cell => cell !== '');
}

function declararGanador(indexGanadores) {

    if (player === 'O') {
        titulo.textContent = "la máquina te ganó";
    } else {
        titulo.textContent = `${name2} gana`;
    }

    indexGanadores.forEach(index => {
        cells[index].style.background = '#6c6ac0';
    });

    btnReiniciar.style.visibility = 'visible';
    isEnPausa = true;

}

btnReiniciar.addEventListener('click', () => {
    btnReiniciar.style.visibility = 'hidden'
    inputs.fill('')
    cells.forEach(cell => {
        cell.textContent = ''
        cell.style.background = '#484776'
    })

    isEnPausa = false
    isJuegoStarted = false
    titulo.textContent = 'TIC TAC TOE'

})