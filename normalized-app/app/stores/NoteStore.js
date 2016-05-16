import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions';

class NoteStore {
  constructor() {
    this.bindActions(NoteActions);

    // normalized - {<id>: {note}}
    this.notes = {};

    this.exportPublicMethods({
      getNotesByIds: this.getNotesByIds.bind(this)
    });
  }
  create({id, task, editing}) {
    this.setState({
      notes: Object.assign({}, this.notes, {
        [id]: {
          id,
          editing,
          task
        }
      })
    });
  }
  update(updatedNote) {
    const id = updatedNote.id;

    this.setState({notes: Object.assign({}, this.notes, {
        [id]: Object.assign(
          {}, this.notes[id], updatedNote
        )
      })
    });
  }
  delete(id) {
    const {[id]: omit, ...notes} = this.notes;

    this.setState({notes});
  }
  getNotesByIds(ids) {
    return (ids || []).map(id => this.notes[id]).filter(a => a) || [];
  }
}

export default alt.createStore(NoteStore, 'NoteStore');
