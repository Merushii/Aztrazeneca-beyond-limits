function mostrarPagina(url) {
    // Obtener referencia a los elementos
    var paginaMostrada = document.getElementById("paginaMostrada");

    // Cambiar el estilo para mostrar la página
    paginaMostrada.style.display = "block";

    // Obtener el iframe
    var iframe = document.getElementById("iframePagina");

    // Cargar la URL en el iframe
    iframe.src = url;
}

function cerrarPagina() {
    // Ocultar el contenido de la página
    var paginaMostrada = document.getElementById("paginaMostrada");
    paginaMostrada.style.display = "none";

    // Limpiar la URL del iframe
    var iframe = document.getElementById("iframePagina");
    iframe.src = "";
}

