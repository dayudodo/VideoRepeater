var React = require('react');
var ReactDOM = require('react-dom');

// var LiItem= React.createClass({
// 	render(){
// 		<li></li>
// 	}
// })

var EnglishList = React.createClass({
	componentDidMount(){
		console.log('did mount');
	},
	shouldComponentUpdate(nextProps, nextState){
		// return false;
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
		return <ul id="english_list" >
		  {this.props.items.map((item)=> {
			  return <li key={ 'start' + item.startTime }  onClick={this.handleClick.bind(null,item)} > { item.english } </li>
		})}</ul>;
	}
});

module.exports = EnglishList;
