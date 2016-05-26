import React from 'react';
import connect from 'connect-alt';

const connectAdapter = (Component, state, actions) => {
  return props => <Component {...Object.assign({}, props, actions)} />
};

export default (state, actions) => {
  if(typeof state === 'function' ||
    (typeof state === 'object') &&
    Object.keys(state).length) {
    return target => connect(state)(connectAdapter(target, state, actions));
  }

  return target => connectAdapter(target, state, actions);
};
