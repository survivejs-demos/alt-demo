import React from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import connect from '../libs/connect';
import Lanes from './Lanes.jsx';
import LaneActions from '../actions/LaneActions';

@DragDropContext(HTML5Backend)
@connect(({lanes}) => ({lanes}))
export default class App extends React.Component {
  render() {
    return (
      <div>
        <button className="add-lane" onClick={this.addLane}>+</button>
        <Lanes lanes={this.props.lanes} />
      </div>
    );
  }
  addLane() {
    LaneActions.create({name: 'New lane'});
  }
}