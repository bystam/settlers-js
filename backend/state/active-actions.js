

exports.ActiveActions = ActiveActions;

// basically used as a set of strings

function ActiveActions () {
  this.data = {};
}

ActiveActions.prototype = {
  constructor: ActiveActions,

  begin: function (action) {
    if (typeof action !== 'string')
      throw "action type must be a string"
    this.data[action] = true;
  },

  end: function (action) {
    delete this.data[action];
  },

  contains: function (action) {
    return this.data[action] ? true : false;
  },

  isEmpty: function () {
    return Object.keys (this.data).length === 0;
  }
};