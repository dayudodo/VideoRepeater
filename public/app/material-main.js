'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RaisedButton = require('material-ui/RaisedButton');

var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

var _Dialog = require('material-ui/Dialog');

var _Dialog2 = _interopRequireDefault(_Dialog);

var _colors = require('material-ui/styles/colors');

var _FlatButton = require('material-ui/FlatButton');

var _FlatButton2 = _interopRequireDefault(_FlatButton);

var _getMuiTheme = require('material-ui/styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _MuiThemeProvider = require('material-ui/styles/MuiThemeProvider');

var _MuiThemeProvider2 = _interopRequireDefault(_MuiThemeProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * In this file, we create a React component
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * which incorporates components providedby material-ui.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200
  }
};

var muiTheme = (0, _getMuiTheme2.default)({
  palette: {
    accent1Color: _colors.deepOrange500
  }
});

var Main = function (_Component) {
  _inherits(Main, _Component);

  function Main(props, context) {
    _classCallCheck(this, Main);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Main).call(this, props, context));

    _this.handleRequestClose = _this.handleRequestClose.bind(_this);
    _this.handleTouchTap = _this.handleTouchTap.bind(_this);

    _this.state = {
      open: false
    };
    return _this;
  }

  _createClass(Main, [{
    key: 'handleRequestClose',
    value: function handleRequestClose() {
      this.setState({
        open: false
      });
    }
  }, {
    key: 'handleTouchTap',
    value: function handleTouchTap() {
      this.setState({
        open: true
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var standardActions = _react2.default.createElement(_FlatButton2.default, {
        label: 'Ok',
        primary: true,
        onTouchTap: this.handleRequestClose
      });

      return _react2.default.createElement(
        _MuiThemeProvider2.default,
        { muiTheme: muiTheme },
        _react2.default.createElement(
          'div',
          { style: styles.container },
          _react2.default.createElement(
            _Dialog2.default,
            {
              open: this.state.open,
              title: 'Super Secret Password',
              actions: standardActions,
              onRequestClose: this.handleRequestClose
            },
            '1-2-3-4-5'
          ),
          _react2.default.createElement(
            'h1',
            null,
            'Material-UI'
          ),
          _react2.default.createElement(
            'h2',
            null,
            'example project'
          ),
          _react2.default.createElement(_RaisedButton2.default, {
            label: 'Super Secret Password',
            secondary: true,
            onTouchTap: this.handleTouchTap
          })
        )
      );
    }
  }]);

  return Main;
}(_react.Component);

exports.default = Main;