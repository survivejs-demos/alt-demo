import React from 'react';
import connect from '../libs/connect';
import Editable from './Editable';
import Note from './Note';
import LaneActions from '../actions/LaneActions';

export default connect(({}), {
  LaneActions
})(
  ({
    notes,
    onNoteClick=() => {}, onEdit=() => {}, onDelete=() => {},
    LaneActions
  }) => {
    return (
      <ul className="notes">{notes.map(({id, editing, task}) =>
        <li key={id}>
          <Note className="note" id={id}
            editing={editing}
            onClick={onNoteClick.bind(null, id)}
            onMove={LaneActions.move}>
            <Editable
              className="editable"
              editing={editing}
              value={task}
              onEdit={onEdit.bind(null, id)} />
            <button
              className="delete"
              onClick={onDelete.bind(null, id)}>x</button>
          </Note>
        </li>
      )}</ul>
    );
  }
);
