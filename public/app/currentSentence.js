'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

/*
 当前句子的显示，当用户点击字幕时，会自动改变，已经实现点击时播放功能
*/
var CurrentSentence = React.createClass({
	displayName: 'CurrentSentence',

	//按钮点击就去执行父组件中的方法好了，因为资源都在父组件之中！
	// shouldComponentUpdate(nextProps, nextState){
	// 	return this.props.current_sentence != nextProps.current_sentence
	// },
	prev_sentence: function prev_sentence(e) {
		e.preventDefault();
		this.props.prev_sentence();
	},
	next_sentence: function next_sentence(e) {
		e.preventDefault();
		this.props.next_sentence();
	},
	handleClick: function handleClick(e) {
		e.preventDefault();
		this.props.currentSentenceClick();
	},
	render: function render() {
		var english = this.props.current_sentence ? this.props.current_sentence.english : '';
		return React.createElement(
			'div',
			{ className: 'col-sm-12 col-md-12 col-lg-12' },
			React.createElement(
				'div',
				{ className: 'alert alert-success col-md-10 col-lg-10', onClick: this.props.currentSentenceClick, id: 'current_sentence' },
				english
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