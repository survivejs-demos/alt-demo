import alt from '../libs/alt';
import LaneActions from '../actions/LaneActions';
import update from 'react-addons-update';

class LaneStore {
  constructor() {
    this.bindActions(LaneActions);

    // normalized - {<id>: {lane}}
    this.lanes = {};

    this.exportPublicMethods({
      getLanes: this.getLanes.bind(this)
    });
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

    this.setState({
      lanes: Object.assign({}, lanes, {
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

    this.setState({
      lanes: Object.assign({}, lanes, {
        [laneId]: Object.assign({}, lane, {
          notes: lane.notes.filter(note => note !== noteId)
        })
      })
    });
  }
  move({sourceId, targetId}) {
    const lanes = this.getLanes();

    const sourceLane = lanes.filter(lane => lane.notes.includes(sourceId))[0];
    const targetLane = lanes.filter(lane => lane.notes.includes(targetId))[0];

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
  getLanes() {
    return Object.keys(this.lanes).map(id => this.lanes[id]) || [];
  }
}

export default alt.createStore(LaneStore, 'LaneStore');
