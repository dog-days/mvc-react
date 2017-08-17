import React from 'react';
import Provider from 'react-router-redux-saga-model/libs/memory-provider';
import ControllerBindModel from './controller-bind-model';

export default class MemoryMVC extends React.Component {
  displayName = 'BrowserMVC';
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
