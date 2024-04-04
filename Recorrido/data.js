var APP_DATA = {
  "scenes": [
    {
      "id": "0-sala-de-reuniones-privadas",
      "name": "Sala de reuniones privadas",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 875,
      "initialViewParameters": {
        "yaw": 0.4172121922579457,
        "pitch": 0.23193560411002956,
        "fov": 1.222445190334001
      },
      "linkHotspots": [
        {
          "yaw": -0.8436244076667911,
          "pitch": 0.22918872809822588,
          "rotation": 25.918139392115812,
          "target": "1-zona-de-trabajo-en-equipo"
        },
        {
          "yaw": 1.1502558083769951,
          "pitch": 0.5558574384262656,
          "rotation": 25.918139392115812,
          "target": "8-sistema-de-pantallas-de-reunin"
        },
        {
          "yaw": 1.156398006333017,
          "pitch": -0.026174594193278722,
          "rotation": 10.995574287564278,
          "target": "6-espacio-de-desarrollo-de-software"
        },
        {
          "yaw": -2.5275202181653196,
          "pitch": 0.9225004688931158,
          "rotation": 11.780972450961727,
          "target": "2-estaciones-de-trabajo"
        }
      ],
      "infoHotspots": [
        {
          "yaw": -0.052757506529049536,
          "pitch": -0.17740118162827834,
          "title": "Sala de Reuniones Privadas",
          "text": "Reserve estas salas a través de nuestro sistema interno para discusiones confidenciales o para concentrarse en tareas que requieren más enfoque. Están equipadas con proyectores y pizarras para su uso."
        }
      ]
    },
    {
      "id": "1-zona-de-trabajo-en-equipo",
      "name": "Zona de trabajo en equipo",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 875,
      "initialViewParameters": {
        "yaw": 0.14419340574666784,
        "pitch": 0.4257431631104378,
        "fov": 1.222445190334001
      },
      "linkHotspots": [
        {
          "yaw": 0.14830210205301242,
          "pitch": 0.934082144937733,
          "rotation": 9.42477796076938,
          "target": "0-sala-de-reuniones-privadas"
        }
      ],
      "infoHotspots": [
        {
          "yaw": -2.0937160215436474,
          "pitch": -0.11112091951780734,
          "title": "Zona de Trabajo en Equipo<br>",
          "text": "Este espacio está reservado para el trabajo en equipo. Utilice los monitores disponibles para compartir su pantalla durante las reuniones y colabore con eficiencia gracias a la conectividad mejorada."
        }
      ]
    },
    {
      "id": "2-estaciones-de-trabajo",
      "name": "Estaciones de trabajo",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 875,
      "initialViewParameters": {
        "yaw": -0.05710803394052988,
        "pitch": -0.05213464434944015,
        "fov": 1.222445190334001
      },
      "linkHotspots": [
        {
          "yaw": -0.32038512776942696,
          "pitch": 0.3955286339233801,
          "rotation": 9.42477796076938,
          "target": "6-espacio-de-desarrollo-de-software"
        },
        {
          "yaw": 1.1939431174129105,
          "pitch": 0.2603379434746458,
          "rotation": 1.5707963267948966,
          "target": "0-sala-de-reuniones-privadas"
        }
      ],
      "infoHotspots": [
        {
          "yaw": -0.2549350381938993,
          "pitch": -0.18081053924627,
          "title": "Estaciones de Trabajo",
          "text": "Cada estación de trabajo está equipada con monitores ajustables, sillas \nergonómicas y almacenamiento personal. Recuerde mantener su espacio \nordenado y respetar las áreas de trabajo de sus colegas."
        }
      ]
    },
    {
      "id": "3-departamento-legal",
      "name": "Departamento legal",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 875,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -0.6206471396512363,
          "pitch": 0.32140791054023055,
          "rotation": 5.497787143782138,
          "target": "4-rea-de-descanso"
        },
        {
          "yaw": 0.6864537574267686,
          "pitch": 0.023278669005508235,
          "rotation": 1.5707963267948966,
          "target": "6-espacio-de-desarrollo-de-software"
        }
      ],
      "infoHotspots": [
        {
          "yaw": 1.1442648348906719,
          "pitch": 0.02948406197420894,
          "title": "Departamento legal<br>",
          "text": "Aquí, nuestro equipo legal trabaja en regulaciones, patentes y asuntos corporativos, protegiendo los intereses de la empresa y asegurando el cumplimiento normativo."
        }
      ]
    },
    {
      "id": "4-rea-de-descanso",
      "name": "Área de descanso",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 875,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 2.887663279092882,
          "pitch": 0.5905962964054794,
          "rotation": 0.7853981633974483,
          "target": "3-departamento-legal"
        }
      ],
      "infoHotspots": [
        {
          "yaw": -0.21155770043150213,
          "pitch": -0.140217431508308,
          "title": "Área de Descanso",
          "text": "Utilice esta área para tomar un café y desconectar brevemente del \ntrabajo. Está disponible para todos los empleados y se proporcionan \nmáquinas de café y tés variados."
        },
        {
          "yaw": -0.10282189896051186,
          "pitch": 0.7262688950147673,
          "title": "Mesa del Área de Descanso",
          "text": "Mesa de madera robusta para uso común en la zona de descanso, ideal para\n tomar un café, colaborar con colegas o disfrutar de un breve respiro. \nManténgala limpia y ordenada para el disfrute de todos."
        }
      ]
    },
    {
      "id": "5-rea-de-soporte-it",
      "name": "Área de soporte IT",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 875,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 0.944639862086305,
          "pitch": 0.4585784384395808,
          "rotation": 3.141592653589793,
          "target": "6-espacio-de-desarrollo-de-software"
        }
      ],
      "infoHotspots": [
        {
          "yaw": -0.9273411033140686,
          "pitch": -0.13621135211119295,
          "title": "Área de Soporte IT",
          "text": "Si necesita asistencia técnica, visite nuestra área de soporte IT. El equipo está disponible durante el horario de oficina para ayudar con cualquier problema o consulta tecnológica."
        }
      ]
    },
    {
      "id": "6-espacio-de-desarrollo-de-software",
      "name": "Espacio de desarrollo de software",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 875,
      "initialViewParameters": {
        "yaw": -1.8138396593657102,
        "pitch": 0.6645688604277744,
        "fov": 1.222445190334001
      },
      "linkHotspots": [
        {
          "yaw": 0.0708641190343613,
          "pitch": 0.36868785730438525,
          "rotation": 0,
          "target": "5-rea-de-soporte-it"
        },
        {
          "yaw": -2.574895179134014,
          "pitch": 0.5036962908639815,
          "rotation": 0.7853981633974483,
          "target": "2-estaciones-de-trabajo"
        },
        {
          "yaw": -3.0193982248744256,
          "pitch": 0.5410175232483692,
          "rotation": 17.27875959474387,
          "target": "3-departamento-legal"
        },
        {
          "yaw": -2.7848653993878685,
          "pitch": 0.8349120343242795,
          "rotation": 9.42477796076938,
          "target": "7-rea-de-transicin"
        }
      ],
      "infoHotspots": [
        {
          "yaw": -2.2160849366524182,
          "pitch": 0.09606065324573798,
          "title": "&nbsp;Espacio de Desarrollo de Software",
          "text": "En esta área, nuestros desarrolladores y programadores crean y mantienen las soluciones informáticas que impulsan nuestras operaciones y análisis de datos."
        },
        {
          "yaw": -0.8084139794297229,
          "pitch": 0.1913677449262572,
          "title": "Monitor de Desarrollo",
          "text": "Pantalla dedicada para la revisión de código y monitoreo de proyectos en el área de desarrollo de software, con alta resolución para una clara visualización de detalles.<br>"
        }
      ]
    },
    {
      "id": "7-rea-de-transicin",
      "name": "Área de Transición",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 875,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 0.5725261785854432,
          "pitch": 0.3800219007156045,
          "rotation": 0.7853981633974483,
          "target": "8-sistema-de-pantallas-de-reunin"
        },
        {
          "yaw": -1.0718225727686956,
          "pitch": 0.47358471864511387,
          "rotation": 0,
          "target": "6-espacio-de-desarrollo-de-software"
        }
      ],
      "infoHotspots": [
        {
          "yaw": -0.476092150533006,
          "pitch": -0.0023176242675546632,
          "title": "Area de transición<br>",
          "text": "Este espacio actúa como un pasillo de conexión diseñado para facilitar el flujo libre y la comunicación entre equipos, manteniendo la privacidad y la concentración de cada área."
        }
      ]
    },
    {
      "id": "8-sistema-de-pantallas-de-reunin",
      "name": "Sistema de Pantallas de Reunión",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 875,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -1.8937793616846825,
          "pitch": 0.10295192063412983,
          "rotation": 4.71238898038469,
          "target": "7-rea-de-transicin"
        },
        {
          "yaw": 2.6806138646768094,
          "pitch": 0.30368141062592713,
          "rotation": 1.5707963267948966,
          "target": "0-sala-de-reuniones-privadas"
        }
      ],
      "infoHotspots": [
        {
          "yaw": 3.0360215558977215,
          "pitch": 0.31427178827210156,
          "title": "Unidad de Respaldo de Energía (UPS)",
          "text": "Este dispositivo es una Unidad de Respaldo de Energía, esencial para proteger las computadoras y otros equipos electrónicos. En caso de un corte de energía, proporcionará electricidad temporal para guardar su trabajo y apagar de manera segura su equipo. No desconectar ni ajustar sin autorización del personal de IT."
        },
        {
          "yaw": 0.42845038315339146,
          "pitch": -0.4906303818167519,
          "title": "Sistema de Pantallas de Reunión",
          "text": "Seis pantallas de 35\" configuradas para facilitar presentaciones y videoconferencias en alta definición, con opciones de visualización individual o combinada. Indispensables para la colaboración y la comunicación efectiva en reuniones privadas."
        }
      ]
    }
  ],
  "name": "Project Title",
  "settings": {
    "mouseViewMode": "drag",
    "autorotateEnabled": false,
    "fullscreenButton": true,
    "viewControlButtons": true
  }
};
