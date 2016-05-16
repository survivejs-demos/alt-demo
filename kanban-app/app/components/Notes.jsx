import React from 'react';
import connect from '../libs/connect';
import Editable from './Editable.jsx';
import Note from './Note.jsx';
import LaneActions from '../actions/LaneActions';

export default connect(null, {laneActions: LaneActions})(
  ({notes, onValueClick, onEdit, onDelete, laneActions}) => {
    return (
      <ul className="notes">{notes.map(note =>
        <Note className="note" id={note.id} key={note.id}
          editing={note.editing} onMove={laneActions.move}>
          <Editable
            editing={note.editing}
            value={note.task}
            onValueClick={onValueClick.bind(null, note.id)}
            onEdit={onEdit.bind(null, note.id)}
            onDelete={onDelete.bind(null, note.id)} />
        </Note>
      )}</ul>
    );
  }
);