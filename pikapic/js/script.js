$(document).ready(function() {
    $('form').submit(function(event) {
        let username = $('#username').val();
        let password = $('#password').val();

        if (!username || !password) {
            alert('Por favor, ingresa tanto el nombre de usuario como la contraseña.');
            event.preventDefault(); // Prevenir que el formulario se envíe si hay campos vacíos
        }
    });
});

$(document).ready(function() {
    // Mostrar campo adicional de género si se selecciona "Otro"
    $('#gender').change(function() {
        if ($(this).val() == 'Otro') {
            $('#other-gender').show();
        } else {
            $('#other-gender').hide();
            $('#other-gender-input').val(''); // Limpiar campo si se cambia de opción
        }
    });

    // Validación del formulario
    $('#register-form').submit(function(event) {
        event.preventDefault(); // Evitar el envío para hacer validaciones

        let username = $('#username').val();
        let email = $('#email').val();
        let name = $('#name').val();
        let password = $('#password').val();
        let confirmPassword = $('#confirm-password').val();
        let dob = $('#dob').val();
        let gender = $('#gender').val();
        let otherGender = $('#other-gender-input').val();

        // Validar campos obligatorios
        let missingFields = [];

        if (!username) missingFields.push("Username");
        if (!email) missingFields.push("Email");
        if (!name) missingFields.push("Nombre");
        if (!password) missingFields.push("Contraseña");
        if (!confirmPassword) missingFields.push("Confirmar Contraseña");
        if (!dob) missingFields.push("Fecha de Nacimiento");
        if (!gender || gender === '') missingFields.push("Género");

        // Validación de correo electrónico
        if (email && !email.includes('@')) {
            missingFields.push("Email inválido");
        }

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            missingFields.push("Las contraseñas no coinciden");
        }

        // Validar que la persona sea mayor de 18 años
        let today = new Date();
        let birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            missingFields.push("Debes ser mayor de 18 años para registrarte");
        }

        // Mostrar mensaje si falta algún campo
        if (missingFields.length > 0) {
            alert('Por favor, completa los siguientes campos: ' + missingFields.join(', '));
            return;
        }

        // Si todo está bien, redirigir (o procesar el formulario)
        window.location.href = 'dashboard.html'; // Redirige a la página de destino
    });
});


const posts = [
    {
        imageUrl: '../img/pf-aridos.jpeg',
        profileImage: '../img/profile.jpg',
        userName: 'Ariana Grande',
        postTime: '4hr',
        content: 'i’m droppin a new ep soon!!! soooooooooooooooo stay tune <3',
        likes: 27000,
        comments: 1200,
        shares: 500,
        saves: 300,
    }
];

function loadPost(postIndex) {
    const post = posts[postIndex];

    // Cambiar imagen del post
    $('#exp-post .col-lg-5 img').attr('src', post.imageUrl);

    // Cambiar la imagen del perfil
    $('#exp-post .col-lg-7 .d-flex .rounded-circle').attr('src', post.profileImage);

    // Cambiar el nombre del usuario y el tiempo
    $('#exp-post .col-lg-7 .d-flex p').html(`<span class="fw-bold">${post.userName}</span> • ${post.postTime}`);

    // Cambiar el contenido del post
    $('#exp-post .col-lg-7 .d-flex.flex-column.flex-grow-1').text(post.content);

    // Cambiar los números de likes, comentarios y shares
    $('#exp-post .d-flex .d-flex p.m-0').eq(0).text(`${post.likes}`);
    $('#exp-post .d-flex .d-flex p.m-0').eq(1).text(`${post.comments}`);
    $('#exp-post .d-flex .d-flex p.m-0').eq(2).text(`${post.saves}`);
    $('#exp-post .d-flex .d-flex p.m-0').eq(3).text(`${post.shares}`);
}

// Funcionalidad de like/dislike con jQuery
let isLiked = false;

$('#exp-post .d-flex .d-flex .d-flex:nth-child(1) svg').on('click', function() {
    let likeCount = $('#exp-post .d-flex .d-flex p.m-0').eq(0);
    
    if (isLiked) {
        // Si ya está dado like, quitamos el like
        posts[0].likes -= 1;
        $(this).find('path').css('fill', 'none');  // Cambiar color del ícono a gris
        likeCount.text(`${posts[0].likes}`);
    } else {
        // Si no está dado like, lo agregamos
        posts[0].likes += 1;
        $(this).find('path').css('fill', 'red');  // Cambiar color del ícono a rojo
        likeCount.text(`${posts[0].likes}`);
    }

    // Cambiar el estado de like
    isLiked = !isLiked;
});

// Cargar el primer post al cargar la página
$(document).ready(function() {
    loadPost(0);
});

$(document).ready(function() {
    $("#closepost").click(function() {
        $("#exp-post").hide();  // Oculta el post completo
    });
});


$(document).ready(function() {
    // Cuando se hace clic en un post
    $('.post').click(function() {
        var $clickedPost = $(this); // El post que fue clickeado
        var postId = $clickedPost.data('post-id');
        var $postList = $('#post-list');
        
        // Obtener la posición del post clickeado en el DOM
        var postIndex = $clickedPost.index();

        // Mostrar el post extendido
        var $expandedPost = $('#exp-post');

        // Ocultar el post clickeado
        $clickedPost.css('display', 'none');  // Aquí ocultamos el post clickeado (sin usar fadeOut)

        // Posicionar el post extendido en la misma fila de los otros posts
        $expandedPost.insertAfter($clickedPost); // Esto coloca el post extendido después del post clickeado

        // Mostrar el post extendido
        $expandedPost.css('display', 'block');  // Aseguramos que el post extendido esté visible

        // Opcional: Actualizar el contenido del post extendido
        $expandedPost.find('img').attr('src', $clickedPost.find('img').attr('src'));

        // Ocultar los otros posts
        $postList.find('.post').not($clickedPost).css('display', 'none'); // Ocultamos los otros posts (sin fadeOut)

        // Hacer scroll para mostrar el post extendido si está oculto
        $('html, body').animate({
            scrollTop: $expandedPost.offset().top - 50
        }, 500);

        // Guardar el post original para restaurarlo más tarde
        $clickedPost.data('original', $clickedPost); // Guardamos el post sin moverlo del DOM
    });

    // Al hacer clic en el botón de cerrar el post extendido
    $('#closepost').click(function() {
        var $expandedPost = $('#exp-post');
        var $clickedPost = $('#post-list').find('.post:visible').first(); // Obtener el post original visible

        // Ocultar el post extendido
        $expandedPost.css('display', 'none');  // Ocultamos el post extendido

        // Restaurar el post original
        var originalPost = $clickedPost.data('original');

        // Insertar el post original nuevamente en su lugar
        $clickedPost.css('display', 'block');  // Aseguramos que el post esté visible

        // Mostrar nuevamente todos los posts
        $('#post-list').find('.post').css('display', 'block');  // Aseguramos que todos los posts sean visibles
    });
});
