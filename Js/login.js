document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto

    // Obtener los valores del formulario
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Realizar la solicitud para obtener el archivo JSON
    fetch('./Json/Usuarios.json')
        .then(response => response.json())
        .then(data => {
            // Verificar si las credenciales son correctas
            var user = data.find(user => user.username === username && user.password === password);
            if (user) {
                // Almacenar el nombre de usuario en el almacenamiento de sesión
                sessionStorage.setItem('nombreUsuario', user.username);

                // Si las credenciales son correctas, redirigir a la página de inicio
                window.location.href = 'principal.html';
            } else {
                // Mostrar el modal de Bootstrap
                $('#exampleModal').modal('show');

                // Cerrar el modal después de 5 segundos
                setTimeout(function() {
                    $('#exampleModal').modal('hide');
                }, 2000); // 5000 milisegundos = 5 segundos
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


