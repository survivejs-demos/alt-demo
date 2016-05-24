import React from 'react';

export default class Editable extends React.Component {
  render() {
    const {value, onEdit, onValueClick, editing, ...props} = this.props;

    return (
      <div {...props}>
        {editing ?
          <Edit value={value} onEdit={onEdit} /> :
          <Value value={value} onValueClick={onValueClick} />
        }
      </div>
    );
  }
}

class Edit extends React.Component {
  render() {
    const {value} = this.props;

    return <input type="text"
      ref={
        element => element ?
        element.selectionStart = value.length :
        null
      }
      autoFocus={true}
      defaultValue={value}
      onBlur={this.finishEdit}
      onKeyPress={this.checkEnter} />;
  }
  checkEnter = (e) => {
    if(e.key === 'Enter') {
      this.finishEdit(e);
    }
  }
  finishEdit = (e) => {
    const value = e.target.value;

    if(this.props.onEdit) {
      this.props.onEdit(value);
    }
  }
}

const Value = ({onValueClick = () => {}, value}) => {
  return (
    <div onClick={onValueClick}>
      <span className="value">{value}</span>
    </div>
  );
};
