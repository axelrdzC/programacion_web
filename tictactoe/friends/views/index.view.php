<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Práctica 06: APIs</title>
</head>
<body>
    <h1>Práctica 06: APIs</h1>
    <h2>Games:</h2>
    <ul>
    <?php foreach ($games as $game): ?>
        <li>
            <a href="http://primosoft.com.mx/games/api/getscores.php?game=<?= urlencode($game) ?>&orderAsc=1" target="_blank">
                <?= htmlspecialchars($game) ?>
            </a>
        </li>
    <?php endforeach; ?>
</ul>
    <script src="js/index.js"></script>
</body>
</html>