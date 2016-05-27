"use strict";

var EnglishList = React.createClass({
  render: function () {
    var createItem = function (item) {
      return React.createElement(
        "li",
        { key: Date.now() },
        item.english
      );
    };
    return React.createElement(
      "ul",
      null,
      this.props.items.map(createItem)
    );
  }
});