import React from 'react';
import Provider from 'react-router-redux-saga-model/libs/hash-provider';
import ControllerBindModel from './controller-bind-model';

export default class HashMVC extends React.Component {
  displayName = 'HashMVC';
  render() {
    const { modelRegister, ...others } = this.props;
    return (
      <Provider {...others}>
        <ControllerBindModel
          basename={others.basename}
          hot={others.hot}
          modelRegister={modelRegister}
        />
      </Provider>
    );
  }
}
