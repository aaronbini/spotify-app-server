const express = require('express');
const app = express();
const spotify = require('./routes/spotify-routes');
const errorhandler = require('./errorHandler');
const notFound = require('./notFound');
const path = require('path');
const publicPath = path.resolve( __dirname, '../public' );
const indexHtml = path.resolve( __dirname, './index.html' );

const cors = require('./cors')('*');

app.use(express.static(publicPath));
app.use(cors);
app.get('/', (req,res) => res.sendFile(indexHtml));

app.use('/api/spotify', spotify);
app.use(errorhandler);
app.use(notFound);

module.exports = app;
