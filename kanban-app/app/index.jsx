import React from 'react';
import ReactDOM from 'react-dom';
import AltContainer from 'alt-container';
import App from './components/App.jsx';
import alt from './libs/alt';
import NoteStore from './stores/NoteStore';
import LaneStore from './stores/LaneStore';
import storage from './libs/storage';
import persist from './libs/persist';

alt.addStore('notes', NoteStore);
alt.addStore('lanes', LaneStore);

if(process.env.NODE_ENV !== 'production') {
  React.Perf = require('react-addons-perf');
}

persist(alt, storage, 'app');

ReactDOM.render(
  <AltContainer flux={alt}>
    <App />
  </AltContainer>,
  document.getElementById('app')
);
