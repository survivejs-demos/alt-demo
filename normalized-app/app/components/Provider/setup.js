import storage from '../../libs/storage';
import persist from '../../libs/persist';
import NoteStore from '../../stores/NoteStore';
import LaneStore from '../../stores/LaneStore';

export default alt => {
  alt.addStore('notes', NoteStore);
  alt.addStore('lanes', LaneStore);

  persist(alt, storage(localStorage), 'normalized-app');
}
