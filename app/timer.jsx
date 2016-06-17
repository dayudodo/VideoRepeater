const React = require('react');  
var ReactDOM = require('react-dom');

var Timer = React.createClass({
  getInitialState: function() {
    return {secondsElapsed: 0};
  },
  tick: function() {
    this.setState({secondsElapsed: this.state.secondsElapsed + 1});
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
    return (
      <div>学习时间: { this.state.secondsElapsed }秒</div>
    );
  }
});

ReactDOM.render(<Timer />, document.getElementById('timer'));
