function cerrarSesion() {
    // Limpiar datos de sesi�n
    sessionStorage.clear(); // Esto eliminar� todos los datos de sesi�n
    localStorage.clear(); // Esto eliminar� todos los datos almacenados localmente (opcional)

    // Redirigir a la p�gina de inicio de sesi�n
    window.location.href = 'index.html';
}