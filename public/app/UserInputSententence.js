'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var UserInputSentence = React.createClass({
	displayName: 'UserInputSentence',
	shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
		// return this.props.item != nextProps.item
		return false; //有状态的组件其实比下面无状态组件的速度要更快，无状态的话每次都会生成！
	},
	render: function render() {
		return;
		React.createElement(
			'div',
			{ className: 'col-md-12 col-lg-12' },
			React.createElement('input', { type: 'text', className: 'form-control input-lg', placeholder: 'type your english here...', id: 'user_input' })
		);
	}
});

module.exports = UserInputSentence;