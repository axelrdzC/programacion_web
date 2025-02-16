<?php
$game = $_GET['game'];
$orderAsc = $_GET['orderAsc'];

// Construir la URL para el servidor remoto
$url = "http://primosoft.com.mx/games/api/getscores.php?game=" . urlencode($game) . "&orderAsc=" . $orderAsc;

// Hacer la solicitud al servidor remoto
$response = file_get_contents($url);

// Enviar la respuesta como JSON
header('Content-Type: application/json');
echo $response;
?>
