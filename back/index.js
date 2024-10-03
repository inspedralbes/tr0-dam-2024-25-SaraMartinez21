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

// app.get('/data', (req, res) => {
//     const process = spawn( 'python', ['./data.json']);
// });


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});