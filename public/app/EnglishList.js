'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var EnglishList = React.createClass({
	componentDidMount() {
		console.log('did mount');
	},
	shouldComponentUpdate(nextProps, nextState) {
		// return false;
		return this.props.items != nextProps.items; //只有当items改变的时候才会re-render!
	},
	handleClick(item) {
		MediaPlayer(item.startTime / 1000, item.endTime / 1000);
		// ReactDOM.render(
		//   <div>{item.english}</div>,
		//   document.getElementById('current_sentence')
		// );
		this.props.change_current_sentence(item);
	},
	render() {
		return React.createElement(
			'ul',
			null,
			this.props.items.map(item => {
				return React.createElement(
					'li',
					{ key: item.startTime, onClick: this.handleClick.bind(null, item) },
					' ',
					item.english,
					' '
				);
			})
		);
	}
});

module.exports = EnglishList;