// var React = require('react');
import React from 'react';
var ReactDOM = require('react-dom');

var LiItem= React.createClass({
	shouldComponentUpdate(nextProps, nextState){
		// return this.props.item != nextProps.item
		return false; //有状态的组件其实比下面无状态组件的速度要更快，无状态的话每次都会生成！
	},
	render(){
		return <li onClick={this.props.onClick } title="chinese">{this.props.item.english}</li>
	}
})
// var LiItem = function(props){
// 	return <li onClick={props.onClick }>{props.item.english}</li>
// }

var EnglishList = React.createClass({
	componentDidMount(){
		console.log('did mount');
	},
	shouldComponentUpdate(nextProps, nextState){
		// return false;
		// return (this.props.hide != nextProps.hide) 
		return (this.props.items != nextProps.items)  //只有当items改变的时候才会re-render! 其它情况的state改变并不会影响到这儿！
	},
	handleClick(item){
		MediaPlayer(item.startTime/1000, item.endTime/1000);
		// ReactDOM.render(
		//   <div>{item.english}</div>, 
		//   document.getElementById('current_sentence')
		// );
		this.props.change_current_sentence(item);
	},
	render() {
		return <ul >
		  {this.props.items.map((item)=> {
			  return <LiItem key={ item.startTime }  onClick={this.handleClick.bind(null,item)}  item={item}/>
		})}</ul>
	}
});

module.exports = EnglishList;
