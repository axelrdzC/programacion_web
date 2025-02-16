const tabla = document.getElementById('tabla');
const boton_reiniciar = document.getElementById('reiniciar');
const tabla_records = document.querySelector('#personasTop');
const boton_inicio = document.getElementById('start');
const input_nombre = document.getElementById('playerName');
const leaderboard = document.querySelector('.leadboard table tbody');

let jugador = 'X';
let estatus_tabla = ['','','','','','','','',''];
let juego_activado = false;  
let empezar_tiempo;
let turno_jugador = true;

const NOMBRE_JUEGO = 'ariana grande YUH';
let topTiempos = [];

// CREATE table
function CrearTabla() {
    for (let i = 0; i < 9; i++) {
        const celda = document.createElement('div');
        celda.classList.add('celda');
        celda.dataset.index = i;
        celda.addEventListener('click', Click);
        tabla.appendChild(celda);
    }
}

// los clicks
function Click(event) {
    const index = event.target.dataset.index;

    if (!juego_activado || estatus_tabla[index] !== '' || !turno_jugador) {
        return;
    }

    estatus_tabla[index] = jugador;
    event.target.textContent = jugador;

    // color per jugador
    event.target.style.color = (jugador === 'X') ? '#9fcce8' : '#bae53c';

    if (!empezar_tiempo) {
        empezar_tiempo = Date.now();
    }

    if (verificar_ganador()) {
        juego_activado = false;

        boton_reiniciar.style.visibility = 'visible';

        const tiempo_tomado = (Date.now() - empezar_tiempo);
        const nombre_jugador = input_nombre.value.trim();
        if (nombre_jugador) {
            enviarPuntaje(nombre_jugador, tiempo_tomado);
        }
    } else if (estatus_tabla.every(cell => cell !== '')) {
        alert('Es un empate');
        juego_activado = false;

        // Mostrar el botón de reinicio
        boton_reiniciar.style.visibility = 'visible';
    } else {
        turno_jugador = false;
        jugador = 'O';
        setTimeout(movimiento_computadora, 800);
    }
}

// movimiento de la IA
function movimiento_computadora() {
    let celdas_disponibles = estatus_tabla.map((cell, index) => cell === '' ? index : null).filter(v => v !== null);
    if (celdas_disponibles.length === 0) {
        return;
    }

    const randomIndex = celdas_disponibles[Math.floor(Math.random() * celdas_disponibles.length)];
    estatus_tabla[randomIndex] = jugador;
    document.querySelector(`.celda[data-index='${randomIndex}']`).textContent = jugador;

    if (verificar_ganador()) {
        juego_activado = false;
        alert("La IA te ganó, ¡qué más podías hacer! :(");
    } else if (estatus_tabla.every(cell => cell !== '')) {
        alert('¡EMPATE!');
        juego_activado = false;
    } else {
        jugador = 'X';
        turno_jugador = true;
    }
}

function verificar_ganador() {
    const combinaciones_para_ganar = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    return combinaciones_para_ganar.some(combinacion => {
        const [a, b, c] = combinacion;
        return estatus_tabla[a] && estatus_tabla[a] === estatus_tabla[b] && estatus_tabla[a] === estatus_tabla[c];
    });
}

// enviar new puntaje al servidor
function enviarPuntaje(nombre_jugador, tiempo) {
    fetch('guardarPuntaje.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `player=${encodeURIComponent(nombre_jugador)}&score=${tiempo}&game=${encodeURIComponent(NOMBRE_JUEGO)}`
    }).then(response => response.text())
      .then(data => {
          console.log(data);
          alert("Puntaje guardado con éxito!");
          obtenerMejoresTiempos();
      }).catch(error => {
          console.error("Error al guardar el puntaje:", error);
      });
}

// get los mejores tiempos desde el proxy
function obtenerMejoresTiempos() {
    const urlGetScoresProxy = `http://localhost/progra web/tictactoe/proxy.php?game=ariana grande YUH&orderAsc=1`;

    fetch(urlGetScoresProxy)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del proxy.');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                topTiempos = data;
            } else {
                topTiempos = []; // si no hay datos vaciar el leaderboard
            }
            mostrarLeaderboard();
        })
        .catch(error => {
            console.error('Error al obtener los mejores tiempos:', error);
            alert('Hubo un problema al obtener los mejores tiempos.');
        });
}

function mostrarLeaderboard() {
    leaderboard.innerHTML = '';  // limpiar leaderboard antes de mostrar los datos
    if (topTiempos.length > 0) {
        topTiempos.forEach((registro, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${registro.player}</td>
                <td>${formatearTiempo(registro.score)}</td>
                <td>${registro.date}</td>
            `;
            leaderboard.appendChild(tr);
        });
    } else {
        leaderboard.innerHTML = `<tr><td colspan="4">No hay puntajes aún.</td></tr>`;
    }
}

// Formatear tiempo en formato legible
function formatearTiempo(milisegundos) {
    const totalSegundos = Math.floor(milisegundos / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    const milis = milisegundos % 1000;

    return `${minutos}m ${segundos}s ${milis}ms`;
}

// cargar leaderboard
document.addEventListener('DOMContentLoaded', () => {
    obtenerMejoresTiempos();
    obtenerMejoresTiempos();
});

function reiniciar_juego() {
    estatus_tabla = ['','','','','','','','',''];
    jugador = 'X';
    juego_activado = true;
    turno_jugador = true;
    empezar_tiempo = null;

    document.querySelectorAll('.celda').forEach(celda => {
        celda.textContent = '';  
        celda.style.color = ''; // reset color
    });

    // Ocultar el botón de reinicio
    boton_reiniciar.style.visibility = 'hidden';
}

// Iniciar el juego
function iniciar_juego() {
    if (input_nombre.value.trim() === '') {
        alert('Por favor ingresa tu nombre para empezar.');
        return;
    }
    jugador = 'X';
    juego_activado = true;
    CrearTabla();
    obtenerMejoresTiempos();
}

boton_inicio.addEventListener('click', iniciar_juego);
boton_reiniciar.addEventListener('click', reiniciar_juego);
