import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions';

export default class NoteStore {
  constructor() {
    this.bindActions(NoteActions);

    // normalized - {<id>: {note}}
    this.notes = {};
  }
  static getState() {
    return Object.keys(this.state.notes || {}).map(id => this.state.notes[id]) || [];
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
}
