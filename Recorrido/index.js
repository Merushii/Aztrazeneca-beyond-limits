/*
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

(function () {
  var Marzipano = window.Marzipano;
  var bowser = window.bowser;
  var screenfull = window.screenfull;
  var data = window.APP_DATA;

  // Grab elements from DOM.
  var panoElement = document.querySelector('#pano');
  var sceneNameElement = document.querySelector('#titleBar .sceneName');
  var sceneListElement = document.querySelector('#sceneList');
  var sceneElements = document.querySelectorAll('#sceneList .scene');
  var sceneListToggleElement = document.querySelector('#sceneListToggle');
  var autorotateToggleElement = document.querySelector('#autorotateToggle');
  var fullscreenToggleElement = document.querySelector('#fullscreenToggle');

  // Detect desktop or mobile mode.
  if (window.matchMedia) {
    var setMode = function () {
      if (mql.matches) {
        document.body.classList.remove('desktop');
        document.body.classList.add('mobile');
      } else {
        document.body.classList.remove('mobile');
        document.body.classList.add('desktop');
      }
    };
    var mql = matchMedia("(max-width: 500px), (max-height: 500px)");
    setMode();
    mql.addListener(setMode);
  } else {
    document.body.classList.add('desktop');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var dropdown = document.getElementById('colorFilterDropdown');

    dropdown.addEventListener('change', function () {
      console.log('Dropdown changed to:', this.value); // Diagnostic log

      // Remove any existing filter class from <body>
      document.body.classList.remove('normal', 'deuteranopia', 'protanopia', 'tritanopia', 'achromatopsia');

      // Add the selected filter class to <body>
      document.body.classList.add(this.value);

      // Diagnostic check to confirm the class was added
      console.log('Current body classes:', document.body.className);
    });
  });

  // Detect whether we are on a touch device.
  document.body.classList.add('no-touch');
  window.addEventListener('touchstart', function () {
    document.body.classList.remove('no-touch');
    document.body.classList.add('touch');
  });

  // Use tooltip fallback mode on IE < 11.
  if (bowser.msie && parseFloat(bowser.version) < 11) {
    document.body.classList.add('tooltip-fallback');
  }

  // Viewer options.
  var viewerOpts = {
    controls: {
      mouseViewMode: data.settings.mouseViewMode
    }
  };

  // Initialize viewer.
  var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

  //Registrar el metodo de control personalizado
  var deviceOrientationControlMethod = new DeviceOrientationControlMethod();
  var controls = viewer.controls();
  controls.registerMethod('deviceOrientation', deviceOrientationControlMethod);


  // Create scenes.
  var scenes = data.scenes.map(function (data) {
    var urlPrefix = "tiles";
    var source = Marzipano.ImageUrlSource.fromString(
      urlPrefix + "/" + data.id + "/{z}/{f}/{y}/{x}.jpg",
      { cubeMapPreviewUrl: urlPrefix + "/" + data.id + "/preview.jpg" });
    var geometry = new Marzipano.CubeGeometry(data.levels);

    var limiter = Marzipano.RectilinearView.limit.traditional(data.faceSize, 100 * Math.PI / 180, 120 * Math.PI / 180);
    var view = new Marzipano.RectilinearView(data.initialViewParameters, limiter);

    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    //Habilitar Giroscopio

    var enabled = false;

    var toggleElement = document.getElementById('toggleDeviceOrientation');

    function requestPermissionForIOS() {
      window.DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            enableDeviceOrientation()
          }
        }).catch((e) => {
          console.error(e)
        })
    }

    function enableDeviceOrientation() {
      deviceOrientationControlMethod.getPitch(function (err, pitch) {
        if (!err) {
          view.setPitch(pitch);
        }
      });
      controls.enableMethod('deviceOrientation');
      enabled = true;
      toggleElement.className = 'enabled';
    }

    function enable() {
      if (window.DeviceOrientationEvent) {
        if (typeof (window.DeviceOrientationEvent.requestPermission) == 'function') {
          requestPermissionForIOS()
        } else {
          enableDeviceOrientation()
        }
      }
    }

    function disable() {
      controls.disableMethod('deviceOrientation');
      enabled = false;
      toggleElement.className = '';
    }

    function toggle() {
      if (enabled) {
        disable();
      } else {
        enable();
      }
    }

    toggleElement.addEventListener('click', toggle);



    // Create link hotspots.
    data.linkHotspots.forEach(function (hotspot) {
      var element = createLinkHotspotElement(hotspot);
      scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
    });

    // Create info hotspots.
    data.infoHotspots.forEach(function (hotspot) {
      var element = createInfoHotspotElement(hotspot);
      scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
    });

    return {
      data: data,
      scene: scene,
      view: view
    };
  });

  // Set up autorotate, if enabled.
  var autorotate = Marzipano.autorotate({
    yawSpeed: 0.03,
    targetPitch: 0,
    targetFov: Math.PI / 2
  });
  if (data.settings.autorotateEnabled) {
    autorotateToggleElement.classList.add('enabled');
  }

  // Set handler for autorotate toggle.
  autorotateToggleElement.addEventListener('click', toggleAutorotate);

  // Set up fullscreen mode, if supported.
  if (screenfull.enabled && data.settings.fullscreenButton) {
    document.body.classList.add('fullscreen-enabled');
    fullscreenToggleElement.addEventListener('click', function () {
      screenfull.toggle();
    });
    screenfull.on('change', function () {
      if (screenfull.isFullscreen) {
        fullscreenToggleElement.classList.add('enabled');
      } else {
        fullscreenToggleElement.classList.remove('enabled');
      }
    });
  } else {
    document.body.classList.add('fullscreen-disabled');
  }

  var views = [
    scenes[0].view, // Vista 1 asociada a la primera escena
    scenes[1].view, // Vista 2 asociada a la segunda escena
    scenes[2].view, // Vista 3 asociada a la tercera escena
    scenes[3].view,  // Vista 4 asociada a la cuarta escena
    scenes[4].view, // Vista 5 asociada a la 5 escena
    scenes[5].view, // Vista 6 asociada a la 6 escena
    scenes[6].view, // Vista 7 asociada a la 7 escena
    scenes[7].view,  // Vista 8 asociada a la 8 escena
    scenes[8].view  // Vista  asociada a la 9 escena
  ];

  // Agrega un evento de escucha para detectar cuando se presionan las teclas
  document.addEventListener('keydown', function (event) {
    // Verifica qué tecla se ha presionado
    switch (event.key) {
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        // Cambia a la vista correspondiente
        var viewIndex = parseInt(event.key) - 1;
        switchScene(scenes[viewIndex]);
        break;
      default:
        break;
    }
  });

  function handleKeyPress(event) {
    // Obtener la tecla presionada
    var keyPressed = event.keyCode || event.which;

    // Iterar sobre todas las escenas
    for (var i = 0; i < scenes.length; i++) {
      // Obtener la vista de la escena actual
      var currentView = scenes[i].view;

      // Obtener el ángulo de yaw actual
      var currentYaw = currentView.yaw();

      // Obtener el ángulo de pitch actual
      var currentPitch = currentView.pitch();

      // Calcular el nuevo ángulo de yaw y pitch dependiendo de la tecla presionada
      var newYaw = currentYaw;
      var newPitch = currentPitch;

      // Dependiendo de la tecla presionada, ajustar los ángulos de yaw y pitch
      switch (keyPressed) {
        case 37: // Flecha izquierda
          newYaw -= Math.PI / 18; // Por ejemplo, 10 grados
          break;
        case 38: // Flecha arriba
          newPitch -= Math.PI / 18; // Por ejemplo, 10 grados
          break;
        case 39: // Flecha derecha
          newYaw += Math.PI / 18; // Por ejemplo, 10 grados
          break;
        case 40: // Flecha abajo
          newPitch += Math.PI / 18; // Por ejemplo, 10 grados
          break;
        default:
          // No hacer nada si no se presionó una tecla de dirección
          return;
      }

      // Establecer los nuevos ángulos de yaw y pitch
      currentView.setYaw(newYaw);
      currentView.setPitch(newPitch);
    }
  }

  // Agregar un event listener para detectar la presión de teclas
  document.addEventListener('keydown', handleKeyPress);

  // Set handler for scene list toggle.
  sceneListToggleElement.addEventListener('click', toggleSceneList);

  // Start with the scene list open on desktop.
  if (!document.body.classList.contains('mobile')) {
    showSceneList();
  }

  // Set handler for scene switch.
  scenes.forEach(function (scene) {
    var el = document.querySelector('#sceneList .scene[data-id="' + scene.data.id + '"]');
    el.addEventListener('click', function () {
      switchScene(scene);
      // On mobile, hide scene list after selecting a scene.
      if (document.body.classList.contains('mobile')) {
        hideSceneList();
      }
    });
  });

  // DOM elements for view controls.
  var viewUpElement = document.querySelector('#viewUp');
  var viewDownElement = document.querySelector('#viewDown');
  var viewLeftElement = document.querySelector('#viewLeft');
  var viewRightElement = document.querySelector('#viewRight');
  var viewInElement = document.querySelector('#viewIn');
  var viewOutElement = document.querySelector('#viewOut');

  // Dynamic parameters for controls.
  var velocity = 0.7;
  var friction = 3;

  // Associate view controls with elements.
  var controls = viewer.controls();
  controls.registerMethod('upElement', new Marzipano.ElementPressControlMethod(viewUpElement, 'y', -velocity, friction), true);
  controls.registerMethod('downElement', new Marzipano.ElementPressControlMethod(viewDownElement, 'y', velocity, friction), true);
  controls.registerMethod('leftElement', new Marzipano.ElementPressControlMethod(viewLeftElement, 'x', -velocity, friction), true);
  controls.registerMethod('rightElement', new Marzipano.ElementPressControlMethod(viewRightElement, 'x', velocity, friction), true);
  controls.registerMethod('inElement', new Marzipano.ElementPressControlMethod(viewInElement, 'zoom', -velocity, friction), true);
  controls.registerMethod('outElement', new Marzipano.ElementPressControlMethod(viewOutElement, 'zoom', velocity, friction), true);

  function sanitize(s) {
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
  }

  function switchScene(scene) {
    stopAutorotate();
    scene.view.setParameters(scene.data.initialViewParameters);
    scene.scene.switchTo();
    startAutorotate();
    updateSceneName(scene);
    updateSceneList(scene);
  }

  function updateSceneName(scene) {
    sceneNameElement.innerHTML = sanitize(scene.data.name);
  }

  function updateSceneList(scene) {
    for (var i = 0; i < sceneElements.length; i++) {
      var el = sceneElements[i];
      if (el.getAttribute('data-id') === scene.data.id) {
        el.classList.add('current');
      } else {
        el.classList.remove('current');
      }
    }
  }

  function showSceneList() {
    sceneListElement.classList.add('enabled');
    sceneListToggleElement.classList.add('enabled');
  }

  function hideSceneList() {
    sceneListElement.classList.remove('enabled');
    sceneListToggleElement.classList.remove('enabled');
  }

  function toggleSceneList() {
    sceneListElement.classList.toggle('enabled');
    sceneListToggleElement.classList.toggle('enabled');
  }

  function startAutorotate() {
    if (!autorotateToggleElement.classList.contains('enabled')) {
      return;
    }
    viewer.startMovement(autorotate);
    viewer.setIdleMovement(3000, autorotate);
  }

  function stopAutorotate() {
    viewer.stopMovement();
    viewer.setIdleMovement(Infinity);
  }

  function toggleAutorotate() {
    if (autorotateToggleElement.classList.contains('enabled')) {
      autorotateToggleElement.classList.remove('enabled');
      stopAutorotate();
    } else {
      autorotateToggleElement.classList.add('enabled');
      startAutorotate();
    }
  }

  function createLinkHotspotElement(hotspot) {

    // Create wrapper element to hold icon and tooltip.
    var wrapper = document.createElement('div');
    wrapper.classList.add('hotspot');
    wrapper.classList.add('link-hotspot');

    // Create image element.
    var icon = document.createElement('img');
    icon.src = 'img/link.png';
    icon.classList.add('link-hotspot-icon');

    // Set rotation transform.
    var transformProperties = ['-ms-transform', '-webkit-transform', 'transform'];
    for (var i = 0; i < transformProperties.length; i++) {
      var property = transformProperties[i];
      icon.style[property] = 'rotate(' + hotspot.rotation + 'rad)';
    }

    // Add click event handler.
    wrapper.addEventListener('click', function () {
      switchScene(findSceneById(hotspot.target));
    });

    // Prevent touch and scroll events from reaching the parent element.
    // This prevents the view control logic from interfering with the hotspot.
    stopTouchAndScrollEventPropagation(wrapper);

    // Create tooltip element.
    var tooltip = document.createElement('div');
    tooltip.classList.add('hotspot-tooltip');
    tooltip.classList.add('link-hotspot-tooltip');
    tooltip.innerHTML = findSceneDataById(hotspot.target).name;

    wrapper.appendChild(icon);
    wrapper.appendChild(tooltip);

    return wrapper;
  }

// Obtener referencia al botón "Filtros de daltonismo" y al div de información
const openAccessButton = document.querySelector('#openAccessOptions button');
const infoDiv = document.querySelector('.info');

// Agregar evento de clic al botón
openAccessButton.addEventListener('click', function() {
  // Verificar si el div de información está visible
  if (infoDiv.style.display === "block") {
    // Si está visible, ocultarlo y detener la narración
    infoDiv.style.display = "none";
    narrateText(""); // Detener cualquier narración en curso
  } else {
    // Si está oculto, mostrarlo y narrar el contenido si la narración está activa
    infoDiv.style.display = "block";
    if (narrationActive) {
      narrateText(infoDiv.innerText);
    }
  }
});

  function createInfoHotspotElement(hotspot) {

    // Create wrapper element to hold icon and tooltip.
    var wrapper = document.createElement('div');
    wrapper.classList.add('hotspot');
    wrapper.classList.add('info-hotspot');

    // Create hotspot/tooltip header.
    var header = document.createElement('div');
    header.classList.add('info-hotspot-header');

    // Create image element.
    var iconWrapper = document.createElement('div');
    iconWrapper.classList.add('info-hotspot-icon-wrapper');
    var icon = document.createElement('img');
    icon.src = 'img/info.png';
    icon.classList.add('info-hotspot-icon');
    iconWrapper.appendChild(icon);

    // Create title element.
    var titleWrapper = document.createElement('div');
    titleWrapper.classList.add('info-hotspot-title-wrapper');
    var title = document.createElement('div');
    title.classList.add('info-hotspot-title');
    title.innerHTML = hotspot.title;
    titleWrapper.appendChild(title);

    // Create close element.
    var closeWrapper = document.createElement('div');
    closeWrapper.classList.add('info-hotspot-close-wrapper');
    var closeIcon = document.createElement('img');
    closeIcon.src = 'img/close.png';
    closeIcon.classList.add('info-hotspot-close-icon');
    closeWrapper.appendChild(closeIcon);

    // Construct header element.
    header.appendChild(iconWrapper);
    header.appendChild(titleWrapper);
    header.appendChild(closeWrapper);

    // Create text element.
    var text = document.createElement('div');
    text.classList.add('info-hotspot-text');
    text.innerHTML = hotspot.text;

    // Place header and text into wrapper element.
    wrapper.appendChild(header);
    wrapper.appendChild(text);

    // Create a modal for the hotspot content to appear on mobile mode.
    var modal = document.createElement('div');
    modal.innerHTML = wrapper.innerHTML;
    modal.classList.add('info-hotspot-modal');
    document.body.appendChild(modal);

    var toggle = function () {
      wrapper.classList.toggle('visible');
      modal.classList.toggle('visible');
    };


    // Show content when hotspot is clicked.
    wrapper.querySelector('.info-hotspot-header').addEventListener('click', function (event) {
      toggle(event); // Llamada a la función original
      switch (hotspot.title) {
        case "Unidad de Respaldo de Energía (UPS)":
          openModal(hotspot);   // Llamada a la nueva función
          break;
        case "Área de Soporte IT":
          openModal(hotspot);   // Llamada a la nueva función
          break;
        case "Sistema de Pantallas de Reunión":
          openModal(hotspot);   // Llamada a la nueva función
          break;
        case "Mesa del Área de Descanso":
          openModal(hotspot);   // Llamada a la nueva función
          break;

        default:
          break;
      }

    });

    wrapper.querySelector('.info-hotspot-close-wrapper').addEventListener('click', function (event) {
      event.stopPropagation(); // Detiene la propagación para evitar que se ejecute el evento de apertura del modal.
      toggle(); // Alterna la visibilidad del hotspot.
    });

    // Hide content when close icon is clicked.
    modal.querySelector('.info-hotspot-close-wrapper').addEventListener('click', function (event) {
      toggle(); // Esta línea alterna la visibilidad del modal.
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Detiene cualquier narración en curso.
      }
      event.stopPropagation(); // Esto evitará que el evento siga propagándose.
    });


    wrapper.querySelector('.info-hotspot-header').addEventListener('click', function (event) {
      toggle();
      toggle(event); // Llamada a la función original
    });

    wrapper.addEventListener('click', function(event) {
      // Verifica si el clic fue en el ícono de cierre
      var isCloseButton = event.target === closeIcon || event.target === closeWrapper;
      
      // Solo narra el texto si el clic no fue en el botón de cierre
      if (!window.speechSynthesis.speaking && narrationActive) {
        // Narra el texto cuando el mouse pasa sobre el hotspot
        narrateText(hotspot.title);
        narrateText(hotspot.text);
      }
    });

    wrapper.addEventListener('mouseover', function (event) {
      // Verifica si hay alguna narración en curso y si la narración está activa
      if (!window.speechSynthesis.speaking && narrationActive) {
        // Narra el texto cuando el mouse pasa sobre el hotspot
        narrateText(hotspot.title);
        narrateText(hotspot.text);
      }
    });

    // Prevent touch and scroll events from reaching the parent element.
    // This prevents the view control logic from interfering with the hotspot.
    stopTouchAndScrollEventPropagation(wrapper);

    return wrapper;
  }

// Bandera para verificar si la narración está activada
let narrationActive = true;


function toggleNarration() {
  // Cambiar el estado de la narración
  narrationActive = !narrationActive;
  // Actualizar la clase del botón según el estado de la narración
  const desactivateNarrationButton = document.getElementById('desactivateNarration');
  if (!narrationActive) {
    // Si la narración se desactiva, detener la narración en curso
    window.speechSynthesis.cancel();
    desactivateNarrationButton.classList.add('disabled');
  } else {
    // Si la narración se activa, solo actualizar la clase del botón
    desactivateNarrationButton.classList.remove('disabled');
  }
}


function narrateText(text) {
  if (narrationActive && 'speechSynthesis' in window) {
    // Crea una nueva instancia de SpeechSynthesisUtterance.
    var msg = new SpeechSynthesisUtterance();

    // Reemplaza etiquetas HTML por espacios, y <br> por puntos para una mejor narración.
    var cleanText = text.replace(/<[^>]+>/g, '').replace(/<br\s*[\/]?>/gi, ". ");

    // Establece el texto a narrar.
    msg.text = cleanText;

    // Opcional: Configura el idioma y otras propiedades de la voz aquí.
    msg.lang = 'es-ES'; // Ajusta al idioma deseado.

    msg.onend = function () {
      console.log('Narración completada');
    };

    // Habla el texto.
    window.speechSynthesis.speak(msg);
  } else {
    console.log("Tu navegador no soporta la Web Speech API o la narración está desactivada");
  }
}

// Obtener referencia al div "desactivateNarration"
const desactivateNarrationDiv = document.querySelector('#desactivateNarration');

// Agregar evento de clic al div "desactivateNarration"
desactivateNarrationDiv.addEventListener('click', function () {
  toggleNarration(); // Cambiar el estado de la narración al hacer clic
});

  // Prevent touch and scroll events from reaching the parent element.
  function stopTouchAndScrollEventPropagation(element, eventList) {
    var eventList = ['touchstart', 'touchmove', 'touchend', 'touchcancel',
      'wheel', 'mousewheel'];
    for (var i = 0; i < eventList.length; i++) {
      element.addEventListener(eventList[i], function (event) {
        event.stopPropagation();
      });
    }
  }

  function findSceneById(id) {
    for (var i = 0; i < scenes.length; i++) {
      if (scenes[i].data.id === id) {
        return scenes[i];
      }
    }
    return null;
  }

  function findSceneDataById(id) {
    for (var i = 0; i < data.scenes.length; i++) {
      if (data.scenes[i].id === id) {
        return data.scenes[i];
      }
    }
    return null;
  }

  // Display the initial scene.
  switchScene(scenes[0]);

  document.addEventListener("DOMContentLoaded", function () {
    // Función para actualizar el texto basado en el tamaño de la pantalla
    function updateTextForDevice() {
      var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      var textElement = document.getElementById('controlsText'); // Asegúrate de reemplazar 'yourTextElementId' con el id real de tu elemento de texto

      // Suponiendo que 768px es el punto de corte entre dispositivos móviles y escritorio
      if (width <= 1366) {
        // Texto para dispositivos móviles con saltos de línea HTML
        textElement.innerHTML = 'Controles del Modelo 3D:<br>' +
          'Desliza con un dedo: Rotar<br>' +
          'Desliza con dos dedos: Mover<br>' +
          'Pincha con dos dedos: Zoom';
      } else {
        // Texto para escritorio con saltos de línea HTML
        textElement.innerHTML = 'Controles del Modelo 3D:<br>' +
          'Click izquierdo + arrastrar: Rotar<br>' +
          'Click derecho + arrastrar: Mover<br>' +
          'Rueda del mouse: Zoom';
      }
    }

    // Ejecuta la función al cargar la página
    updateTextForDevice();

    // Añade un listener para cuando la ventana cambie de tamaño
    window.addEventListener('resize', updateTextForDevice);
  });

  //Abrir modal para presentar el modelo 3D
  function openModal(hotspot) {
    var modal = document.getElementById('modal3D');
    var span = document.getElementsByClassName("close-button")[0];
    var controlsText = document.getElementById('controlsText');

    // Mostrar el modal
    modal.style.display = "block";
    controlsText.style.display = "block";

    // Cargar el modelo 3D en el modal
    loadModelIntoModal(hotspot.title); // Asumiendo que el título puede determinar el modelo

    animate();


    // Cerrar el modal al hacer clic en el botón de cierre
    span.onclick = function () {
      modal.style.display = "none";
      controlsText.style.display = "none";
      clearModelFromModal(); // Asegurarse de limpiar o detener el renderizado del modelo
    }
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  var modal = document.getElementById('modal3D'); // Asegúrate de que 'modal3D' es el ID correcto del modal
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x404040, 0.6);
  const ambientLight = new THREE.AmbientLight(0x404040, 1); // Luz ambiental suave


  function loadModelIntoModal(modelName) {
    // Antes de cargar un nuevo modelo, limpia el modelo anterior si existe
    clearModelFromModal();

    const loader = new THREE.GLTFLoader();
    // Asumiendo que todos los modelos necesitan ajustes individuales de cámara y posición
    switch (modelName) {
      case "Unidad de Respaldo de Energía (UPS)":
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(600, 300);
        modal.querySelector('#modelo3d').appendChild(renderer.domElement);
        //camera.fov = 45; // Ajusta el Field of View si es necesario
        camera.updateProjectionMatrix();
        ambientLight.intensity = 0.5; // Bajar la intensidad si es necesario
        scene.add(ambientLight);
        scene.add(hemiLight);
        renderer.gammaOutput = true;
        renderer.gammaFactor = 2.2;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        loader.load('img/server_cpu.glb', function (gltf) {
          scene.add(gltf.scene);
          const cameraExportada = gltf.cameras[0];
          if (cameraExportada) {
            // Puedes usar la cámara exportada directamente o copiar sus propiedades a tu cámara
            camera.position.copy(cameraExportada.position);
            camera.rotation.copy(cameraExportada.rotation);
            // Si la cámara tiene propiedades como FOV que quieres copiar, puedes hacerlo aquí
            camera.fov = cameraExportada.fov;
            camera.updateProjectionMatrix();
          }
          //adjustCameraForModel('Área de Soporte IT', gltf.scene);
        });
        break;
      case "Área de Soporte IT":
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(600, 300);
        modal.querySelector('#modelo3d').appendChild(renderer.domElement);
        //camera.fov = 45; // Ajusta el Field of View si es necesario
        camera.updateProjectionMatrix();
        ambientLight.intensity = 0.5; // Bajar la intensidad si es necesario
        scene.add(ambientLight);
        scene.add(hemiLight);
        renderer.gammaOutput = true;
        renderer.gammaFactor = 2.2;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        loader.load('img/Monitor.glb', function (gltf) {
          scene.add(gltf.scene);
          const cameraExportada = gltf.cameras[0];
          if (cameraExportada) {
            // Puedes usar la cámara exportada directamente o copiar sus propiedades a tu cámara
            camera.position.copy(cameraExportada.position);
            camera.rotation.copy(cameraExportada.rotation);
            // Si la cámara tiene propiedades como FOV que quieres copiar, puedes hacerlo aquí
            camera.fov = cameraExportada.fov;
            camera.updateProjectionMatrix();
          }
          //adjustCameraForModel('Área de Soporte IT', gltf.scene);
        });
        break;
      case "Sistema de Pantallas de Reunión":
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(600, 300);
        modal.querySelector('#modelo3d').appendChild(renderer.domElement);
        camera.fov = 45; // Ajusta el Field of View si es necesario
        ambientLight.intensity = 0.5; // Bajar la intensidad si es necesario
        scene.add(ambientLight);
        scene.add(hemiLight);
        renderer.gammaOutput = true;
        renderer.gammaFactor = 2.2;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        loader.load('img/Television.glb', function (gltf) {
          scene.add(gltf.scene);
          const cameraExportada = gltf.cameras[0];
          if (cameraExportada) {
            // Puedes usar la cámara exportada directamente o copiar sus propiedades a tu cámara
            camera.position.copy(cameraExportada.position);
            camera.rotation.copy(cameraExportada.rotation);
            // Si la cámara tiene propiedades como FOV que quieres copiar, puedes hacerlo aquí
            camera.fov = cameraExportada.fov;
            camera.updateProjectionMatrix();
          }
          //adjustCameraForModel('Sistema de Pantallas de Reunión', gltf.scene);
        });
        break;
      case "Mesa del Área de Descanso":
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(600, 300);
        modal.querySelector('#modelo3d').appendChild(renderer.domElement);
        //camera.fov = 45; // Ajusta el Field of View si es necesario
        camera.updateProjectionMatrix();
        ambientLight.intensity = 0.5; // Bajar la intensidad si es necesario
        scene.add(ambientLight);
        scene.add(hemiLight);
        renderer.gammaOutput = true;
        renderer.gammaFactor = 2.2;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        loader.load('img/Table.glb', function (gltf) {
          scene.add(gltf.scene);
          const cameraExportada = gltf.cameras[0];
          if (cameraExportada) {
            // Puedes usar la cámara exportada directamente o copiar sus propiedades a tu cámara
            camera.position.copy(cameraExportada.position);
            camera.rotation.copy(cameraExportada.rotation);
            // Si la cámara tiene propiedades como FOV que quieres copiar, puedes hacerlo aquí
            camera.fov = cameraExportada.fov;
            camera.updateProjectionMatrix();
          }
          //adjustCameraForModel('Área de Soporte IT', gltf.scene);
        });
        break;

      // Otros casos según sea necesario...

      default:
        console.log("Modelo no encontrado para: ", modelName);
        break;
    }
  }

  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controles.update();
  }

  const controles = new THREE.OrbitControls(camera, renderer.domElement);

  var animationFrameId;

  // Función de animación
  function animate() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId); // Cancelar cualquier animación previa
    }
    animationFrameId = requestAnimationFrame(animate);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controles.update();
  }

  function clearModelFromModal() {
    // Detener el bucle de animación
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    // Remover todos los objetos de la escena
    while (scene.children.length > 0) {
      let child = scene.children[0];
      if (child.geometry) {
        child.geometry.dispose(); // Eliminar la geometría del objeto
      }
      if (child.material) {
        if (child.material instanceof Array) { // En caso de que haya múltiples materiales
          child.material.forEach(material => material.dispose());
        } else {
          child.material.dispose(); // Eliminar el material
        }
      }
      scene.remove(child); // Remover el objeto de la escena
    }
  }


  function updateFilters() {
    const brightnessValue = document.getElementById('brightness').value;
    const contrastValue = document.getElementById('contrast').value;
    const saturationValue = document.getElementById('saturation').value;
    const daltonismValue = document.getElementById('colorFilterDropdown').value;

    // Actualizar los filtros del body.
    const filterStyle = `brightness(${brightnessValue}%) contrast(${contrastValue}%) saturate(${saturationValue}%)`;
    document.body.style.filter = filterStyle;

    // Guardar el estado del filtro de daltonismo.
    let daltonismFilter = '';
    switch (daltonismValue) {
      case 'deuteranopia':
        daltonismFilter = 'url(#deuteranopia)';
        break;
      case 'protanopia':
        daltonismFilter = 'url(#protanopia)';
        break;
      case 'tritanopia':
        daltonismFilter = 'url(#tritanopia)';
        break;
      case 'achromatopsia':
        daltonismFilter = 'url(#achromatopsia)';
        break;
      default:
        daltonismFilter = 'none';
    }

    // Si se selecciona un filtro de daltonismo, asegúrate de combinarlo con los otros filtros.
    if (daltonismFilter !== 'none') {
      document.body.style.webkitFilter = filterStyle; // Para compatibilidad con Safari
      document.body.style.filter += daltonismFilter;
    }
  }

  function narrateText(text) {
    if ('speechSynthesis' in window) {
      // Crea una nueva instancia de SpeechSynthesisUtterance.
      var msg = new SpeechSynthesisUtterance();

      // Reemplaza etiquetas HTML por espacios, y <br> por puntos para una mejor narración.
      var cleanText = text.replace(/<[^>]+>/g, '').replace(/<br\s*[\/]?>/gi, ". ");

      // Establece el texto a narrar.
      msg.text = cleanText;

      // Opcional: Configura el idioma y otras propiedades de la voz aquí.
      msg.lang = 'es-ES'; // Ajusta al idioma deseado.

      msg.onend = function () {
        console.log('Narración completada');
      };

      // Habla el texto.
      window.speechSynthesis.speak(msg);
    } else {
      console.log("Tu navegador no soporta la Web Speech API");
    }
  }


  function resetSlidersAndFilters() {
    // Establece el valor de los sliders al valor por defecto.
    document.getElementById('brightness').value = 100;
    document.getElementById('contrast').value = 100;
    document.getElementById('saturation').value = 100;
    document.body.style.filter = '';
    document.body.style.webkitFilter = '';
  }

  // Asegúrate de que esta parte se ejecute cuando el DOM esté completamente cargado.
  document.addEventListener('DOMContentLoaded', function () {
    // Agrega listeners para cada slider.
    document.getElementById('brightness').addEventListener('input', updateFilters);
    document.getElementById('contrast').addEventListener('input', updateFilters);
    document.getElementById('saturation').addEventListener('input', updateFilters);
    document.getElementById('Restablecer').addEventListener('click', resetSlidersAndFilters);

    // También actualiza los filtros cuando se cambia el filtro de daltonismo.
    document.getElementById('colorFilterDropdown').addEventListener('change', updateFilters);

  });

})();
