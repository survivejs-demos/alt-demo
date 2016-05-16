import alt from '../libs/alt';
import LaneActions from '../actions/LaneActions';
import update from 'react-addons-update';

export default class LaneStore {
  constructor() {
    this.bindActions(LaneActions);

    // normalized - {<id>: {lane}}
    this.lanes = {};
  }
  static getState() {
    return Object.keys(this.state.lanes || {}).map(id => this.state.lanes[id]) || [];
  }
  create({id, notes, editing, name}) {
    this.setState({
      lanes: Object.assign({}, this.lanes, {
        [id]: {
          id,
          editing,
          name,
          notes: notes || []
        }
      })
    });
  }
  update(updatedLane) {
    const id = updatedLane.id;

    this.setState({lanes: Object.assign({}, this.lanes, {
        [id]: Object.assign(
          {}, this.lanes[id], updatedLane
        )
      })
    });
  }
  delete(id) {
    const {[id]: omit, ...lanes} = this.lanes;

    this.setState({lanes});
  }
  attachToLane({laneId, noteId}) {
    const lanes = this.lanes;
    const lane = lanes[laneId];
    const laneContainingNote = this.findLaneContainingNote(noteId);
    let removeNote = {};

    if(laneContainingNote) {
      // Remove possible old reference
      removeNote = {
        [laneContainingNote.id]: Object.assign({}, laneContainingNote, {
          notes: laneContainingNote.notes.filter(note => note !== noteId)
        })
      };
    }

    this.setState({
      lanes: Object.assign({}, lanes, removeNote, {
        // Add a new reference
        [laneId]: Object.assign({}, lane, {
          notes: lane.notes.includes(noteId) ?
            lane.notes :
            lane.notes.concat(noteId)
        })
      })
    })
  }
  detachFromLane({laneId, noteId}) {
    const lanes = this.lanes;
    const lane = lanes[laneId];

    if(!lane) {
      return console.error('detachFromLane - Trying to detach from a non-existent lane');
    }

    this.setState({
      lanes: Object.assign({}, lanes, {
        [laneId]: Object.assign({}, lane, {
          notes: lane.notes.filter(note => note !== noteId)
        })
      })
    });
  }
  move({sourceId, targetId}) {
    const sourceLane = this.findLaneContainingNote(sourceId);
    const targetLane = this.findLaneContainingNote(targetId);

    const sourceNoteIndex = sourceLane.notes.indexOf(sourceId);
    const targetNoteIndex = targetLane.notes.indexOf(targetId);

    if(sourceLane === targetLane) {
      // move at once to avoid complications
      sourceLane.notes = update(sourceLane.notes, {
        $splice: [
          [sourceNoteIndex, 1],
          [targetNoteIndex, 0, sourceId]
        ]
      });
    }
    else {
      // TODO: this could be written in immutable style
      // get rid of the source
      sourceLane.notes.splice(sourceNoteIndex, 1);

      // and move it to target
      targetLane.notes.splice(targetNoteIndex, 0, sourceId);
    }

    // XXX: not cool since we go through mutation here
    this.setState({lanes: this.lanes});
  }
  findLaneContainingNote(id) {
    const lanes = this.getInstance().getState();
    const matches = lanes.filter(lane => lane.notes.includes(id));

    if(matches.length) {
      return matches[0]
    }
  }
}
