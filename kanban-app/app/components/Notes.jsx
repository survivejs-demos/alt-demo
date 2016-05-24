import React from 'react';
import connect from '../libs/connect';
import Editable from './Editable';
import Note from './Note';
import LaneActions from '../actions/LaneActions';

export default connect(({}), {laneActions: LaneActions})(
  ({
    notes,
    onValueClick=() => {}, onEdit=() => {}, onDelete=() => {},
    laneActions
  }) => {
    return (
      <ul className="notes">{notes.map(note =>
        <li key={note.id}>
          <Note className="note" id={note.id}
            editing={note.editing} onMove={laneActions.move}>
            <Editable
              className="editable"
              editing={note.editing}
              value={note.task}
              onValueClick={onValueClick.bind(null, note.id)}
              onEdit={onEdit.bind(null, note.id)} />
            <button
              className="delete"
              onClick={onDelete.bind(null, note.id)}>x</button>
          </Note>
        </li>
      )}</ul>
    );
  }
);
