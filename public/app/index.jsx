'use strict';


import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

// import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';


injectTapEventPlugin();


var Timer = require('./timer'); //一引用就可以在界面中显示出时间段
var CurrentSentence= require('./currentSentence');
var EnglishList = require('./EnglishList');
import TableEnglishList from './TableEnglishList';
// var {TableEnglishList} = require('./TableEnglishList'); //类的办法似乎需要使用import才能够正常的使用，es6的就按照es6的来。

const fs = global.require('fs'); //如果直接使用require，可能使用的是windows.require。
// import fs from 'fs'
var srt = require("srt").fromString;

var srtArray;
var current_media;
var arr_index=new Array(); //索引数组，用于判断与上一次的索引相同与否

function set_current_media(media_index, filename_index){

  // 换片看了，自然media_index也要变，并且还得把变化保存起来。
  if ( (typeof(media_index) != "string") && (typeof(media_index) != "number") ) { 
    console.log(`media_index:${media_index}`);
    throw new Error('media_index should be a number')
  };

  var media_param = G_media.video[media_index]
  //如果有filename_index的参数，就用这个参数，否则就读取media.json中的filename_index
  var which_index = filename_index? filename_index : media_param.filename_index;
  media_param.filename_index= which_index; 
  var mpObj=  media_param.filenames[which_index];

  var mpFileName=`./media/${media_param.name}/${mpObj.medianame}`
  var srtFileName=`./media/${media_param.name}/${mpObj.srtname}`
  var path= require('path')
  // var local_mpfile= path.resolve('.',mpFileName)
  // var local_srtfile = path.resolve('.',srtFileName)
  var local_mpfile= mpFileName
  var local_srtfile = srtFileName
  // 判断媒体及字幕文件是否存在
  console.log(local_mpfile,local_srtfile)
  if (fs.existsSync(local_mpfile) || fs.accessSync(local_srtfile) ){
    G_player.src = mpFileName
  }else{
    throw new Error(`can't find ${local_mpfile} or ${local_srtfile}`);
  }

  if ( Number(G_media.media_index) != Number(media_index) )  {
    G_media.media_index = media_index
    fs.writeFile('media.json', JSON.stringify(G_media,null,"\t") ,(err)=>{
      if (err) {throw new Error(err)}
        else
      {
        console.log(`media_index change to ${media_index}, media: ${mpFileName}`);
      }
    })
  }


  // 注意需要加上utf-8, 需要使用Sync同步读取、
  // 不然下面的items获取不到值。
  var file_content= fs.readFileSync(srtFileName,'utf-8').replace(/\r\n/g,'\n')
  var data = srt(file_content);
  for(var index in data){
    // data[index]["english"]= data[index].text.split('\n')[0]
    // data[index]["chinese"]= data[index].text.split('\n')[1]
    [ data[index]["english"],data[index]["chinese"] ] = data[index].text.split('\n')
  }

  srtArray= new Array(); //需要生成个新的字幕数组，不然就总是会把以前的给加上。
  for(var index in data){
    srtArray= srtArray.concat(data[index]);
  }
  current_media = media_param;
  arr_index = [mpObj.index, mpObj.index];
}

set_current_media( G_media.media_index ) //第一次就设置成排名第一的video=>panda1


var SRTApp= React.createClass({
  getInitialState: function() {
    var mpfile_index = current_media.filename_index //每几个媒体文件，电影里面可能会有好几段视频，统一作为数组处理，
    var sentence_index = current_media.filenames[mpfile_index].index  //当前媒体文件中每几个index

    return {
        items: srtArray
      , text: ''
      , textFilter: ''
      , current_index: sentence_index
      , current_sentence: srtArray[sentence_index]
      , prev_search_text: ''
      , value: 1
      , open:false
      , hideSubtitle:false
      , subMovieOpen: false
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
    // var item= this.getEnglishList()[index];
    var item= srtArray[index];
    if(item){
      this.setState({current_index: index})
      $(ReactDOM.findDOMNode(this.refs.english_list)).val(index) //播放的时候就定义到其文字所在位置
      //保存当前index.播放哪个就保存哪个
      current_media.filenames[current_media.filename_index].index = index;
      arr_index.push(index); arr_index.shift(); 
      // console.log(arr_index)
      if( arr_index[0] != arr_index[1] ){
        fs.writeFile('media.json', JSON.stringify(G_media), (err)=>{
          if (err) {throw new Error(err)}
            else
          {
            // console.log('ok')
          }
        });
      }
      // item.click(); 
      this.setState({current_sentence: item});  //更新当然句子的显示，
      MediaPlayer(item.startTime/1000, item.endTime/1000); 

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
    this.setState({current_sentence: item});  
    var index = this.state.items.indexOf(item); //一切的数据变化都集中到items中，如此，子组件的数据获取其实就根据state中的数据来！
    this.setState({current_index: index});
    this.play_sentence(index); //有参数尽量使用参数，而不要使用状态，因为状态是异步的，这个函数执行完之后状态才会发生变化？应该是这样，不然全乱了
  },
  filterChange:function(e){
    this.setState({textFilter: e.target.value});
  },
  currentSentenceClick:function(e){
    this.play_current();
  },
  hideOrShowSubtitle:function(e){
    e.preventDefault();
    this.setState({hideSubtitle: !this.state.hideSubtitle});
    $(ReactDOM.findDOMNode(this.refs.english_list)).toggleClass('hidden'); 
    //还是jQuery操作来的方便！另外，这样也不需要ID了，因为其实逻辑非常简单
    //不过只把hideSubtitle作为布尔变量来使用有点儿浪费的赶脚
  },
  hideOrShowAll:function(e){
    e.preventDefault()
    this.hideOrShowSubtitle(e)
    this.setState({hideAll: !this.state.hideAll});
    $(ReactDOM.findDOMNode(this.refs.all_display)).toggleClass('hidden'); 
  },
  handleFilter:function(e){
    e.preventDefault();
    this.setState({current_sentence: ''})
    var newArray= srtArray.filter((item)=>{
      return item.english.toLowerCase().includes(this.state.textFilter.toLowerCase());
    });
    srtArray= newArray
    // console.log(newArray.slice(2,5))
    this.setState({items: srtArray});
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
  handleMovie:function(video, index){
    // console.log(video)
    // 改变当前媒体
    set_current_media( index );
    var mpfile_index = current_media.filenames[current_media.filename_index].index
    this.setState({
        items: srtArray 
      , current_index: mpfile_index
      , current_sentence: srtArray[mpfile_index]
    });
    this.handleClose();
  },
  handleSubMovieDialog:function(){
    console.log("popup a dialog to select sub movie");
    this.setState({subMovieOpen:true})
  },
  handleSubMovieDialogClose:function(){
    this.setState({subMovieOpen:false})
  },
  change_filename:function(index, filename_index){
    // console.log("media",G_media.video[index].name);
    // set_current_media(index, filename_index)
    set_current_media( index, filename_index );
    var mpfile_index = current_media.filenames[filename_index].index
    this.setState({
        items: srtArray 
      , current_index: mpfile_index
      , current_sentence: srtArray[mpfile_index]
    });
    this.handleSubMovieDialogClose();
    this.handleClose();
  },
  componentDidMount:function(){
    this.play_current();
  },
  render: function(){
    const styles = {
      customWidth: { width: 100, },
      hideBtnWidth:{ margin: 12, },
      root: {
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
      },
      gridList: {
        width: 500,
        overflowY: 'auto',
        marginBottom: 24,
      },
    };
    const subMovieActions = [
          <FlatButton
            label="Ok"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.handleSubMovieDialogClose}
          />,
        ];
    return (
    <MuiThemeProvider muiTheme={getMuiTheme()}>
      <div comment="just a container to include material-ui elements">
         <RaisedButton label={ this.state.hideAll? '全显示': '躲起来'} onClick={this.hideOrShowAll} style={styles.hideBtnWidth}/>
           <div ref="all_display">
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
                <RaisedButton label={ this.state.hideSubtitle? '显示字幕': '隐藏字幕'} onClick={this.hideOrShowSubtitle} style={styles.hideBtnWidth}/>


                <RaisedButton
                  label="设置"
                  onTouchTap={this.handleToggle}
                />
                <Drawer
                  docked={false}
                  width={500}
                  open={this.state.open}
                  onRequestChange={(open) => this.setState({open})}
                >
                  <div style={styles.root}>
                    <MenuItem onTouchTap={this.handleClose}>Close</MenuItem>
                    <GridList
                      cellHeight={200}
                      style={styles.gridList}
                    >
                      { 
                        /* featured用来指示是否需要显示更下一级的各种菜单，以及用来控制是否显示对话框，如果filenames数组只有一个值，默认是不显示对话框的 */
                        G_media.video.map((video,index) => (
                        <GridTile
                          key={ index }
                          title={ video.description }
                          titlePosition="top"
                          titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                          cols={ video.featured ? 2 : 1 }
                          rows={ video.featured ? 2 : 1 }
                          onTouchTap={ video.featured ? this.handleSubMovieDialog : this.handleMovie.bind(null,video,index) }
                          subtitle=
                            {video.featured? 
                                    <Dialog
                                      title={video.description}
                                      actions={subMovieActions}
                                      modal={false}
                                      open={this.state.subMovieOpen}
                                      onRequestClose={this.handleSubMovieDialogClose}
                                    >
                                      
                                      {video.filenames.map((filename, filename_index)=>(
                                        <RaisedButton key={filename_index}
                                        label={ filename.name }
                                        onClick={this.change_filename.bind(null, index, filename_index)}
                                        style={styles.hideBtnWidth} />
                                        ))}
                                    </Dialog> : null
                            }
                        >
                          <img src={`./image/${ video.image }`} alt={video.name} />
                        </GridTile>
                      )) }
                    </GridList>
                  </div>
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

            
            <CurrentSentence 
              current_sentence={ this.state.current_sentence } 
              prev_sentence={this.prev_sentence} 
              next_sentence={this.next_sentence} 
              currentSentenceClick={this.play_current} 
            />

            
            <EnglishList items={this.state.items} 
                        ref="english_list" 
                        change_current_sentence={ this.change_current_sentence }
                        />
           </div>
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

$(document).ready(function(){  
    // $("#english_list").scrollQ();  
});  
// 载入后就开始读当前句子，算是初始化的一部分。
// console.log(srtrendered.state.current_sentence);
// $(function(){
//   srtrendered.play_current();
// })

