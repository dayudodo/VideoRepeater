var React = require('react');
var ReactDOM = require('react-dom');

var EnglishList = React.createClass({
	componentDidMount(){
		console.log('did mount');
	},
	shouldComponentUpdate(){
		return false;
	},
	handleClick(item){
		// console.log(event);
		// var start=parseInt(event.target.start);
		// var end=parseInt(event.target.end);
		// console.log(`${item.startTime}`);
		MediaPlayer(item.startTime/1000, item.endTime/1000);
		ReactDOM.render(
		  <div>{item.english}</div>, 
		  document.getElementById('current_sentence')
		);
	},
	render() {
		// var self= this;
		var createItem = (item)=> {
		  return (
		   <li key={ item.startTime }  onClick={this.handleClick.bind(null,item)} >
		    { item.english } 
		   </li>
		  )
		};
		return <ul >{this.props.items.map(createItem)}</ul>;
	}
});

module.exports = EnglishList;