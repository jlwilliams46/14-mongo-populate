'use strict';

const Album = require('./album');
const mongoose = require('mongoose');
const debug = require('debug')('http:model-track');

const Track = mongoose.Schema({
  'speechiness': {type: Number},
  'key': {type: Number},
  'time_signature': {type: Number},
  'liveness': {type: Number},
  'loudness': {type: Number},
  'duration_ms': {type: Number},
  'danceability': {type: Number},
  'duration': {type: Number},
  'valence': {type: Number},
  'acousticness': {type: Number},
  'spotify_id': {type: String},
  'volume_number': {type: Number},
  'energy': {type: Number},
  'tempo': {type: Number},
  'instrumentalness': {type: Number},
  'mode': {type: Number},
  'number': {type: Number},
  'artist': {type: String, required: true},
  'title': {type: String, required: true},
  'album': {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'album'},
}, { timestamps: true });


Track.pre('save', function(next) {
  Album.findById(this.album)
    .then(album => {
      album.tracks = [...new Set(album.tracks).add(this._id)];

      // let trackIds = new Set(album.tracks)
      // trackIds.add(this._id)
      // album.tracks = [...trackIds]

      album.save();
    })
    .then(next)
    .catch(() => next(new Error('Validation Error. Failed to save Track.')));
});

// TODO: Need to Debug.
Track.post('remove', function(doc, next) {
  Album.findById(doc.album)
    .then(album => {
      album.tracks = album.tracks.filter(a => doc._id.toString() !== a.toString());
      album.save();
    })
    .then(next)
    .catch(next);
});

module.exports = mongoose.model('track', Track);