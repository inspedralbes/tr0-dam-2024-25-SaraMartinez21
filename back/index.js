const express = require('express');
const fs = require('fs'); 
const app = express();
const cors = require('cors');
const { v4: uuidv4, validate } = require('uuid');
//const { uuid } = require('uuidv4');
//const port = 23369;
const port = 3000;

app.use(express.json());
app.use(cors());

let json;
fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    json = JSON.parse(data);
});

let partidas = {};
app.get('/data', (req, res) => {
    res.json(json.preguntes);
});


app.post('/addPreguntas', (req, res) => {
    const lastId = json.preguntes.length > 0 ? json.preguntes[json.preguntes.length - 1].id : 0;
    const newPregunta = { id: lastId + 1,uid ,...req.body };

    json.preguntes.push(newPregunta);

    fs.writeFile('data.json', JSON.stringify(json), (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });

    res.json(newPregunta);
});


app.post('/preguntesPartida', (req, res) => {
    const uid = req.body.uid;
    const preguntes = json.preguntes;
    const partida = {
        uid: "",
        preguntes: [],
    };

    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * preguntes.length);
        partida.preguntes.push(preguntes[randomIndex]);
    }

    partida.uid = uuidv4(); // Generar un UID único
    partidas[partida.uid] = JSON.parse(JSON.stringify(partida));
    console.log(partidas);
    res.send(partida);
});

app.post('/submitRespuestas', (req, res) => {
    const { token, respuestas } = req.body;

    // Validación de los datos recibidos
    if (!token || !Array.isArray(respuestas)) {
        return res.status(400).send('Faltan datos o datos incorrectos');
    }

    // Buscar la partida correspondiente al token
    const partida = partidas[token];
    if (!partida) {
        return res.status(404).send('Token no válido');
    }

    // Procesar las respuestas
    let correctas = 0;
    for (let i = 0; i < respuestas.length; i++) {
        const pregunta = partida.preguntes[i];
        if (pregunta.respostes[pregunta.resposta_correcta] === respuestas[i]) {
            correctas++;
        }
    }

    // Enviar el resultado al cliente
    res.status(200).json({ correctas });
});


app.delete('/deletePregunta/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = json.preguntes.findIndex((pregunta) => pregunta.id === id);
    if (index !== -1) {
        json.preguntes.splice(index, 1);
        fs.writeFile('data.json', JSON.stringify(json), (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
        res.json(json.preguntes);
    }else {
        res.status(404).send('Pregunta no encontrada'); 
    }
})

app.put('/updatePregunta/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = json.preguntes.findIndex((pregunta) => pregunta.id === id);
    if (index !== -1) {
        json.preguntes[index] = { ...json.preguntes[index], ...req.body };
        fs.writeFile('data.json', JSON.stringify(json), (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
        res.json(json.preguntes[index]);
    } else {
        res.status(404).send('Pregunta no encontrada');
    }
});

// app.get('/data', (req, res) => {
//     const process = spawn( 'python', ['./data.json']);
// });


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});