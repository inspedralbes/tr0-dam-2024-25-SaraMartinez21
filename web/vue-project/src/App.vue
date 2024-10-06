<script setup>
import { ref, onMounted } from 'vue';
import { getPreguntas, addPregunta } from './communicationManager.js';

const preguntas = ref([]);
const novaPregunta = ref({ pregunta: '', opcions: [], imatge: '' });
const mostrarFormulario = ref(false);

onMounted(async () => {
  preguntas.value = await getPreguntas();
});

const addNovaPregunta = async () => {
  await addPregunta(novaPregunta.value);
  preguntas.value = await getPreguntas();
  novaPregunta.value = { pregunta: '', opcions: [], imatge: '' };
};

const formulariCrear = () => {
  mostrarFormulario.value = !mostrarFormulario.value;
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
        <input v-model="novaPregunta.opcions" placeholder="Opcions (separadas por comas)" class="input" />
        <input v-model="novaPregunta.imatge" placeholder="Imatge (URL)" class="input" />
        <button type="submit" class="btn-submit">Crear</button>
      </form>

      <ul class="lista-preguntas">
        <li v-for="pregunta in preguntas" :key="pregunta.id" class="pregunta-item">
          <p class="pregunta-text">{{ pregunta.pregunta }}</p>
          <img v-if="pregunta.imatge" :src="pregunta.imatge" alt="Imatge de la pregunta" />
          <ul>
            <li v-for="opcions in pregunta.opcions" :key="opcions.id" class="opcion-item">
              {{ opcions.resposta }}
            </li>
          </ul>
        </li>
      </ul>
    </section>
  </div>
</template>



<style scoped>
/* Estilos generales */
body {
  font-family: 'Helvetica Neue', sans-serif;
  background-color: #f0f4f8;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

/* Header */
header {
  background-color: #34495e;
  padding: 20px 0;
  text-align: center;
  border-bottom: 4px solid #2c3e50;
}

.logo {
  font-size: 26px;
  color: #ecf0f1;
  margin: 0;
  font-weight: 600;
  letter-spacing: 1px;
}

/* Botón para crear preguntas */
.btn-crear {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
  display: block;
  margin: 20px 0;
}

.btn-crear:hover {
  background-color: #c0392b;
  transform: translateY(-3px);
}

/* Formulario */
.form-crear {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  transition: box-shadow 0.3s ease;
}

.form-crear:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #dcdde1;
  font-size: 16px;
  background-color: #f9f9f9;
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
}

.btn-submit:hover {
  background-color: #27ae60;
  transform: translateY(-3px);
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
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.pregunta-item:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.pregunta-text {
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 18px;
  color: #2980b9;
}

.opcion-item {
  margin-left: 20px;
  font-size: 15px;
  color: #7f8c8d;
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
}
</style>

