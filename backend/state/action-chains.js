

exports.ActionSet = ActionSet;

// basically used as a set of strings

function ActionSet () {
  this.data = {};
}

ActionSet.prototype = {
  constructor: ActionSet,

  add: function (action) {
    if (typeof action !== 'string')
      throw "action type must be a string"
    this.data[action] = true;
  },

  remove: function (action) {
    delete this.data[action];
  },

  contains: function (action) {
    return this.data[action] ? true : false;
  },

  isEmpty: function (action) {
    return Object.keys (this.data).length === 0;
  }
};