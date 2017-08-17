import React from 'react';
import PropTypes from 'prop-types';
import RouteController from 'react-router-controller/libs/RouteController';

/**
 */
export default class ControllerBindModel extends React.Component {
  static propTypes = {
    modelRegister: PropTypes.func.isRequired,
  };
  static contextTypes = {
    sagaStore: PropTypes.object,
  };
  //第一次渲染
  firstRender = true;
  displayName = 'MVC';
  render() {
    const { modelRegister, basename, hot } = this.props;
    if (hot && modelRegister) {
      //热替换需要每次更新运行
      modelRegister(this.context.sagaStore.register);
    } else if (this.firstRender && modelRegister) {
      this.firstRender = false;
      modelRegister(this.context.sagaStore.register);
    }
    return <RouteController basename={basename} hot={hot} />;
  }
}
