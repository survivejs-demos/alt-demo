import React from 'react';
import {DropTarget} from 'react-dnd';
import connect from '../libs/connect';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';
import ItemTypes from '../constants/itemTypes';
import Notes from './Notes.jsx';
import Editable from './Editable.jsx';

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

@DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
@connect(({notes}) => ({notes}), {
  noteActions: NoteActions,
  laneActions: LaneActions
})
export default class Lane extends React.Component {
  render() {
    const {
      connectDropTarget, lane, notes, laneActions, noteActions, ...props
    } = this.props;

    return connectDropTarget(
      <div {...props}>
        <div className="lane-header" onClick={this.activateLaneEdit}>
          <div className="lane-add-note">
            <button onClick={this.addNote}>+</button>
          </div>
          <Editable className="lane-name" editing={lane.editing}
            value={lane.name} onEdit={this.editName} />
          <div className="lane-delete">
            <button onClick={this.deleteLane}>x</button>
          </div>
        </div>
        <Notes
          notes={getNotesByIds(notes, lane.notes)}
          onValueClick={this.activateNoteEdit}
          onEdit={this.editNote}
          onDelete={this.deleteNote} />
      </div>
    );
  }
  editNote = (id, task) => {
    const {noteActions} = this.props;

    // Don't modify if trying to set an empty value
    if(!task.trim()) {
      noteActions.update({id, editing: false});

      return;
    }

    noteActions.update({id, task, editing: false});
  }
  addNote = (e) => {
    // If note is added, avoid opening lane name edit by stopping
    // event bubbling in this case.
    e.stopPropagation();

    const {laneActions, noteActions} = this.props;
    const laneId = this.props.lane.id;
    const note = noteActions.create({task: 'New task'});

    laneActions.attachToLane({
      noteId: note.id,
      laneId
    });
  }
  deleteNote = (noteId, e) => {
    // Avoid bubbling to edit
    e.stopPropagation();

    const {laneActions, noteActions} = this.props;
    const laneId = this.props.lane.id;

    laneActions.detachFromLane({laneId, noteId});
    noteActions.delete(noteId);
  }
  editName = (name) => {
    const {laneActions} = this.props;
    const laneId = this.props.lane.id;

    // Don't modify if trying to set an empty value
    if(!name.trim()) {
      laneActions.update({id: laneId, editing: false});

      return;
    }

    laneActions.update({id: laneId, name, editing: false});
  }
  deleteLane = (e) => {
    // Avoid bubbling to edit
    e.stopPropagation();

    const {laneActions} = this.props;
    const laneId = this.props.lane.id;

    laneActions.delete(laneId);
  }
  activateLaneEdit = () => {
    const {laneActions} = this.props;
    const laneId = this.props.lane.id;

    laneActions.update({id: laneId, editing: true});
  }
  activateNoteEdit = (id) => {
    const {noteActions} = this.props;

    noteActions.update({id, editing: true});
  }
}

function getNotesByIds(allNotes, ids) {
  // `reduce` is a powerful method that allows us to
  // fold data. You can implement `filter` and `map`
  // through it. Here we are using it to concatenate
  // notes matching to the ids.
  return (ids || []).reduce((notes, id) =>
    // Concatenate possible matching ids to the result
    notes.concat(
      allNotes.filter(note => note.id === id)
    )
  , []);
}