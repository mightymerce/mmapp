/*
*   FUNCTIONS
*/

function parseCurrency(number) {

    var options = new JsNumberFormatter.locales.formatOptions('de')
                    .specifyDecimalMask('00');
    number = JsNumberFormatter.formatNumber(number, options, true);

    return number;

}

function parseCurrencyForPP(number) {

    var options = new JsNumberFormatter.locales.formatOptions('us')
                    .specifyDecimalMask('00');
    number = JsNumberFormatter.formatNumber(number, options, true);

    return number;

}

function calculatePrices() {

    var singlePriceData = $('.single-price').data('value');
    var singlePrice;
    if (typeof singlePriceData == 'string') {
    	singlePrice = parseFloat(singlePriceData)
    } else {
    	singlePrice = singlePriceData;
    }
    console.log(singlePrice);
    console.log(typeof singlePrice);

    var shippingData = $('.lbl-shipping').data('value');
    var shipping;
    if (typeof shippingData == 'string') {
        shipping = parseFloat(shippingData)
    } else {
        shipping = shippingData;
    }
    console.log(shipping);
    console.log(typeof shipping);

    var amount = $('.amount').val();
    var subtotal = amount * singlePrice;
    var total = subtotal + shipping;
    var vat = total * 19 / 100;
    console.log('Amount: ' +amount);
    console.log('Subtotal: ' +subtotal);
    console.log('Total: ' +total);


    $('.single-price').text(parseCurrency(singlePrice) + ' €');
    $('.highlight-price').text(parseCurrency(singlePrice) + ' €');
    $('.lbl-priceperitem').text(parseCurrency(singlePrice) + ' €');
    $('.lbl-quantity').text(amount);
    $('.lbl-shipping').text(parseCurrency(shipping) + ' €');
    $('.lbl-subtotal').text(parseCurrency(subtotal) + ' €');
    $('#PAYMENTREQUEST_0_ITEMAMT').val(parseCurrencyForPP(subtotal));
    $('.lbl-total').text(parseCurrency(total));
    $('.lbl-total-PP').val(parseCurrencyForPP(total));
    $('.lbl-shipping-PP').val(parseCurrencyForPP(shipping));
    $('.lbl-itemprice-PP').val(parseCurrencyForPP(singlePrice));
    $('.lbl-vat').text(parseCurrency(vat) + ' €');
}

function scrollToDiv(element, offset){
    element = element.replace("link", "");
    $('html,body').unbind().animate({scrollTop: $(element).offset().top-offset},'slow');
}

function trimString(element, length) {
    $(element).each (function () {
        if ($(this).text().length > length) {
            $(this).text($(this).text().substring(0,length) + '...');
        }
    });
}





$('.js-go-to-checkout').click(function() {
    $('.cart').hide();
    $('.details').show();
    $('.step-headline').html('Your Details');
    scrollToDiv('#belowpicture', 0);
});

$('.js-go-to-confirmation').click(function() {
    $('.review').hide();
    $('.confirmation').show();
    $('.step-headline').html('Order Confirmation');
    scrollToDiv('#belowpicture', 0);
});


/*
*   CALCULATE PRICES
*/

$("input.amount").TouchSpin({
    min: 1,
    max: 10,
    step: 1,
    decimals: 0
});

$(document).ready(".bootstrap-touchspin-up").click(function() {
    setTimeout(function(){
      calculatePrices();
    }, 1000);
});

$(document).ready(function() {
    setTimeout(function(){
        calculatePrices();
        trimString('.js-headline', 70);
        $('.js-content').shorten({
            moreText: '(read more)',
            lessText: '(read less)'
        });
    }, 2000);
});



/*
*   FORM
*/
$('.address-identical').change(function() {
    if(this.checked) {
        $('.shipping-address').hide(400);
    }
    else{
        $('.shipping-address').show(400);
    }
});


$('#details-form').validator();

$('#details-form').validator().on('submit', function (e) {
  if (e.isDefaultPrevented()) {
    scrollToDiv('#belowpicture', 0);
  } else {
    e.preventDefault();
    $('.review-billling-name').html(
        $('.billing-firstname-val').val() + ' ' +  $('.billing-lastname-val').val()
    );
    $('.review-billing-address').html(
        $('.billing-street-val').val() + ' ' +  $('.billing-no-val').val() + ', ' + $('.billing-postal-val').val() + ' ' + $('.billing-city-val').val() + ', ' + $('.billing-country-val').val()
    );

    $('.review-shipping-name').html(
        $('.shipping-firstname-val').val() + ' ' +  $('.shipping-lastname-val').val()
    );
    $('.review-shipping-address').html(
        $('.shipping-street-val').val() + ' ' +  $('.shipping-no-val').val() + ', ' + $('.shipping-postal-val').val() + ' ' + $('.shipping-city-val').val() + ', ' + $('.shipping-country-val').val()
    );

    $('.review-shipping-option').html(
        $('.shipping-option-val').val()
    );

    $('.details').hide();
    $('.review').show();
    $('.step-headline').html('Review Your Order');
    scrollToDiv('#belowpicture', 0);
  }
});

