import React from 'react';
import { connect } from 'react-redux';

@connect(state => {
  return {
    display: state.index,
  };
})
export default class IndexView extends React.Component {
  showToggleEvent = e => {
    const { dispatch, display } = this.props;
    if (display) {
      dispatch({
        type: 'index/toggleShow',
        payload: false,
      });
    } else {
      dispatch({
        type: 'index/toggleShow',
        payload: true,
      });
    }
  };
  render() {
    const { display } = this.props;
    return (
      <div>
        <button onClick={this.showToggleEvent}>
          {display && '隐藏'}
          {!display && '显示'}
        </button>
        {display && <div>我被显示了</div>}
      </div>
    );
  }
}
