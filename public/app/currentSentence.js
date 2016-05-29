'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var CurrentSentence = React.createClass({
	//按钮点击就去执行父组件中的方法好了，因为资源都在父组件之中！
	prev_sentence: function (e) {
		e.preventDefault();
		this.props.prev_sentence();
	},
	next_sentence: function (e) {
		e.preventDefault();
		this.props.next_sentence();
	},
	handleClick: function (e) {
		e.preventDefault();
		this.props.currentSentenceClick();
	},
	render() {
		return React.createElement(
			'div',
			{ className: 'col-sm-12 col-md-12 col-lg-12' },
			React.createElement(
				'div',
				{ className: 'alert alert-success col-md-10 col-lg-10', onClick: this.props.currentSentenceClick, id: 'current_sentence' },
				this.props.current_sentence.english
			),
			React.createElement(
				'button',
				{ className: 'btn btn-info btn-sm', onClick: this.prev_sentence },
				'上句'
			),
			React.createElement(
				'button',
				{ className: 'btn btn-info btn-sm', onClick: this.next_sentence },
				'下句'
			)
		);
	}
});

module.exports = CurrentSentence;