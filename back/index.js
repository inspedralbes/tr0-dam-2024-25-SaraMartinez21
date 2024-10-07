const express = require('express');
const fs = require('fs'); 
const app = express();
const cors = require('cors');
const { parse } = require('path');
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

app.get('/data/:id', (req, res) => {
    res.json(json.preguntes[req.params.id]);
});

app.post('/data', (req, res) => {
    json.preguntes.push(req.body);
    fs.writeFile('data.json', JSON.stringify(json), (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
    res.json(json.preguntes);
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

app.put('/editarPregunta/:id', (req, res)=>{
    const id = parseInt(req.params.id);
    const index = json.preguntes.findIndex((pregunta) => pregunta.id === id);

    if(index !== -1){
        json.preguntes[index] = req.body;
        fs.writeFile('data.json', JSON.stringify(json), (err) => {
            if (err) {
                console.error(err);
                return;
            }else{
                const {  pregunta, respuesta, imagen } = req.body;
                if (!pregunta || !respuesta || !imagen || respuesta.length < 4 || correcta < 0 || correcta > 3) {
                    res.send('Pregunta no valida');
                }else{
                    res.json(json.preguntes);
                    console.log('Pregunta actualizada');
                }
            }
        });
        res.json(json.preguntes);
    }

})

// app.get('/data', (req, res) => {
//     const process = spawn( 'python', ['./data.json']);
// });


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});