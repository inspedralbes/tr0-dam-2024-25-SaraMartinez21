const express = require('express');
const fs = require('fs'); 
const app = express();
const cors = require('cors');

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
app.get('/data', (req, res) => {
    res.json(json.preguntes);
});

app.post('/addPreguntas', (req, res) => {
    
    const lastId = json.preguntes.length > 0 ? json.preguntes[json.preguntes.length - 1].id : 0;
    const newPregunta = { id: lastId + 1, ...req.body };

    json.preguntes.push(newPregunta);

    fs.writeFile('data.json', JSON.stringify(json), (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });

    res.json(newPregunta);
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