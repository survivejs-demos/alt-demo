import React from 'react';
import connect from 'connect-alt';

const connectAdapter = (Component, state, actions) => {
  return class ConnectAdapter extends React.Component {
    render() {
      return <Component {...Object.assign({}, this.props, actions)} {...this.state} />;
    }
  };
};

export default (state, actions) => {
  if(state) {
    return target => connect(state)(connectAdapter(target, state, actions));
  }

  return target => connectAdapter(target, state, actions);
};
