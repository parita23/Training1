const express = require('express');
const app = express();
const PORT = 5000;
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/Loginform.html', (req, res) => {
    res.send('Hello World!');
});
app.get('/website.html', (req, res) => {
    res.send('Hello World!');
});
app.get('/gradiantdemo.html', (req, res) => {
    res.send('Hello World!');
});


app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));