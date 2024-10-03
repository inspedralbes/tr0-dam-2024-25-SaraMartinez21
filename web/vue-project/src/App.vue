<script setup>
import { ref, onMounted } from 'vue';
import { getPreguntas, addPregunta } from './communicationManager.js';


const preguntas = ref([]);
const novaPregunta = ref({ pregunta: '', opcions: [] , imatge: ''});


onMounted(async () => {
  preguntas.value = await getPreguntas();
});

const addNovaPregunta = async () => {
  await addPregunta(novaPregunta.value);
  preguntas.value = await getPreguntas();
};



// const getPython = async () => {
//   preguntas.value = await getPreguntas();
// };

</script>

<template>
  <header>

  
  </header>
  <h2>Lista de preguntas</h2>
  <button @click="formulariCrear">Crear Pregunta</button>
  <form v-if="novaPregunta" @submit.prevent="addNovaPregunta">
    <input v-model="novaPregunta.pregunta" placeholder="Pregunta" />
    <input v-model="novaPregunta.opcions" placeholder="Opcions" />
    <input v-model="novaPregunta.imatge" placeholder="Imatge" />
    <button type="submit">Crear</button>
  </form>

      <ul>
        <li v-for="pregunta in preguntas" :key="pregunta.id">
          {{ pregunta.pregunta }}
          <ul>
            <li v-for="opcions in pregunta.opcions" :key="opcions.id">
            {{ opcions.resposta }}
          </li>
          </ul>
        </li>
      </ul>
</template>


<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  } 

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
