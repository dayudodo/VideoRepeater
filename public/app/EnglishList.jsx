// var React = require('react');
import React from 'react';
var ReactDOM = require('react-dom');

// 生成li项，单独写出来是为了设置其shouldComponentUpdate优化显示，不然当在搜索框输入文本时会非常卡！
var ListItem= React.createClass({
	shouldComponentUpdate(nextProps, nextState){
		// return this.props.item != nextProps.item
		return false; //有状态的组件其实比下面无状态组件的速度要更快，无状态的话每次都会生成！
	},
	render(){
		return <option onClick={this.props.onClick } title={this.props.item.chinese}>{this.props.item.english}</option>
	}
})
// var ListItem = function(props){
// 	return <li onClick={props.onClick }>{props.item.english}</li>
// }

var EnglishList = React.createClass({
	componentDidMount(){
		console.log('did mount EnglishList');
	},
	shouldComponentUpdate(nextProps, nextState){
		// return false;
		// return (this.props.hide != nextProps.hide) 
		return (this.props.items != nextProps.items)  //只有当items改变的时候才会re-render! 其它情况的state改变并不会影响到这儿！
	},
	handleClick(item){
		// MediaPlayer(item.startTime/1000, item.endTime/1000); //播放放到主控中，以便统一控制
		// ReactDOM.render(
		//   <div>{item.english}</div>, 
		//   document.getElementById('current_sentence')
		// );
		this.props.change_current_sentence(item);
	},
	render() {
		return <select multiple className="form-control col-sm-12 col-md-12 col-lg-12" size="20" id="english_list">
		    {this.props.items.map((item,index)=> (
				<ListItem key={ Date.now() + index }  onClick={this.handleClick.bind(null,item)}  item={item}/>
			))}
		  </select>
	}
});

module.exports = EnglishList;
