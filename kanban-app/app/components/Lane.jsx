import React from 'react';
import uuid from 'uuid';
import {compose} from 'redux';
import {DropTarget} from 'react-dnd';
import connect from '../libs/connect';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';
import ItemTypes from '../constants/itemTypes';
import Notes from './Notes';
import Editable from './Editable';

const noteTarget = {
  hover(targetProps, monitor) {
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    if(!targetProps.lane.notes.length) {
      LaneActions.attachToLane({
        laneId: targetProps.lane.id,
        noteId: sourceId
      });
    }
  }
};

const Lane = ({
  connectDropTarget, lane, notes, LaneActions, NoteActions, ...props
}) => {
  const editNote = (id, task) => {
    // Don't modify if trying to set an empty value
    if(!task.trim()) {
      NoteActions.update({id, editing: false});

      return;
    }

    NoteActions.update({id, task, editing: false});
  }
  const addNote = e => {
    // If note is added, avoid opening lane name edit by stopping
    // event bubbling in this case.
    e.stopPropagation();

    const noteId = uuid.v4();

    NoteActions.create({
      id: noteId,
      task: 'New task'
    });
    LaneActions.attachToLane({
      laneId: lane.id,
      noteId
    });
  }
  const deleteNote = (noteId, e) => {
    // Avoid bubbling to edit
    e.stopPropagation();

    LaneActions.detachFromLane({
      laneId: lane.id,
      noteId
    });
    NoteActions.delete(noteId);
  }
  const editName = name => {
    // Don't modify if trying to set an empty value
    if(!name.trim()) {
      LaneActions.update({
        id: lane.id,
        editing: false
      });

      return;
    }

    LaneActions.update({
      id: lane.id,
      name,
      editing: false
    });
  }
  const deleteLane = e => {
    // Avoid bubbling to edit
    e.stopPropagation();

    LaneActions.delete(lane.id);
  }
  const activateLaneEdit = () => {
    LaneActions.update({
      id: lane.id,
      editing: true
    });
  }
  const activateNoteEdit = id => {
    NoteActions.update({id, editing: true});
  }

  return connectDropTarget(
    <div {...props}>
      <div className="lane-header" onClick={activateLaneEdit}>
        <div className="lane-add-note">
          <button onClick={addNote}>+</button>
        </div>
        <Editable className="lane-name" editing={lane.editing}
          value={lane.name} onEdit={editName} />
        <div className="lane-delete">
          <button onClick={deleteLane}>x</button>
        </div>
      </div>
      <Notes
        notes={selectNotesByIds(notes, lane.notes)}
        onValueClick={activateNoteEdit}
        onEdit={editNote}
        onDelete={deleteNote} />
    </div>
  );
}

function selectNotesByIds(allNotes, noteIds = []) {
  // `reduce` is a powerful method that allows us to
  // fold data. You can implement `filter` and `map`
  // through it. Here we are using it to concatenate
  // notes matching to the ids.
  return noteIds.reduce((notes, id) =>
    // Concatenate possible matching ids to the result
    notes.concat(
      allNotes.filter(note => note.id === id)
    )
  , []);
}

export default compose(
  DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
    connectDropTarget: connect.dropTarget()
  })),
  connect(({NoteStore}) => ({
    notes: NoteStore.notes
  }), {
    NoteActions,
    LaneActions
  })
)(Lane)
