'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider', '$translateProvider',
  function ($locationProvider, $httpProvider, $translateProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');

    $translateProvider.translations('de-DE', {
      // BREADCRUMB
      'BREADCRUMB-HOME':'Home',
      'BREADCRUMB-LOGO':'Logo',
      'BREADCRUMB-SHOP-SETTINGS':'Shop Settings',
      'BREADCRUMB-SETTINGS':'Settings',

      // VIEW ----- signin.client.view.html ------
      // LABELS
      'LABEL-EMAIL':'eMail',
      'LABEL-PASSWORD':'Password',
      'PLACEHOLDER-LABEL-EMAIL':'email ...',
      'PLACEHOLDER-LABEL-PASSWORD':'password...',
      'HEADLINE-SUB-WELCOME-BACK': 'Willkommen zurück! Log dich ein und sieh nach deinen Produkten, Posts und Bestellungen. ',

      // BUTTONS
      'BUTTON-TEXT-SIGNIN': 'Sign in',
      'BUTTON-TEXT-SIGNUP': 'Sign up',
      'BUTTON-TEXT-FORGOTPWD': 'Forgot password',

      // VALDIATIONS
      'VALIDATION-REQ-EMAIL':'eMail is required.',
      'VALIDATION-REQ-PASSWORD':'Password is required.',

      // ERRORS

      // VIEW ----- signup.client.view.html ------
      // LABELS
      'HEADLINE-SIGNUP':'mightymerce Registrierung',
      'HEADLINE-SUB-SIGNUP-WELCOME':'Verkaufe deine Produkte ganz einfach über die sozialen Kanäle und Marktplätze. Und das alles über eine zentrale Stelle. Ganz einfach. Versprochen.',
      'PLACEHOLDER-LABEL-SHOPNAME':'shopname',
      'LABEL-OR':'or',

      // VALDIATIONS
      'VALIDATION-VALID-EMAIL':'eMail not valid.',
      'VALIDATION-VALID-PASSWORD':'Password is required.',
      'VALIDATION-REQUIREMENTS-PASSWORD':'Password requirements',

      // ERRORS
      'PASSWORD-POPOVER-MESSAGE':'Please enter a passphrase or password with greater than 10 characters, numbers, lowercase, upppercase, and special characters.',

      // VIEW ----- forgot-password.client.view.html ------
      // LABELS
      'HEADLINE-SUB-FORGOTPWD':'Forgot password?',

      // BUTTONS
      'BUTTON-TEXT-SUBMIT': 'Submit',

      // VIEW ----- reset-password.client.view.html ------
      // LABELS
      'HEADLINE-SUB-RESETPWD':'Reset your password',
      'LABEL-NEW-PASSWORD':'New Password',
      'LABEL-VERIFY-PASSWORD':'Verify Password',

      // BUTTONS
      'BUTTON-UPDATE-PASSWORD':'Update Password',

      // ERROR
      'VALIDATION-ENTER-NEW-PASSWORD':'Enter a new password.',
      'VALIDATION-ENTER-PASSWORD-AGAIN':'Enter the password again to verify.',
      'VALIDATION-PASSWORD-MATCH':'Passwords do not match.',

      // VIEW ----- reset-password-invalid.client.view.html ------
      // LABELS
      'HEADLINE-SUB-RESETPWD-INVALID':'Password reset is invalid',

      // ERRORS
      'MESSAGE-ASK-NEW-PASSWORD':'Ask for a new password reset',

      // VIEW ----- reset-password-success.client.view.html ------
      // LABELS
      'HEADLINE-SUB-RESETPWD-SUCCESS':'Password successfully reset',

      // ERROR
      'MESSAGE-CONTINUE-DASHBOARD':'Continue to your dashboard',

      // VIEW ----- change-password.client.view.html ------
      // LABELS
      'LABEL-CURRENT-PASSWORD':'Current Password',
      'PLACEHOLDER-LABEL-CURRENT-PASSWORD':'Current Password',

      // BUTTON
      'BUTTON-SAVE-PASSWORD':'Save Password',

      // ERROR
      'VALIDATION-CURRENT-PASSWORD-REQ':'Your current password is required.',
      'VALIDATION-CHANGED-PWD-SUCCESS':'Password Changed Successfully',

      // VIEW ----- change-profile-picture.client.view.html ------
      // LABELS
      'HEADLINE-SUB-YOUR-CURRENT-LOGO':'Your current Logo',
      'HEADLINE-SUB-UPLOAD-NEW-LOGO':'Upload new Logo',
      'LABEL-PREVIEW-IMAGE':'Preview image',
      'LABEL-NOTE-BEST-FIT-LOGO':'Note: Best fit for Logo image ...px / ...px',

      // BUTTON
      'BUTTON-SAVE-IMAGE':'Save image',
      'BUTTON-CANCEL':'Cancel',
      'BUTTON-SELECT-IMAGE':'Select Image ',

      // ERROR
      'MESSAGE-SUCCESS-LOGO-CHANGED':'Logo changed Successfully',

      // VIEW ----- edit-payment.client.view.html ------
      // LABELS
      'HEADLINE-SUB-PAYMENT':'Payment',
      'HEADLINE-SUB-PAYPAL-PAYMENT-GATEWAY':'Paypal payment gateway',
      'HEADLINE-SUB-PAYPAL-BUSINESS-ACCOUNT':'Schritt 1 - Geschäftskonto einrichten',
      'HEADLINE-SUB-PAYPAL-SIGNATURE-ACCESS':'Schritt 2 - API Signatur abrufen',
      'HEADLINE-SUB-PAYPAL-SIGNATURE-ENTER':'Schritt 3 - API Signatur übertragen',
      'HEADLINE-SUB-PAYPAL-CREDENTIALS':'Paypal Credentials',
      'LABEL-PAYPAL-API-USER':'Paypal API User*',
      'LABEL-PAYPAL-API-PWD':'Paypal API Password*',
      'LABEL-PAYPAL-API-SIG':'Paypal API Signature*',

      // TEXT
      'TEXT-PAYPAL-EXPRESS-I':'Deine Kunden können im mightymerce Checkout mit Paypal Express bei dir einkaufen.',
      'TEXT-PAYPAL-EXPRESS-II':'Diese PDF-Anleitung von PayPal zeigt dir, wie du ein Geschäftskonto einrichtest, wenn du noch keines hast:',
      'TEXT-PAYPAL-EXPRESS-III':'Zur Anleitung von PayPal',
      'TEXT-PAYPAL-EXPRESS-IIII':'Bitte richte als Zahlart ',
      'TEXT-PAYPAL-EXPRESS':'PayPal Express',
      'TEXT-PAYPAL-EXPRESS-IIIII':' ein.',
      'TEXT-PAYPAL-SIGNATURE':'Sobald dein Geschäftskonto eingerichtet ist, benötigen wir eine sogenannte API Signatur von dir. Diese brauchen wir, um dein mightymerce Konto mit deinem PayPal Geschäftskonto zu verbinden. Das Video von PayPal zeigt dir, wie das geht.',
      'TEXT-PAYPAL-SIGNATURE-ENTER':'Dein Konto ist eingerichtet und deine Daten sind vollständig. Kopiere jetzt die Daten von PayPal in die nachfolgenden Felder und Bestätige deine Eingabe. FERTIG ! Deine Kunden können jetzt bei dir einkaufen.',

      // ERROR
      'VALIDATION-PAYPAL-API-USER-REQ':'Paypal api user is required.',
      'VALIDATION-PAYPAL-API-PWD-REQ':'Paypal api password is required.',
      'VALIDATION-PAYPAL-API-SIG-REQ':'Paypal api signature is required.',

      // BUTTON
      'BUTTON-BACK-TUTORIAL':'Return to tutorial',
      'BUTTON-UPDATE-PAYPAL-DATA':'Update paypal data',

      // VIEW ----- edit-profile.client.view.html ------
      // LABELS
      'HEADLINE-ACCOUNT-AREA':'User',
      'HEADLINE-SUB-EDIT-PROFILE':'Profile',
      'HEADLINE-SUB-COMPANY-DETAILS':'Company Details',
      'NOTE-PROVIDE-COMPANY-DETAILS':'For the receipt of a monthly invoice, please provide your company’s address details.',
      'LABEL-COMPANY-NAME':'Company Name',
      'LABEL-FIRST-NAME':'First Name',
      'LABEL-LAST-NAME':'Last Name',
      'LABEL-STREET':'Street',
      'LABEL-STREET-NO':'Street No',
      'LABEL-ZIP-CODE':'Zip Code',
      'LABEL-CITY':'City',

      // ERROR
      'VALIDATION-COMPANY-NAME-REQ':'Company Name is required.',
      'VALIDATION-FIRST-NAME-REQ':'First Name is required.',
      'VALIDATION-LAST-NAME-REQ':'Last Name is required.',
      'VALIDATION-STREET-REQ':'Street is required.',
      'VALIDATION-STREET-NO-REQ':'Street No. is required.',
      'VALIDATION-ZIP-CODE-REQ':'Zip Code is required.',
      'VALIDATION-CITY-REQ':'City is required.',

      // BUTTON
      'BUTTON-UPDATE-PROFILE-DATA':'Update profile data',

      // VIEW ----- subscription.client.view.html ------
      // LABELS
      'HEADLINE-SUB-SUBSCRIPTION':'Subscription',
      'HEADLINE-SUB-YOUR-SUBSCRIPTION':'Your subscription',
      'TEXT-YOUR-SUBSCRIPTION':'Based on the growth of your business your are able to manage your subscriptions by upgrading or downsizing your plans.',
      'LABEL-YOUR-SUBSCRIPTION':'Your plan',
      'LABEL-MOST-POPULAR':'Most popular',
      'LABEL-FREE-SUBSCRIPTION':'FREE',
      'LABEL-FIVE-PRODUCTS':'5 different products',
      'LABEL-TEN-PRODUCTS':'10 different products',
      'LABEL-HUNDRED-PRODUCTS':'100 different products',
      'LABEL-UNLIMITED-PRODUCTS':'unlimited different products',
      'LABEL-ALL-AVAILABLE':'All available',
      'LABEL-TO-SELL':'to sell',
      'LABEL-SALES-CHANNELS':'sales channels',
      'LABEL-SUBSCRIPTION-BASIC':'Basic',
      'LABEL-SUBSCRIPTION-MONTHLY':'Monthly',
      'LABEL-SUBSCRIPTION-PROFESSIONAL':'Professional',
      'LABEL-SUBSCRIPTION-UNLIMITED':'Unlimited',

      // BUTTON
      'BUTTON-RETURN-FREE-SUBSCRIPTION':'Return to free subscription now!',
      'BUTTON-UPGRADE-SUBSCRIPTION':'Upgrade subscription now!',
      'BUTTON-DOWNGRADE-SUBSCRIPTION':'Downgrade subscription now!',

      // VIEW ----- create-currency.client.view.html ------
      // LABELS
      'BREADCRUMB-CURRENCY-CREATE':'Currency - Create',
      'LABEL-CURRENCY-OPTION':'Currency option',
      'LABEL-CURRENCY-CODE':'Currency Code',
      'LABEL-CURRENCY-VALUE':'Currency Value',

      // ERROR
      'VALIDATION-CURRENCY-CODE':'Currency Code is required.',
      'VALIDATION-CURRENCY-VALUE':'Currency Value is required.',

      // BUTTON
      'BUTTON-SAVE-CURRENCY':'Save currency data',

      // VIEW ----- list-currency.client.view.html ------
      // LABELS
      'BREADCRUMB-CURRENCY':'Currency',
      'LABEL-CURRENCY-ROWS':'Currency rows',
      'TEXT-CURRENCY-NOTE':'NOTE: You will be able to add more currencies soon. At that point of time only EUR is available.',
      'LABEL-CURRENCY-CODE-TABLE-HEADER':'Code',
      'LABEL-CURRENCY-VALUE-TABLE-HEADER':'Value',

      // ERROR
      'MESSAGE-NO-CURRENCY':'No currency yet, why dont you',
      'MESSAGE-NO-CREATE-ONE':'create one',

      // VIEW ----- edit-currency.client.view.html ------
      // LABELS
      'BREADCRUMB-CURRENCY-EDIT':'Currency - Edit',

      // BUTTON
      'BUTTON-UPDATE-CURRENCY':'Update currency data',

      // VIEW ----- list-delivery.client.view.html ------
      // LABELS
      'BREADCRUMB-DELIVERY':'Delivery',
      'LABEL-DELIVERY-OPTION':'Delivery options',
      'LABEL-TABLE-HEADER-DELIVERY-TITLE':'Title',
      'LABEL-TABLE-HEADER-DELIVERY-WITHIN':'Delivered within',
      'LABEL-TABLE-HEADER-DELIVERY-COUNTRY':'Delivery country',
      'LABEL-TABLE-HEADER-DELIVERY-COSTS':'Costs',

      // BUTTON
      'BUTTON-EDIT-DELIVERY-OPTION':'Edit delivery option',
      'BUTTON-ADD-DELIVERY-OPTION':'Add new delivery option',
      'MESSAGE-NO-DELIVERY':'No delivery yet, why dont you',

      // VIEW ----- edit-delivery.client.view.html ------
      // LABELS
      'BREADCRUMB-DELIVERY-EDIT':'Delivery Edit',
      'LABEL-DELIVERY-TITLE':'Delivery Duration',
      'LABEL-DELIVERY-DURATION':'Delivery Duration',
      'LABEL-DELIVERY-COUNTRY':'Delivery Country',
      'LABEL-DELIVERY-COST':'Delivery Cost',

      'LABEL-TOOLTIP-COST-FORMAT':'Please enter delivery costs in the format 3.40 or 0.55 - there are no commas possible.',

      // ERROR
      'VALIDATION-DELIVERY-TITLE':'Delivery title is required.',
      'VALIDATION-DELIVERY-DURATION':'Delivery Duration is required.',
      'VALIDATION-DELIVERY-COUNTRY':'Delivery Country is required.',
      'VALIDATION-DELIVERY-COST':'Delivery Cost is required.',

      // BUTTON
      'BUTTON-UPDATE-DELIVERY':'Update delivery data',

      // VIEW ----- create-delivery.client.view.html ------
      // LABELS
      'BREADCRUMB-DELIVERY-CREATE':'Delivery Create',

      // BUTTON
      'BUTTON-SAVE-DELIVERY':'Save delivery data',

      // VIEW ----- create-legal.client.view.html ------
      // LABELS
      'BREADCRUMB-LEGAL-CREATE':'Legal Create',
      'LABEL-LEGAL-OPTION':'Legal option',

      // VIEW ----- list-legal.client.view.html ------
      // LABELS
      'BREADCRUMB-LEGAL':'Legal',
      'LABEL-TABLE-HEADER-LEGAL-TITLE':'Title',
      'LABEL-TABLE-HEADER-LEGAL-PURPOSE':'Purpose',
      'LABEL-LEGAL-PRIVACYPOLICY':'Privacy Policy',
      'LABEL-LEGAL-RETURNPOLICY':'Return Policy',
      'LABEL-LEGAL-TERMSANDCONDITIONS':'Terms and Conditions',
      'LABEL-LEGAL-IMPRINT':'Imprint',
      'LABEL-LEGAL-COPYRIGHT':'Copyright',
      'TEXT-LEGAL-NOTE-INF-REQUIRED':'Your legal information is required. Please maintain all information!',

      // BUTTON
      'BUTTON-EDIT':'Edit',

      // VIEW ----- edit-legal.client.view.html ------
      // LABELS
      'BREADCRUMB-PRIVACYPOLICY-EDIT':'Edit Privacy Policy',

      // BUTTON
      'BUTTON-UPDATE-PRIVACY-POLICY':'Update Privacy Policy',

      // ERROR
      'VALIDATION-PRIVACYPOLICY-REQ':'Privacy policy is required.',

      // VIEW ----- edit-legal-copyright.client.view.html ------
      // LABELS
      'BREADCRUMB-COPYRIGHT-EDIT':'Edit Copyright',

      // BUTTON
      'BUTTON-RETURN-TO-LEGAL':'Return to legal overview',
      'BUTTON-UPDATE-COPYRIGHT':'Update Copyright',

      // ERROR
      'VALIDATION-COPYRIGHT-REQ':'Copyright is required.',

      // VIEW ----- edit-legal-imprint.client.view.html ------
      // LABELS
      'BREADCRUMB-IMPRINT-EDIT':'Edit Imprint',

      // BUTTON
      'BUTTON-UPDATE-IMPRINT':'Update Imprint',

      // ERROR
      'VALIDATION-IMRPINT-REQ':'Imprint is required.',

      // VIEW ----- edit-legal-returnpolicy.client.view.html ------
      // LABELS
      'BREADCRUMB-RETURNPOLICY-EDIT':'Edit Return Policy',

      // BUTTON
      'BUTTON-UPDATE-RETURNPOLICY':'Update Return Policy',

      // ERROR
      'VALIDATION-RETURNPOLICY-REQ':'Return Policy is required.',

      // VIEW ----- edit-legal-termsandcondition.client.view.html ------
      // LABELS
      'BREADCRUMB-TERMSCONDITION-EDIT':'Edit Terms and Conditions',

      // BUTTON
      'BUTTON-UPDATE-TERMSCONDITION':'Update Terms and Conditions',

      // ERROR
      'VALIDATION-TERMSCONDITION-REQ':'Terms and Conditions are required.',

      // VIEW ----- create-taxes.client.view.html ------
      // LABELS
      'BREADCRUMB-TAXES-CREATE':'Create Taxes',
      'LABEL-TAXES-OPTION':'Tax options',
      'LABEL-TAXES-COUNTRY':'Country',
      'LABEL-TAXES-TAXRATE':'Tax Rate',

      // ERROR
      'VALIDATION-TAXES-COUNTRY-REQ':'Tax Country is required.',
      'VALIDATION-TAXES-TAXRATE-REQ':'Tax Rate is required.',

      // BUTTON
      'BUTTON-SAVE-TAXRATE':'Save tax rate data',

      // VIEW ----- edit-taxes.client.view.html ------
      // LABELS
      'BREADCRUMB-TAXES-EDIT':'Edit Taxes',

      // BUTTON
      'BUTTON-UPDATE-TAXRATE':'Update tax rate data',

      // VIEW ----- list-taxes.client.view.html ------
      // LABELS
      'BREADCRUMB-TAXES':'Taxes',
      'LABEL-TABLE-HEADER-TAXES-CODE':'Code',
      'LABEL-TABLE-HEADER-TAXES-VALUE':'Value',

      // ERROR
      'MESSAGE-NO-TAXES':'No tax row yet, why dont you',

      // BUTTON
      'BUTTON-EDIT-TAXRATE-OPTION':'Edit tax option',
      'BUTTON-ADD-NEW-TAXRATE':'Add new tax option',

      // VIEW ----- list-order.client.view.html ------
      // LABELS
      'BREADCRUMB-ORDER':'Orders',
      'LABEL-OPEN-ORDERS':'Your Open Orders',
      'LABEL-SHIPPED-ORDERS':'Your Shipped Orders',
      'LABEL-RETURNED-ORDERS':'Your Returned Orders',
      'LABEL-TABLE-HEADER-ORDER-ID':'Order ID',
      'LABEL-TABLE-HEADER-DATE':'Date',
      'LABEL-TABLE-HEADER-CUSTOMER':'Customer',
      'LABEL-TABLE-HEADER-PAYMENT':'Payment',
      'LABEL-TABLE-HEADER-ORDER-STATUS':'Order Status',

      // BUTTON
      'BUTTON-VIEW-DETAILS':'View details',
      'BUTTON-RECEIVE-RETURN':'Receive Return',
      'BUTTON-SHIP-ORDER':'Ship Order',

      // MESSAGE
      'MESSAGE-NO-ORDERS-RETURNED':'No orders have been returned yet.',
      'MESSAGE-NO-ORDERS-SHIPPED':'No orders have been shipped yet.',
      'MESSAGE-NO-ORDERS-PLACED':'No orders have been placed yet.',

      // VIEW ----- cancel-order.modal.view.html ------
      // LABELS
      'LABEL-CANCEL-ORDER':'Cancel order',
      'TEXT-NOTE-ADD-ADDITIONAL-CUSTOMER-MESSAGE':'Add an individual message for the customer (optional) ',
      'TEXT-NOTE-MAKE-SURE-TO-REFUND':'Please note: If you cancel an order make sure to refund already paid items.',

      // BUTTON
      'BUTTON-CLOSE':'Close',
      'BUTTON-CANCEL-ORDER':'Cancel order',

      // VIEW ----- receive-return.modal.view.html ------
      // LABELS
      'LABEL-RECEIVE-RETURN':'Receive return',
      'TEXT-NOTE-MAKE-SURE-TO-REFUND-PAYMENT-INFO':'Please note: Make sure to refund paid items manually upon receipt of a return. You will find the payment information on the detail page of this order.',
      'TEXT-NOTE-RETURN-CONFIRMATION':'By receiving the return, your customer will automatically receive a standard return confirmation ',

      // VIEW ----- ship-order.modal.view.html ------
      // LABELS
      'LABEL-SHIP-ORDER':'Receive return',
      'TEXT-NOTE-TRACKING-ID-LINK':'Tracking ID or Link (optional) ',
      'TEXT-NOTE-SHIPPING-NOTE-CUSTOMER-RECEIVE':'Please note: By shipping the order, your customer will automatically receive a standard shipping confirmation.',

      // BUTTON
      'BUTTON-YES-SHIP-ORDER':'Yes, ship order',

      // VIEW ----- list-order.client.view.html ------
      // LABELS
      'BREADCRUMB-ORDER-DETAIL':'Orders Detail',
      'LABEL-PAYMENT-STATUS':' Payment Status ',
      'LABEL-ORDER-STATUS':' Order Status ',
      'LABEL-PAYMENT-DATE':' Payment Date ',
      'LABEL-ORDERED-VIA':' Ordered via ',
      'LABEL-BILLING-ADDRESS':'Billing Address',
      'LABEL-SHIPPING-ADDRESS':'Shipping Address',
      'LABEL-EMAIL-ADDRESS':'eMail Address',
      'LABEL-SUBTOTAL':' Subtotal ',
      'LABEL-SHIPPING-COST':' Shipping Cost ',
      'LABEL-TOTAL-AMOUNT':' Total Amount ',
      'LABEL-INCL-VAT':' Incl. VAT (',
      'LABEL-TRACKING-NO':' Tracking number ',
      'LABEL-PRODUCT-NO':'Product No.',
      'LABEL-PRODUCT-TITLE':'Product Title',
      'LABEL-PRODUCT-PRICE':'Product Price',
      'LABEL-QUANTITY':'Quantity',
      'LABEL-PAYMENT-DETAILS':'Payment Details',
      'LABEL-PAYMENT-TYPE':'Payment Type',
      'LABEL-ACCOUNT-ID':'Account ID',
      'LABEL-TRANSACTION-ID':'Transaction ID',
      'LABEL-ORDERED-PRODUCTS':'Ordered product',
      'TEXT-TOOLTIP-HOW-REVIEW-ORDER':'To verify payment and to process a return open your PayPal account and enter PayPal Account ID of your customer and/or Transaction ID for this order .',

      // BUTTON
      'BUTTON-GO-TO-PRODUCT':'Go to product',
      'BUTTON-BACK-ORDER-OVERVIEW':'Back to order overview',

      // VIEW ----- list-post.client.view.html ------
      // LABELS
      'BREADCRUMB-POSTS-OVERVIEW':'Post Overview',
      'LABEL-POST-YOUR':'Your Posts',
      'LABEL-POST-CHANNEL':'Post Channel',
      'LABEL-POST-PUBLICATION-DATE':'Publication Date',
      'LABEL-POST-STATUS':'Post Status',
      'LABEL-PRODUCT':'Product',

      // MESSAGE
      'MESSAGE-NO-POSTS-YET':'You have no posts yet. Create your first product post!',

      // BUTTON
      'BUTTON-ADD-POST':'Add a post ',
      'BUTTON-VIEW-POST':'View Post',

      // VIEW ----- header.client.view.html ------
      // LABELS
      'LABEL-HEADER-DASHBOARD':' Dashboard',
      'LABEL-HEADER-TUTORIAL':' Tutorial',
      'TEXT-YOU-HAVE':' You have ',
      'TEXT-OPEN-ORDERS':' open orders ',
      'TEXT-STATUS-CREATED':'(Status: CREATED)',
      'LABEL-CUSTOMER':'customer',
      'LABEL-ORDER-AMOUNT':'order amount',
      'LABEL-VIA-CHANNEL':'order via',
      'LABEL-SEE-ALL-ORDERS':'See All Orders',
      'LABEL-PROFILE':'Profile',
      'LABEL-LOGO':'Logo',
      'LABEL-PAYMENT':'Payment',
      'LABEL-LOGOUT':'Log out',
      'LABEL-SUBSCRIPTION':'Subscription',
      'LABEL-CHANGE-PASSWORD':'Change Password',

      // VIEW ----- footer.client.view.html ------
      // LABELS
      'LABEL-IMPRINT':'Impressum & Haftungsausschluss',
      'LABEL-DATASECURITY':'Datenschutz',
      'LABEL-TERMS':'AGB',
      'LABEL-CONTACT':'Kontakt',

      // VIEW ----- home.client.view.html ------
      // LABELS
      'LABEL-YOUR-ORDERS':'Your Orders',
      'LABEL-PERFORMANCE-OVERVIEW':'Performance Overview',
      'TEXT-AVERAGE-VALUE-SALES':'Average value of sales in the past month:',
      'TEXT-ALL-SALES-YEAR':'All sales this year: feature comeing soon',
      'LABEL-THIS-MONTH-REVENUE':'This month revenue',
      'LABEL-UPDATE-ON':'Update on',
      'LABEL-MONTH':'Month',
      'LABEL-ORDERS-THIS-MONTH':'Orders this month',
      'LABEL-ORDERS-VOLUME':'Orders Volume',
      'LABEL-ORDERS-VOLUME-THIS-MONTH':'Orders volumes this month',
      'LABEL-TODAY-ORDERS':'Today Orders',

      // BUTTON
      'BUTTON-ALL-ORDERS':'all orders',

      // VIEW ----- tutorial.client.view.html ------
      // LABELS
      'LABEL-WELCOME':'Welcome',
      'LABEL-ADD-COMPANY-DETAILS':'Add your company details',
      'LABEL-ADD-BASICS-COMPANY-DETAILS':'The basics. Please add your company details.',
      'LABEL-COMPLETED':'Completed',
      'LABEL-MAINTAIN-COMPANY-DATA':'Maintain company data',
      'LABEL-ADD-LEGAL-DATA':'Maintain your legal data',
      'LABEL-NOTE-ADD-TERMS-AND-CONDITIONS':'Please add your terms and conditions, return policies, data policies and impress to make sure that your offer complies with legal regulatory.',
      'LABEL-MAINTAIN-LEGAL-DATA':'Maintain legal data',
      'LABEL-ADD-PAYPAL':'Connect your PayPal account',
      'LABEL-NOTE-ADD-PAYPAL':'Activate your PayPal account to facilitate checkout for your customers and to enable payments to your account.',
      'LABEL-CONNECT-TO-PAYPAL':'Connect to Paypal',
      'LABEL-ADD-DELIVERY-OPTION':'Add your delivery options',
      'LABEL-NOTE-ADD-DELIVERY-OPTION':'Enable customers to select their preferred delivery option by adding your delivery options.',
      'LABEL-NOTE-HINT-ADDED-DELIVERY-OPTION':'Note: We added a standard delivery option for 3,50 € when setting up your account. In case that doesnt fit to your delivery costs, you easily can change this option - by clicking on "Maintain delivery options".',
      'LABEL-VERIFY-DELIVERY-OPTION':'Verify delivery options',
      'LABEL-MAINTAIN-FIRST-PRODUCT':'Maintain your first product ',
      'LABEL-NOTE-MAINTAIN-FIRST-PRODUCT':'Maintain title, description, and pricing of your first product. Add an image of your product that is appealing to your customers.. ',
      'LABEL-MAINTAIN-PRODUCT':'Maintain product',

      // ERROR
      'MESSAGE-EXPLAIN-TUTORIAL':'Take these 5 steps and you are ready to sell products on your customers favorite social channels and market places.',

    });

    $translateProvider.translations('en-EN', {
      // BREADCRUMB
      'BREADCRUMB-HOME':'Home',
      'BREADCRUMB-LOGO':'Logo',
      'BREADCRUMB-SHOP-SETTINGS':'Shop Settings',
      'BREADCRUMB-SETTINGS':'Settings',

      // VIEW ----- signin.client.view.html ------
      // LABELS
      'LABEL-EMAIL':'eMail',
      'LABEL-PASSWORD':'Password',
      'PLACEHOLDER-LABEL-EMAIL':'email ...',
      'PLACEHOLDER-LABEL-PASSWORD':'password...',
      'HEADLINE-SUB-WELCOME-BACK': 'Willkommen zurück! Log dich ein und sieh nach deinen Produkten, Posts und Bestellungen. ',

      // BUTTONS
      'BUTTON-TEXT-SIGNIN': 'Sign in',
      'BUTTON-TEXT-SIGNUP': 'Sign up',
      'BUTTON-TEXT-FORGOTPWD': 'Forgot password',

      // VALDIATIONS
      'VALIDATION-REQ-EMAIL':'eMail is required.',
      'VALIDATION-REQ-PASSWORD':'Password is required.',

      // ERRORS

      // VIEW ----- signup.client.view.html ------
      // LABELS
      'HEADLINE-SIGNUP':'mightymerce Registrierung',
      'HEADLINE-SUB-SIGNUP-WELCOME':'Verkaufe deine Produkte ganz einfach über die sozialen Kanäle und Marktplätze. Und das alles über eine zentrale Stelle. Ganz einfach. Versprochen.',
      'PLACEHOLDER-LABEL-SHOPNAME':'shopname',
      'LABEL-OR':'or',

      // VALDIATIONS
      'VALIDATION-VALID-EMAIL':'eMail not valid.',
      'VALIDATION-VALID-PASSWORD':'Password is required.',
      'VALIDATION-REQUIREMENTS-PASSWORD':'Password requirements',

      // ERRORS
      'PASSWORD-POPOVER-MESSAGE':'Please enter a passphrase or password with greater than 10 characters, numbers, lowercase, upppercase, and special characters.',

      // VIEW ----- forgot-password.client.view.html ------
      // LABELS
      'HEADLINE-SUB-FORGOTPWD':'Forgot password?',

      // BUTTONS
      'BUTTON-TEXT-SUBMIT': 'Submit',

      // VIEW ----- reset-password.client.view.html ------
      // LABELS
      'HEADLINE-SUB-RESETPWD':'Reset your password',
      'LABEL-NEW-PASSWORD':'New Password',
      'LABEL-VERIFY-PASSWORD':'Verify Password',

      // BUTTONS
      'BUTTON-UPDATE-PASSWORD':'Update Password',

      // ERROR
      'VALIDATION-ENTER-NEW-PASSWORD':'Enter a new password.',
      'VALIDATION-ENTER-PASSWORD-AGAIN':'Enter the password again to verify.',
      'VALIDATION-PASSWORD-MATCH':'Passwords do not match.',

      // VIEW ----- reset-password-invalid.client.view.html ------
      // LABELS
      'HEADLINE-SUB-RESETPWD-INVALID':'Password reset is invalid',

      // ERRORS
      'MESSAGE-ASK-NEW-PASSWORD':'Ask for a new password reset',

      // VIEW ----- reset-password-success.client.view.html ------
      // LABELS
      'HEADLINE-SUB-RESETPWD-SUCCESS':'Password successfully reset',

      // ERROR
      'MESSAGE-CONTINUE-DASHBOARD':'Continue to your dashboard',

      // VIEW ----- change-password.client.view.html ------
      // LABELS
      'LABEL-CURRENT-PASSWORD':'Current Password',
      'PLACEHOLDER-LABEL-CURRENT-PASSWORD':'Current Password',

      // BUTTON
      'BUTTON-SAVE-PASSWORD':'Save Password',

      // ERROR
      'VALIDATION-CURRENT-PASSWORD-REQ':'Your current password is required.',
      'VALIDATION-CHANGED-PWD-SUCCESS':'Password Changed Successfully',

      // VIEW ----- change-profile-picture.client.view.html ------
      // LABELS
      'HEADLINE-SUB-YOUR-CURRENT-LOGO':'Your current Logo',
      'HEADLINE-SUB-UPLOAD-NEW-LOGO':'Upload new Logo',
      'LABEL-PREVIEW-IMAGE':'Preview image',
      'LABEL-NOTE-BEST-FIT-LOGO':'Note: Best fit for Logo image ...px / ...px',

      // BUTTON
      'BUTTON-SAVE-IMAGE':'Save image',
      'BUTTON-CANCEL':'Cancel',
      'BUTTON-SELECT-IMAGE':'Select Image ',

      // ERROR
      'MESSAGE-SUCCESS-LOGO-CHANGED':'Logo changed Successfully',

      // VIEW ----- edit-payment.client.view.html ------
      // LABELS
      'HEADLINE-SUB-PAYMENT':'Payment',
      'HEADLINE-SUB-PAYPAL-PAYMENT-GATEWAY':'Paypal payment gateway',
      'HEADLINE-SUB-PAYPAL-BUSINESS-ACCOUNT':'Schritt 1 - Geschäftskonto einrichten',
      'HEADLINE-SUB-PAYPAL-SIGNATURE-ACCESS':'Schritt 2 - API Signatur abrufen',
      'HEADLINE-SUB-PAYPAL-SIGNATURE-ENTER':'Schritt 3 - API Signatur übertragen',
      'HEADLINE-SUB-PAYPAL-CREDENTIALS':'Paypal Credentials',
      'LABEL-PAYPAL-API-USER':'Paypal API User*',
      'LABEL-PAYPAL-API-PWD':'Paypal API Password*',
      'LABEL-PAYPAL-API-SIG':'Paypal API Signature*',

      // TEXT
      'TEXT-PAYPAL-EXPRESS-I':'Deine Kunden können im mightymerce Checkout mit Paypal Express bei dir einkaufen.',
      'TEXT-PAYPAL-EXPRESS-II':'Diese PDF-Anleitung von PayPal zeigt dir, wie du ein Geschäftskonto einrichtest, wenn du noch keines hast:',
      'TEXT-PAYPAL-EXPRESS-III':'Zur Anleitung von PayPal',
      'TEXT-PAYPAL-EXPRESS-IIII':'Bitte richte als Zahlart ',
      'TEXT-PAYPAL-EXPRESS':'PayPal Express',
      'TEXT-PAYPAL-EXPRESS-IIIII':' ein.',
      'TEXT-PAYPAL-SIGNATURE':'Sobald dein Geschäftskonto eingerichtet ist, benötigen wir eine sogenannte API Signatur von dir. Diese brauchen wir, um dein mightymerce Konto mit deinem PayPal Geschäftskonto zu verbinden. Das Video von PayPal zeigt dir, wie das geht.',
      'TEXT-PAYPAL-SIGNATURE-ENTER':'Dein Konto ist eingerichtet und deine Daten sind vollständig. Kopiere jetzt die Daten von PayPal in die nachfolgenden Felder und Bestätige deine Eingabe. FERTIG ! Deine Kunden können jetzt bei dir einkaufen.',

      // ERROR
      'VALIDATION-PAYPAL-API-USER-REQ':'Paypal api user is required.',
      'VALIDATION-PAYPAL-API-PWD-REQ':'Paypal api password is required.',
      'VALIDATION-PAYPAL-API-SIG-REQ':'Paypal api signature is required.',

      // BUTTON
      'BUTTON-BACK-TUTORIAL':'Return to tutorial',
      'BUTTON-UPDATE-PAYPAL-DATA':'Update paypal data',

      // VIEW ----- edit-profile.client.view.html ------
      // LABELS
      'HEADLINE-ACCOUNT-AREA':'User',
      'HEADLINE-SUB-EDIT-PROFILE':'Profile',
      'HEADLINE-SUB-COMPANY-DETAILS':'Company Details',
      'NOTE-PROVIDE-COMPANY-DETAILS':'For the receipt of a monthly invoice, please provide your company’s address details.',
      'LABEL-COMPANY-NAME':'Company Name',
      'LABEL-FIRST-NAME':'First Name',
      'LABEL-LAST-NAME':'Last Name',
      'LABEL-STREET':'Street',
      'LABEL-STREET-NO':'Street No',
      'LABEL-ZIP-CODE':'Zip Code',
      'LABEL-CITY':'City',

      // ERROR
      'VALIDATION-COMPANY-NAME-REQ':'Company Name is required.',
      'VALIDATION-FIRST-NAME-REQ':'First Name is required.',
      'VALIDATION-LAST-NAME-REQ':'Last Name is required.',
      'VALIDATION-STREET-REQ':'Street is required.',
      'VALIDATION-STREET-NO-REQ':'Street No. is required.',
      'VALIDATION-ZIP-CODE-REQ':'Zip Code is required.',
      'VALIDATION-CITY-REQ':'City is required.',

      // BUTTON
      'BUTTON-UPDATE-PROFILE-DATA':'Update profile data',

      // VIEW ----- subscription.client.view.html ------
      // LABELS
      'HEADLINE-SUB-SUBSCRIPTION':'Subscription',
      'HEADLINE-SUB-YOUR-SUBSCRIPTION':'Your subscription',
      'TEXT-YOUR-SUBSCRIPTION':'Based on the growth of your business your are able to manage your subscriptions by upgrading or downsizing your plans.',
      'LABEL-YOUR-SUBSCRIPTION':'Your plan',
      'LABEL-MOST-POPULAR':'Most popular',
      'LABEL-FREE-SUBSCRIPTION':'FREE',
      'LABEL-FIVE-PRODUCTS':'5 different products',
      'LABEL-TEN-PRODUCTS':'10 different products',
      'LABEL-HUNDRED-PRODUCTS':'100 different products',
      'LABEL-UNLIMITED-PRODUCTS':'unlimited different products',
      'LABEL-ALL-AVAILABLE':'All available',
      'LABEL-TO-SELL':'to sell',
      'LABEL-SALES-CHANNELS':'sales channels',
      'LABEL-SUBSCRIPTION-BASIC':'Basic',
      'LABEL-SUBSCRIPTION-MONTHLY':'Monthly',
      'LABEL-SUBSCRIPTION-PROFESSIONAL':'Professional',
      'LABEL-SUBSCRIPTION-UNLIMITED':'Unlimited',

      // BUTTON
      'BUTTON-RETURN-FREE-SUBSCRIPTION':'Return to free subscription now!',
      'BUTTON-UPGRADE-SUBSCRIPTION':'Upgrade subscription now!',
      'BUTTON-DOWNGRADE-SUBSCRIPTION':'Downgrade subscription now!',

      // VIEW ----- create-currency.client.view.html ------
      // LABELS
      'BREADCRUMB-CURRENCY-CREATE':'Currency - Create',
      'LABEL-CURRENCY-OPTION':'Currency option',
      'LABEL-CURRENCY-CODE':'Currency Code',
      'LABEL-CURRENCY-VALUE':'Currency Value',

      // ERROR
      'VALIDATION-CURRENCY-CODE':'Currency Code is required.',
      'VALIDATION-CURRENCY-VALUE':'Currency Value is required.',

      // BUTTON
      'BUTTON-SAVE-CURRENCY':'Save currency data',

      // VIEW ----- list-currency.client.view.html ------
      // LABELS
      'BREADCRUMB-CURRENCY':'Currency',
      'LABEL-CURRENCY-ROWS':'Currency rows',
      'TEXT-CURRENCY-NOTE':'NOTE: You will be able to add more currencies soon. At that point of time only EUR is available.',
      'LABEL-CURRENCY-CODE-TABLE-HEADER':'Code',
      'LABEL-CURRENCY-VALUE-TABLE-HEADER':'Value',

      // ERROR
      'MESSAGE-NO-CURRENCY':'No currency yet, why dont you',
      'MESSAGE-NO-CREATE-ONE':'create one',

      // VIEW ----- edit-currency.client.view.html ------
      // LABELS
      'BREADCRUMB-CURRENCY-EDIT':'Currency - Edit',

      // BUTTON
      'BUTTON-UPDATE-CURRENCY':'Update currency data',

      // VIEW ----- list-delivery.client.view.html ------
      // LABELS
      'BREADCRUMB-DELIVERY':'Delivery',
      'LABEL-DELIVERY-OPTION':'Delivery options',
      'LABEL-TABLE-HEADER-DELIVERY-TITLE':'Title',
      'LABEL-TABLE-HEADER-DELIVERY-WITHIN':'Delivered within',
      'LABEL-TABLE-HEADER-DELIVERY-COUNTRY':'Delivery country',
      'LABEL-TABLE-HEADER-DELIVERY-COSTS':'Costs',

      // BUTTON
      'BUTTON-EDIT-DELIVERY-OPTION':'Edit delivery option',
      'BUTTON-ADD-DELIVERY-OPTION':'Add new delivery option',
      'MESSAGE-NO-DELIVERY':'No delivery yet, why dont you',

      // VIEW ----- edit-delivery.client.view.html ------
      // LABELS
      'BREADCRUMB-DELIVERY-EDIT':'Delivery Edit',
      'LABEL-DELIVERY-TITLE':'Delivery Duration',
      'LABEL-DELIVERY-DURATION':'Delivery Duration',
      'LABEL-DELIVERY-COUNTRY':'Delivery Country',
      'LABEL-DELIVERY-COST':'Delivery Cost',

      'LABEL-TOOLTIP-COST-FORMAT':'Please enter delivery costs in the format 3.40 or 0.55 - there are no commas possible.',

      // ERROR
      'VALIDATION-DELIVERY-TITLE':'Delivery title is required.',
      'VALIDATION-DELIVERY-DURATION':'Delivery Duration is required.',
      'VALIDATION-DELIVERY-COUNTRY':'Delivery Country is required.',
      'VALIDATION-DELIVERY-COST':'Delivery Cost is required.',

      // BUTTON
      'BUTTON-UPDATE-DELIVERY':'Update delivery data',

      // VIEW ----- create-delivery.client.view.html ------
      // LABELS
      'BREADCRUMB-DELIVERY-CREATE':'Delivery Create',

      // BUTTON
      'BUTTON-SAVE-DELIVERY':'Save delivery data',

      // VIEW ----- create-legal.client.view.html ------
      // LABELS
      'BREADCRUMB-LEGAL-CREATE':'Legal Create',
      'LABEL-LEGAL-OPTION':'Legal option',

      // VIEW ----- list-legal.client.view.html ------
      // LABELS
      'BREADCRUMB-LEGAL':'Legal',
      'LABEL-TABLE-HEADER-LEGAL-TITLE':'Title',
      'LABEL-TABLE-HEADER-LEGAL-PURPOSE':'Purpose',
      'LABEL-LEGAL-PRIVACYPOLICY':'Privacy Policy',
      'LABEL-LEGAL-RETURNPOLICY':'Return Policy',
      'LABEL-LEGAL-TERMSANDCONDITIONS':'Terms and Conditions',
      'LABEL-LEGAL-IMPRINT':'Imprint',
      'LABEL-LEGAL-COPYRIGHT':'Copyright',
      'TEXT-LEGAL-NOTE-INF-REQUIRED':'Your legal information is required. Please maintain all information!',

      // BUTTON
      'BUTTON-EDIT':'Edit',

      // VIEW ----- edit-legal.client.view.html ------
      // LABELS
      'BREADCRUMB-PRIVACYPOLICY-EDIT':'Edit Privacy Policy',

      // BUTTON
      'BUTTON-UPDATE-PRIVACY-POLICY':'Update Privacy Policy',

      // ERROR
      'VALIDATION-PRIVACYPOLICY-REQ':'Privacy policy is required.',

      // VIEW ----- edit-legal-copyright.client.view.html ------
      // LABELS
      'BREADCRUMB-COPYRIGHT-EDIT':'Edit Copyright',

      // BUTTON
      'BUTTON-RETURN-TO-LEGAL':'Return to legal overview',
      'BUTTON-UPDATE-COPYRIGHT':'Update Copyright',

      // ERROR
      'VALIDATION-COPYRIGHT-REQ':'Copyright is required.',

      // VIEW ----- edit-legal-imprint.client.view.html ------
      // LABELS
      'BREADCRUMB-IMPRINT-EDIT':'Edit Imprint',

      // BUTTON
      'BUTTON-UPDATE-IMPRINT':'Update Imprint',

      // ERROR
      'VALIDATION-IMRPINT-REQ':'Imprint is required.',

      // VIEW ----- edit-legal-returnpolicy.client.view.html ------
      // LABELS
      'BREADCRUMB-RETURNPOLICY-EDIT':'Edit Return Policy',

      // BUTTON
      'BUTTON-UPDATE-RETURNPOLICY':'Update Return Policy',

      // ERROR
      'VALIDATION-RETURNPOLICY-REQ':'Return Policy is required.',

      // VIEW ----- edit-legal-termsandcondition.client.view.html ------
      // LABELS
      'BREADCRUMB-TERMSCONDITION-EDIT':'Edit Terms and Conditions',

      // BUTTON
      'BUTTON-UPDATE-TERMSCONDITION':'Update Terms and Conditions',

      // ERROR
      'VALIDATION-TERMSCONDITION-REQ':'Terms and Conditions are required.',

      // VIEW ----- create-taxes.client.view.html ------
      // LABELS
      'BREADCRUMB-TAXES-CREATE':'Create Taxes',
      'LABEL-TAXES-OPTION':'Tax options',
      'LABEL-TAXES-COUNTRY':'Country',
      'LABEL-TAXES-TAXRATE':'Tax Rate',

      // ERROR
      'VALIDATION-TAXES-COUNTRY-REQ':'Tax Country is required.',
      'VALIDATION-TAXES-TAXRATE-REQ':'Tax Rate is required.',

      // BUTTON
      'BUTTON-SAVE-TAXRATE':'Save tax rate data',

      // VIEW ----- edit-taxes.client.view.html ------
      // LABELS
      'BREADCRUMB-TAXES-EDIT':'Edit Taxes',

      // BUTTON
      'BUTTON-UPDATE-TAXRATE':'Update tax rate data',

      // VIEW ----- list-taxes.client.view.html ------
      // LABELS
      'BREADCRUMB-TAXES':'Taxes',
      'LABEL-TABLE-HEADER-TAXES-CODE':'Code',
      'LABEL-TABLE-HEADER-TAXES-VALUE':'Value',

      // ERROR
      'MESSAGE-NO-TAXES':'No tax row yet, why dont you',

      // BUTTON
      'BUTTON-EDIT-TAXRATE-OPTION':'Edit tax option',
      'BUTTON-ADD-NEW-TAXRATE':'Add new tax option',

      // VIEW ----- list-order.client.view.html ------
      // LABELS
      'BREADCRUMB-ORDER':'Orders',
      'LABEL-OPEN-ORDERS':'Your Open Orders',
      'LABEL-SHIPPED-ORDERS':'Your Shipped Orders',
      'LABEL-RETURNED-ORDERS':'Your Returned Orders',
      'LABEL-TABLE-HEADER-ORDER-ID':'Order ID',
      'LABEL-TABLE-HEADER-DATE':'Date',
      'LABEL-TABLE-HEADER-CUSTOMER':'Customer',
      'LABEL-TABLE-HEADER-PAYMENT':'Payment',
      'LABEL-TABLE-HEADER-ORDER-STATUS':'Order Status',

      // BUTTON
      'BUTTON-VIEW-DETAILS':'View details',
      'BUTTON-RECEIVE-RETURN':'Receive Return',
      'BUTTON-SHIP-ORDER':'Ship Order',

      // MESSAGE
      'MESSAGE-NO-ORDERS-RETURNED':'No orders have been returned yet.',
      'MESSAGE-NO-ORDERS-SHIPPED':'No orders have been shipped yet.',
      'MESSAGE-NO-ORDERS-PLACED':'No orders have been placed yet.',

      // VIEW ----- cancel-order.modal.view.html ------
      // LABELS
      'LABEL-CANCEL-ORDER':'Cancel order',
      'TEXT-NOTE-ADD-ADDITIONAL-CUSTOMER-MESSAGE':'Add an individual message for the customer (optional) ',
      'TEXT-NOTE-MAKE-SURE-TO-REFUND':'Please note: If you cancel an order make sure to refund already paid items.',

      // BUTTON
      'BUTTON-CLOSE':'Close',
      'BUTTON-CANCEL-ORDER':'Cancel order',

      // VIEW ----- receive-return.modal.view.html ------
      // LABELS
      'LABEL-RECEIVE-RETURN':'Receive return',
      'TEXT-NOTE-MAKE-SURE-TO-REFUND-PAYMENT-INFO':'Please note: Make sure to refund paid items manually upon receipt of a return. You will find the payment information on the detail page of this order.',
      'TEXT-NOTE-RETURN-CONFIRMATION':'By receiving the return, your customer will automatically receive a standard return confirmation ',

      // VIEW ----- ship-order.modal.view.html ------
      // LABELS
      'LABEL-SHIP-ORDER':'Receive return',
      'TEXT-NOTE-TRACKING-ID-LINK':'Tracking ID or Link (optional) ',
      'TEXT-NOTE-SHIPPING-NOTE-CUSTOMER-RECEIVE':'Please note: By shipping the order, your customer will automatically receive a standard shipping confirmation.',

      // BUTTON
      'BUTTON-YES-SHIP-ORDER':'Yes, ship order',

      // VIEW ----- list-order.client.view.html ------
      // LABELS
      'BREADCRUMB-ORDER-DETAIL':'Orders Detail',
      'LABEL-PAYMENT-STATUS':' Payment Status ',
      'LABEL-ORDER-STATUS':' Order Status ',
      'LABEL-PAYMENT-DATE':' Payment Date ',
      'LABEL-ORDERED-VIA':' Ordered via ',
      'LABEL-BILLING-ADDRESS':'Billing Address',
      'LABEL-SHIPPING-ADDRESS':'Shipping Address',
      'LABEL-EMAIL-ADDRESS':'eMail Address',
      'LABEL-SUBTOTAL':' Subtotal ',
      'LABEL-SHIPPING-COST':' Shipping Cost ',
      'LABEL-TOTAL-AMOUNT':' Total Amount ',
      'LABEL-INCL-VAT':' Incl. VAT (',
      'LABEL-TRACKING-NO':' Tracking number ',
      'LABEL-PRODUCT-NO':'Product No.',
      'LABEL-PRODUCT-TITLE':'Product Title',
      'LABEL-PRODUCT-PRICE':'Product Price',
      'LABEL-QUANTITY':'Quantity',
      'LABEL-PAYMENT-DETAILS':'Payment Details',
      'LABEL-PAYMENT-TYPE':'Payment Type',
      'LABEL-ACCOUNT-ID':'Account ID',
      'LABEL-TRANSACTION-ID':'Transaction ID',
      'LABEL-ORDERED-PRODUCTS':'Ordered product',
      'TEXT-TOOLTIP-HOW-REVIEW-ORDER':'To verify payment and to process a return open your PayPal account and enter PayPal Account ID of your customer and/or Transaction ID for this order .',

      // BUTTON
      'BUTTON-GO-TO-PRODUCT':'Go to product',
      'BUTTON-BACK-ORDER-OVERVIEW':'Back to order overview',

      // VIEW ----- list-post.client.view.html ------
      // LABELS
      'BREADCRUMB-POSTS-OVERVIEW':'Post Overview',
      'LABEL-POST-YOUR':'Your Posts',
      'LABEL-POST-CHANNEL':'Post Channel',
      'LABEL-POST-PUBLICATION-DATE':'Publication Date',
      'LABEL-POST-STATUS':'Post Status',
      'LABEL-PRODUCT':'Product',

      // MESSAGE
      'MESSAGE-NO-POSTS-YET':'You have no posts yet. Create your first product post!',

      // BUTTON
      'BUTTON-ADD-POST':'Add a post ',
      'BUTTON-VIEW-POST':'View Post',

      // VIEW ----- header.client.view.html ------
      // LABELS
      'LABEL-HEADER-DASHBOARD':' Dashboard',
      'LABEL-HEADER-TUTORIAL':' Tutorial',
      'TEXT-YOU-HAVE':' You have ',
      'TEXT-OPEN-ORDERS':' open orders ',
      'TEXT-STATUS-CREATED':'(Status: CREATED)',
      'LABEL-CUSTOMER':'customer',
      'LABEL-ORDER-AMOUNT':'order amount',
      'LABEL-VIA-CHANNEL':'order via',
      'LABEL-SEE-ALL-ORDERS':'See All Orders',
      'LABEL-PROFILE':'Profile',
      'LABEL-LOGO':'Logo',
      'LABEL-PAYMENT':'Payment',
      'LABEL-LOGOUT':'Log out',
      'LABEL-SUBSCRIPTION':'Subscription',
      'LABEL-CHANGE-PASSWORD':'Change Password',

      // VIEW ----- footer.client.view.html ------
      // LABELS
      'LABEL-IMPRINT':'Impressum & Haftungsausschluss',
      'LABEL-DATASECURITY':'Datenschutz',
      'LABEL-TERMS':'AGB',
      'LABEL-CONTACT':'Kontakt',

      // VIEW ----- home.client.view.html ------
      // LABELS
      'LABEL-YOUR-ORDERS':'Your Orders',
      'LABEL-PERFORMANCE-OVERVIEW':'Performance Overview',
      'TEXT-AVERAGE-VALUE-SALES':'Average value of sales in the past month:',
      'TEXT-ALL-SALES-YEAR':'All sales this year: feature comeing soon',
      'LABEL-THIS-MONTH-REVENUE':'This month revenue',
      'LABEL-UPDATE-ON':'Update on',
      'LABEL-MONTH':'Month',
      'LABEL-ORDERS-THIS-MONTH':'Orders this month',
      'LABEL-ORDERS-VOLUME':'Orders Volume',
      'LABEL-ORDERS-VOLUME-THIS-MONTH':'Orders volumes this month',
      'LABEL-TODAY-ORDERS':'Today Orders',

      // BUTTON
      'BUTTON-ALL-ORDERS':'all orders',

      // VIEW ----- tutorial.client.view.html ------
      // LABELS
      'LABEL-WELCOME':'Welcome',
      'LABEL-ADD-COMPANY-DETAILS':'Add your company details',
      'LABEL-ADD-BASICS-COMPANY-DETAILS':'The basics. Please add your company details.',
      'LABEL-COMPLETED':'Completed',
      'LABEL-MAINTAIN-COMPANY-DATA':'Maintain company data',
      'LABEL-ADD-LEGAL-DATA':'Maintain your legal data',
      'LABEL-NOTE-ADD-TERMS-AND-CONDITIONS':'Please add your terms and conditions, return policies, data policies and impress to make sure that your offer complies with legal regulatory.',
      'LABEL-MAINTAIN-LEGAL-DATA':'Maintain legal data',
      'LABEL-ADD-PAYPAL':'Connect your PayPal account',
      'LABEL-NOTE-ADD-PAYPAL':'Activate your PayPal account to facilitate checkout for your customers and to enable payments to your account.',
      'LABEL-CONNECT-TO-PAYPAL':'Connect to Paypal',
      'LABEL-ADD-DELIVERY-OPTION':'Add your delivery options',
      'LABEL-NOTE-ADD-DELIVERY-OPTION':'Enable customers to select their preferred delivery option by adding your delivery options.',
      'LABEL-NOTE-HINT-ADDED-DELIVERY-OPTION':'Note: We added a standard delivery option for 3,50 € when setting up your account. In case that doesnt fit to your delivery costs, you easily can change this option - by clicking on "Maintain delivery options".',
      'LABEL-VERIFY-DELIVERY-OPTION':'Verify delivery options',
      'LABEL-MAINTAIN-FIRST-PRODUCT':'Maintain your first product ',
      'LABEL-NOTE-MAINTAIN-FIRST-PRODUCT':'Maintain title, description, and pricing of your first product. Add an image of your product that is appealing to your customers.. ',
      'LABEL-MAINTAIN-PRODUCT':'Maintain product',

      // ERROR
      'MESSAGE-EXPLAIN-TUTORIAL':'Take these 5 steps and you are ready to sell products on your customers favorite social channels and market places.',

  });

    /*
    $translateProvider.useStaticFilesLoader({
      prefix: '/languages/',
      suffix: '.json'
    });
    $translateProvider.useLocalStorage();
    */

    $translateProvider.preferredLanguage('en-EN');

  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(function ($rootScope, $state, $window, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  $rootScope.$on('$viewContentLoaded', function(){

    var interval = setInterval(function(){
      if (document.readyState == "complete") {
        window.scrollTo(0, 0);
        clearInterval(interval);
      }
    },200);

  });


  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored 
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
});

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
