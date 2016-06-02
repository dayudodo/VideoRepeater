var React = require('react');
var ReactDOM = require('react-dom');

var Current_sentence = React.createClass({
	//按钮点击就去执行父组件中的方法好了，因为资源都在父组件之中！
	prev_sentence:function(){
		this.props.prev_sentence();
	},
	next_sentence:function(){
		this.props.next_sentence();
	},
	render() {
		return   <div className="alert alert-success col-sm-12 col-md-12 col-lg-12" >
				    <button className="btn btn-info btn-default" onClick={ this.prev_sentence } >上</button>
				    <div className="col-md-10 col-lg-10" >{this.props.current_sentence.english}</div>
				    <button className="btn btn-info btn-default" onClick={ this.next_sentence }>下</button>
				  </div>;
	}
});

module.exports = Current_sentence;