'use strict'

import React from 'react';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import {List, ListItem} from 'material-ui/List';



var TableEnglishList = React.createClass ({
	componentDidMount(){
		console.log('did mount TableEnglishList');
	},
	handleClick(item){
		this.props.change_current_sentence(item);
	},
	shouldComponentUpdate(nextProps, nextState){
		// return false;
		// return (this.props.hide != nextProps.hide) 
		return (this.props.items !== nextProps.items) ||(this.props.current_index!== nextProps.current_index) //只有当items改变的时候才会re-render! 其它情况的state改变并不会影响到这儿！
	},
	render() {
		var ori_this=this;
		console.log("table:",ori_this.props.current_index)
		return (
			<div className="col-sm-12 col-md-12 col-lg-12 ">
		    	<Table height={'550px'} onCellClick={this.cellClick}>

		    	  <TableBody displayRowCheckbox={false} preScanRows={false}>
		    	    {this.props.items.map((item,index)=> (
			    	    <TableRow key={ Date.now() + index }  onTouchTap={ this.handleClick.bind(null,item) } 
			    	    	selected={ Number(ori_this.props.current_index) === Number(index) ? true : false}
			    	    >
			    	         	<TableRowColumn>{item.english}</TableRowColumn>
			    	    </TableRow>
			       ))}

		    	  </TableBody>
		    	</Table>
			</div>
		)
	}
})

module.exports = TableEnglishList