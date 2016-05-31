import React from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';



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
	data[index]["english"]= data[index].text.split('\n')[0]
	data[index]["chinese"]= data[index].text.split('\n')[1]
	data[index]["id"] = index
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
      , hide: false };
  },
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  getEnglishList:function(){
    return ReactDOM.findDOMNode(this.refs.english_list).children;
  },
  handleSubmit: function(e) {
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
    var english_list = this.getEnglishList();
    var english= english_list[index]
    if(english){ 
      this.setState({current_index: index})
      english.click(); }
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
    this.setState({textFilter: e.target.value})
  },
  handleFilter:function(e){
    e.preventDefault();
    var newArray= srtArray.filter((item)=>{
      return item.english.includes(this.state.textFilter);
    });
    // console.log(newArray.slice(2))
    this.setState({items: newArray});
  },
  currentSentenceClick:function(e){
    this.play_current();
  },
  hideOrShowSubtitle:function(e){
    e.preventDefault();
    // this.setState({hide: !this.state.hide});
    $(ReactDOM.findDOMNode(this.refs.english_list)).toggleClass('hidden'); //还是jQuery操作来的方便！另外，这样也不需要ID了，因为其实逻辑非常简单
  },
  render: function(){
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
       <div>
          <form class="form-inline">
            <div class="form-group">
            <button onClick={this.hideOrShowSubtitle} class="btn btn-primary" id="hideorshow" >{ this.state.hide? '显示字幕': '隐藏字幕'}</button>
            </div>
          </form>
          <form onSubmit={this.handleSubmit}>
            <label>搜索：</label>
            <input onChange={this.onChange} value={this.state.text} />
            <button className="btn btn-default">下</button>
          </form>
          <form onSubmit={this.handleFilter}>
            <label title="过滤后只会显示那些包含过滤词的句子">过滤：</label>
            <input onChange={this.filterChange} value={this.state.textFilter} />
          </form>
          <CurrentSentence 
            current_sentence={ this.state.current_sentence } 
            prev_sentence={this.prev_sentence} 
            next_sentence={this.next_sentence} 
            currentSentenceClick={this.currentSentenceClick} />
          <EnglishList items={this.state.items} ref="english_list" change_current_sentence={ this.change_current_sentence } />
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
