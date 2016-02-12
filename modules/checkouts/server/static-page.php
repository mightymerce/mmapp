<?php
/**
 * This file creates a static page for crawlers such as Facebook or Twitter bots that cannot evaluate JavaScript.
 *
 * Created by mightymerce.
 * User: Markus
 * Date: 12/02/16
 *
 */
$SITE_ROOT = "http://shop.mightymerce.com/";
$jsonData = getData($SITE_ROOT);
makePage($jsonData, $SITE_ROOT);
function getData($siteRoot) {
    $id = ctype_digit($_GET['id']) ? $_GET['id'] : 1;
    $rawData = file_get_contents($siteRoot.'api/products/:'.$id);
    return json_decode($rawData);
}
function makePage($data, $siteRoot) {
    $imageUrl = $siteRoot . $data->image;
    $pageUrl = $siteRoot . "product/" . $data->id;
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title><?php echo $data->productTitle; ?></title>

        <!-- Facebook META -->
        <meta property="fb:app_id" content="1679726155619376">
        <meta property="og:site_name" content="mightymerce">
        <meta property="og:title" content="<?php echo $data->productTitle; ?>">
        <meta property="og:description" content="<?php echo $data->productDescription; ?>">
        <meta property="og:url" content="<?php echo $data->productCheckoutURL . "?channel=facebook"; ?>"
        <meta property="og:image" content="<?php echo $data->image; ?>">

        <!-- Twitter META -->
        <meta property="twitter:card" content="product" />
        <meta name="twitter:title" content="<?php echo $data->productTitle; ?>">
        <meta name="twitter:description" content="<?php echo $data->productDescription; ?>">
        <meta name="twitter:url" content="<?php echo $data->productCheckoutURL . "?channel=twitter"; ?>">
        <meta name="twitter:image" content="<?php echo $data->image; ?>">

        <!-- Pinterest META -->
        <meta property="og:type" content="product">
        <meta property="og:title" content="<?php echo $data->productTitle; ?>">
        <meta property="og:description" content="<?php echo $data->productDescription; ?>">
        <meta property="og:url" content="<?php echo $data->productCheckoutURL . "?channel=pinterest"; ?>" />
        <meta property="og:price:amount" content="<?php echo $data->productPrice; ?>">
        <meta property="og:price:currency" content="<?php echo $data->productCurrency; ?>">
        <meta property="og:availability" content="instock"
        <meta property="og:site_name" content="mightymerce">


    </head>
    <body>
    <p><?php echo $data->description; ?></p>
    <img src="<?php echo $data->image; ?>">
    </body>
    </html>
<?php
}
