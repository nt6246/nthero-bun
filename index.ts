//const app = require('express')()
import express from 'express';
const app = express();
const PORT = process.env.PORT || 8080;

//const params = require('./src/params')
import params from './src/params';

//const proxy = require('./src/proxy')
import proxy from './src/proxy';

app.enable('trust proxy');
app.get('/', params, proxy);
// app.get('/favicon.ico', (req, res) => res.status(204).end());
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
