import React from 'react';
import classnames from 'classnames';

export default ({editing, value, onEdit, className, ...props}) => {
  if(editing) {
    return <Edit
      className={className}
      value={value}
      onEdit={onEdit}
      {...props} />;
  }

  return <span className={classnames('value', className)} {...props}>
    {value}
  </span>;
}

const Edit = ({className, value, onEdit = () => {}, ...props}) => {
  const checkEnter = e => e.key === 'Enter' && finishEdit(e);
  const finishEdit = e => onEdit(e.target.value);

  return <input
    type="text"
    className={classnames('edit', className)}
    autoFocus={true}
    defaultValue={value}
    onBlur={finishEdit}
    onKeyPress={checkEnter}
    {...props} />;
}
