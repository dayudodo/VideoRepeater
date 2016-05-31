'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactTapEventPlugin = require('react-tap-event-plugin');

var _reactTapEventPlugin2 = _interopRequireDefault(_reactTapEventPlugin);

var _getMuiTheme = require('material-ui/styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _MuiThemeProvider = require('material-ui/styles/MuiThemeProvider');

var _MuiThemeProvider2 = _interopRequireDefault(_MuiThemeProvider);

var _RaisedButton = require('material-ui/RaisedButton');

var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

var _Dialog = require('material-ui/Dialog');

var _Dialog2 = _interopRequireDefault(_Dialog);

var _colors = require('material-ui/styles/colors');

var _FlatButton = require('material-ui/FlatButton');

var _FlatButton2 = _interopRequireDefault(_FlatButton);

var _SelectField = require('material-ui/SelectField');

var _SelectField2 = _interopRequireDefault(_SelectField);

var _MenuItem = require('material-ui/MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _Drawer = require('material-ui/Drawer');

var _Drawer2 = _interopRequireDefault(_Drawer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _reactTapEventPlugin2.default)();

var Timer = require('./timer');
var CurrentSentence = require('./currentSentence');
var EnglishList = require('./EnglishList');

var fs = require('fs');
var srt = require("srt").fromString;

var hideSubtitle = false;

//初始化视频及字幕文件
var sourceName = 'croods';
var videoFileName = 'media/' + sourceName + '.mp4';
var srtFileName = './subtitle/' + sourceName + '.srt';

var vid = document.getElementById('player');
vid.src = videoFileName;

// 注意需要加上utf-8, 需要使用Sync同步读取、
// 不然下面的items获取不到值。
var data = srt(fs.readFileSync(srtFileName, 'utf-8'));
for (var index in data) {
  data[index]["english"] = data[index].text.split('\n')[0];
  data[index]["chinese"] = data[index].text.split('\n')[1];
  data[index]["id"] = index;
}

// 将数据转化成数组，以供angular的filter使用。
var srtArray = [];
for (var index in data) {
  srtArray = srtArray.concat(data[index]);
}

var SRTApp = _react2.default.createClass({
  displayName: 'SRTApp',

  getInitialState: function getInitialState() {
    return {
      items: srtArray,
      text: '',
      textFilter: '',
      current_index: -1,
      prev_search_text: '',
      current_sentence: new Object(),
      value: 1,
      open: false };
  },
  onChange: function onChange(e) {
    this.setState({ text: e.target.value });
  },
  getEnglishList: function getEnglishList() {
    return _reactDom2.default.findDOMNode(this.refs.english_list).children;
  },
  handleSubmit: function handleSubmit(e) {
    e.preventDefault();
    // console.log(this.state.text);
    var search_text = this.state.text; //state的好处是拥有历史功能？
    var english_list = this.getEnglishList();

    if (search_text && search_text.length != 0) {
      //如果用户新输入内容，那么就从0开始搜索，否则就是查找下一句。
      var start = search_text == this.state.prev_search_text ? this.state.current_index : 0;
      this.setState({ prev_search_text: search_text }); //有没有全局变量的办法？不用设置啥state?仅仅用来存储数据而已？this.props? ==todo

      for (var index = start; index < this.state.items.length; index++) {
        var sentence = this.state.items[index].english.toLowerCase();
        if (sentence.includes(search_text.toLowerCase())) {
          console.log(this.state.current_index + ' :index:' + index);
          if (index == this.state.current_index) {
            continue;
          };
          english_list[index].click(); //或许是react好的地方，因为这个click已经写好了，直接复用。
          this.setState({ current_index: index });

          break;
        } else {
          if (this.state.items.length - 1 == index) {
            console.log('last sentence');
          };
        }
      }
      // alert("last word");
    };
  },
  play_sentence: function play_sentence(index) {
    if (index == NaN) {
      throw 'params index error in play_sentence().';
    };
    var english_list = this.getEnglishList();
    var english = english_list[index];
    if (english) {
      this.setState({ current_index: index });
      english.click();
    }
  },
  play_current: function play_current() {
    this.play_sentence(this.state.current_index);
  },
  prev_sentence: function prev_sentence() {
    this.play_sentence(this.state.current_index - 1);
  },
  next_sentence: function next_sentence() {
    this.play_sentence(this.state.current_index + 1);
  },
  change_current_sentence: function change_current_sentence(item) {
    // console.log(item);
    this.setState({ current_sentence: item });
    var index = this.state.items.indexOf(item); //一切的数据变化都集中到items中，如此，子组件的数据获取其实就根据state中的数据来！
    this.setState({ current_index: index });
  },
  filterChange: function filterChange(e) {
    this.setState({ textFilter: e.target.value });
  },
  handleFilter: function handleFilter(e) {
    var _this = this;

    e.preventDefault();
    this.setState({ current_sentence: '' });
    var newArray = srtArray.filter(function (item) {
      return item.english.toLowerCase().includes(_this.state.textFilter.toLowerCase());
    });
    // console.log(newArray.slice(2))
    this.setState({ items: newArray });
  },
  handleSelect: function handleSelect(event, index, value) {
    this.setState({ value: value });
  },
  handleToggle: function handleToggle() {
    this.setState({ open: !this.state.open });
  },
  handleClose: function handleClose() {
    this.setState({ open: false });
  },
  currentSentenceClick: function currentSentenceClick(e) {
    this.play_current();
  },
  hideOrShowSubtitle: function hideOrShowSubtitle(e) {
    e.preventDefault();
    this.setState({ hide: !this.state.hide });
    $(_reactDom2.default.findDOMNode(this.refs.english_list)).toggleClass('hidden');
    //还是jQuery操作来的方便！另外，这样也不需要ID了，因为其实逻辑非常简单
    //不过只把hide作为布尔变量来使用有点儿浪费的赶脚
  },
  render: function render() {
    var _this2 = this;

    var styles = {
      customWidth: { width: 200 },
      hideBtnWidth: { margin: 12 }
    };
    return _react2.default.createElement(
      _MuiThemeProvider2.default,
      { muiTheme: (0, _getMuiTheme2.default)() },
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'form',
          { 'class': 'form-inline' },
          _react2.default.createElement(
            'div',
            { 'class': 'form-group' },
            _react2.default.createElement(_RaisedButton2.default, { label: this.state.hide ? '显示字幕' : '隐藏字幕', onClick: this.hideOrShowSubtitle, style: styles.hideBtnWidth }),
            _react2.default.createElement(
              _SelectField2.default,
              {
                value: this.state.value,
                onChange: this.handleSelect,
                style: styles.customWidth
              },
              _react2.default.createElement(_MenuItem2.default, { value: 1, primaryText: 'Custom width' }),
              _react2.default.createElement(_MenuItem2.default, { value: 2, primaryText: 'Every Night' }),
              _react2.default.createElement(_MenuItem2.default, { value: 3, primaryText: 'Weeknights' }),
              _react2.default.createElement(_MenuItem2.default, { value: 4, primaryText: 'Weekends' }),
              _react2.default.createElement(_MenuItem2.default, { value: 5, primaryText: 'Weekly' })
            ),
            _react2.default.createElement(_RaisedButton2.default, {
              label: 'Open Drawer',
              onTouchTap: this.handleToggle
            }),
            _react2.default.createElement(
              _Drawer2.default,
              {
                docked: false,
                width: 200,
                open: this.state.open,
                onRequestChange: function onRequestChange(open) {
                  return _this2.setState({ open: open });
                }
              },
              _react2.default.createElement(
                _MenuItem2.default,
                { onTouchTap: this.handleClose },
                'Menu Item'
              ),
              _react2.default.createElement(
                _MenuItem2.default,
                { onTouchTap: this.handleClose },
                'Menu Item 2'
              )
            )
          )
        ),
        _react2.default.createElement(
          'form',
          { onSubmit: this.handleSubmit },
          _react2.default.createElement(
            'label',
            null,
            '搜索：'
          ),
          _react2.default.createElement('input', { onChange: this.onChange, value: this.state.text }),
          _react2.default.createElement(
            'button',
            { className: 'btn btn-default' },
            '下'
          )
        ),
        _react2.default.createElement(
          'form',
          { onSubmit: this.handleFilter },
          _react2.default.createElement(
            'label',
            { title: '过滤后只会显示那些包含过滤词的句子' },
            '过滤：'
          ),
          _react2.default.createElement('input', { onChange: this.filterChange, value: this.state.textFilter })
        ),
        _react2.default.createElement(CurrentSentence, {
          current_sentence: this.state.current_sentence,
          prev_sentence: this.prev_sentence,
          next_sentence: this.next_sentence,
          currentSentenceClick: this.currentSentenceClick }),
        _react2.default.createElement(EnglishList, { items: this.state.items, ref: 'english_list', change_current_sentence: this.change_current_sentence })
      )
    );
  }
});

var srtrendered = _reactDom2.default.render(_react2.default.createElement(SRTApp, null), document.getElementById('srtapp_container'));

//按键控制
$(window).keydown(function (e) {
  var focused = $('input').is(':focus');
  if (!focused) {
    if (e.keyCode == 37) {
      srtrendered.prev_sentence();
    }; //left
    if (e.keyCode == 39) {
      srtrendered.next_sentence();
    }; //right
    if (e.keyCode == 13) {
      srtrendered.play_current();
    };
  } else {
    if (e.keyCode == 114) {
      console.log('help');
    };
  };
});

// $("#hideorshow").click(function(){
//   var el= $("#english_list");
//    if (!hideSubtitle) {
//     $(this).text("显示字幕");
//   }else{
//     $(this).text("隐藏字幕");
//   };
//   $('#english_list').toggleClass('hidden');
//   hideSubtitle = !hideSubtitle;
// })