var React = require('react');
var ReactDOM = require('react-dom');

var UserInputSentence= React.createClass({
	shouldComponentUpdate(nextProps, nextState){
		// return this.props.item != nextProps.item
		return false; //有状态的组件其实比下面无状态组件的速度要更快，无状态的话每次都会生成！
	},
	render(){
		return 
		 <div className="col-md-12 col-lg-12">
		   <input type="text" className="form-control input-lg" placeholder="type your english here..." id="user_input"/>
		 </div>
	}
})

module.exports = UserInputSentence;