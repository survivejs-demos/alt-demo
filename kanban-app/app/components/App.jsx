import React from 'react';
import uuid from 'uuid';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import connect from '../libs/connect';
import Lanes from './Lanes';
import LaneActions from '../actions/LaneActions';

@DragDropContext(HTML5Backend)
@connect(({LaneStore}) => ({lanes: LaneStore.lanes}), {
  LaneActions
})
export default class App extends React.Component {
  render() {
    return (
      <div>
        <button className="add-lane" onClick={this.addLane}>+</button>
        <Lanes lanes={this.props.lanes} />
      </div>
    );
  }
  addLane = () => {
    this.props.LaneActions.create({id: uuid.v4(), name: 'New lane'});
  }
}
