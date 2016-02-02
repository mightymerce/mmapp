'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  Product = mongoose.model('Product'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Products
 */
exports.create = function (req, res) {
  var product = new Product(req.body);
  product.user = req.user;

  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/**
 * Show the current product
 */
exports.read = function (req, res) {
  res.json(req.product);
};

/**
 * Update a product
 */
exports.update = function (req, res) {
  var product = req.product;

  product.productId = req.body.productId;
  product.productTitle = req.body.productTitle;
  product.productDescription = req.body.productDescription;
  product.productPrice = req.body.productPrice;
  product.productTax = req.body.productTax;
  product.productCurrency = req.body.productCurrency;
  //product.productSaleprice = req.body.productSaleprice;
  //product.productSalepricefrom = req.body.productSalepricefrom;
  //product.productSalepriceuntil = req.body.productSalepriceuntil;
  product.productShippingoption = req.body.productShippingoption;
  product.productItemInStock = req.body.productItemInStock;
  product.productMainImageURL = req.body.productMainImageURL;
  product.productMainImageURLFacebook = req.body.productMainImageURLFacebook;
  product.productMainImageURLTwitter = req.body.productMainImageURLTwitter;
  product.productMainImageURLPinterest = req.body.productMainImageURLPinterest;
  product.productMainImageURLEtsy = req.body.productMainImageURLEtsy;
  product.productMainImageURLDawanda = req.body.productMainImageURLDawanda;
  product.productMainImageURLCode = req.body.productMainImageURLCode;
  product.productMainImageAlt = req.body.productMainImageAlt;
  product.productFurtherImage1URL = req.body.productFurtherImage1URL;
  product.productFurtherImage1URLFacebook = req.body.productFurtherImage1URLFacebook;
  product.productFurtherImage1URLTwitter = req.body.productFurtherImage1URLTwitter;
  product.productFurtherImage1URLPinterest = req.body.productFurtherImage1URLPinterest;
  product.productFurtherImage1URLEtsy = req.body.productFurtherImage1URLEtsy;
  product.productFurtherImage1URLDawanda = req.body.productFurtherImage1URLDawanda;
  product.productFurtherImage1URLCode = req.body.productFurtherImage1URLCode;
  product.productFurtherImage1Alt = req.body.productFurtherImage1Alt;
  product.productFurtherImage2URL = req.body.productFurtherImage2URL;
  product.productFurtherImage2URLFacebook = req.body.productFurtherImage2URLFacebook;
  product.productFurtherImage2URLTwitter = req.body.productFurtherImage2URLTwitter;
  product.productFurtherImage2URLPinterest = req.body.productFurtherImage2URLPinterest;
  product.productFurtherImage2URLEtsy = req.body.productFurtherImage2URLEtsy;
  product.productFurtherImage2URLDawanda = req.body.productFurtherImage2URLDawanda;
  product.productFurtherImage2URLCode = req.body.productFurtherImage2URLCode;
  product.productFurtherImage2Alt = req.body.productFurtherImage2Alt;
  product.productFurtherImage3URL = req.body.productFurtherImage3URL;
  product.productFurtherImage3URLFacebook = req.body.productFurtherImage3URLFacebook;
  product.productFurtherImage3URLTwitter = req.body.productFurtherImage3URLTwitter;
  product.productFurtherImage3URLPinterest = req.body.productFurtherImage3URLPinterest;
  product.productFurtherImage3URLEtsy = req.body.productFurtherImage3URLEtsy;
  product.productFurtherImage3URLDawanda = req.body.productFurtherImage3URLDawanda;
  product.productFurtherImage3URLCode = req.body.productFurtherImage3URLCode;
  product.productFurtherImage3Alt = req.body.productFurtherImage3Alt;
  product.productFurtherImage4URL = req.body.productFurtherImage4URL;
  product.productFurtherImage4URLFacebook = req.body.productFurtherImage4URLFacebook;
  product.productFurtherImage4URLTwitter = req.body.productFurtherImage4URLTwitter;
  product.productFurtherImage4URLPinterest = req.body.productFurtherImage4URLPinterest;
  product.productFurtherImage4URLEtsy = req.body.productFurtherImage4URLEtsy;
  product.productFurtherImage4URLDawanda = req.body.productFurtherImage4URLDawanda;
  product.productFurtherImage4URLCode = req.body.productFurtherImage4URLCode;
  product.productFurtherImage4Alt = req.body.productFurtherImage4Alt;
  product.productFurtherImage5URL = req.body.productFurtherImage5URL;
  product.productFurtherImage5URLFacebook = req.body.productFurtherImage5URLFacebook;
  product.productFurtherImage5URLTwitter = req.body.productFurtherImage5URLTwitter;
  product.productFurtherImage5URLPinterest = req.body.productFurtherImage5URLPinterest;
  product.productFurtherImage5URLEtsy = req.body.productFurtherImage5URLEtsy;
  product.productFurtherImage5URLDawanda = req.body.productFurtherImage5URLDawanda;
  product.productFurtherImage5URLCode = req.body.productFurtherImage5URLCode;
  product.productFurtherImage5Alt = req.body.productFurtherImage5Alt;
  product.productActive = req.body.productActive;

  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/**
 * Delete an product
 */
exports.delete = function (req, res) {
  var product = req.product;

  product.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/**
 * List of Products
 */
exports.list = function (req, res) {
  Product.find({ user: { $eq: req.query.user } }).sort('-created').populate('user', 'displayName').exec(function (err, products) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(products);
    }
  });
};

/**
 * Product middleware
 */
exports.productByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Product is invalid'
    });
  }

  Product.findById(id).populate('user', 'displayName').exec(function (err, product) {
    if (err) {
      return next(err);
    } else if (!product) {
      return res.status(404).send({
        message: 'No product with that identifier has been found'
      });
    }
    req.product = product;
    next();
  });
};

exports.productByProductID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Product is invalid'
    });
  }

  Product.findByProductId(id).populate('product').exec(function (err, product) {
    if (err) {
      return next(err);
    } else if (!product) {
      return res.status(404).send({
        message: 'No product with that identifier has been found'
      });
    }
    req.product = product;
    next();
  });
};

/**
 * Update Product Main Image
 */
exports.changeProductMainPicture = function (req, res) {

  console.log('products.server.controller - Start Update on server.controller: Function changeProductMainPicture');

  var user = req.user;
  //var product = req.product;
  var message = null;
  var upload = multer(config.uploads.productImageUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading main product picture'
        });
      } else {
        /*product.productMainImageURL = config.uploads.profileUpload.dest + req.file.filename;

        product.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            req.login(user, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.json(user);
              }
            });
          }
        });*/
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};
