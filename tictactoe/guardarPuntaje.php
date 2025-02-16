<?php

$score = $_POST['score'];
$player = $_POST['player'];
$game = "ariana grande YUH"; 

$data = http_build_query([
    'score' => $score,
    'player' => $player,
    'game' => $game
]);


$options = [
    'http' => [
        'method' => 'POST',
        'header' => 'Content-type: application/x-www-form-urlencoded',
        'content' => $data
    ]
];

$context = stream_context_create($options);

$response = file_get_contents('http://primosoft.com.mx/games/api/addscore.php', false, $context);

// Verificar la respuesta del servidor
if ($response === FALSE) {
    echo "Error al guardar el puntaje.";
} else {
    echo "Puntaje guardado exitosamente.";
    echo $response;
}
?>
