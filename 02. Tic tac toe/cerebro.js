const titulo = document.querySelector('#texto')
const cells = document.querySelectorAll('.cell')
const btnReiniciar = document.querySelector('#reiniciar')
const name = document.querySelector('#playerName');
const btnStart = document.querySelector('#start'); 
const leaderboard = document.querySelector('#personasTop');

let player = 'X'
let maquina = 'O'
let isEnPausa = false
let isJuegoStarted = false
let name2 = ''
let tiempoInicio;
let topTiempos = JSON.parse(localStorage.getItem('topTiempos')) || [];

const inputs = ['', '', '',
                '', '', '',
                '', '', '',]

const comoGanar = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
]

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

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => tapCell(cell, index))
})

function tapCell(cell, index) {

    if (!isJuegoStarted) {
        alert('debes ponerte un nombre primero!');
        return;
    } else {

        if (cell.textContent == '' && !isEnPausa) {
            isJuegoStarted = true
            updateCell(cell, index)     
            
            if (!verificarGanador()) {
                cambiarJugador()
                turnoMaquina()

                if (seLleno()) {
                    titulo.textContent = "Empate!";
                    btnReiniciar.style.visibility = 'visible'
                }

            } else {
                guardarTiempo()
            }

        }

    }
}

function formatearTiempo(milisegundos) {
    const totalSegundos = Math.floor(milisegundos / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    const milis = milisegundos % 1000;

    return `${minutos}m ${segundos}s ${milis}ms`;
}

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

function updateCell(cell, index) {
    cell.textContent = player
    inputs[index] = player
    cell.style.color = (player == 'X') ? '#9fcce8' : '#bae53c'
    console.log(inputs)
}

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

function seLleno() {
    return inputs.every(cell => cell !== '');
}

function declararGanador(indexGanadores) {

    if (player === 'O') {
        titulo.textContent = "La máquina te ganó";
    } else {
        titulo.textContent = `${name2} gana`;
    }

    indexGanadores.forEach((index) =>
        cells[index].style.background = '#6c6ac0'
    )

    btnReiniciar.style.visibility = 'visible'

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