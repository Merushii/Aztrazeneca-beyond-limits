function cerrarSesion() {
    // Limpiar datos de sesión
    sessionStorage.clear(); // Esto eliminará todos los datos de sesión
    localStorage.clear(); // Esto eliminará todos los datos almacenados localmente (opcional)

    // Redirigir a la página de inicio de sesión
    window.location.href = 'index.html';
}