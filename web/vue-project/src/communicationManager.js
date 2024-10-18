//let ruta = 'http://tr0.quiz.sarmarbau.dam.inspedralbes.cat:23369';
let ruta = 'http://localhost:3000';
export async function getPreguntas() {
    const response = await fetch(`${ruta}/data`);
    if (!response.ok) {
        throw new Error('Error al obtener las preguntas');
    }   
    const data = await response.json();
    return data;
}

export async function addPregunta(pregunta) {
    const response = await fetch(`${ruta}/addPregunta`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pregunta),
    });
    if (!response.ok) {
        throw new Error('Error al añadir la pregunta');
    }
    const data = await response.json();
    return data;
}

export async function deletePregunta(id) {
    const response = await fetch(`${ruta}/deletePregunta/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Error al borrar la pregunta');
    }
}

export async function updatePregunta(id, pregunta) {
    const response = await fetch(`${ruta}/updatePregunta/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pregunta), // Enviar la pregunta editada en el cuerpo
    });
    if (!response.ok) {
        throw new Error('Error al actualizar la pregunta');
    }
    const data = await response.json();
    return data;
}
