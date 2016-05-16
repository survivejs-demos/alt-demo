import React from 'react';
import connect from 'connect-alt';
import Lanes from './Lanes.jsx';
import LaneActions from '../actions/LaneActions';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragDropContext(HTML5Backend)
@connect('lanes')
export default class App extends React.Component {
  render() {
    const {lanesStore} = this.props;

    return (
      <div>
        <button className="add-lane" onClick={this.addLane}>+</button>
        <Lanes lanes={lanesStore.lanes} />
      </div>
    );
  }
  addLane() {
    LaneActions.create({name: 'New lane'});
  }
}