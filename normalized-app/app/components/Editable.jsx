import React from 'react';

export default ({editing, value, onEdit}) => {
  if(editing) {
    return <Edit value={value} onEdit={onEdit} />;
  }

  return <span className="value">{value}</span>;
}

class Edit extends React.Component {
  render() {
    const {value} = this.props;

    return <input type="text" className="edit"
      ref={
        element => element ?
        element.selectionStart = value.length :
        null
      }
      autoFocus={true}
      defaultValue={value}
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
