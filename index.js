const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

const question = require( './sample-data.json' );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API calls
app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From API server' });
});

app.post('/api/question', (req, res) => {
    console.log(req.body);
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.question}`,
    );
});

app.post('/api/theme', (req, res) => {
    console.log(req.body);
    res.send( question[ req.body.theme.toLowerCase() ] || [] );
});

app.listen(port, () => console.log(`Listening on port ${port}`));
