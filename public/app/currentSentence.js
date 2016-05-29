'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var CurrentSentence = React.createClass({
	//按钮点击就去执行父组件中的方法好了，因为资源都在父组件之中！
	prev_sentence: function () {
		this.props.prev_sentence();
	},
	next_sentence: function () {
		this.props.next_sentence();
	},
	render() {
		return React.createElement(
			'div',
			{ className: 'alert alert-success col-sm-12 col-md-12 col-lg-12' },
			React.createElement(
				'button',
				{ className: 'btn btn-info btn-default', onClick: this.prev_sentence },
				'上'
			),
			React.createElement(
				'div',
				{ className: 'col-md-10 col-lg-10' },
				this.props.current_sentence.english
			),
			React.createElement(
				'button',
				{ className: 'btn btn-info btn-default', onClick: this.next_sentence },
				'下'
			)
		);
	}
});

module.exports = CurrentSentence;