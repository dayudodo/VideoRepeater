var EnglishList= React.createClass({
  render: function() {
    var createItem = function(item) {
      return <li key={ Date.now() }>{ item.english }</li>;
    };
    return <ul>{this.props.items.map(createItem)}</ul>;
  }
});