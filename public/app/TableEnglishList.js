'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Table = require('material-ui/Table');

var _TextField = require('material-ui/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _Toggle = require('material-ui/Toggle');

var _Toggle2 = _interopRequireDefault(_Toggle);

var _List = require('material-ui/List');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TableEnglishList = _react2.default.createClass({
	displayName: 'TableEnglishList',
	componentDidMount: function componentDidMount() {
		console.log('did mount TableEnglishList');
	},
	handleClick: function handleClick(item) {
		this.props.change_current_sentence(item);
	},
	shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
		// return false;
		// return (this.props.hide != nextProps.hide)
		return this.props.items != nextProps.items || this.props.current_index != nextProps.current_index; //只有当items改变的时候才会re-render! 其它情况的state改变并不会影响到这儿！
	},
	render: function render() {
		var _this = this;

		var ori_this = this;
		console.log("table:", ori_this.props.current_index);
		return _react2.default.createElement(
			'div',
			{ className: 'col-sm-12 col-md-12 col-lg-12 ' },
			_react2.default.createElement(
				_Table.Table,
				{ height: '550px', onCellClick: this.cellClick },
				_react2.default.createElement(
					_Table.TableBody,
					{ displayRowCheckbox: false, preScanRows: false },
					this.props.items.map(function (item, index) {
						return _react2.default.createElement(
							_Table.TableRow,
							{ key: Date.now() + index, onTouchTap: _this.handleClick.bind(null, item),
								selected: Number(ori_this.props.current_index) === Number(index) ? true : false
							},
							_react2.default.createElement(
								_Table.TableRowColumn,
								null,
								item.english
							)
						);
					})
				)
			)
		);
	}
});

module.exports = TableEnglishList;