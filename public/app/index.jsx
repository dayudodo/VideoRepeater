var React = require('react');
var ReactDOM = require('react-dom');

var Timer = require('./timer');
var Current_sentence= require('./current_sentence');
var EnglishList = require('./EnglishList');

var fs = require('fs');
var srt = require("srt").fromString;


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
      , current_index: 0
      , prev_search_text: ''
      , current_sentence: new Object() };
  },
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    // console.log(this.state.text);
    let search_text = this.state.text; //state的好处是拥有历史功能？
    var english_list = ReactDOM.findDOMNode(this.refs.english_list).children;

    if (search_text && search_text.length!=0) {
      //如果用户新输入内容，那么就从0开始搜索，否则就是查找下一句。
      var start= (search_text == this.state.prev_search_text)? this.state.current_index : 0 
      this.setState({prev_search_text: search_text}); //有没有全局变量的办法？不用设置啥state?仅仅用来存储数据而已？this.props? ==todo

      for(var index = start; index < srtArray.length; index++){
        var sentence = srtArray[index].english.toLowerCase();
        if(sentence.includes(search_text.toLowerCase())){
          console.log(`${this.state.current_index} :index:${index}`);
          if (index == this.state.current_index ) {
            continue;
          };
          english_list[index].click(); //或许是react好的地方，因为这个click已经写好了，直接复用。
          this.setState({current_index: index}); 

          break;
        }else{
          if (srtArray.length-1 == index) {  console.log('last sentence')};
        }
      }
      // alert("last word");
    };

    // this.setState({text:''});
  },
  prev_sentence:function(){
    var english_list = ReactDOM.findDOMNode(this.refs.english_list).children;
    var prev= english_list[this.state.current_index - 1]
    if(prev){ 
      this.setState({current_index: this.state.current_index - 1})
      prev.click(); }
  },
  next_sentence:function(){
    var english_list = ReactDOM.findDOMNode(this.refs.english_list).children;
    var next= english_list[this.state.current_index + 1]
    if(next){ 
      this.setState({current_index: this.state.current_index + 1})
      next.click(); }
  },
  change_current_sentence:function(item){
    // console.log(item);
    this.setState({current_sentence: item});  
  },
  render: function(){
    return (
      <div>
        <h3>字幕</h3>
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.onChange} value={this.state.text} />
          <button className="btn btn-default">下</button>
        </form>
        <Current_sentence current_sentence={ this.state.current_sentence } prev_sentence={this.prev_sentence} next_sentence={this.next_sentence}/>
        <EnglishList items={this.state.items} ref="english_list" change_current_sentence={ this.change_current_sentence }/>
      </div>
    );
  }
});

ReactDOM.render(<SRTApp />, document.getElementById('english_list'));
