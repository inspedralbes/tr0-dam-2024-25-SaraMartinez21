<script setup>
import { ref, onMounted } from 'vue';
import { getPreguntas, addPregunta, deletePregunta, updatePregunta } from './communicationManager.js';

const preguntas = ref([]);
const novaPregunta = ref({ pregunta: '', opcions: [], imatge: '', resposta_correcta: 0 });
const mostrarFormulario = ref(false);
const formulariEditar = ref(null);

onMounted(async () => {
  preguntas.value = await getPreguntas();
});

const addNovaPregunta = async () => {
  const nuevaPregunta = {
    pregunta: novaPregunta.value.pregunta,
    resposta: novaPregunta.value.resposta.split(',').map((opcio) => opcio.trim()),
    imatge: novaPregunta.value.imatge,
    resposta_correcta: novaPregunta.value.resposta_correcta,
  };
  await addPregunta(nuevaPregunta);
  preguntas.value = await getPreguntas();
  novaPregunta.value = { pregunta: '', opcions: [], imatge: '', resposta_correcta: 0 };
};

const formulariCrear = () => {
  mostrarFormulario.value = !mostrarFormulario.value;
};

const eliminarPregunta = async (id) => {
  await deletePregunta(id);
  preguntas.value = await getPreguntas();
};

const habilitarFormulariEditar = (pregunta) => {
  formulariEditar.value = { ...pregunta };
};

const guardarPreguntaEditada = async () => {
  const editadaPregunta = {
    id: formulariEditar.value.id, // Incluir el id
    pregunta: formulariEditar.value.pregunta,
    respostes: formulariEditar.value.resposta.split(',').map((opcio) => opcio.trim()), // Cambio de "resposta" a "respostes"
    imatge: formulariEditar.value.imatge,
    resposta_correcta: formulariEditar.value.resposta_correcta,
  };
  await updatePregunta(editadaPregunta.id, editadaPregunta);

  preguntas.value = await getPreguntas();
  formulariEditar.value = null;
};

  const cancelarEdicion = () => {
    formulariEditar.value = null;
  };

</script>

<template>
  <div class="container">

    <section class="preguntas-section">

      <!-- Botón para mostrar/ocultar el formulario -->
      <button @click="formulariCrear" class="btn-crear">
        {{ mostrarFormulario ? 'Ocultar Formulario' : 'Crear Pregunta' }}
      </button>

      <!-- Formulario para crear preguntas -->
      <form v-if="mostrarFormulario" @submit.prevent="addNovaPregunta" class="form-crear">
        <input v-model="novaPregunta.pregunta" placeholder="Pregunta" class="input" />
        <input v-model="novaPregunta.resposta" placeholder="Opcions (separadas por comas)" class="input" />
        <input v-model="novaPregunta.imatge" placeholder="Imatge (URL)" class="input" />
        <input v-model="novaPregunta.resposta_correcta" placeholder="Resposta correcta" class="input" />
        <button type="submit" class="btn-submit">Crear</button>
      </form>

      <ul class="lista-preguntas">
        <li v-for="pregunta in preguntas" :key="pregunta.id" class="pregunta-item">

          <div v-if="formulariEditar && formulariEditar.id === pregunta.id">
            <input v-model="formulariEditar.pregunta" placeholder="Pregunta" class="input" />
            <input v-model="formulariEditar.resposta" placeholder="Opcions (separadas por comas)" class="input" />
            <input v-model="formulariEditar.imatge" placeholder="Imatge (URL)" class="input" />
            <input v-model="formulariEditar.resposta_correcta" placeholder="Resposta correcta" class="input" />
            <button @click="guardarPreguntaEditada" class="btn-submit">Guardar</button>
            <button @click="cancelarEdicion" class="btn-eliminar">Cancelar</button>
          </div>

          <div v-else>
            <p class="pregunta-text">{{ pregunta.pregunta }}</p>
            <img v-if="pregunta.imatge" :src="pregunta.imatge" alt="Imatge de la pregunta" />
            <div class="container-respostas">
              <ul>
              <li
                v-for="(resposta, index) in pregunta.respostes"
                :key="index"
                :class="{ 'respuesta_correcta': index === pregunta.resposta_correcta }"
                class="opcion-item"
              >
                {{ resposta }}
              </li>
              <div class="container-buttons">
                <button @click="eliminarPregunta(pregunta.id)" class="btn-eliminar">Eliminar</button>
                <button @click="habilitarFormulariEditar(pregunta)" class="btn-editar">Editar</button>
              </div>
            </ul>
            </div>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>

body {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
}

/* Botón para crear preguntas */
.btn-crear {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 20px 20vw;
  font-size: 16px;
  border-radius: 30px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.5s ease, background-color 0.3s ease;
  margin-bottom: 5%;
  margin-top: 5%;
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
  
}

img {
  width: 100%;
  max-width: 300%; 
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 5%;
}

.container-respostas {
  margin-top: 5%;
}

.container-buttons {
  margin-top: 2%;
}


.btn-crear:hover {
  background-color: #2980b9;
  transform: translateY(-3px);
}

/* Formulario */
.form-crear {
  background-color: #ffffff;
  padding: 6.5%;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  margin-bottom: 3vh;
}

.input {
  width: 100%;
  padding: 12px;
  margin-bottom: 2%;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  background-color: #fafafa;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input:focus {
  border-color: #3498db;
  box-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
}

.btn-submit {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
  display: block;
  margin: 0 auto;
}

/* Lista de preguntas */
.lista-preguntas {
  list-style-type: none;
  padding: 0;
}

.pregunta-item {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.pregunta-item:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.pregunta-text {
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 250%;
  color: #3498db;
}

.opcion-item {
  margin-left: 20px;
  font-size: 150%;
  color: #7f8c8d;
  margin-bottom: 5px;
}

.respuesta_correcta {
  color: #2ecc71;
  font-weight: bold;
}

.btn-eliminar,
.btn-editar {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 16px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-top: 10px;
}

.btn-editar {
  background-color: #f39c12;
  margin-left: 10px;
}

.btn-eliminar:hover {
  background-color: #c0392b;
}

.btn-editar:hover {
  background-color: #d35400;
}

/* Responsivo */
@media (max-width: 600px) {
  .btn-crear, .btn-submit {
    width: 100%;
  }

  .pregunta-item {
    padding: 15px;
  }

  .form-crear {
    padding: 15px;
  }

  .btn-eliminar,
  .btn-editar {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
