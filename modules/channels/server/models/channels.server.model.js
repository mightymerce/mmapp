'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Channel Schema
 */
var ChannelSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },

  channelId: {
    type: String,
    default: '',
    trim: true,
    required: 'ChannelID cannot be blank'
  },
  channelType: {
    type: String,
    default: '',
    trim: true,
    required: 'Type cannot be blank'
  },
  channelName: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank'
  },
  channelAccessToken: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Channel', ChannelSchema);
