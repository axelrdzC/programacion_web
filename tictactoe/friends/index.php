<?php
// URL de la API
$urlGetGames = "http://primosoft.com.mx/games/api/getgames.php";

// Inicializa cURL
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $urlGetGames,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 30,
]);

// Ejecuta la solicitud y cierra la conexión
$responseContent = curl_exec($ch);
curl_close($ch);

// Decodifica el JSON en un array asociativo
$games = json_decode($responseContent, true);

// Verifica si el JSON es válido
if (json_last_error() !== JSON_ERROR_NONE) {
    die("Error al decodificar JSON: " . json_last_error_msg());
}

// Incluye la vista
include "views/index.view.php";
?>
