
const express = require('express');
const router = express.Router();
const request = require('request-promise-native');

const spotifyURI = 'https://api.spotify.com/v1';

function buildURI (endpoint, id) {
  return `${spotifyURI}/${endpoint}/${id}`;
}

function concatStrings (string) {
  return string.split(' ').join('+');
}

//remove parenthesed info after album name
function removeParens (array) {
  return array.map(item => {
    let filtered = item.name.split(' (');
    item.name = filtered[0];
    return item;
  });
}

//utility function for returning unique albums
function uniq(array) {
  let seen = {};
  let out = [];
  let j = 0;
  for(let i = 0; i < array.length; i++) {
    let item = array[i];
    let name = item.name;
    if(seen[name] !== 1) {
      seen[name] = 1;
      out[j++] = item;
    }
  }
  return out;
}

module.exports = router

  .get('/search', (req, res, next) => {
    
    const query = req.query || 'Ja+Rule';
    query.q = concatStrings(query.q);

    let uri = `${spotifyURI}/search?q=${query.q}&type=${query.type}`;

    request({uri, json: true})
      .then(data => {
        res.send(data);
      })
      .catch(next);
  })

  //get albums by artist
  .get('/artists/:id', (req, res, next) => {
    
    let uri = buildURI('artists', req.params.id);
    uri = `${uri}/albums?market=US`;

    request({uri, json: true})
      .then(data => {
        let parensRemoved = removeParens(data.items);
        let filtered = uniq(parensRemoved);
        data.items = filtered;
        res.send(data);
      })
      .catch(next);
  })

  //get albums with tracks
  .get('/albums/:id', (req, res, next) => {

    let uri = buildURI('albums', req.params.id);
    uri = `${uri}/tracks`;

    request({uri, json: true})
      .then(data => {
        res.send(data);
      })
      .catch(next);

  });
