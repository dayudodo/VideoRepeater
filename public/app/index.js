'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Timer = require('./timer');

ReactDOM.render(React.createElement(Timer, null), document.getElementById('app'));