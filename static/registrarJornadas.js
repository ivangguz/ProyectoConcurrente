// Definir la clase Partido
class Partido {
    constructor(equipoLocal, equipoVisitante, escudoLocal, escudoVisitante, golesLocal = 0, golesVisitante = 0) {
      this.equipoLocal = equipoLocal;
      this.equipoVisitante = equipoVisitante;
      this.escudoLocal = escudoLocal;
      this.escudoVisitante = escudoVisitante;
      this.golesLocal = golesLocal;
      this.golesVisitante = golesVisitante;
    }
  
    // Métodos para obtener y establecer goles
    getGolesLocal() { 
      return this.golesLocal; 
    }
  
    getGolesVisitante() { 
      return this.golesVisitante; 
    }
    setGolesLocal(goles){ 
      this.golesLocal = goles; 
    }
    setGolesVisitante(goles) { 
      this.golesVisitante = goles; 
    }
  
    // Métodos para obtener resultados
    getResultadoLocal() { 
      return this.golesLocal > this.golesVisitante ? 'Victoria' : this.golesLocal < this.golesVisitante ? 'Derrota' : 'Empate'; 
    }
  
    //Metodo para obtener el resultado del equipo visitante
    getResultadoVisitante() { 
      return this.golesVisitante > this.golesLocal ? 'Victoria' : this.golesVisitante < this.golesLocal ? 'Derrota' : 'Empate'; 
    }
  
    // Métodos para obtener diferencia de goles
    getDiferenciaGolesLocal() { 
      return this.golesLocal - this.golesVisitante; 
    }
    getDiferenciaGolesVisitante() { 
      return this.golesVisitante - this.golesLocal; 
    }
  }
  
  // Función para cargar datos de equipos desde JSON y generar el calendario
  async function cargarDatosEquipos() {
    try {
      const response = await fetch('./equipos.json');
      const equiposData = await response.json();
      const schedule = generarRoundRobinCalendario(equiposData);
      renderizarCalendario(schedule);
    } catch (error) {
      console.error('Error extrayendo datos:', error);
    }
  }
  
  // Función para renderizar el calendario en el DOM
  function renderizarCalendario(schedule) {
    const scheduleContainer = document.getElementById('partidos');
  
    schedule.forEach((jornada, index) => {
      const jornadaDiv = document.createElement('div');
      jornadaDiv.classList.add('jornada');
      jornadaDiv.innerHTML = `<h1 class="fondo-azul letras-amarillas text-center p-3 bebas-neue-regular mb-0 mt-5" style="font-size: 50px;">Jornada ${index + 1}</h1>`;
      const divRow = document.createElement('div');
      divRow.classList.add('d-flex', 'flex-wrap', 'g-5');
      jornadaDiv.appendChild(divRow);
  
      jornada.forEach((partido, partidoIndex) => {
        divRow.innerHTML += crearPartidoHTML(partido, index, partidoIndex);
      });
  
      scheduleContainer.appendChild(jornadaDiv);
    });
  
    agregarListenersGuardar(schedule);
  }
  
  // Función para crear el HTML de cada partido
  function crearPartidoHTML(partido, jornadaIndex, partidoIndex) {
    return `
      <div class="col-md-6">
        <div class="text-center border border-primary mt-3 fondo-blanco mx-auto">
          <h2 class="table-light">Jornada ${jornadaIndex + 1}</h2>
          <div class="d-flex flex-column mx-auto p-3">
            <div class="d-flex justify-content-between">
              <p>Super Liga</p>
              <p>Finalizado</p>
            </div>
            <div class="d-flex justify-content-between">
              <div class="text-center">
                <img src="${partido.escudoLocal}" class="escudo-img" alt="${partido.equipoLocal} Escudo" />
                <div>
                  <p>${partido.equipoLocal}</p>
                </div>
              </div>
              <div class="text-center">
                <form class="d-flex align-items-center flex-column">
                  <h3>Resultado</h3>
                  <div class="d-flex flex-row">
                    <input type="number" name="score_${jornadaIndex + 1}_${partidoIndex}_local" class="form-control mx-2" style="width: 50px;" value="${partido.getGolesLocal()}" />
                    <h2>-</h2>
                    <input type="number" name="score_${jornadaIndex + 1}_${partidoIndex}_visitante" class="form-control mx-2" style="width: 50px;" value="${partido.getGolesVisitante()}" />
                  </div>
                </form>
              </div>
              <div class="text-center">
                <img src="${partido.escudoVisitante}" class="escudo-img" alt="${partido.equipoVisitante} Escudo" />
                <div>
                  <p>${partido.equipoVisitante}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="pb-3">
            <button class="btn btn-warning me-2" data-action="save" data-jornada="${jornadaIndex}" data-partido="${partidoIndex}">Guardar</button>
          </div>
        </div>
      </div>
    `;
  }
  
  // Función para agregar event listeners a los botones de guardar
  function agregarListenersGuardar(schedule) {
    document.querySelectorAll('button[data-action="save"]').forEach(button => {
      button.addEventListener('click', () => guardarResultados(button, schedule));
    });
    restaurarEstadoBotones();
  }
  
  // Función para guardar resultados del partido
  function guardarResultados(button, schedule) {
    const jornadaIndex = button.getAttribute('data-jornada');
    const partidoIndex = button.getAttribute('data-partido');
    const localInput = document.querySelector(`input[name="score_${parseInt(jornadaIndex) + 1}_${partidoIndex}_local"]`);
    const visitanteInput = document.querySelector(`input[name="score_${parseInt(jornadaIndex) + 1}_${partidoIndex}_visitante"]`);
  
    const golesLocal = parseInt(localInput.value);
    const golesVisitante = parseInt(visitanteInput.value);
  
    // Actualizar goles en el partido
    const partido = schedule[jornadaIndex][partidoIndex];
    partido.setGolesLocal(golesLocal);
    partido.setGolesVisitante(golesVisitante);
  
    //Console log para verificar que los goles se guarden correctamente
    console.log(`Goles guardados para Jornada ${parseInt(jornadaIndex) + 1}, Partido ${parseInt(partidoIndex) + 1}: ${golesLocal} - ${golesVisitante}`);
  
    // Desactivar el botón después de presionarlo
    button.disabled = true;
    localStorage.setItem(`button_${jornadaIndex}_${partidoIndex}`, 'disabled');
    localStorage.setItem(`score_${jornadaIndex}_${partidoIndex}_local`, golesLocal);
    localStorage.setItem(`score_${jornadaIndex}_${partidoIndex}_visitante`, golesVisitante);
  
    // Actualizar datos de los equipos
    actualizarDatosEquipos(golesLocal, golesVisitante, partido);
  }
  
  // Función para restaurar el estado de los botones y los inputs desde localStorage
  function restaurarEstadoBotones() {
    document.querySelectorAll('button[data-action="save"]').forEach(button => {
      const jornadaIndex = button.getAttribute('data-jornada');
      const partidoIndex = button.getAttribute('data-partido');
      const estado = localStorage.getItem(`button_${jornadaIndex}_${partidoIndex}`);
      if (estado === 'disabled') {
        button.disabled = true;
      }
  
      const localInput = document.querySelector(`input[name="score_${parseInt(jornadaIndex) + 1}_${partidoIndex}_local"]`);
      const visitanteInput = document.querySelector(`input[name="score_${parseInt(jornadaIndex) + 1}_${partidoIndex}_visitante"]`);
      const golesLocal = localStorage.getItem(`score_${jornadaIndex}_${partidoIndex}_local`);
      const golesVisitante = localStorage.getItem(`score_${jornadaIndex}_${partidoIndex}_visitante`);
  
      if (golesLocal !== null) {
        localInput.value = golesLocal;
      }
      if (golesVisitante !== null) {
        visitanteInput.value = golesVisitante;
      }
    });
  }
  
  // Función para actualizar los datos de los equipos en el archivo JSON
  function actualizarDatosEquipos(golesLocal, golesVisitante, partido) {
    fetch('/equipos')
      .then((response) => response.json())
      .then((equipos) => {
        const equipoLocal = equipos.find(equipo => equipo.nombre === partido.equipoLocal);
        const equipoVisitante = equipos.find(equipo => equipo.nombre === partido.equipoVisitante);
  
        actualizarEquipo(equipoLocal, golesLocal, golesVisitante, partido.getDiferenciaGolesLocal());
        actualizarEquipo(equipoVisitante, golesVisitante, golesLocal, partido.getDiferenciaGolesVisitante());
  
        // Guardar los datos actualizados en el archivo JSON
        fetch('/updateEquipos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(equipos),
        })
        .then(response => response.json())
        .then(data => console.log('Datos guardados:', data))
        .catch(error => console.error('Error al guardar datos:', error));
      })
      .catch(error => console.error('Error extrayendo datos:', error));
  }
  
  // Función para actualizar un equipo con los resultados
  function actualizarEquipo(equipo, golesFavor, golesContra, diferenciaGoles) {
    equipo.goles_favor += golesFavor;
    equipo.goles_contra += golesContra;
    equipo.partidos_jugados += 1;
    equipo.diferenciaGoles += diferenciaGoles;
  
    const resultado = golesFavor > golesContra ? 'Victoria' : golesFavor < golesContra ? 'Derrota' : 'Empate';
    if (resultado === 'Victoria') {
      equipo.partidos_ganados += 1;
      equipo.puntos += 3;
    } else if (resultado === 'Derrota') {
      equipo.partidos_perdidos += 1;
    } else {
      equipo.partidos_empatados += 1;
      equipo.puntos += 1;
    }
  }
  
  // Generar el calendario Round-Robin
  function generarRoundRobinCalendario(teams) {
    const numEquipos = teams.length;
    const jornadas = (numEquipos - 1) * 2;
    const partidosPorJornada = numEquipos / 2;
  
    const calendario = [];
    const equipoIndexes = [...Array(numEquipos).keys()];
  
    for (let jornada = 0; jornada < jornadas; jornada++) {
      const partidos = [];
  
      for (let partido = 0; partido < partidosPorJornada; partido++) {
        const home = equipoIndexes[partido];
        const away = equipoIndexes[numEquipos - 1 - partido];
  
        partidos.push(new Partido(teams[home].nombre, teams[away].nombre, teams[home].escudo, teams[away].escudo));
      }
  
      calendario.push(partidos);
      // Rotar los equipos
      equipoIndexes.splice(1, 0, equipoIndexes.pop());
    }
  
    return calendario;
  }
  
  // Deshabilitar el botón de habilitar botones inicialmente
  document.getElementById('habilitarBotones').disabled = true;
  
  // Función para reiniciar la tabla
  document.getElementById('reiniciarTabla').addEventListener('click', reiniciarTabla);
  function reiniciarTabla() {
      fetch('equipos_original.json')
          .then(response => response.json())
          .then(data => {
              fetch('equipos.json', {
                  method: 'PUT', // Usar PUT para sobrescribir el archivo
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(data)
              })
              .then(response => {
                  if (response.ok) {
                      console.log('Tabla reiniciada correctamente.');
                      // Habilitar el botón de habilitar botones después de reiniciar la tabla
                      document.getElementById('habilitarBotones').disabled = false;
                  } else {
                      console.error('Error al reiniciar la tabla.');
                  }
              })
              .catch(error => console.error('Error:', error));
          })
          .catch(error => console.error('Error al leer equipos_original.json:', error));
  }
  
  // Función para habilitar todos los botones de guardar y resetear inputs
  function habilitarBotones() {
    document.querySelectorAll('button[data-action="save"]').forEach(button => {
      button.disabled = false;
      const jornadaIndex = button.getAttribute('data-jornada');
      const partidoIndex = button.getAttribute('data-partido');
      localStorage.removeItem(`button_${jornadaIndex}_${partidoIndex}`);
      localStorage.removeItem(`score_${jornadaIndex}_${partidoIndex}_local`);
      localStorage.removeItem(`score_${jornadaIndex}_${partidoIndex}_visitante`);
  
      const localInput = document.querySelector(`input[name="score_${parseInt(jornadaIndex) + 1}_${partidoIndex}_local"]`);
      const visitanteInput = document.querySelector(`input[name="score_${parseInt(jornadaIndex) + 1}_${partidoIndex}_visitante"]`);
      localInput.value = 0;
      visitanteInput.value = 0;
    });
  }
  
  // Agregar event listener para habilitar los botones
  document.getElementById('habilitarBotones').addEventListener('click', habilitarBotones);
  
  // Cargar los equipos al iniciar la aplicación
  window.onload = () => {
    cargarDatosEquipos();
    restaurarEstadoBotones();
  };
  