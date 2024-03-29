'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Order Schema
 */
var OrderSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },

  orderId: {
    type: String,
    default: '',
    trim: true,
    required: 'OrderID cannot be blank'
  },
  orderDate: {
    type: String,
    default: '',
    trim: true,
    required: 'Date cannot be blank'
  },
  orderShippingCost: {
    type: String,
    default: '',
    trim: true
  },
  orderShippingTime: {
    type: String,
    trim: true,
    default: ''
  },
  orderChannel: {
    type: String,
    default: '',
    trim: true
  },
  orderTransactionID: {
    type: String,
    default: '',
    trim: true
  },

  orderCustomer: {
    type: String,
    default: '',
    trim: true
  },
  orderPaymentStatus: {
    type: String,
    default: '',
    trim: true
  },
  orderPaymentDate: {
    type: String,
    default: '',
    trim: true
  },
  orderPaymentType: {
    type: String,
    default: '',
    trim: true
  },
  orderTaxAmount: {
    type: String,
    default: '',
    trim: true
  },
  orderTax: {
    type: String,
    default: '',
    trim: true
  },
  ordereMail: {
    type: String,
    default: '',
    trim: true
  },
  orderPayerID: {
    type: String,
    default: '',
    trim: true
  },
  orderPayerStatus: {
    type: String,
    default: '',
    trim: true
  },
  orderPayerFirstName: {
    type: String,
    default: '',
    trim: true
  },
  orderPayerLastName: {
    type: String,
    default: '',
    trim: true
  },
  orderShipToName: {
    type: String,
    default: '',
    trim: true
  },
  orderShipToStreet: {
    type: String,
    default: '',
    trim: true
  },
  orderShipToCity: {
    type: String,
    default: '',
    trim: true
  },
  orderShipToState: {
    type: String,
    default: '',
    trim: true
  },
  orderShipToCntryCode: {
    type: String,
    default: '',
    trim: true
  },
  orderShipToCntryName: {
    type: String,
    default: '',
    trim: true
  },
  orderShipToZip: {
    type: String,
    default: '',
    trim: true
  },
  orderBillToFirstName: {
    type: String,
    default: '',
    trim: true
  },
  orderBillToLastName: {
    type: String,
    default: '',
    trim: true
  },
  orderBillToStreet: {
    type: String,
    default: '',
    trim: true
  },
  orderBillToCity: {
    type: String,
    default: '',
    trim: true
  },
  orderBillToState: {
    type: String,
    default: '',
    trim: true
  },
  orderBillToCntryCode: {
    type: String,
    default: '',
    trim: true
  },
  orderBillToCntryName: {
    type: String,
    default: '',
    trim: true
  },
  orderBillToZip: {
    type: String,
    default: '',
    trim: true
  },
  orderShipToAdressStatus: {
    type: String,
    default: '',
    trim: true
  },
  orderShipToTotalAmount: {
    type: String,
    default: '',
    trim: true
  },
  orderShipToCurrencyCode: {
    type: String,
    default: '',
    trim: true
  },
  orderShipToSubtotalAmount: {
    type: String,
    default: '',
    trim: true
  },
  orderStatus: {
    type: String,
    default: '',
    trim: true
  },
  orderProductID: {
    type: String,
    default: '',
    trim: true
  },
  orderProductQuantity: {
    type: String,
    default: '',
    trim: true
  },
  orderShipCloudid: {
    type: String,
    default: '',
    trim: true
  },
  orderShipCloudcarrier_tracking_no: {
    type: String,
    default: '',
    trim: true
  },
  orderShipCloudcarrier_tracking_url: {
    type: String,
    default: '',
    trim: true
  },
  orderShipCloudcarrier_label_url: {
    type: String,
    default: '',
    trim: true
  },
  orderShipCloudprice: {
    type: String,
    default: '',
    trim: true
  },
  orderShipCloudcarrier: {
    type: String,
    default: '',
    trim: true
  },
  orderTrackingNo: {
    type: String,
    default: '',
    trim: true
  },
  ordereMailCustomerShipMessage: {
    type: String,
    default: '',
    trim: true
  },
  orderCustomerPayerMessage: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Order', OrderSchema);
