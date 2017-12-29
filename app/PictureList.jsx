var React = require('react');
var ReactDOM = require('react-dom');

/*
 展示句子的图片，加强理解和记忆，如此，复读机也有强大的展图能力了，因为有了句子图片的api
*/
var PictureList = React.createClass({


	render() {
		const { pics_sources }= this.props
		// console.dir(this.props.pics_sources)
		const host = 'http://localhost:3000'
		return  <div className="col-sm-12 col-md-12 col-lg-12 pictures_list">
							{
								pics_sources? 
								pics_sources.map((pic,index)=>{
									return <img src={`${host}/pictures/${pic.pictures[0].filename}`} key={`pic${index}`}/>

								}) : null
							}
						</div>
	},
});

module.exports = PictureList;