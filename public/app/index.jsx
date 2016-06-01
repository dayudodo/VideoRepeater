import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import TextField from 'material-ui/TextField';

injectTapEventPlugin();


var Timer = require('./timer');
var CurrentSentence= require('./currentSentence');
var EnglishList = require('./EnglishList');

var fs = require('fs');
var srt = require("srt").fromString;

var hideSubtitle = false;

//初始化视频及字幕文件
var sourceName='croods'
var videoFileName=`media/${sourceName}.mp4`
var srtFileName=`./subtitle/${sourceName}.srt`

var vid= document.getElementById('player');
vid.src=videoFileName;

// 注意需要加上utf-8, 需要使用Sync同步读取、
// 不然下面的items获取不到值。
var data = srt(fs.readFileSync(srtFileName,'utf-8'));
for(var index in data){
	// data[index]["english"]= data[index].text.split('\n')[0]
	// data[index]["chinese"]= data[index].text.split('\n')[1]
  [ data[index]["english"],data[index]["chinese"] ] = data[index].text.split('\n')
}

// 将数据转化成数组，以供angular的filter使用。
var srtArray=[];
for(var index in data){
	srtArray= srtArray.concat(data[index]);
}

var SRTApp= React.createClass({
  getInitialState: function() {
    return {
        items: srtArray
      , text: ''
      , textFilter: ''
      , current_index: -1
      , prev_search_text: ''
      , current_sentence: new Object()
      , value: 1
      , open:false
      , repeat_times: 1 };
  },
  onSearchChange: function(e) {
    this.setState({text: e.target.value});
  },
  getEnglishList:function(){
    return ReactDOM.findDOMNode(this.refs.english_list).children;
  },
  handleSearchSubmit: function(e) {
    e.preventDefault();
    // console.log(this.state.text);
    let search_text = this.state.text; //state的好处是拥有历史功能？
    var english_list = this.getEnglishList();

    if (search_text && search_text.length!=0) {
      //如果用户新输入内容，那么就从0开始搜索，否则就是查找下一句。
      var start= (search_text == this.state.prev_search_text)? this.state.current_index : 0 
      this.setState({prev_search_text: search_text}); //有没有全局变量的办法？不用设置啥state?仅仅用来存储数据而已？this.props? ==todo

      for(var index = start; index < this.state.items.length; index++){
        var sentence = this.state.items[index].english.toLowerCase();
        if(sentence.includes(search_text.toLowerCase())){
          console.log(`${this.state.current_index} :index:${index}`);
          if (index == this.state.current_index ) {
            continue;
          };
          english_list[index].click(); //或许是react好的地方，因为这个click已经写好了，直接复用。
          this.setState({current_index: index}); 
          break;
        }else{
          if (this.state.items.length-1 == index) {  console.log('last sentence')};
        }
      }
      // alert("last word");
    };
  },
  play_sentence:function(index){
    if (index==NaN) {throw 'params index error in play_sentence().'};
    var english= this.getEnglishList()[index];
    if(english){ 
      this.setState({current_index: index})
      english.click(); 
    }
  },
  play_current:function(){
    this.play_sentence(this.state.current_index);
  },
  prev_sentence:function(){
    this.play_sentence(this.state.current_index - 1)
  },
  next_sentence:function(){
    this.play_sentence(this.state.current_index + 1)
  },
  change_current_sentence:function(item){
    // console.log(item);
    this.setState({current_sentence: item});  
    var index = this.state.items.indexOf(item); //一切的数据变化都集中到items中，如此，子组件的数据获取其实就根据state中的数据来！
    this.setState({current_index: index});
  },
  filterChange:function(e){
    this.setState({textFilter: e.target.value});
  },
  currentSentenceClick:function(e){
    this.play_current();
  },
  hideOrShowSubtitle:function(e){
    e.preventDefault();
    this.setState({hide: !this.state.hide});
    $(ReactDOM.findDOMNode(this.refs.english_list)).toggleClass('hidden'); 
    //还是jQuery操作来的方便！另外，这样也不需要ID了，因为其实逻辑非常简单
    //不过只把hide作为布尔变量来使用有点儿浪费的赶脚
  },
  handleFilter:function(e){
    e.preventDefault();
    this.setState({current_sentence: ''})
    var newArray= srtArray.filter((item)=>{
      return item.english.toLowerCase().includes(this.state.textFilter.toLowerCase());
    });
    // console.log(newArray.slice(2,5))
    this.setState({items: newArray});
  },
  handleToggle: function(){ 
    this.setState({open: !this.state.open})
  },
  handleClose: function(){
    this.setState({open: false})
  },
  handleRepeatTimes:function(event, index, value){
    this.setState({repeat_times: value})
    // console.log(value)
    G_repeat_times = value; //重复次数成为全局变量，这样，也不需要啥元素来保存值了。
  },
  render: function(){
    const styles = {
      customWidth: { width: 100, },
      hideBtnWidth:{ margin: 12, },
    };
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
       <div>
          <form class="form-inline">
            <div class="form-group">
              <label>重复次数：</label>
              <SelectField
                       value={this.state.repeat_times}
                       onChange={this.handleRepeatTimes}
                       style={styles.customWidth}
                     >
                       <MenuItem value={1} primaryText="1" />
                       <MenuItem value={2} primaryText="2" />
                       <MenuItem value={3} primaryText="3" />
              </SelectField>
              <RaisedButton label={ this.state.hide? '显示字幕': '隐藏字幕'} onClick={this.hideOrShowSubtitle} style={styles.hideBtnWidth}/>

              <RaisedButton
                label="设置"
                onTouchTap={this.handleToggle}
              />
              <Drawer
                docked={false}
                width={200}
                open={this.state.open}
                onRequestChange={(open) => this.setState({open})}
              >
                <MenuItem onTouchTap={this.handleClose}>Close</MenuItem>
                <MenuItem onTouchTap={this.handleClose}>Menu Item 2</MenuItem>
              </Drawer>
            </div>
          </form>
          
            <form onSubmit={this.handleSearchSubmit} id="search_form">
              <label>搜索：</label>
              <TextField
                id="text-field-controlled"
                value={this.state.text}
                onChange={this.onSearchChange}
              />
              <button className="btn btn-default">下</button>
            </form>
            <form onSubmit={this.handleFilter}>
              <label title="过滤后只会显示那些包含过滤词的句子">过滤：</label>
              <TextField
                id="filter-field-controlled"
                value={this.state.textFilter}
                onChange={this.filterChange}
              />
            </form>
          
          <CurrentSentence 
            current_sentence={ this.state.current_sentence } 
            prev_sentence={this.prev_sentence} 
            next_sentence={this.next_sentence} 
            currentSentenceClick={this.currentSentenceClick} />
          <EnglishList items={this.state.items} 
                      ref="english_list" 
                      change_current_sentence={ this.change_current_sentence } 
                      />
        </div>
        </MuiThemeProvider>
    );
  }
});

var srtrendered = ReactDOM.render(<SRTApp />, document.getElementById('srtapp_container'));

//按键控制
$(window).keydown(function(e){
  var focused = $('input').is(':focus');
  if (!focused) {
    if (e.keyCode == 37) { srtrendered.prev_sentence()}; //left
    if (e.keyCode == 39) { srtrendered.next_sentence()}; //right
    if (e.keyCode == 13) { srtrendered.play_current()  };
  }else{
    if (e.keyCode == 114) { console.log('help')};
  };
})

// $('.english_list_class li').tooltip({
//   my: "left top",
//   at: "left top"
// });
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
