var React = require('react');
var ReactDOM = require('react-dom');

/*
 当前句子的显示，当用户点击字幕时，会自动改变，已经实现点击时播放功能
*/
var CurrentSentence = React.createClass({
	//按钮点击就去执行父组件中的方法好了，因为资源都在父组件之中！
	// shouldComponentUpdate(nextProps, nextState){
	// 	return this.props.current_sentence != nextProps.current_sentence
	// },
	prev_sentence:function(e){
		e.preventDefault();
		this.props.prev_sentence();
	},
	next_sentence:function(e){
		e.preventDefault();
		this.props.next_sentence();
	},
	handleClick:function(e){
		e.preventDefault();
		this.props.currentSentenceClick();
	},
	render() {
		const {items, current_index, currentSentenceClick} = this.props;
		const current_sentence=items[current_index]
		const english= current_sentence? current_sentence.english: ''
		const isLastSentence = current_index === (Number(items.length)-1)
		const current_sentence_style = "col-md-10 col-lg-10 alert "+ (isLastSentence? 'alert-warning':'alert-success')
		return  <div className="col-sm-12 col-md-12 col-lg-12">
				    <div className={current_sentence_style} onClick={ currentSentenceClick } id="current_sentence">
				      { english }
				    </div>
				    <button className="btn btn-info btn-sm" onClick={ this.prev_sentence } >上句</button>
				    <button className="btn btn-info btn-sm" onClick={ this.next_sentence } >下句</button>
				</div>
	},
});

module.exports = CurrentSentence;