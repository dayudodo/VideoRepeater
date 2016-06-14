var $simple = document.getElementById("todoapp");
	
	var TodoList = React.createClass({
		getInitialState: function(){
			return ({
				todolist : []
			})
		},
		handleChange : function (rows){
			this.setState ({ todolist : rows});
		},
		render : function (){
			return (
			<div>
				<TypeNew  onAdd ={this.handleChange} todo = {this.state.todolist} />
				<ListTodo onDel = {this.handleChange} todo = {this.state.todolist} />
			</div>
			)
		
		}
	
	});
	
	var TypeNew = React.createClass({
		handleAdd : function(e){
			e.preventDefault();
			var newthing = this.refs.inputnew.getDOMNode().value.trim();
			var rows = this.props.todo;
			if ( newthing != '' ){
				rows.push (newthing);
				this.props.onAdd (rows) ;
			}
			this.refs.inputnew.getDOMNode().value = '';
			
		},
		
		render : function (){
			return (
			<form onSubmit = {this.handleAdd}>
			<input ref = "inputnew" type = "text"  placeholder="type a newthing todo" id="new-todo"  />
			</form>
			)
		}
	});
	
	var ListTodo = React.createClass({
		handleDel : function (e){
			var delindex = e.target.getAttribute("data-key");
			this.props.todo.splice (delindex,1);
			this.props.onDel (this.props.todo);
		},
		
		render : function (){
			return (
			<ul id="todo-list">
			{
			this.props.todo.map(function(item,i){
				return (
				<li>
					<span className="toggle"></span>
                    <label>{item}</label>
					<button className="destroy" onClick = {this.handleDel} data-key = {i} ></button>
				</li>
				)
			}.bind(this))
			}
			</ul>
			)
		}
	});
	
	React.render (<TodoList />, $simple );