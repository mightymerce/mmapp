'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Delivery Schema
 */
var DeliverySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  deliveryTitle: {
    type: String,
    trim: true,
    default: ''
  },
  deliveryTime: {
    type: String,
    trim: true,
    default: ''
  },
  deliveryCountry: {
    type: String,
    trim: true,
    default: ''
  },
  deliveryCost: {
    type: String,
    trim: true,
    default: ''
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Delivery', DeliverySchema);
