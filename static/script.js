// Función para mostrar los equipos en una tabla
function mostrarEquipos() {
    fetch('/equipos')  // Now fetching from the new server route
        .then((response) => response.json())
        .then(data => {
            const dataOrdenada = ordenarTabla(data); // Ordenar los equipos

            const tabla = document.getElementById('tabla-equipos');
            tabla.innerHTML = ''; // Limpiar la tabla existente

            // Iterar sobre cada equipo y crear las filas correspondientes
            dataOrdenada.forEach((equipo, index) => {
                const fila = document.createElement('tr');

                // Celda para la posición del equipo
                const celdaPosicion = document.createElement('td');
                celdaPosicion.textContent = index + 1;
                fila.appendChild(celdaPosicion);

                // Celda para el escudo del equipo
                const celdaEscudo = document.createElement('td');
                const imagenEscudo = document.createElement('img');
                imagenEscudo.src = equipo.escudo;
                imagenEscudo.alt = `Escudo de ${equipo.nombre}`;
                imagenEscudo.style.width = '50px';
                imagenEscudo.style.height = '50px';
                celdaEscudo.appendChild(imagenEscudo);
                fila.appendChild(celdaEscudo);

                // Celda para el nombre del equipo
                const celdaNombre = document.createElement('td');
                celdaNombre.textContent = equipo.nombre;
                fila.appendChild(celdaNombre);

                // Celda para los partidos jugados
                const celdaPartidosJugados = document.createElement('td');
                celdaPartidosJugados.textContent = equipo.partidos_jugados;
                fila.appendChild(celdaPartidosJugados);

                // Celda para los partidos ganados
                const celdaPartidosGanados = document.createElement('td');
                celdaPartidosGanados.textContent = equipo.partidos_ganados;
                fila.appendChild(celdaPartidosGanados);

                // Celda para los partidos empatados
                const celdaPartidosEmpatados = document.createElement('td');
                celdaPartidosEmpatados.textContent = equipo.partidos_empatados;
                fila.appendChild(celdaPartidosEmpatados);

                // Celda para los partidos perdidos
                const celdaPartidosPerdidos = document.createElement('td');
                celdaPartidosPerdidos.textContent = equipo.partidos_perdidos;
                fila.appendChild(celdaPartidosPerdidos);

                // Celda para los goles a favor
                const celdaGolesFavor = document.createElement('td');
                celdaGolesFavor.textContent = equipo.goles_favor;
                fila.appendChild(celdaGolesFavor);

                // Celda para los goles en contra
                const celdaGolesContra = document.createElement('td');
                celdaGolesContra.textContent = equipo.goles_contra;
                fila.appendChild(celdaGolesContra);

                // Celda para la diferencia de goles
                const celdaDiferenciaGoles = document.createElement('td');
                celdaDiferenciaGoles.textContent = equipo.diferenciaGoles;
                fila.appendChild(celdaDiferenciaGoles);

                // Celda para los puntos del equipo
                const celdaPuntos = document.createElement('td');
                celdaPuntos.textContent = equipo.puntos;
                fila.appendChild(celdaPuntos);

                tabla.appendChild(fila); // Agregar la fila a la tabla
            });

            generarCalendario(dataOrdenada); // Generar el calendario de partidos
        })
        .catch((error) => {
            console.log(error); // Manejar errores
        });
}

// Función para ordenar la tabla de equipos
function ordenarTabla(equipos) {
    return equipos.sort((a, b) => {
        if (b.puntos === a.puntos) {
            return b.diferenciaGoles - a.diferenciaGoles;
        }
        return b.puntos - a.puntos;
    });
}

// Llamar a la función mostrarEquipos cuando la página se cargue
window.onload = mostrarEquipos;
