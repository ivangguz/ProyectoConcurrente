class Partido {
    constructor(equipoLocal, equipoVisitante, escudoLocal, escudoVisitante) {
        this.equipoLocal = equipoLocal;
        this.equipoVisitante = equipoVisitante;
        this.escudoLocal = escudoLocal;
        this.escudoVisitante = escudoVisitante;
    }
}

let equiposData = [];

// Fetch para obtener los datos de equipos desde el archivo equipos.json
fetch('/equipos')
  .then((response) => response.json())
  .then((data) => {
    equiposData = data;

    // Generar el calendario de partidos usando el algoritmo Round Robin
    const schedule = generarRoundRobinCalendario(equiposData);
    const scheduleContainer = document.getElementById('jornadas');

    // Iterar sobre cada jornada y crear los elementos HTML correspondientes
    schedule.forEach((round, index) => {
        // Crear el div principal para cada jornada
        const primerDiv = document.createElement('div');
        primerDiv.className = 'text-center contenedor-jornada';

        // Crear el encabezado de la jornada
        const jornadaH3 = document.createElement('h3');
        jornadaH3.className = 'table-header mb-0 bebas-neue-regular';
        jornadaH3.innerHTML = `JORNADA ${index + 1}`;
        primerDiv.appendChild(jornadaH3);

        // Crear la tabla para los partidos
        const tabla = document.createElement('table');
        tabla.className = 'table';
        tabla.style.tableLayout = 'fixed'; // Asegurar un diseño de tabla fijo
        tabla.style.width = '100%'; // Hacer que la tabla ocupe el 100% del ancho

        // Agregar los encabezados de la tabla
        tabla.innerHTML = `<thead>
            <tr class="table-secondary">
                <th class="col-local" scope="col">Local</th>
                <th scope="col"></th>
                <th class="col-visitante" scope="col">Visitante</th>
            </tr>
        </thead>`;
        
        const tbody = document.createElement('tbody');

        // Iterar sobre cada partido de la jornada y crear las filas correspondientes
        round.forEach(match => {
            const row = document.createElement('tr');

            // Celda del equipo local con el logo
            const localCell = document.createElement('td');
            localCell.innerHTML = `${match.equipoLocal} <img src="${match.escudoLocal}" height="30px" width="30px">`;
            localCell.className = 'text-end';
            row.appendChild(localCell);

            // Celda del VS centrada
            const vsCell = document.createElement('td');
            vsCell.className = 'vs-column text-center'; // Añadir clase para estilo
            vsCell.style.justifyContent = 'center'; // Centrar horizontalmente
            vsCell.style.alignItems = 'center'; // Centrar verticalmente
            vsCell.style.height = '50px'; // Altura para centrar
            vsCell.textContent = 'VS';
            row.appendChild(vsCell);

            // Celda del equipo visitante con el logo
            const visitanteCell = document.createElement('td');
            visitanteCell.innerHTML = `<img class="text-start" src="${match.escudoVisitante}" height="30px" width="30px"> ${match.equipoVisitante}`;
            visitanteCell.className = 'text-start';
            row.appendChild(visitanteCell);

            tbody.appendChild(row);
        });

        tabla.appendChild(tbody);
        primerDiv.appendChild(tabla);
        scheduleContainer.appendChild(primerDiv);
    });
  })
  .catch((error) => console.error('Error extrayendo datos:', error));

// Función para generar el calendario de partidos usando el algoritmo Round Robin
function generarRoundRobinCalendario(teams){
    const numEquipos = teams.length;
    const jornadas = (numEquipos - 1) * 2;
    const partidosPorJornada = numEquipos / 2;

    let calendario = [];

    // Crear un array de índices de equipos
    let equipoIndexes = [...Array(numEquipos).keys()];

    // Iterar sobre cada jornada
    for (let jornada = 0; jornada < jornadas; jornada++){
        let partidos = [];

        // Iterar sobre cada partido de la jornada
        for (let partido = 0; partido < partidosPorJornada; partido++){
            let home = equipoIndexes[partido];
            let away = equipoIndexes[numEquipos - 1 - partido];

            // Alternar entre partidos de ida y vuelta
            if (jornada % 2 === 0){
                partidos.push(new Partido(teams[home].nombre, teams[away].nombre, teams[home].escudo, teams[away].escudo));
            }
            else{
                partidos.push(new Partido(teams[away].nombre, teams[home].nombre, teams[away].escudo, teams[home].escudo));
            }
        }

        // Agregar los partidos de la jornada al calendario
        calendario.push(partidos);
        equipoIndexes.splice(1, 0, equipoIndexes.pop());
    }

    return calendario;
}