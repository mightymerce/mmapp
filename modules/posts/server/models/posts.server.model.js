/**
 * Created by mwagner on 10.11.15.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Post Schema
 */
var PostSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },

  postId: {
    type: String,
    default: '',
    trim: true,
    required: 'PostID cannot be blank'
  },
  postStatus: {
    type: String,
    default: '',
    trim: true,
    required: 'Poststatus cannot be blank'
  },
  postPublicationDate: {
    type: String,
    default: '',
    trim: true,
    required: 'Publication Date cannot be blank'
  },
  postExternalPostKey: {
    type: String,
    default: '',
    trim: true
  },
  postChannel: {
    type: String,
    default: '',
    trim: true
  },
  postInformation: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  product: {
    type: Schema.ObjectId,
    ref: 'Product'
  },
  channel: {
    type: Schema.ObjectId,
    ref: 'Channel'
  }
});

mongoose.model('Post', PostSchema);
