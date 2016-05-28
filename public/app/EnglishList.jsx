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
		MediaPlayer(item.startTime/1000, item.endTime/1000);
		// ReactDOM.render(
		//   <div>{item.english}</div>, 
		//   document.getElementById('current_sentence')
		// );
		this.props.change_current_sentence(item);
	},
	render() {
		return <ul >{this.props.items.map((item)=> {
		  return (
		   <li key={ item.startTime }  onClick={this.handleClick.bind(null,item)} > { item.english } </li>
		  )
		})}</ul>;
	}
});

module.exports = EnglishList;