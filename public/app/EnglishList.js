'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReactDOM = require('react-dom'); // var React = require('react');


var LiItem = _react2.default.createClass({
	displayName: 'LiItem',
	shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
		// return this.props.item != nextProps.item
		return false; //有状态的组件其实比下面无状态组件的速度要更快，无状态的话每次都会生成！
	},
	render: function render() {
		return _react2.default.createElement(
			'li',
			{ onClick: this.props.onClick, title: 'chinese' },
			this.props.item.english
		);
	}
});
// var LiItem = function(props){
// 	return <li onClick={props.onClick }>{props.item.english}</li>
// }

var EnglishList = _react2.default.createClass({
	displayName: 'EnglishList',
	componentDidMount: function componentDidMount() {
		console.log('did mount');
	},
	shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
		// return false;
		// return (this.props.hide != nextProps.hide)
		return this.props.items != nextProps.items; //只有当items改变的时候才会re-render! 其它情况的state改变并不会影响到这儿！
	},
	handleClick: function handleClick(item) {
		MediaPlayer(item.startTime / 1000, item.endTime / 1000);
		// ReactDOM.render(
		//   <div>{item.english}</div>,
		//   document.getElementById('current_sentence')
		// );
		this.props.change_current_sentence(item);
	},
	render: function render() {
		var _this = this;

		return _react2.default.createElement(
			'ul',
			null,
			this.props.items.map(function (item) {
				return _react2.default.createElement(LiItem, { key: item.startTime, onClick: _this.handleClick.bind(null, item), item: item });
			})
		);
	}
});

module.exports = EnglishList;