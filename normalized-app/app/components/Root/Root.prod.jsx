import React from 'react';
import AltContainer from 'alt-container';
import alt from '../../libs/alt';
import storage from '../../libs/storage';
import persist from '../../libs/persist';
import NoteStore from '../../stores/NoteStore';
import LaneStore from '../../stores/LaneStore';

alt.addStore('notes', NoteStore);
alt.addStore('lanes', LaneStore);

persist(alt, storage, 'app');

export default ({children}) =>
  <AltContainer flux={alt}>
    {children}
  </AltContainer>
