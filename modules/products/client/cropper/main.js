window.onload = function () {

  'use strict';

  var Cropper = window.Cropper;
  var console = window.console || { log: function () {} };
  var container = document.querySelector('.img-container');
  var image = container.getElementsByTagName('img').item(0);
  var download = document.getElementById('download');
  var actions = document.getElementById('actions');
  var dataX = document.getElementById('dataX');
  var dataY = document.getElementById('dataY');
  var dataHeight = document.getElementById('dataHeight');
  var dataWidth = document.getElementById('dataWidth');
  var dataRotate = document.getElementById('dataRotate');
  var dataScaleX = document.getElementById('dataScaleX');
  var dataScaleY = document.getElementById('dataScaleY');
  var options = {
        aspectRatio: 1200/627,
        preview: '.img-preview',
        cropBoxResizable: false,
        dragMode: 'move',
        build: function () {
          //console.log('build');
        },
        built: function () {
          //console.log('built');
        },
        cropstart: function (data) {
          //console.log('cropstart', data.action);
        },
        cropmove: function (data) {
          //console.log('cropmove', data.action);
        },
        cropend: function (data) {
          //console.log('cropend', data.action);
        },
        crop: function (data) {
          //console.log('crop');
          dataX.value = Math.round(data.x);
          dataY.value = Math.round(data.y);
          dataHeight.value = Math.round(data.height);
          dataWidth.value = Math.round(data.width);
          dataRotate.value = !isUndefined(data.rotate) ? data.rotate : '';
          dataScaleX.value = !isUndefined(data.scaleX) ? data.scaleX : '';
          dataScaleY.value = !isUndefined(data.scaleY) ? data.scaleY : '';
        },
        zoom: function (data) {
          //console.log('zoom', data.ratio);
        }
      };
  var cropper = new Cropper(image, options);


  var containerfacebook = document.querySelector('.img-container-facebook');
  var imagefacebook = containerfacebook.getElementsByTagName('img').item(0);
  var downloadfacebook = document.getElementById('download');
  var actionsfacebook = document.getElementById('actionsfacebook');
  var dataXfacebook = document.getElementById('dataXfacebook');
  var dataYfacebook = document.getElementById('dataYfacebook');
  var dataHeightfacebook = document.getElementById('dataHeightfacebook');
  var dataWidthfacebook = document.getElementById('dataWidthfacebook');
  var dataRotatefacebook = document.getElementById('dataRotatefacebook');
  var dataScaleXfacebook = document.getElementById('dataScaleXfacebook');
  var dataScaleYfacebook = document.getElementById('dataScaleYfacebook');
  var optionsfacebook = {
    aspectRatio: 736/1104,
    preview: '.img-preview-facebook',
    cropBoxResizable: false,
    dragMode: 'move',
    build: function () {
      //console.log('build');
    },
    built: function () {
      //console.log('built');
    },
    cropstart: function (data) {
      //console.log('cropstart', data.action);
    },
    cropmove: function (data) {
      //console.log('cropmove', data.action);
    },
    cropend: function (data) {
      //console.log('cropend', data.action);
    },
    crop: function (data) {
      //console.log('crop');
      dataXfacebook.value = Math.round(data.x);
      dataYfacebook.value = Math.round(data.y);
      dataHeightfacebook.value = Math.round(data.height);
      dataWidthfacebook.value = Math.round(data.width);
      dataRotatefacebook.value = !isUndefined(data.rotate) ? data.rotate : '';
      dataScaleXfacebook.value = !isUndefined(data.scaleX) ? data.scaleX : '';
      dataScaleYfacebook.value = !isUndefined(data.scaleY) ? data.scaleY : '';
    },
    zoom: function (data) {
      //console.log('zoom', data.ratio);
    }
  };
  var cropperfacebook = new Cropper(imagefacebook, optionsfacebook);



  function isUndefined(obj) {
    return typeof obj === 'undefined';
  }

  function preventDefault(e) {
    if (e) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    }
  }


  // Tooltip
  $('[data-toggle="tooltip"]').tooltip();


  // Buttons
  if (!document.createElement('canvas').getContext) {
    $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
  }

  // Buttons Facebook
  if (!document.createElement('canvas').getContext) {
    $('button[data-method="getCroppedCanvasfacebook"]').prop('disabled', true);
  }

  if (typeof document.createElement('cropper').style.transition === 'undefined') {
    $('button[data-method="rotate"]').prop('disabled', true);
    $('button[data-method="scale"]').prop('disabled', true);
  }

  if (typeof document.createElement('cropper').style.transition === 'undefined') {
    $('button[data-method="rotatefacebook"]').prop('disabled', true);
    $('button[data-method="scalefacebook"]').prop('disabled', true);
  }


  // Download
  //if (typeof download.download === 'undefined') {
  //  download.className += ' disabled';
  //}


  // Options
  actions.querySelector('.docs-toggles').onclick = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var cropBoxData;
    var canvasData;
    var cropBoxDatafacebook;
    var canvasDatafacebook;
    var isCheckbox;
    var isRadio;

    if (!cropper) {
      return;
    }

    if (!cropperfacebook) {
      return;
    }

    if (target.tagName.toLowerCase() === 'span') {
      target = target.parentNode;
    }

    if (target.tagName.toLowerCase() === 'label') {
      target = target.getElementsByTagName('input').item(0);
    }

    isCheckbox = target.type === 'checkbox';
    isRadio = target.type === 'radio';

    if (isCheckbox || isRadio) {
      if (isCheckbox) {
        options[target.name] = target.checked;
        cropBoxData = cropper.getCropBoxData();
        canvasData = cropper.getCanvasData();

        optionsfacebook[target.name] = target.checked;
        cropBoxDatafacebook = cropperfacebook.getCropBoxData();
        canvasDatafacebook = cropperfacebook.getCanvasData();

        options.built = function () {
          console.log('built');
          cropper.setCropBoxData(cropBoxData).setCanvasData(canvasData);
        };
        optionsfacebook.built = function () {
          console.log('built');
          cropperfacebook.setCropBoxData(cropBoxDatafacebook).setCanvasData(canvasDatafacebook);
        };
      } else {
        options[target.name] = target.value;
        options.built = function () {
          console.log('built');
        };
        optionsfacebook[target.name] = target.value;
        optionsfacebook.built = function () {
          console.log('built');
        };
      }

      // Restart
      cropper.destroy();
      cropper = new Cropper(image, options);

      // Restart
      cropperfacebook.destroy();
      cropperfacebook = new Cropper(imagefacebook, optionsfacebook);
    }
  };


  // Methods
  actions.querySelector('.docs-buttons').onclick = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var result;
    var resultfacebook;
    var input;
    var data;
    var datafacebook;

    alert('los gehts!');

    if (!cropper) {
      return;
    }

    while (target !== this) {
      if (target.getAttribute('data-method')) {
        break;
      }

      target = target.parentNode;
    }

    if (target === this || target.disabled || target.className.indexOf('disabled') > -1) {
      return;
    }

    data = {
      method: target.getAttribute('data-method'),
      target: target.getAttribute('data-target'),
      option: target.getAttribute('data-option'),
      secondOption: target.getAttribute('data-second-option')
    };

    datafacebook = {
      method: target.getAttribute('data-method'),
      target: target.getAttribute('data-target'),
      option: target.getAttribute('data-option'),
      secondOption: target.getAttribute('data-second-option')
    };


    if (data.method) {
      if (typeof data.target !== 'undefined') {
        input = document.querySelector(data.target);

        if (!target.hasAttribute('data-option') && data.target && input) {
          try {
            data.option = JSON.parse(input.value);
          } catch (e) {
            console.log(e.message);
          }
        }
      }

      if (data.method === 'getCroppedCanvas') {
        data.option = JSON.parse(data.option);
      }

      result = cropper[data.method](data.option, data.secondOption);
      resultfacebook = cropperfacebook[data.method](data.option, data.secondOption);

      switch (data.method) {
        case 'scaleX':
        case 'scaleY':
          target.setAttribute('data-option', -data.option);
          break;

        case 'getCroppedCanvas':
          if (result) {

            alert(result.toDataURL());
            alert(resultfacebook.toDataURL());
            angular.element(document.getElementById('productsMediaControllerID')).scope().uploadProductMainPicture(result,resultfacebook);

            // Bootstrap's Modal
            //$('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

            if (!download.disabled) {
              download.href = result.toDataURL();
            }
          }

          break;

        case 'getCroppedCanvasfacebook':
          if (result) {

            alert(result.toDataURL());
            angular.element(document.getElementById('productsMediaControllerID')).scope().uploadProductMainPicture(result);

            // Bootstrap's Modal
            //$('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

            if (!download.disabled) {
              download.href = result.toDataURL();
            }
          }

          break;

        case 'destroy':
          cropper = null;
          break;
      }

      if (typeof result === 'object' && result !== cropper && input) {
        try {
          input.value = JSON.stringify(result);
          input.value = JSON.stringify(resultfacebook);
        } catch (e) {
          console.log(e.message);
        }
      }

    }
  }


  // Methods for Facebook
  actionsfacebook.querySelector('.docs-buttons').onclick = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var result;
    var input;
    var data;

    if (!cropper) {
      return;
    }

    while (target !== this) {
      if (target.getAttribute('data-method')) {
        break;
      }

      target = target.parentNode;
    }

    if (target === this || target.disabled || target.className.indexOf('disabled') > -1) {
      return;
    }

    data = {
      method: target.getAttribute('data-method'),
      target: target.getAttribute('data-target'),
      option: target.getAttribute('data-option'),
      secondOption: target.getAttribute('data-second-option')
    };

    if (data.method) {
      if (typeof data.target !== 'undefined') {
        input = document.querySelector(data.target);

        if (!target.hasAttribute('data-option') && data.target && input) {
          try {
            data.option = JSON.parse(input.value);
          } catch (e) {
            console.log(e.message);
          }
        }
      }

      if (data.method === 'getCroppedCanvas') {
        data.option = JSON.parse(data.option);
      }

      if (data.method === 'getCroppedCanvasfacebook') {
        data.option = JSON.parse(data.option);
      }

      result = cropperfacebook[data.method](data.option, data.secondOption);

      switch (data.method) {
        case 'scaleX':
        case 'scaleY':
          target.setAttribute('data-option', -data.option);
          break;

        case 'getCroppedCanvas':
          if (result) {

            alert(result.toDataURL());
            angular.element(document.getElementById('productsMediaControllerID')).scope().uploadProductMainPicture(result);

            // Bootstrap's Modal
            //$('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

            if (!download.disabled) {
              download.href = result.toDataURL();
            }
          }

          break;

        case 'destroy':
          cropper = null;
          break;
      }

      if (typeof result === 'object' && result !== cropper && input) {
        try {
          input.value = JSON.stringify(result);
        } catch (e) {
          console.log(e.message);
        }
      }

    }
  };

  document.body.onkeydown = function (event) {
    var e = event || window.event;

    if (!cropper || this.scrollTop > 300) {
      return;
    }

    switch (e.keyCode) {
      case 37:
        preventDefault(e);
        cropper.move(-1, 0);
        break;

      case 38:
        preventDefault(e);
        cropper.move(0, -1);
        break;

      case 39:
        preventDefault(e);
        cropper.move(1, 0);
        break;

      case 40:
        preventDefault(e);
        cropper.move(0, 1);
        break;
    }
  };


  // Import image
  var inputImage = document.getElementById('inputImage');
  var URL = window.URL || window.webkitURL;
  var blobURL;

  if (URL) {
    inputImage.onchange = function () {
      var files = this.files;
      var file;

      if (cropper && cropperfacebook && files && files.length) {
        file = files[0];

        if (/^image\/\w+/.test(file.type)) {
          blobURL = URL.createObjectURL(file);
          cropper.reset().replace(blobURL);
          cropperfacebook.reset().replace(blobURL);
          inputImage.value = null;
        } else {
          window.alert('Please choose an image file.');
        }
      }
    };
  } else {
    inputImage.disabled = true;
    inputImage.parentNode.className += ' disabled';
  }

};
