document.addEventListener("DOMContentLoaded", function() {
    const showContentButton = document.getElementById('showContentButton');
    const header = document.getElementById('header');
    const titleCards = document.getElementById('titleCards');
    const containerCard = document.getElementById('containerCard');

    // Función para mostrar elementos con animación y desplazamiento al header
    function showElement(element) {
        element.style.opacity = '0';
        element.classList.remove('hidden'); // Elimina la clase que oculta el elemento
        setTimeout(() => {
            element.style.opacity = '1'; // Cambia la opacidad para mostrar el elemento con una animación suave
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }

    // Función para ocultar elementos con animación
    function hideElement(element) {
        element.style.opacity = '1'; 
        setTimeout(() => {
            element.style.opacity = '0';
            setTimeout(() => {
                element.classList.add('hidden'); // Agrega la clase que oculta el elemento despuós de la animación
            }, 500);
        }, 50);
    }

    // Agregar evento de clic al botón para mostrar y ocultar el contenido
    showContentButton.addEventListener('click', function() {
        if (header.classList.contains('hidden')) {
            showElement(header); // Mostrar el header con animación y desplazamiento
            showElement(titleCards); // Mostrar title-cards con animación
            showElement(containerCard); // Mostrar container-card con animación
            showContentButton.textContent = 'Ver menos'; // Cambiar el texto del botón
        } else {
            hideElement(header); // Ocultar el header con animación
            hideElement(titleCards); // Ocultar title-cards con animación
            hideElement(containerCard); // Ocultar container-card con animación
            showContentButton.textContent = 'Ver más'; // Cambiar el texto del botón
        }
    });
});
