import React from 'react';

export default ({editing, value, onEdit, onValueClick, ...props}) => (
  <div {...props}>
    {editing ?
      <Edit value={value} onEdit={onEdit} /> :
      <Value value={value} onValueClick={onValueClick} />
    }
  </div>
)

const Value = ({onValueClick = () => {}, value}) => {
  return (
    <div onClick={onValueClick}>
      <span className="value">{value}</span>
    </div>
  );
};

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
