const { Schema } = require('mongoose');
const {format_date} = require('./../utils/format_date');

const reactionSchema = new Schema(
  {
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
      minlength: 1,
      default: 'User has a reaction.',
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => {
        if (date) { return format_date(date) }
      }
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);


module.exports = reactionSchema;
