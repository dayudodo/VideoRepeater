'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

var _Dialog = require('material-ui/Dialog');

var _Dialog2 = _interopRequireDefault(_Dialog);

var _FlatButton = require('material-ui/FlatButton');

var _FlatButton2 = _interopRequireDefault(_FlatButton);

var _RaisedButton = require('material-ui/RaisedButton');

var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

var _IconButton = require('material-ui/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _SelectField = require('material-ui/SelectField');

var _SelectField2 = _interopRequireDefault(_SelectField);

var _MenuItem = require('material-ui/MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _Drawer = require('material-ui/Drawer');

var _Drawer2 = _interopRequireDefault(_Drawer);

var _TextField = require('material-ui/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _DatePicker = require('material-ui/DatePicker');

var _DatePicker2 = _interopRequireDefault(_DatePicker);

var _GridList = require('material-ui/GridList');

var _Subheader = require('material-ui/Subheader');

var _Subheader2 = _interopRequireDefault(_Subheader);

var _starBorder = require('material-ui/svg-icons/toggle/star-border');

var _starBorder2 = _interopRequireDefault(_starBorder);

var _TableEnglishList = require('./TableEnglishList');

var _TableEnglishList2 = _interopRequireDefault(_TableEnglishList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

(0, _reactTapEventPlugin2.default)();

var Timer = require('./timer');
var CurrentSentence = require('./currentSentence');
var EnglishList = require('./EnglishList');

// var {TableEnglishList} = require('./TableEnglishList'); //类的办法似乎需要使用import才能够正常的使用，es6的就按照es6的来。

var fs = require('fs');
var srt = require("srt").fromString;

var hideSubtitle = false;
var srtArray;
var current_media;
var arr_index = new Array(); //用于判断与上一次的索引相同与否

function set_current_media(media_index) {

  // 换片看了，自然media_index也要变，并且还得把变化保存起来。
  if (typeof media_index != "string" && typeof media_index != "number") {
    console.log(media_index);
    throw new Error('media_index should be a number');
  };

  var media_param = G_media.video[media_index];
  var mpObj = media_param.filenames[media_param.filename_index];
  var mpFileName = 'media/' + media_param.name + '/' + mpObj.medianame;
  var srtFileName = 'media/' + media_param.name + '/' + mpObj.srtname;
  var local_path = require('path');
  var local_mpfile = local_path.resolve('.', mpFileName);
  var local_srtfile = local_path.resolve('.', srtFileName);
  // 判断媒体及字幕文件是否存在
  console.log(local_mpfile, local_srtfile);
  if (fs.existsSync(local_mpfile) || fs.existsSync(local_srtfile)) {
    G_player.src = mpFileName;
  } else {
    throw new Error('can\'t find ' + mpFileName + ' or ' + srtFileName);
  }

  if (Number(G_media.media_index) != Number(media_index)) {
    G_media.media_index = media_index;
    fs.writeFile('media.json', JSON.stringify(G_media), function (err) {
      if (err) {
        throw new Error(err);
      } else {
        console.log('media_index change to ' + media_index + ', media: ' + mpFileName);
      }
    });
  }

  // 注意需要加上utf-8, 需要使用Sync同步读取、
  // 不然下面的items获取不到值。
  var data = srt(fs.readFileSync(srtFileName, 'utf-8'));
  for (var index in data) {
    var _data$index$text$spli = data[index].text.split('\n');
    // data[index]["english"]= data[index].text.split('\n')[0]
    // data[index]["chinese"]= data[index].text.split('\n')[1]


    var _data$index$text$spli2 = _slicedToArray(_data$index$text$spli, 2);

    data[index]["english"] = _data$index$text$spli2[0];
    data[index]["chinese"] = _data$index$text$spli2[1];
  }

  srtArray = new Array(); //需要生成个新的字幕数组，不然就总是会把以前的给加上。
  for (var index in data) {
    srtArray = srtArray.concat(data[index]);
  }
  current_media = media_param;
  arr_index = [mpObj.index, mpObj.index];
}

set_current_media(G_media.media_index); //第一次就设置成排名第一的video=>panda1

var SRTApp = _react2.default.createClass({
  displayName: 'SRTApp',

  getInitialState: function getInitialState() {
    var mpfile_index = current_media.filename_index; //每几个媒体文件，电影里面可能会有好几段视频，统一作为数组处理，
    var sentence_index = current_media.filenames[mpfile_index].index; //当前媒体文件中每几个index

    return {
      items: srtArray,
      text: '',
      textFilter: '',
      current_index: sentence_index,
      current_sentence: srtArray[sentence_index],
      prev_search_text: '',
      value: 1,
      open: false,
      subMovieOpen: false,
      repeat_times: 1 };
  },
  onSearchChange: function onSearchChange(e) {
    this.setState({ text: e.target.value });
  },
  getEnglishList: function getEnglishList() {
    return _reactDom2.default.findDOMNode(this.refs.english_list).children;
  },
  handleSearchSubmit: function handleSearchSubmit(e) {
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
    // var item= this.getEnglishList()[index];
    var item = srtArray[index];
    if (item) {
      this.setState({ current_index: index });
      $(_reactDom2.default.findDOMNode(this.refs.english_list)).val(index); //播放的时候就定义到其文字所在位置
      //保存当前index.播放哪个就保存哪个
      current_media.filenames[current_media.filename_index].index = index;
      arr_index.push(index);arr_index.shift();
      console.log(arr_index);
      if (arr_index[0] != arr_index[1]) {
        fs.writeFile('media.json', JSON.stringify(G_media), function (err) {
          if (err) {
            throw new Error(err);
          } else {
            // console.log('ok')
          }
        });
      }
      // item.click();
      this.setState({ current_sentence: item }); //更新当然句子的显示，
      MediaPlayer(item.startTime / 1000, item.endTime / 1000);
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
    this.setState({ current_sentence: item });
    var index = this.state.items.indexOf(item); //一切的数据变化都集中到items中，如此，子组件的数据获取其实就根据state中的数据来！
    this.setState({ current_index: index });
    this.play_sentence(index); //有参数尽量使用参数，而不要使用状态，因为状态是异步的，这个函数执行完之后状态才会发生变化？应该是这样，不然全乱了
  },
  filterChange: function filterChange(e) {
    this.setState({ textFilter: e.target.value });
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
  handleFilter: function handleFilter(e) {
    var _this = this;

    e.preventDefault();
    this.setState({ current_sentence: '' });
    var newArray = srtArray.filter(function (item) {
      return item.english.toLowerCase().includes(_this.state.textFilter.toLowerCase());
    });
    srtArray = newArray;
    // console.log(newArray.slice(2,5))
    this.setState({ items: srtArray });
  },
  handleToggle: function handleToggle() {
    this.setState({ open: !this.state.open });
  },
  handleClose: function handleClose() {
    this.setState({ open: false });
  },
  handleRepeatTimes: function handleRepeatTimes(event, index, value) {
    this.setState({ repeat_times: value });
    // console.log(value)
    G_repeat_times = value; //重复次数成为全局变量，这样，也不需要啥元素来保存值了。
  },
  handleMovie: function handleMovie(video, index) {
    // console.log(video)
    // 改变当前媒体
    set_current_media(index);
    var mpfile_index = current_media.filenames[current_media.filename_index].index;
    this.setState({
      items: srtArray,
      current_index: mpfile_index,
      current_sentence: srtArray[mpfile_index]
    });
    this.handleClose();
  },
  handleSubMovieDialog: function handleSubMovieDialog() {
    console.log("popup a dialog to select sub movie");
    this.setState({ subMovieOpen: true });
  },
  handleSubMovieDialogClose: function handleSubMovieDialogClose() {
    this.setState({ subMovieOpen: false });
  },
  change_filename: function change_filename(filename_index) {
    console.log("filename_index:", filename_index);
  },
  componentDidMount: function componentDidMount() {
    this.play_current();
  },
  render: function render() {
    var _this2 = this;

    var styles = {
      customWidth: { width: 100 },
      hideBtnWidth: { margin: 12 },
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around'
      },
      gridList: {
        width: 500,
        overflowY: 'auto',
        marginBottom: 24
      }
    };
    var subMovieActions = [_react2.default.createElement(_FlatButton2.default, {
      label: 'Ok',
      primary: true,
      keyboardFocused: true,
      onTouchTap: this.handleSubMovieDialogClose
    })];
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
            _react2.default.createElement(
              'label',
              null,
              '重复次数：'
            ),
            _react2.default.createElement(
              _SelectField2.default,
              {
                value: this.state.repeat_times,
                onChange: this.handleRepeatTimes,
                style: styles.customWidth
              },
              _react2.default.createElement(_MenuItem2.default, { value: 1, primaryText: '1' }),
              _react2.default.createElement(_MenuItem2.default, { value: 2, primaryText: '2' }),
              _react2.default.createElement(_MenuItem2.default, { value: 3, primaryText: '3' })
            ),
            _react2.default.createElement(_RaisedButton2.default, { label: this.state.hide ? '显示字幕' : '隐藏字幕', onClick: this.hideOrShowSubtitle, style: styles.hideBtnWidth }),
            _react2.default.createElement(_RaisedButton2.default, {
              label: '设置',
              onTouchTap: this.handleToggle
            }),
            _react2.default.createElement(
              _Drawer2.default,
              {
                docked: false,
                width: 500,
                open: this.state.open,
                onRequestChange: function onRequestChange(open) {
                  return _this2.setState({ open: open });
                }
              },
              _react2.default.createElement(
                'div',
                { style: styles.root },
                _react2.default.createElement(
                  _MenuItem2.default,
                  { onTouchTap: this.handleClose },
                  'Close'
                ),
                _react2.default.createElement(
                  _GridList.GridList,
                  {
                    cellHeight: 200,
                    style: styles.gridList
                  },

                  /* featured用来指示是否需要显示更下一级的各种菜单，以及用来控制是否显示对话框，如果filenames数组只有一个值，默认是不显示对话框的 */
                  G_media.video.map(function (video, index) {
                    return _react2.default.createElement(
                      _GridList.GridTile,
                      {
                        key: index,
                        title: video.description,
                        titlePosition: 'top',
                        titleBackground: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)',
                        cols: video.featured ? 2 : 1,
                        rows: video.featured ? 2 : 1,
                        onTouchTap: video.featured ? _this2.handleSubMovieDialog : _this2.handleMovie.bind(null, video, index),
                        subtitle: video.featured ? _react2.default.createElement(
                          _Dialog2.default,
                          {
                            title: video.description,
                            actions: subMovieActions,
                            modal: false,
                            open: _this2.state.subMovieOpen,
                            onRequestClose: _this2.handleSubMovieDialogClose
                          },
                          video.filenames.map(function (filename, filename_index) {
                            return _react2.default.createElement(_RaisedButton2.default, { key: filename_index,
                              label: filename.name,
                              onClick: _this2.change_filename.bind(null, filename_index),
                              style: styles.hideBtnWidth });
                          })
                        ) : null
                      },
                      _react2.default.createElement('img', { src: './image/' + video.image, alt: video.name })
                    );
                  })
                )
              )
            )
          )
        ),
        _react2.default.createElement(
          'form',
          { onSubmit: this.handleSearchSubmit, id: 'search_form' },
          _react2.default.createElement(
            'label',
            null,
            '搜索：'
          ),
          _react2.default.createElement(_TextField2.default, {
            id: 'text-field-controlled',
            value: this.state.text,
            onChange: this.onSearchChange
          }),
          _react2.default.createElement(
            'button',
            { className: 'btn btn-default' },
            '下'
          )
        ),
        _react2.default.createElement(CurrentSentence, {
          current_sentence: this.state.current_sentence,
          prev_sentence: this.prev_sentence,
          next_sentence: this.next_sentence,
          currentSentenceClick: this.play_current
        }),
        _react2.default.createElement(EnglishList, { items: this.state.items,
          ref: 'english_list',
          change_current_sentence: this.change_current_sentence
        })
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

$(document).ready(function () {
  // $("#english_list").scrollQ(); 
});
// 载入后就开始读当前句子，算是初始化的一部分。
// console.log(srtrendered.state.current_sentence);
// $(function(){
//   srtrendered.play_current();
// })