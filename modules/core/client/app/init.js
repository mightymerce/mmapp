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
        'BREADCRUMB-SHOP-SETTINGS':'Shop Einstellungen',
        'BREADCRUMB-SETTINGS':'Einstellungen',

        // VIEW ----- signin.client.view.html ------
        // LABELS
        'LABEL-EMAIL':'E-Mail',
        'LABEL-PASSWORD':'Passwort',
        'PLACEHOLDER-LABEL-EMAIL':'E-Mail',
        'PLACEHOLDER-LABEL-PASSWORD':'Passwort',
        'HEADLINE-SUB-WELCOME-BACK': 'Willkommen zurück! Log dich ein und sieh nach deinen Produkten, Posts und Bestellungen. ',

        // BUTTONS
        'BUTTON-TEXT-SIGNIN': 'Anmelden',
        'BUTTON-TEXT-SIGNUP': 'Registrieren',
        'BUTTON-TEXT-FORGOTPWD': 'Passwort vergessen',

        // VALDIATIONS
        'VALIDATION-REQ-EMAIL':'Bitte gib eine E-Mail-Adresse ein.',
        'VALIDATION-REQ-PASSWORD':'Bitte gib ein Passwort ein.',

        // ERRORS

        // VIEW ----- signup.client.view.html ------
        // LABELS
        'HEADLINE-SIGNUP':'mightymerce Registrierung',
        'HEADLINE-SUB-SIGNUP-WELCOME':'Verkaufe deine Produkte ganz einfach über die sozialen Kanäle und Marktplätze. Und das alles über eine zentrale Stelle. Ganz einfach. Versprochen.',
        'PLACEHOLDER-LABEL-SHOPNAME':'Firma',
        'LABEL-OR':'oder',

        // VALDIATIONS
        'VALIDATION-VALID-EMAIL':'Bitte prüfe das Format deiner E-Mail-Adresse. ',
        'VALIDATION-VALID-PASSWORD':'Bitte prüfe deine Passworteingabe.',
        'VALIDATION-REQUIREMENTS-PASSWORD':'Passwortsicherheit.',

        // ERRORS
        'PASSWORD-POPOVER-MESSAGE':'Bitte gib ein Passwort ein.',

        // VIEW ----- forgot-password.client.view.html ------
        // LABELS
        'HEADLINE-SUB-FORGOTPWD':'Passwort vergessen?',

        // BUTTONS
        'BUTTON-TEXT-SUBMIT': 'Absenden',

        // VIEW ----- reset-password.client.view.html ------
        // LABELS
        'HEADLINE-SUB-RESETPWD':'Passwort zurücksetzen',
        'LABEL-NEW-PASSWORD':'Neues Passwort',
        'LABEL-VERIFY-PASSWORD':'Passwort verifizieren',

        // BUTTONS
        'BUTTON-UPDATE-PASSWORD':'Passwort aktualisieren',

        // ERROR
        'VALIDATION-ENTER-NEW-PASSWORD':'Bitte gib ein neues Passwort ein.',
        'VALIDATION-ENTER-PASSWORD-AGAIN':'Bitte gib zur Verifizierung dein Passwort erneut ein.',
        'VALIDATION-PASSWORD-MATCH':'Bitte prüfe Passwort und Passwort Wiederholung - sie stimmen nicht überein. ',

        // VIEW ----- reset-password-invalid.client.view.html ------
        // LABELS
        'HEADLINE-SUB-RESETPWD-INVALID':'Aus Sicherheitsgründen ist dein Link zum Zurücksetzen des Passwortes nur eine Stunde gültig. Bitte lass dir einen neuen Link zuschicken.',

        // BUTTONS
        'BUTTON-INVALID-TOKEN-FORGOT-PWD':'Neuen Link zum Zurücksetzen beantragen',

        // ERRORS
        'MESSAGE-ASK-NEW-PASSWORD':'Aus Sicherheitsgründen ist dein Link zum Zurücksetzen des Passwortes nur eine Stunde gültig. Bitte lass dir einen neuen Link zuschicken.',

        // VIEW ----- reset-password-success.client.view.html ------
        // LABELS
        'HEADLINE-SUB-RESETPWD-SUCCESS':'Dein Passwort wurde aktualisiert.',

        // ERROR
        'MESSAGE-CONTINUE-DASHBOARD':'Zurück zum Dashboard',

        // VIEW ----- change-password.client.view.html ------
        // LABELS
        'LABEL-CURRENT-PASSWORD':'Aktuelles Passwort',
        'PLACEHOLDER-LABEL-CURRENT-PASSWORD':'Aktuelles Passwort',

        // BUTTON
        'BUTTON-SAVE-PASSWORD':'Passwort speichern',

        // ERROR
        'VALIDATION-CURRENT-PASSWORD-REQ':'Bitte gib dein bisheriges Passwort ein.',
        'VALIDATION-CHANGED-PWD-SUCCESS':'Dein Passwort wurde aktualisiert.',

        // VIEW ----- change-profile-picture.client.view.html ------
        // LABELS
        'HEADLINE-SUB-YOUR-CURRENT-LOGO':'Dein Logo',
        'HEADLINE-SUB-UPLOAD-NEW-LOGO':'Neues Logo hochladen',
        'LABEL-PREVIEW-IMAGE':'Vorschaubild',
        'LABEL-NOTE-BEST-FIT-LOGO':'Die beste Bildgröße (BxH) für dein Logo ist: 370px x 152px',

        // BUTTON
        'BUTTON-SAVE-IMAGE':'Bild speichern',
        'BUTTON-CANCEL':'Abbrechen',
        'BUTTON-SELECT-IMAGE-LOGO':'Logo auswählen',

        // ERROR
        'MESSAGE-SUCCESS-LOGO-CHANGED':'Dein Logo wurde aktualisiert',

        // VIEW ----- edit-payment.client.view.html ------
        // LABELS
        'HEADLINE-SUB-PAYMENT':'Bezahlung',
        'HEADLINE-SUB-PAYPAL-PAYMENT-GATEWAY':'Paypal Zahlungsdienst',
        'HEADLINE-SUB-PAYPAL-BUSINESS-ACCOUNT':'Schritt 1 - Geschäftskonto einrichten',
        'HEADLINE-SUB-PAYPAL-SIGNATURE-ACCESS':'Schritt 2 - API Signatur abrufen',
        'HEADLINE-SUB-PAYPAL-SIGNATURE-ENTER':'Schritt 3 - API Signatur übertragen',
        'HEADLINE-SUB-PAYPAL-CREDENTIALS':'Paypal Zugangsdaten',
        'LABEL-PAYPAL-API-USER':'Paypal API User',
        'LABEL-PAYPAL-API-PWD':'Paypal API Passwort',
        'LABEL-PAYPAL-API-SIG':'Paypal API Signatur',

        // TEXT
        'TEXT-PAYPAL-EXPRESS-I':'Deine Kunden können im mightymerce Checkout mit Paypal Express bei dir einkaufen.',
        'TEXT-PAYPAL-EXPRESS-II':'Diese PDF-Anleitung von PayPal zeigt dir, wie du ein Geschäftskonto einrichtest, wenn du noch keines hast:',
        'TEXT-PAYPAL-EXPRESS-III':'Zur Anleitung von PayPal',
        'TEXT-PAYPAL-EXPRESS-IIII':'Bitte richte als Zahlart ',
        'TEXT-PAYPAL-EXPRESS':'PayPal Express',
        'TEXT-PAYPAL-EXPRESS-IIIII':' ein.',
        'TEXT-PAYPAL-SIGNATURE':'Sobald dein Geschäftskonto eingerichtet ist, benötigen wir eine so genannte API Signatur von dir. Diese brauchen wir, um dein mightymerce Konto mit deinem PayPal Geschäftskonto zu verbinden. Das Video von PayPal zeigt dir, wie das geht.',
        'TEXT-PAYPAL-SIGNATURE-ENTER':'Dein Konto ist eingerichtet und deine Daten sind vollständig. Kopiere jetzt die Daten von PayPal in die nachfolgenden Felder und Bestätige deine Eingabe. FERTIG ! Deine Kunden können jetzt bei dir einkaufen.',

        // ERROR
        'VALIDATION-PAYPAL-API-USER-REQ':'Bitte gib deinen Paypal API User ein.',
        'VALIDATION-PAYPAL-API-PWD-REQ':'Bitte gib dein Paypal API Passwort ein.',
        'VALIDATION-PAYPAL-API-SIG-REQ':'Bitte gib deine Paypal API Signatur ein.',

        // BUTTON
        'BUTTON-BACK-TUTORIAL':'Zurück zum Tutorial',
        'BUTTON-UPDATE-PAYPAL-DATA':'Daten speichern',

        // VIEW ----- edit-profile.client.view.html ------
        // LABELS
        'HEADLINE-ACCOUNT-AREA':'User',
        'HEADLINE-SUB-EDIT-PROFILE':'Profil',
        'HEADLINE-SUB-COMPANY-DETAILS':'Firmendaten',
        'NOTE-PROVIDE-COMPANY-DETAILS':'Bitte ergänze deine Firmendaten und halte sie aktuell, damit wir dir monatlich eine gültige Rechnung ausstellen können.',
        'LABEL-COMPANY-NAME':'Firma',
        'LABEL-FIRST-NAME':'Vorname',
        'LABEL-LAST-NAME':'Nachname',
        'LABEL-STREET':'Straße',
        'LABEL-STREET-NO':'Hausnummer',
        'LABEL-ZIP-CODE':'PLZ',
        'LABEL-CITY':'Ort',

        // ERROR
        'VALIDATION-COMPANY-NAME-REQ':'Bitte ergänze deine Firma.',
        'VALIDATION-FIRST-NAME-REQ':'Bitte ergänze deinen Vornamen.',
        'VALIDATION-LAST-NAME-REQ':'Bitte ergänze deinen Nachnamen.',
        'VALIDATION-STREET-REQ':'Bitte ergänze die Straße deiner Firmenadresse.',
        'VALIDATION-STREET-NO-REQ':'Bitte ergänze die Hausnummer deiner Firmenadresse.',
        'VALIDATION-ZIP-CODE-REQ':'Bitte ergänze die PLZ deiner Firmenadresse.',
        'VALIDATION-CITY-REQ':'Bitte ergänze die Stadt deiner Firmenadresse.',

        // BUTTON
        'BUTTON-UPDATE-PROFILE-DATA':'Profildaten aktualisieren',

        // VIEW ----- subscription.client.view.html ------
        // LABELS
        'HEADLINE-SUB-SUBSCRIPTION':'Abo verwalten',
        'HEADLINE-SUB-YOUR-SUBSCRIPTION':'Dein mightymerce Abo',
        'TEXT-YOUR-SUBSCRIPTION':'mightymerce passt sich deinem Wachstum an. So kannst du jeden Monat dein mightymerce Abo erhöhen und falls nötig auch verringern.',
        'LABEL-YOUR-SUBSCRIPTION':'Dein gewähltes Abo',
        'LABEL-MOST-POPULAR':'Am beliebtesten',
        'LABEL-FREE-SUBSCRIPTION':'FREE',
        'LABEL-FIVE-PRODUCTS':'Bis zu 5 Produkte',
        'LABEL-TEN-PRODUCTS':'Bis zu 10 Produkte',
        'LABEL-HUNDRED-PRODUCTS':'Bis zu 100 Produkte',
        'LABEL-UNLIMITED-PRODUCTS':'Unbegrenzte Anzahl Produkte',
        'LABEL-ALL-AVAILABLE':'Alle verfügbaren',
        'LABEL-TO-SELL':'zum Verkauf',
        'LABEL-SALES-CHANNELS':'Verkaufskanäle',
        'LABEL-SUBSCRIPTION-BASIC':'Basic',
        'LABEL-SUBSCRIPTION-MONTHLY':'monatlich',
        'LABEL-SUBSCRIPTION-PROFESSIONAL':'Professional',
        'LABEL-SUBSCRIPTION-UNLIMITED':'Unlimited',

        // BUTTON
        'BUTTON-RETURN-FREE-SUBSCRIPTION':'Auf FREE reduzieren!',
        'BUTTON-UPGRADE-SUBSCRIPTION':'Jetzt erhöhen!',
        'BUTTON-DOWNGRADE-SUBSCRIPTION':'Jetzt reduzieren!',

        // VIEW ----- create-currency.client.view.html ------
        // LABELS
        'BREADCRUMB-CURRENCY-CREATE':'Währung anlegen',
        'LABEL-CURRENCY-OPTION':'Währungsoption',
        'LABEL-CURRENCY-CODE':'Währungscode',
        'LABEL-CURRENCY-VALUE':'Wert',

        // ERROR
        'VALIDATION-CURRENCY-CODE':'Bitte gib den Währungscode ein (z.B. EUR).',
        'VALIDATION-CURRENCY-VALUE':'Bitte gib den Prozentwert der Währung ein.',

        // BUTTON
        'BUTTON-SAVE-CURRENCY':'Daten speichern',

        // VIEW ----- list-currency.client.view.html ------
        // LABELS
        'BREADCRUMB-CURRENCY':'Währung',
        'LABEL-CURRENCY-ROWS':'Währungsoption',
        'TEXT-CURRENCY-NOTE':'Bald wird es möglich sein, mehrere Währungen anzulegen - wir arbeiten daran. Für den Moment steht EUR zur Verfügung.',
        'LABEL-CURRENCY-CODE-TABLE-HEADER':'Code',
        'LABEL-CURRENCY-VALUE-TABLE-HEADER':'Wert',

        // ERROR
        'MESSAGE-NO-CURRENCY':'Es ist noch keine Währung gepflegt. Leg jetzt eine an.',
        'MESSAGE-NO-CREATE-ONE':'Jetzt anlegen',

        // VIEW ----- edit-currency.client.view.html ------
        // LABELS
        'BREADCRUMB-CURRENCY-EDIT':'Währung bearbeiten',

        // BUTTON
        'BUTTON-UPDATE-CURRENCY':'Daten speichern',

        // VIEW ----- list-delivery.client.view.html ------
        // LABELS
        'BREADCRUMB-DELIVERY':'Versand',
        'LABEL-DELIVERY-OPTION':'Versandoptionen',
        'LABEL-TABLE-HEADER-DELIVERY-TITLE':'Versandoption',
        'LABEL-TABLE-HEADER-DELIVERY-WITHIN':'Versandbereit innerhalb von',
        'LABEL-TABLE-HEADER-DELIVERY-COUNTRY':'Lieferland',
        'LABEL-TABLE-HEADER-DELIVERY-COSTS':'Versandkosten',

        // BUTTON
        'BUTTON-EDIT-DELIVERY-OPTION':'Versandoptionen bearbeiten',
        'BUTTON-ADD-DELIVERY-OPTION':'Neue Versandoption hinzufügen',
        'MESSAGE-NO-DELIVERY':'Es sind noch keine Lieferoptionen gepflegt. Leg jetzt eine an.',

        // VIEW ----- edit-delivery.client.view.html ------
        // LABELS
        'BREADCRUMB-DELIVERY-EDIT':'Versandoption bearbeiten',
        'LABEL-DELIVERY-TITLE':'Versandoption',
        'LABEL-DELIVERY-DURATION':'Versandbereit innerhalb von',
        'LABEL-DELIVERY-COUNTRY':'Zielland',
        'LABEL-DELIVERY-COST':'Versandkosten',

        'LABEL-TOOLTIP-COST-FORMAT':'Bitte gib den Wert der Versandkosten mit Punkt getrennt statt mit Komma ein - z.B. 3.50',

        // ERROR
        'VALIDATION-DELIVERY-TITLE':'Bitte ergänze den Namen der Versandoption.',
        'VALIDATION-DELIVERY-DURATION':'Bitte ergänze die Versanddauer.',
        'VALIDATION-DELIVERY-COUNTRY':'Bitte ergänze das Lieferland.',
        'VALIDATION-DELIVERY-COST':'Bitte ergänze die Versandkosten.',

        // BUTTON
        'BUTTON-UPDATE-DELIVERY':'Daten speichern',

        // VIEW ----- create-delivery.client.view.html ------
        // LABELS
        'BREADCRUMB-DELIVERY-CREATE':'Versandoption hinzufügen',

        // BUTTON
        'BUTTON-SAVE-DELIVERY':'Daten speichern',

        // VIEW ----- create-legal.client.view.html ------
        // LABELS
        'BREADCRUMB-LEGAL-CREATE':'Rechtstexte hinzufügen',
        'LABEL-LEGAL-OPTION':'Rechtstexte',

        // VIEW ----- list-legal.client.view.html ------
        // LABELS
        'BREADCRUMB-LEGAL':'Rechtstexte',
        'LABEL-TABLE-HEADER-LEGAL-TITLE':'Typ',
        'LABEL-TABLE-HEADER-LEGAL-PURPOSE':'Zweck',
        'LABEL-LEGAL-PRIVACYPOLICY':'Datenschutzerklärung',
        'LABEL-LEGAL-RETURNPOLICY':'Widerrufsbelehrung',
        'LABEL-LEGAL-TERMSANDCONDITIONS':'Allgemeine Geschäftsbedingungen',
        'LABEL-LEGAL-IMPRINT':'Impressum',
        'LABEL-LEGAL-COPYRIGHT':'Copyright',
        'TEXT-LEGAL-NOTE-INF-REQUIRED':'Bitte ergänze alle Daten zu den Rechtstexten - diese Informationen müssen vom Händler zur Verfügung gestellt werden.',

        // BUTTON
        'BUTTON-EDIT':'Bearbeiten',

        // VIEW ----- edit-legal.client.view.html ------
        // LABELS
        'BREADCRUMB-PRIVACYPOLICY-EDIT':'Datenschutzerklärung bearbeiten',

        // BUTTON
        'BUTTON-UPDATE-PRIVACY-POLICY':'Daten speichern',

        // ERROR
        'VALIDATION-PRIVACYPOLICY-REQ':'Bitte ergänze deine Datenschutzerklärung.',

        // VIEW ----- edit-legal-copyright.client.view.html ------
        // LABELS
        'BREADCRUMB-COPYRIGHT-EDIT':'Copyright bearbeiten',

        // BUTTON
        'BUTTON-RETURN-TO-LEGAL':'Zurück zur Übersicht',
        'BUTTON-UPDATE-COPYRIGHT':'Daten speichern',

        // ERROR
        'VALIDATION-COPYRIGHT-REQ':'Bitte ergänze dein Copyright.',

        // VIEW ----- edit-legal-imprint.client.view.html ------
        // LABELS
        'BREADCRUMB-IMPRINT-EDIT':'Impressum bearbeiten',

        // BUTTON
        'BUTTON-UPDATE-IMPRINT':'Daten speichern',

        // ERROR
        'VALIDATION-IMRPINT-REQ':'Bitte ergänze dein Impressum.',

        // VIEW ----- edit-legal-returnpolicy.client.view.html ------
        // LABELS
        'BREADCRUMB-RETURNPOLICY-EDIT':'Widerrufsbelehrung bearbeiten',

        // BUTTON
        'BUTTON-UPDATE-RETURNPOLICY':'Daten speichern',

        // ERROR
        'VALIDATION-RETURNPOLICY-REQ':'Bitte ergänze deine Widerrufsbelehrung.',

        // VIEW ----- edit-legal-termsandcondition.client.view.html ------
        // LABELS
        'BREADCRUMB-TERMSCONDITION-EDIT':'Allgemeine Geschäftsbedingungen bearbeiten',

        // BUTTON
        'BUTTON-UPDATE-TERMSCONDITION':'Daten speichern',

        // ERROR
        'VALIDATION-TERMSCONDITION-REQ':'Bitte ergänze deine Allgemeinen Geschäftsbedingungen.',

        // VIEW ----- create-taxes.client.view.html ------
        // LABELS
        'BREADCRUMB-TAXES-CREATE':'Steuersatz hinzufügen',
        'LABEL-TAXES-OPTION':'Steueroptionen',
        'LABEL-TAXES-COUNTRY':'Land',
        'LABEL-TAXES-TAXRATE':'Steuersatz',

        // ERROR
        'VALIDATION-TAXES-COUNTRY-REQ':'Bitte ergänze das Land für diesen Steuersatz.',
        'VALIDATION-TAXES-TAXRATE-REQ':'Bitte ergänze den Steuersatz.',

        // BUTTON
        'BUTTON-SAVE-TAXRATE':'Daten speichern',

        // VIEW ----- edit-taxes.client.view.html ------
        // LABELS
        'BREADCRUMB-TAXES-EDIT':'Steuersatz bearbeiten',

        // BUTTON
        'BUTTON-UPDATE-TAXRATE':'Daten speichern',

        // VIEW ----- list-taxes.client.view.html ------
        // LABELS
        'BREADCRUMB-TAXES':'Steuersatz',
        'LABEL-TABLE-HEADER-TAXES-CODE':'Code',
        'LABEL-TABLE-HEADER-TAXES-VALUE':'Wert',

        // ERROR
        'MESSAGE-NO-TAXES':'Es ist noch kein Steuersatz gepflegt. Leg jetzt einen an.',

        // BUTTON
        'BUTTON-EDIT-TAXRATE-OPTION':'Steuersatz bearbeiten',
        'BUTTON-ADD-NEW-TAXRATE':'Neuen Steuersatz hinzufügen',

        // VIEW ----- list-order.client.view.html ------
        // LABELS
        'BREADCRUMB-ORDER':'Bestellungen',
        'LABEL-OPEN-ORDERS':'Offenen Bestellungen',
        'LABEL-SHIPPED-ORDERS':'Versendete Bestellungen',
        'LABEL-RETURNED-ORDERS':'Retounierte Bestellungen',
        'LABEL-TABLE-HEADER-ORDER-ID':'Bestellnummer',
        'LABEL-TABLE-HEADER-DATE':'Datum',
        'LABEL-TABLE-HEADER-CUSTOMER':'Kunde',
        'LABEL-TABLE-HEADER-PAYMENT':'Zahlung',
        'LABEL-TABLE-HEADER-ORDER-STATUS':'Bestellstatus',

        // BUTTON
        'BUTTON-VIEW-DETAILS':'Details ansehen',
        'BUTTON-RECEIVE-RETURN':'Retoure bestätigen',
        'BUTTON-SHIP-ORDER':'Versand bestätigen',

        // MESSAGE
        'MESSAGE-NO-ORDERS-RETURNED':'Es wurden noch keine Bestellungen retouniert.',
        'MESSAGE-NO-ORDERS-SHIPPED':'Es wurden noch keine Bestellungen verschickt.',
        'MESSAGE-NO-ORDERS-PLACED':'Es wurden noch keine Bestellungen entgegengenommen.',

        // VIEW ----- cancel-order.modal.view.html ------
        // LABELS
        'LABEL-CANCEL-ORDER':'Bestellung canceln',
        'TEXT-NOTE-ADD-ADDITIONAL-CUSTOMER-MESSAGE':'Ergänze eine individuelle Nachricht an deinen Kunden. Diese wird in der E-Mail ergänzt (optional).',
        'TEXT-NOTE-MAKE-SURE-TO-REFUND':'Bitte beachte, dass beim canceln der Bestellung ggf. eine manuelle Rückbuchung über Paypal erfolgen muss, wenn der Kunde bereits bezahlt hat.',

        // BUTTON
        'BUTTON-CLOSE':'Fenster schließen',
        'BUTTON-CANCEL-ORDER':'Bestellung canceln',

        // VIEW ----- receive-return.modal.view.html ------
        // LABELS
        'LABEL-RECEIVE-RETURN':'Retoure bestätigen',
        'TEXT-NOTE-MAKE-SURE-TO-REFUND-PAYMENT-INFO':'Bitte denk daran, deinem Kunden manuell das Geld für die zurückgesendete Ware zu erstatten. Die Zahlungsinformationen findest du auf der Detailseite der jeweiligen Bestellung. Dir Rückbuchung selbst erfolgt über dein Paypal Konto.',
        'TEXT-NOTE-RETURN-CONFIRMATION':'Dein Kunde wird mit einer automatischen Bestätigungsemail über den Erhalt der Retoure informiert.',

        // VIEW ----- ship-order.modal.view.html ------
        // LABELS
        'LABEL-SHIP-ORDER':'Bestellung versenden',
        'TEXT-NOTE-TRACKING-ID-LINK':'Tracking ID oder Link zur Sendungsverfolgung (optional)',
        'TEXT-NOTE-SHIPPING-NOTE-CUSTOMER-RECEIVE': 'Dein Kunde wird mit einer automatischen Bestätigungsemail über den Versand der Bestellung informiert.',

        // BUTTON
        'BUTTON-YES-SHIP-ORDER':'Bestellung versenden',


        // VIEW ----- list-order.client.view.html ------
        // LABELS
        'BREADCRUMB-ORDER-DETAIL':'Bestelldetail',
        'LABEL-PAYMENT-STATUS':' Zahlungsstatus',
        'LABEL-ORDER-STATUS':' Bestellstatus ',
        'LABEL-PAYMENT-DATE':' Zahlungsdatum ',
        'LABEL-ORDERED-VIA':' Bestellt via',
        'LABEL-BILLING-ADDRESS':'Rechnungsadresse',
        'LABEL-SHIPPING-ADDRESS':'Lieferadresse',
        'LABEL-EMAIL-ADDRESS':'E-Mail-Adresse',
        'LABEL-SUBTOTAL':' Zwischensumme ',
        'LABEL-SHIPPING-COST':' Versandkosten ',
        'LABEL-TOTAL-AMOUNT':' Summe ',
        'LABEL-INCL-VAT':' Inkl. MwSt (',
        'LABEL-TRACKING-NO':' Trackingnummer ',
        'LABEL-PRODUCT-NO':'Produktnummer',
        'LABEL-PRODUCT-TITLE':'Title',
        'LABEL-PRODUCT-PRICE':'Einzelpreis',
        'LABEL-QUANTITY':'Menge',
        'LABEL-PAYMENT-DETAILS':'Zahlungsdetails',
        'LABEL-PAYMENT-TYPE':'Zahlungstyp',
        'LABEL-ACCOUNT-ID':'Kundennummer',
        'LABEL-TRANSACTION-ID':'Transaktionsnummer',
        'LABEL-ORDERED-PRODUCTS':'Bestellte Produkte',
        'TEXT-TOOLTIP-HOW-REVIEW-ORDER':'Um den Zahlungsstatus zu prüfen oder einen retounierten Artikel dieser Bestellung zu erstatten, logge dich bitte in deinen Paypal Account ein. Dort kansnt du entweder nach der Paypal Account ID deines Kunden oder der Transaktionsnummer der Bestellung suchen.',

        // BUTTON
        'BUTTON-GO-TO-PRODUCT':'Zum Produkt',
        'BUTTON-BACK-ORDER-OVERVIEW':'Zurück zur Bestellübersicht',

        // VIEW ----- list-post.client.view.html ------
        // LABELS
        'BREADCRUMB-POSTS-OVERVIEW':'Übersicht Posts',
        'LABEL-POST-YOUR':'Deine Posts',
        'LABEL-POST-CHANNEL':'Kanal',
        'LABEL-POST-PUBLICATION-DATE':'Veröffentlicht am',
        'LABEL-POST-STATUS':'Status Post',
        'LABEL-PRODUCT':'Produkt',

        // MESSAGE
        'MESSAGE-NO-POSTS-YET':'Du hast derzeit noch keine Posts. Poste jetzt dein erstes Produkt!',

        // BUTTON
        'BUTTON-ADD-POST':'Post hinzufügen',
        'BUTTON-VIEW-POST':'Post anzeigen',

        // VIEW ----- header.client.view.html ------
        // LABELS
        'LABEL-HEADER-DASHBOARD':' Dashboard',
        'LABEL-HEADER-TUTORIAL':' Tutorial',
        'TEXT-YOU-HAVE':' Du hast ',
        'TEXT-OPEN-ORDERS':' neue Bestellungen ',
        'TEXT-STATUS-CREATED':'(Status: CREATED)',
        'LABEL-CUSTOMER':'Kunde',
        'LABEL-ORDER-AMOUNT':'Anzahl Bestellungen',
        'LABEL-VIA-CHANNEL':'Bestellt via',
        'LABEL-SEE-ALL-ORDERS':'Alle Bestellungen anzeigen',
        'LABEL-PROFILE':'Profil bearbeiten',
        'LABEL-LOGO':'Logo',
        'LABEL-PAYMENT':'Zahlungen verwalten',
        'LABEL-LOGOUT':'Abmelden',
        'LABEL-SUBSCRIPTION':'Abonement verwalten',
        'LABEL-CHANGE-PASSWORD':'Passwort ändern',

        // VIEW ----- footer.client.view.html ------
        // LABELS
        'LABEL-IMPRINT':'Impressum & Haftungsausschluss',
        'LABEL-DATASECURITY':'Datenschutz',
        'LABEL-TERMS':'AGB',
        'LABEL-CONTACT':'Kontakt',

        // VIEW ----- home.client.view.html ------
        // LABELS
        'LABEL-YOUR-ORDERS':'Deine Bestelleingänge',
        'LABEL-PERFORMANCE-OVERVIEW':'Übersicht Performance',
        'TEXT-AVERAGE-VALUE-SALES':'Durchschnittlicher Bestellwert im letzen Monat:',
        'TEXT-ALL-SALES-YEAR':'Summe Verkäufe aktuelles Jahr (feature coming soon)',
        'LABEL-THIS-MONTH-REVENUE':'Umsatz aktueller Monat',
        'LABEL-UPDATE-ON':'Zuletzt aktualisiert: ',
        'LABEL-MONTH':'Monat',
        'LABEL-ORDERS-THIS-MONTH':'Anzahl Bestelleingänge diesen Monat',
        'LABEL-ORDERS-VOLUME':'Bestellvolumen',
        'LABEL-ORDERS-VOLUME-THIS-MONTH':'Bestellvolumen diesen Monat',
        'LABEL-TODAY-ORDERS':'Bestelleingänge heute',

        // BUTTON
        'BUTTON-ALL-ORDERS':'Alle Bestellungen anzeigen',

        // VIEW ----- tutorial.client.view.html ------
        // LABELS
        'LABEL-WELCOME':'Willkommen bei mightymerce',
        'LABEL-ADD-COMPANY-DETAILS':'Verfollständige deine Firmendaten',
        'LABEL-ADD-BASICS-COMPANY-DETAILS':'Bitte ergänze deine Firmendaten, damit wir dir monatlich eine Rechnung austellen können.',
        'LABEL-COMPLETED':'Erledigt',
        'LABEL-MAINTAIN-COMPANY-DATA':'Firmendaten pflegen',
        'LABEL-ADD-LEGAL-DATA':'Ergänze deine Rechtstexte',
        'LABEL-NOTE-ADD-TERMS-AND-CONDITIONS':'Bitte ergänze deine Allgemeinen Geschäftsbedingungen, Widerrufsbelehrung, Datenschutzerklärung, Copyright und Impressum. Wir wissen, diese Themen machen keinen Spaß, aber du brauchst diese Angaben aus rechtlichen Gründen, damit deine Kunden bei dir kaufen können.',
        'LABEL-MAINTAIN-LEGAL-DATA':'Rechtstexte pflegen',
        'LABEL-ADD-PAYPAL':'Verknüpfe deinen Paypal Account',
        'LABEL-NOTE-ADD-PAYPAL':'Verknüpfe deinen Paypal Account, um Zahlungen zu empfangen und den Checkout für deine Kunden so einfach wie möglich zu gestalten.',
        'LABEL-CONNECT-TO-PAYPAL':'PayPal Account verwalten',
        'LABEL-ADD-DELIVERY-OPTION':'Definiere deine Lieferoptionen',
        'LABEL-NOTE-ADD-DELIVERY-OPTION':'Wir haben eine Standard Lieferung für 3,50 € für dich voreingestellt, damit du schneller loslegen kannst. Wenn dieser Betrag nicht für dich passt, kannst du ihn ganz leicht anpassen. Klicke dazu einfach auf "Lieferoptionen verwalten".',
        'LABEL-NOTE-HINT-ADDED-DELIVERY-OPTION':'Bitte beachte, dass wir derzeit nur eine Lieferoptionen anbieten können. Wir planen, diese Funktionalität auszubauen und dir in Zukunft die Möglichkeit zu geben, weitere Lieferoptionen zu pflegen.',
        'LABEL-VERIFY-DELIVERY-OPTION':'Lieferoptionen bearbeiten',
        'LABEL-MAINTAIN-FIRST-PRODUCT':'Pflege dein erstes Produkt',
        'LABEL-NOTE-MAINTAIN-FIRST-PRODUCT':'Pflege Titel, Beschreibung und Preis. Dann lade ein Produktbild hoch, dass die Aufmerksamkeit deiner Kunden weckt. Und los geht es!',
        'LABEL-MAINTAIN-PRODUCT':'Maintain product',

        // ERROR
        'MESSAGE-EXPLAIN-TUTORIAL':'Unser Tutorial hilft dir mit diesen 5 Schritten, dein erstes Produkt auf deinem bevorzugten Social Media Kanal zu posten.',




        // NEW
        //signup
        'LABEL-ACCEPT-TERMS-HINT-I':'Mit Klick auf "Registrieren" erklärst du dich mit unseren ',
        'LABEL-ACCEPT-TERMS-HINT-II':' einverstanden und bestätigst uns, dass du unsere ',
        'LABEL-ACCEPT-TERMS-HINT-III':'  gelesen hast. Um deinen Besuch auf unserer Webseite so angenehm wie möglich zu gestalten, verwenden wir Cookies. ',
        'LABEL-TERMS-AND-CONDITION-LONG':'Allgemeinen Geschäftsbedingungen',
        'LABEL-DATA-PROTECTION-LONG':'Datenschutzerklärung',

        //home
        'LABEL-ORDERS-VOLUME-CHANNEL':'Bestellvolumen je Verkaufskanal',

        // VIEW ----- view-product.client.view.html ------
        // LABELS
        'BREADCRUMB-PRODUCTS':'Produkte',
        'BREADCRUMB-EDIT-PRODUCTS':'Produkt editieren',
        'BREADCRUMB-POSTS':'Posts',
        'BREADCRUMB-MAIN-DATA':'Produktdetails',
        'BUTTON-TAB-MAIN-DATA':' Produktdetails',
        'BUTTON-TAB-IMAGES':'Bilder',
        'BUTTON-TAB-DAWANDA-PRODUCT':'Dawanda Produkt',
        'BUTTON-TAB-NEW':'NEU',
        'LABEL-IMAGE':'Bild',
        'LABEL-POST-DATE':'Post Datum',
        'LABEL-POST-ACTION':'Aktion',

        // BUTTON
        'BUTTON-CREATE-POST':' Post erstellen',
        'BUTTON-CREATE-PIN':' Pin erstellen',
        'BUTTON-CREATE-TWEET':' Tweet erstellen',
        'BUTTON-CREATE-COMMENT':' Kommentar erstellen',
        'BUTTON-CREATE-POST-ETSY':' Etsy-Post erstellen',
        'BUTTON-CREATE-POST-DAWANDA':' Dawanda-Post erstellen',
        'BUTTON-CREATE-POST-CODE-SNIPPET':' HTML Widget',
        'BUTTON-REVIEW-POST':'Post überprüfen',

        // ERROR
        'NOTE-FINALIZE-TUTORIAL':'Bitte schließe alle Schritte im Tutorial ab, bevor du dein erstes Produkt postest! Diese Daten sind notwendig, damit deine Kunden später auch kaufen können.',
        'NOTE-YOUR-SALES-CHANNELS':'Deine verfügbaren Verkaufskanäle:',
        'NOTE-ADD-IMAGES-FIRST':'Bitte öffne zuerst den Tab "Bilder", um ein Produktbild für Instagram hinzuzugügen.',
        'NOTE-SERVICE-COMEING-SOON':'Dieser Service ist bald für dich verfügbar:',
        'NOTE-SERVICE-IN-DEVELOPMENT':'Diesen Service entwickeln wir gerade für dich:',
        'NOTE-NOT-POSTED-PRODUCT-SO-FAR':'Du hast dieses Produkt noch nicht gepostet. Um es zu posten klicke auf "Post erstellen" für den Verkaufskanal, den du nutzen möchtest!',


        // VIEW ----- media-instagram.product.modal.view.html ------
        // LABELS
        'LABEL-YOUR-MEDIA-ON':'Deine Medien auf',
        'LABEL-TEXT':'Text',

        // ERROR
        'NOTE-YOUR-IMAGES-ON-INSTAGAM':'Hier sind deine verfügbaren Bilder von Instagram. Bitte wähle eins für dein Produkt.',

        // VIEW ----- post.product.modal.view.html ------
        // LABELS
        'LABEL-YOUR-POST-TO':'Dein Post in',
        'LABEL-POSTED-ON':'Gepostet am',
        'LABEL-YOUR-COMMENT':'Dein Kommentar',
        'LABEL-INSTRUCTION':'So gehst du vor',
        'LABEL-PREVIEW-POST':'Vorschau deines Post ',
        'LABEL-PREVIEW-PIN':'Vorschau deines Pins',
        'LABEL-PREVIEW-TWEET':'Vorschau deines Tweets',
        'LABEL-PREVIEW-INSTAGRAM':'Vorschau deines Instagaram Kommentars',
        'LABEL-PREVIEW-CODE-SNIPET':'Vorschau deines HTML Widgets',
        'LABEL-BUY-NOW':'Jetzt kaufen',
        'LABEL-FOR':'für',
        'LABEL-SOLD-BY':'Verkauft von',

        // ERROR
        'NOTE-CURRENTLY-NO-UPDATE-FACEBOOK-POST':'Gut zu wissen: Deinen Facebook-Post kann aktuell nicht verändert werden, nachdem er veröffentlicht wurde.',
        'NOTE-ACCESS-TOKEN-EXPIRED-FACEBOOK':'Es tut uns leid. Dein Facebook Profil konnte nicht geladen werden. Bitte schließe das Fenster und klicke erneut auf den Button "Post erstellen".',
        'NOTE-POST-WILL-AUTOMATICALLY-BE-UPDATED':'Gut zu wissen: Dein Post wird automatisch aktualisiert, wenn du dein Produkt nach dem Post editierst und speicherst.',
        'NOTE-CURRENTLY-NO-UPDATE-TWITTER-POST':'Gut zu wissen: Deinen Twitter-Tweet kann aktuell nicht verändert werden, nachdem er veröffentlicht wurde.',
        'NOTE-INSTAGRAM-POST-AS-COMMENT':'Gut zu wissen: Dein Produkt erscheint bei Instagram als neuer Kommentar. Er enthält einen Link zur Produktdetailseite, wo deine Kunden kaufen können.',
        'NOTE-COPY-CODE-SNIPET-TO-ANY-SIDE':'Bitte kopiere den HTML Code und füge ihn auf der Webseite ein, auf der du dein Produkt verkaufen möchtest. Im Notizfeld kannst du vermerken, auf welchen Seiten du dein Produkt eingebunden hast.',
        'NOTE-INFORMATION-WHERE-SAVE-CODE-SNIPET':'Hier kannst du notieren, wo du dein HTML Widget einbindest',
        'NOTE-NOT-FINAL-LOOK-OF-POST':'Gut zu wissen: So wird dein Post aufgebaut sein. Die bekannten Facebook-Elemente werden im Live-Post verfügbar sein.',
        'NOTE-NOT-FINAL-LOOK-OF-PIN':'Gut zu wissen: So wird dein Pin aufgebaut sein. Die bekannten Pinterest-Elemente werden im Live-Pin verfügbar sein.',
        'NOTE-NOT-FINAL-LOOK-OF-TWEET':'Gut zu wissen: So wird dein Tweet aufgebaut sein. Die bekannten Twitter-Elemente werden im Live-Tweet verfügbar sein.',
        'NOTE-NOT-FINAL-LOOK-OF-INSTAGRAM-COMMENT':'Gut zu wissen: So wird dein Post aufgebaut sein. Die bekannten Instagram-Elemente werden im Live-Post verfügbar sein. Bitte beachte, dass die Kommentare bei Instagram auf 300 Zeichen begrenzt sind. Damit wir den "Jetzt kaufen" Link noch einbauen können, müssen wir Titel und Beschreibung auf 200 Zeichen kürzen.',
        'NOTE-NOT-FINAL-LOOK-OF-CODE-SNIPET':'Gut zu wissen: Je nach Einbindung auf deiner Seite, kann die Vorschau leicht abweichen.',

        // BUTTON
        'BUTTON-TRY-POST-AGAIN':'Posten erneut versuchen',
        'BUTTON-TRY-TWEET-AGAIN':'Tweet erneut versuchen',
        'BUTTON-POST-PRODUCT-AGAIN':'Produkt erneut posten',
        'BUTTON-PIN-PRODUCT-AGAIN':'Produkt erneut pinnen',
        'BUTTON-TWEET-PRODUCT-AGAIN':'Tweet erneut posten',
        'BUTTON-POST-PRODUCT-TO-FACEBOOK':'Auf Facebook posten',
        'BUTTON-PIN-PRODUCT-TO-PINTEREST':'Auf Pinterest posten',
        'BUTTON-TWEET-PRODUCT-TO-TWITTER':'Auf Twitter posten',
        'BUTTON-ADD-DETAILS-TO-INSTAGRAM':'Auf Instagram posten',
        'BUTTON-SAVE-CODE-SNIPPET-INFORMATION':'HTML Widget Information speichern',
        'BUTTON-POST-PRODUCT-TO-ETSY':'Auf Etsy posten',

        // VIEW ----- list-product.client.view.html ------
        // LABELS
        'BREADCRUMB-YOUR-PRODUCTS':'Produkte',
        'BREADCRUMB-ALL-YOUR-PRODUCTS':'All your products',

        // BUTTON
        'BUTTON-EDIT-PRODUCT':'Produkt bearbeiten',
        'BUTTON-UPGRADE-ACCOUNT':'Account upgraden',
        'BUTTON-ADD-PRODUCT':'Produkt hinzufügen',

        // VIEW ----- edit-product.client.view.html ------
        // LABELS
        'LABEL-PRODUCT-ACTIVE-ON':'Dein Produkt ist aktiv auf: ',
        'LABEL-DESCRIBE-YOUR-PRODUCT':'Beschreibe dein Produkt',
        'LABEL-IN-STOCK':'Ist verfügbar',
        'LABEL-IN-ID':'Produktnummer',
        'LABEL-TITLE':'Titel',
        'LABEL-DESCRIPTION':'Beschreibung',
        'LABEL-PRICE':'Preis',
        'LABEL-TAX':'Steuersatz',
        'LABEL-CURRENCY':'Währung',
        'LABEL-SHIPPING-OPTION':'Lieferoption',
        'LABEL-TOOLTIP-ITEM-NO-LONGER-IN-STOCK':'Wenn dein Produkt gerade nicht verfügbar ist, kannst du den Verkauf stoppen. Das Produkt wird in den geposteten Kanälen noch sichtbar sein, kann aber nicht mehr gekauft werden. Sobald es wieder verfügbar ist, kannst du es z.B. erneut posten (Facebook) oder einen Hinweis in Titel oder Beschreibung geben (Pinterest).',
        'LABEL-TOOLTIP-PRODUCT-TITLE':'Ergänze Informationen zu Marke, Farbe oder Größe zum Titel zB. kommasepariert. Bitte beachte, dass du diese Zeichen nicht verwendest: /[^\{}]/. Und diese max. je einmal: % : & + .',
        'LABEL-TOOLTIP-PRODUCT-PRICE':'Bitte pflege Preise im Format 12.40 oder 2314.05 - Es sind keine Kommas möglich.',
        'LABEL-SET-PRICE-PRODUCT':'Pflege den',
        'LABEL-SELECT-SHIPPING-OPTION':'Wähle die Versandoption für dein Produkt',

        // ERROR
        'VALIDATION-PRODUCT-ID-REQ':'Bitte ergänze die Produktnummer.',
        'VALIDATION-PRODUCT-TITLE-REQ':'Bitte ergänze den Produkttitel.',
        'VALIDATION-PRODUCT-TITLE-TO-LONG':'Bitte kürze den Produkttitel.',
        'VALIDATION-PRODUCT-DESCRIPTION-REQ':'Bitte ergänze die Produktbeschreibung.',
        'VALIDATION-PRODUCT-DESCRIPTION-TO-LONG':'Bitte kürze die Produktbeschreibung.',
        'VALIDATION-PRODUCT-TAX-REQ':'Bitte ergänze den Steuersatz.',
        'VALIDATION-PRODUCT-SHIPPING-OPTION-REQ':'Bitte ergänze die Lieferoption.',
        'NOTE-ALREADY-POSTED-PRODUCT':'Gut zu wissen, wenn du das Produkt bereits gepostet hast:',
        'NOTE-UPDATE-PRODUCT-CHANGES-IN-CHANNELS':'Änderungen an den Proudktdaten oder Bildern werden in den aktiven Verkaufskanälen aktualisiert. Ausnahme ist Facebook, wo das Produkt erneut gepostet werden muss. ',

        // BUTTON
        'BUTTON-UPDATE-PRODUCT':'Produkt aktualisieren',

        // VIEW ----- create-product.client.view.html ------
        // LABELS
        'BREADCRUMB-CREATE-PRODUCT':'Produkt hinzufügen',
        'LABEL-PLACEHOLDER-PRODUCT-PRICE':'Preis im Format 1234.00 mit Punkt angeben',

        // ERROR
        'VALIDATION-PRODUCT-CURRENCY-REQ':'Bitte ergänze die Währung.',

        // BUTTON
        'BUTTON-CREATE-PRODUCT':'Produkt hinzufügen',

        // VIEW ----- edit-media-product.client.view.html ------
        // LABELS
        'LABEL-YOUR-PRODUCT-IMAGES':'Deine Produktbilder',
        'LABEL-MAIN-IMAGE':'Hauptbild',
        'LABEL-SOON-AVAILABLE':'Bald verfügbar',
        'LABEL-HOW-TO-ADD-IMAGES':'So pflegst du deine Produktbilder',
        'LABEL-PRODUCT-IMAGES':'Produktbilder',
        'LABEL-MAINTAIN-PRODUCTS-TODO':'So pflegst du deine Produktbilder',
        'LABEL-STEP1':'Schritt 1:',
        'LABEL-STEP1-EXPLANATION':'Lade ein Bild hoch durch Klick auf "Bild hochladen"',
        'LABEL-STEP2':'Schritt 2:',
        'LABEL-STEP2-EXPLANATION':'Überprüfe alle Bildausschnitte',
        'LABEL-STEP2-EXPLANATION-LONG':'Bei Bedarf kannst du den Ausschnitt für jeden Verkaufskanal verändern.',
        'LABEL-STEP3':'Schritt 3:',
        'LABEL-STEP3-EXPLANATION':'Pflege den Alt-Text für dein Produktbild',
        'LABEL-STEP-FINALLY':'Und zum Schluss:',
        'LABEL-STEP-FINALLY-EXPLANATION':'Klicke auf "Bild speichern"',
        'LABEL-MAINTAIN-FACEBOOK-IMAGE':'Facebook-Bild pflegen',
        'LABEL-BEST-FIT-FACEBOOK':'Gut zu wissen: Das beste Seitenverhältnis für Bilder auf Facebook ist 1200px / 627px',
        'LABEL-MAINTAIN-PINTEREST-IMAGE':'Pinterest-Bild pflegen',
        'LABEL-BEST-FIT-PINTEREST':'Gut zu wissen: Das beste Seitenverhältnis für Bilder auf Pinterest ist 736px / 1104px',
        'LABEL-MAINTAIN-TWITTER-IMAGE':'Twitter-Bild pflegen',
        'LABEL-BEST-FIT-TWITTER':'Gut zu wissen: Das beste Seitenverhältnis für Bilder auf Twitter ist 1024px / 512px',
        'LABEL-ALT-TEXT':'Alt-Text',
        'LABEL-ORIGINAL-FILE-NAME':'Dateiname',
        'LABEL-FILE-SIZE':'Größe',
        'LABEL-PROGRESS-UPLOAD':'Fortschritt',
        'LABEL-FILE-UPLOAD-STATUS':'Status',
        'LABEL-FILE-UPLOAD-ACTIONS':'Aktion',
        'LABEL-UPLOAD-NEW-IMAGE-TO-REPLACE-EXISTING':'Lade ein neues Bild hoch oder ersetze das bestehende Bild, wenn du bereits eines hochgeladen hast.',

        // ERROR
        'NOTE-HOW-TO-PROCEED-ADD-IMAGE':'Gut zu wissen: Mit Ausnahme von Instagram kannst du alle Bilder nach den unten beschriebenen Schritten hinzufügen. Für das Instagram-Bild klicke bitte den Button oberhalb der Tabelle.',
        'NOTE-HOW-TO-ADD-IMAGES':'Die benötigten Bildformate in den Verkaufskanälen unterscheiden sich. Damit du nicht jeden Bildausschnitt separate hochladen musst, kannst du hier bequem das Hauptbild hochladen und anschließend die Bildausschnitte im richtigen Format je Verkaufskanal auswählen. Du ergänzt den Alt-Text für dein Produktbild, das automatisch für alle Kanäle übernommen wird. Klickst auf Upload und FERTIG.',
        'NOTE-USE-DEFAULT-CROP-SETTINGS':'Gut zu wissen: Die Bildausschnitte werden automatisch gesetzt, wenn du das Hauptbild hochgeladen hast. Du kannst diese Default Bildausschnitte nutzen und Schritt 2 überspringen.',
        'NOTE-CASE-CROPPER-NOT-ACTIVE':'Falls das Bild-Ausschnitt-Tool nicht aktiv sein sollte, lade bitte die Seite erneut. Wir wissen um diesen Fehler und werden ihn schnellstmöglich beheben.',
        'NOTE-TOOLTIP-DESCRIPTION-FALLBACK-IMAGE':'Bitte beschreibe dein Bild, damit diese von den Suchmaschinen berücksichtigt werden kann. Falls das Bild nicht angezeigt werden kann, werden wir diesen Text anzeigen. Ebenfalls ist er relevant für sehbehinderte, um einen Eindruck zu bekommen, was angezeigt wird.',
        'VALIDATION-ALT-TEXT-REQ':'Bitte pflege einen Alt-Text',

        // BUTTON
        'BUTTON-ADD-IMAGE':'Bild uploaden',
        'BUTTON-SELECT-IMAGE':'Bild hochladen',
        'BUTTON-EDIT-IMAGE':'Bild editieren',
        'BUTTON-UPLOAD-ALL-MAIN-IMAGES':'Alle Hauptbilder uploaden',
        'BUTTON-STOP-UPLOAD':'Upload stoppen',
        'BUTTON-REMOVE-FROM-UPLOAD-LIST':'Von Uploadliste entfernen',
        'BUTTON-SAVE-IMAGES':'Bilder speichern',




        // NEWNEW
        // VIEW ----- ship-order.modal.view.html ------
        // LABELS
        'LABEL-SHIPPING-SERVICE':'Service',
        'LABEL-SHIPPING-INFORMATION':'Paketinformation',
        'LABEL-SHIPPING-FURTHER-INFORMATION':'Weitere Informationen',
        'LABEL-SELECT-SHIPPING-PROVIDER':'Lieferdienst auswählen: ',
        'LABEL-SHIPPING-PARCEL-INFORMATION-LENGTH':'Länge (in cm)',
        'LABEL-SHIPPING-PARCEL-INFORMATION-HIGHT':'Höhe (in cm)',
        'LABEL-SHIPPING-PARCEL-INFORMATION-WIDTH':'Breite (in cm)',
        'LABEL-SHIPPING-PARCEL-INFORMATION-WEIGHT':'Gewicht (in cm)',


        // ERROR
        'ERROR-NOTE-SHIP-CLOUD-INFORMATION-I':'Mit mightymerce kannst du den Service von Shipcloud nutzen.',
        'ERROR-NOTE-SHIP-CLOUD-INFORMATION-II':'Drucke deine Versandetiketten und stelle deinen Kunden eine Sendungsverfolgung zur Verfügung.',
        'ERROR-NOTE-FURTHER-INFORMATION':'Hier kannst du weitere Informationen für deine Kunden angeben. Wenn du einen eigenen Lieferdienst nutzt, kannst du die URL oder den Code der Sendungsverfolgung ergänzen. Wenn du Shipcloud nutzt, lasse das Feld bitte leer. Wir übernehmen die Daten automatisch.'

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
          'PLACEHOLDER-LABEL-EMAIL':'email',
          'PLACEHOLDER-LABEL-PASSWORD':'password',
          'HEADLINE-SUB-WELCOME-BACK': 'Welcome back! Login to mightymerce and review your products, posts and orders. ',

          // BUTTONS
          'BUTTON-TEXT-SIGNIN': 'Sign in',
          'BUTTON-TEXT-SIGNUP': 'Sign up',
          'BUTTON-TEXT-FORGOTPWD': 'Forgot password',

          // VALDIATIONS
          'VALIDATION-REQ-EMAIL':'Pleae enter an eMail address.',
          'VALIDATION-REQ-PASSWORD':'Please enter a password.',

          // ERRORS

          // VIEW ----- signup.client.view.html ------
          // LABELS
          'HEADLINE-SIGNUP':'mightymerce registration ',
          'HEADLINE-SUB-SIGNUP-WELCOME':'Sell your products via social media channels and marketplaces. It is so easy with mightymerce.',
          'PLACEHOLDER-LABEL-SHOPNAME':'shopname',
          'LABEL-OR':'or',

          // VALDIATIONS
          'VALIDATION-VALID-EMAIL':'Please verify your entry.',
          'VALIDATION-VALID-PASSWORD':'Please verify your entry.',
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

          // BUTTONS
          'BUTTON-INVALID-TOKEN-FORGOT-PWD':'Ask for a new password reset',

          // ERRORS
          'MESSAGE-ASK-NEW-PASSWORD':'Ask for a new password reset',

          // VIEW ----- reset-password-success.client.view.html ------
          // LABELS
          'HEADLINE-SUB-RESETPWD-SUCCESS':'Your password has been reset successfully.',

          // ERROR
          'MESSAGE-CONTINUE-DASHBOARD':'Continue to your dashboard',

          // VIEW ----- change-password.client.view.html ------
          // LABELS
          'LABEL-CURRENT-PASSWORD':'Current password',
          'PLACEHOLDER-LABEL-CURRENT-PASSWORD':'Current password',

          // BUTTON
          'BUTTON-SAVE-PASSWORD':'Save password',

          // ERROR
          'VALIDATION-CURRENT-PASSWORD-REQ':'Your current password is required.',
          'VALIDATION-CHANGED-PWD-SUCCESS':'Your password has been reset successfully.',

          // VIEW ----- change-profile-picture.client.view.html ------
          // LABELS
          'HEADLINE-SUB-YOUR-CURRENT-LOGO':'Your current Logo',
          'HEADLINE-SUB-UPLOAD-NEW-LOGO':'Upload new logo',
          'LABEL-PREVIEW-IMAGE':'Preview image',
          'LABEL-NOTE-BEST-FIT-LOGO':'Note: Best fit for logo image 370px x 152px',

          // BUTTON
          'BUTTON-SAVE-IMAGE':'Save image',
          'BUTTON-CANCEL':'Cancel',
          'BUTTON-SELECT-IMAGE-LOGO':'Select image ',

          // ERROR
          'MESSAGE-SUCCESS-LOGO-CHANGED':'Your logo has been changed successfully',

          // VIEW ----- edit-payment.client.view.html ------
          // LABELS
          'HEADLINE-SUB-PAYMENT':'Payment',
          'HEADLINE-SUB-PAYPAL-PAYMENT-GATEWAY':'Paypal payment gateway',
          'HEADLINE-SUB-PAYPAL-BUSINESS-ACCOUNT':'Step 1 - Set up a merchant account',
          'HEADLINE-SUB-PAYPAL-SIGNATURE-ACCESS':'Step 2 - Request API signature',
          'HEADLINE-SUB-PAYPAL-SIGNATURE-ENTER':'Step 3 - Transmit API signature',
          'HEADLINE-SUB-PAYPAL-CREDENTIALS':'Paypal credentials',
          'LABEL-PAYPAL-API-USER':'Paypal API user',
          'LABEL-PAYPAL-API-PWD':'Paypal API password',
          'LABEL-PAYPAL-API-SIG':'Paypal API signature',

          // TEXT
          'TEXT-PAYPAL-EXPRESS-I': 'Your customers may checkout their order with Paypal Express. Your therefore need to connect to a Paypal merchant account.',
          'TEXT-PAYPAL-EXPRESS-II':'The following PDF will assist you in setting up a new merchant account, if you do not already have one:',
          'TEXT-PAYPAL-EXPRESS-III':'Continue to Paypals PDF',
          'TEXT-PAYPAL-EXPRESS-IIII':'Please select ',
          'TEXT-PAYPAL-EXPRESS':'PayPal Express',
          'TEXT-PAYPAL-EXPRESS-IIIII':' as payment method.',
          'TEXT-PAYPAL-SIGNATURE':'As soon as you have created your merchant account, you need to generate a so called API signature. We need this signature to connect your mightymerce account with your Paypal merchant account. The following video provided by Paypal shows you, how to receive this information:',
          'TEXT-PAYPAL-SIGNATURE-ENTER':'Please copy and paste the following information from your Paypal account in the provided input fields and click save. Great, now you are done with connecting Paypal and your customers are able to buy from you.',

          // ERROR
          'VALIDATION-PAYPAL-API-USER-REQ':'Please enter the Paypal API user.',
          'VALIDATION-PAYPAL-API-PWD-REQ':'Please enter the Paypal API password.',
          'VALIDATION-PAYPAL-API-SIG-REQ':'Please enter the API signature.',

          // BUTTON
          'BUTTON-BACK-TUTORIAL':'Return to tutorial',
          'BUTTON-UPDATE-PAYPAL-DATA':'Update Paypal data',

          // VIEW ----- edit-profile.client.view.html ------
          // LABELS
          'HEADLINE-ACCOUNT-AREA':'User',
          'HEADLINE-SUB-EDIT-PROFILE':'Profile',
          'HEADLINE-SUB-COMPANY-DETAILS':'Company details',
          'NOTE-PROVIDE-COMPANY-DETAILS':'For the receipt of a monthly invoice, please provide your company’s address details.',
          'LABEL-COMPANY-NAME':'Company name',
          'LABEL-FIRST-NAME':'First name',
          'LABEL-LAST-NAME':'Last name',
          'LABEL-STREET':'Street',
          'LABEL-STREET-NO':'Street no',
          'LABEL-ZIP-CODE':'Zip code',
          'LABEL-CITY':'City',

          // ERROR
          'VALIDATION-COMPANY-NAME-REQ':'Please enter your company name.',
          'VALIDATION-FIRST-NAME-REQ':'Please enter your first name.',
          'VALIDATION-LAST-NAME-REQ':'Please enter your Last name.',
          'VALIDATION-STREET-REQ':'Please enter your companys street.',
          'VALIDATION-STREET-NO-REQ':'Please enter your companys street number.',
          'VALIDATION-ZIP-CODE-REQ':'Please enter your companys zip code.',
          'VALIDATION-CITY-REQ':'Please enter your companys city.',

          // BUTTON
          'BUTTON-UPDATE-PROFILE-DATA':'Update profile data',

          // VIEW ----- subscription.client.view.html ------
          // LABELS
          'HEADLINE-SUB-SUBSCRIPTION':'Subscription',
          'HEADLINE-SUB-YOUR-SUBSCRIPTION':'Your subscription',
          'TEXT-YOUR-SUBSCRIPTION':'Based on the growth of your business your are able to manage your subscriptions by upgrading or downgrading your plans.',
          'LABEL-YOUR-SUBSCRIPTION':'Your plan',
          'LABEL-MOST-POPULAR':'Most popular',
          'LABEL-FREE-SUBSCRIPTION':'FREE',
          'LABEL-FIVE-PRODUCTS':'5 different products',
          'LABEL-TEN-PRODUCTS':'10 different products',
          'LABEL-HUNDRED-PRODUCTS':'100 different products',
          'LABEL-UNLIMITED-PRODUCTS':'unlimited products',
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
          'BREADCRUMB-CURRENCY-CREATE':'Create currency',
          'LABEL-CURRENCY-OPTION':'Currency option',
          'LABEL-CURRENCY-CODE':'Currency code',
          'LABEL-CURRENCY-VALUE':'Currency value',

          // ERROR
          'VALIDATION-CURRENCY-CODE':'Please enter a currency code.',
          'VALIDATION-CURRENCY-VALUE':'Please enter a currency value.',

          // BUTTON
          'BUTTON-SAVE-CURRENCY':'Save currency data',

          // VIEW ----- list-currency.client.view.html ------
          // LABELS
          'BREADCRUMB-CURRENCY':'Currency',
          'LABEL-CURRENCY-ROWS':'Currency option',
          'TEXT-CURRENCY-NOTE':'NOTE: You will be able to add more currencies soon. At that point of time only EUR is available.',
          'LABEL-CURRENCY-CODE-TABLE-HEADER':'Code',
          'LABEL-CURRENCY-VALUE-TABLE-HEADER':'Value',

          // ERROR
          'MESSAGE-NO-CURRENCY':'No currency yet, why dont you',
          'MESSAGE-NO-CREATE-ONE':'create one',

          // VIEW ----- edit-currency.client.view.html ------
          // LABELS
          'BREADCRUMB-CURRENCY-EDIT':'Edit currency',

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
          'BREADCRUMB-DELIVERY-EDIT':'Edit delivery option',
          'LABEL-DELIVERY-TITLE':'Delivery option',
          'LABEL-DELIVERY-DURATION':'Delivery duration',
          'LABEL-DELIVERY-COUNTRY':'Delivery country',
          'LABEL-DELIVERY-COST':'Delivery cost',

          'LABEL-TOOLTIP-COST-FORMAT':'Please enter delivery costs in the format 3.40 or 0.55 - there are no commas possible.',

          // ERROR
          'VALIDATION-DELIVERY-TITLE':'Please enter the delivery option.',
          'VALIDATION-DELIVERY-DURATION':'Please enter the delivery duration.',
          'VALIDATION-DELIVERY-COUNTRY':'Please enter the delivery country.',
          'VALIDATION-DELIVERY-COST':'Please enter the delivery costs.',

          // BUTTON
          'BUTTON-UPDATE-DELIVERY':'Update delivery data',

          // VIEW ----- create-delivery.client.view.html ------
          // LABELS
          'BREADCRUMB-DELIVERY-CREATE':'Create delivery',

          // BUTTON
          'BUTTON-SAVE-DELIVERY':'Save delivery data',

          // VIEW ----- create-legal.client.view.html ------
          // LABELS
          'BREADCRUMB-LEGAL-CREATE':'Create legal data',
          'LABEL-LEGAL-OPTION':'Legal option',

          // VIEW ----- list-legal.client.view.html ------
          // LABELS
          'BREADCRUMB-LEGAL':'Legal',
          'LABEL-TABLE-HEADER-LEGAL-TITLE':'Title',
          'LABEL-TABLE-HEADER-LEGAL-PURPOSE':'Purpose',
          'LABEL-LEGAL-PRIVACYPOLICY':'Privacy policy',
          'LABEL-LEGAL-RETURNPOLICY':'Return policy',
          'LABEL-LEGAL-TERMSANDCONDITIONS':'Terms and conditions',
          'LABEL-LEGAL-IMPRINT':'Imprint',
          'LABEL-LEGAL-COPYRIGHT':'Copyright',
          'TEXT-LEGAL-NOTE-INF-REQUIRED':'Your legal information is required. Please maintain all information!',

          // BUTTON
          'BUTTON-EDIT':'Edit',

          // VIEW ----- edit-legal.client.view.html ------
          // LABELS
          'BREADCRUMB-PRIVACYPOLICY-EDIT':'Edit privacy policy',

          // BUTTON
          'BUTTON-UPDATE-PRIVACY-POLICY':'Update privacy policy',

          // ERROR
          'VALIDATION-PRIVACYPOLICY-REQ':'Please add your privacy policy.',

          // VIEW ----- edit-legal-copyright.client.view.html ------
          // LABELS
          'BREADCRUMB-COPYRIGHT-EDIT':'Edit copyright',

          // BUTTON
          'BUTTON-RETURN-TO-LEGAL':'Return to legal overview',
          'BUTTON-UPDATE-COPYRIGHT':'Update copyright',

          // ERROR
          'VALIDATION-COPYRIGHT-REQ':'Please add your copyright.',

          // VIEW ----- edit-legal-imprint.client.view.html ------
          // LABELS
          'BREADCRUMB-IMPRINT-EDIT':'Edit imprint',

          // BUTTON
          'BUTTON-UPDATE-IMPRINT':'Update imprint',

          // ERROR
          'VALIDATION-IMRPINT-REQ':'Please add your imprint.',

          // VIEW ----- edit-legal-returnpolicy.client.view.html ------
          // LABELS
          'BREADCRUMB-RETURNPOLICY-EDIT':'Edit return policy',

          // BUTTON
          'BUTTON-UPDATE-RETURNPOLICY':'Update return policy',

          // ERROR
          'VALIDATION-RETURNPOLICY-REQ':'Please add your return policy.',

          // VIEW ----- edit-legal-termsandcondition.client.view.html ------
          // LABELS
          'BREADCRUMB-TERMSCONDITION-EDIT':'Edit terms and conditions',

          // BUTTON
          'BUTTON-UPDATE-TERMSCONDITION':'Update terms and conditions',

          // ERROR
          'VALIDATION-TERMSCONDITION-REQ':'Please add your terms and conditions.',

          // VIEW ----- create-taxes.client.view.html ------
          // LABELS
          'BREADCRUMB-TAXES-CREATE':'Create taxes',
          'LABEL-TAXES-OPTION':'Tax options',
          'LABEL-TAXES-COUNTRY':'Country',
          'LABEL-TAXES-TAXRATE':'Tax rate',

          // ERROR
          'VALIDATION-TAXES-COUNTRY-REQ':'Please enter the tax country.',
          'VALIDATION-TAXES-TAXRATE-REQ':'Please enter the tax rate.',

          // BUTTON
          'BUTTON-SAVE-TAXRATE':'Save data',

          // VIEW ----- edit-taxes.client.view.html ------
          // LABELS
          'BREADCRUMB-TAXES-EDIT':'Edit taxes',

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
          'LABEL-OPEN-ORDERS':'Your open orders',
          'LABEL-SHIPPED-ORDERS':'Your shipped orders',
          'LABEL-RETURNED-ORDERS':'Your returned orders',
          'LABEL-TABLE-HEADER-ORDER-ID':'Order ID',
          'LABEL-TABLE-HEADER-DATE':'Date',
          'LABEL-TABLE-HEADER-CUSTOMER':'Customer',
          'LABEL-TABLE-HEADER-PAYMENT':'Payment',
          'LABEL-TABLE-HEADER-ORDER-STATUS':'Order status',

          // BUTTON
          'BUTTON-VIEW-DETAILS':'View details',
          'BUTTON-RECEIVE-RETURN':'Receive return',
          'BUTTON-SHIP-ORDER':'Ship order',

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
          'TEXT-NOTE-TRACKING-ID-LINK':'Tracking ID or link (optional) ',
          'TEXT-NOTE-SHIPPING-NOTE-CUSTOMER-RECEIVE':'Please note: By shipping the order, your customer will automatically receive a standard shipping confirmation.',

          // BUTTON
          'BUTTON-YES-SHIP-ORDER':'Ship order',

          // VIEW ----- list-order.client.view.html ------
          // LABELS
          'BREADCRUMB-ORDER-DETAIL':'Orders detail',
          'LABEL-PAYMENT-STATUS':' Payment status ',
          'LABEL-ORDER-STATUS':' Order status ',
          'LABEL-PAYMENT-DATE':' Payment date ',
          'LABEL-ORDERED-VIA':' Ordered via ',
          'LABEL-BILLING-ADDRESS':'Billing address',
          'LABEL-SHIPPING-ADDRESS':'Shipping address',
          'LABEL-EMAIL-ADDRESS':'eMail address',
          'LABEL-SUBTOTAL':' Subtotal ',
          'LABEL-SHIPPING-COST':' Shipping costs ',
          'LABEL-TOTAL-AMOUNT':' Total amount ',
          'LABEL-INCL-VAT':' Incl. VAT (',
          'LABEL-TRACKING-NO':' Tracking number ',
          'LABEL-PRODUCT-NO':'Product no.',
          'LABEL-PRODUCT-TITLE':'Product title',
          'LABEL-PRODUCT-PRICE':'Product price',
          'LABEL-QUANTITY':'Quantity',
          'LABEL-PAYMENT-DETAILS':'Payment details',
          'LABEL-PAYMENT-TYPE':'Payment type',
          'LABEL-ACCOUNT-ID':'Account ID',
          'LABEL-TRANSACTION-ID':'Transaction ID',
          'LABEL-ORDERED-PRODUCTS':'Ordered product',
          'TEXT-TOOLTIP-HOW-REVIEW-ORDER':'To verify payment and to process a return open your PayPal account and enter PayPal Account ID of your customer and/or Transaction ID for this order .',

          // BUTTON
          'BUTTON-GO-TO-PRODUCT':'Go to product',
          'BUTTON-BACK-ORDER-OVERVIEW':'Back to order overview',

          // VIEW ----- list-post.client.view.html ------
          // LABELS
          'BREADCRUMB-POSTS-OVERVIEW':'Post overview',
          'LABEL-POST-YOUR':'Your posts',
          'LABEL-POST-CHANNEL':'Post channel',
          'LABEL-POST-PUBLICATION-DATE':'Publication date',
          'LABEL-POST-STATUS':'Post status',
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
          'LABEL-SEE-ALL-ORDERS':'See all Orders',
          'LABEL-PROFILE':'Profile',
          'LABEL-LOGO':'Logo',
          'LABEL-PAYMENT':'Payment',
          'LABEL-LOGOUT':'Log out',
          'LABEL-SUBSCRIPTION':'Subscription',
          'LABEL-CHANGE-PASSWORD':'Change Password',

          // VIEW ----- footer.client.view.html ------
          // LABELS
          'LABEL-IMPRINT':'Imprint',
          'LABEL-DATASECURITY':'Privacy policy',
          'LABEL-TERMS':'Terms and conditions',
          'LABEL-CONTACT':'LABEL-CONTACT',

          // VIEW ----- home.client.view.html ------
          // LABELS
          'LABEL-YOUR-ORDERS':'Your orders',
          'LABEL-PERFORMANCE-OVERVIEW':'Performance overview',
          'TEXT-AVERAGE-VALUE-SALES':'Average value of sales in the past month:',
          'TEXT-ALL-SALES-YEAR':'All sales this year: feature coming soon',
          'LABEL-THIS-MONTH-REVENUE':'This month revenue',
          'LABEL-UPDATE-ON':'Update on',
          'LABEL-MONTH':'Month',
          'LABEL-ORDERS-THIS-MONTH':'Orders this month',
          'LABEL-ORDERS-VOLUME':'Order volume',
          'LABEL-ORDERS-VOLUME-THIS-MONTH':'Order volume this month',
          'LABEL-TODAY-ORDERS':'Orders today',

          // BUTTON
          'BUTTON-ALL-ORDERS':'Open all orders',

          // VIEW ----- tutorial.client.view.html ------
          // LABELS
          'LABEL-WELCOME':'Welcome',
          'LABEL-ADD-COMPANY-DETAILS':'Add your company details',
          'LABEL-ADD-BASICS-COMPANY-DETAILS':'The basics. Please add your company details.',
          'LABEL-COMPLETED':'Completed',
          'LABEL-MAINTAIN-COMPANY-DATA':'Maintain company data',
          'LABEL-ADD-LEGAL-DATA':'Maintain your legal data',
          'LABEL-NOTE-ADD-TERMS-AND-CONDITIONS':'Please add your terms and conditions, return policies, data policies and imprint to make sure that your offer complies with legal regulatory.',
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



          // NEW
          //signup
          'LABEL-ACCEPT-TERMS-HINT-I':'With click on "Register" I agree to the',
          'LABEL-ACCEPT-TERMS-HINT-II':'and confirm that I have read the ',
          'LABEL-ACCEPT-TERMS-HINT-III':'To ease the use of our website we use cookies. ',
          'LABEL-TERMS-AND-CONDITION-LONG':'Terms and Conditions',
          'LABEL-DATA-PROTECTION-LONG':'Privacy Policy',

          //home
          'LABEL-ORDERS-VOLUME-CHANNEL':'Order volume per channel',

          // VIEW ----- view-product.client.view.html ------
          // LABELS
          'BREADCRUMB-PRODUCTS':'Products',
          'BREADCRUMB-EDIT-PRODUCTS':'Edit products',
          'BREADCRUMB-POSTS':'Posts',
          'BREADCRUMB-MAIN-DATA':'Main data',
          'BUTTON-TAB-MAIN-DATA':' Main data',
          'BUTTON-TAB-IMAGES':'Images',
          'BUTTON-TAB-DAWANDA-PRODUCT':'Dawanda product',
          'BUTTON-TAB-NEW':'NEW',
          'LABEL-IMAGE':'Image',
          'LABEL-POST-DATE':'Post date',
          'LABEL-POST-ACTION':'Action',

          // BUTTON
          'BUTTON-CREATE-POST':' Create post',
          'BUTTON-CREATE-PIN':' Create pin',
          'BUTTON-CREATE-TWEET':' Create tweet',
          'BUTTON-CREATE-COMMENT':' Create comment',
          'BUTTON-CREATE-POST-ETSY':' Create Etsy post',
          'BUTTON-CREATE-POST-DAWANDA':' Create Dawanda post',
          'BUTTON-CREATE-POST-CODE-SNIPPET':' Code snippet',
          'BUTTON-REVIEW-POST':'Review post',

          // ERROR
          'NOTE-FINALIZE-TUTORIAL':'Please finalize the tutorial before you post your first product! This data is essential, to enable customers to buy your products.',
          'NOTE-YOUR-SALES-CHANNELS':'Your available sales channels:',
          'NOTE-ADD-IMAGES-FIRST':'Note: Please go to "Images" tab first to add a product image for Instagram!',
          'NOTE-SERVICE-COMEING-SOON':'This service will soon be available for you:',
          'NOTE-SERVICE-IN-DEVELOPMENT':'This service will soon be available for you:',
          'NOTE-NOT-POSTED-PRODUCT-SO-FAR':'You have not posted this product yet. To post this product just click on "Create post" for the corresponding channel!',


          // VIEW ----- media-instagram.product.modal.view.html ------
          // LABELS
          'LABEL-YOUR-MEDIA-ON':'Your medias on',
          'LABEL-TEXT':'Text',

          // ERROR
          'NOTE-YOUR-IMAGES-ON-INSTAGAM':'Those are your recent Instagram images. Please select your product image.',

          // VIEW ----- post.product.modal.view.html ------
          // LABELS
          'LABEL-YOUR-POST-TO':'Your post to',
          'LABEL-POSTED-ON':'Posted on',
          'LABEL-YOUR-COMMENT':'Your comment',
          'LABEL-INSTRUCTION':'Instruction',
          'LABEL-PREVIEW-POST':'Preview of your post ',
          'LABEL-PREVIEW-PIN':'Preview of your pin ',
          'LABEL-PREVIEW-TWEET':'Preview of your tweet',
          'LABEL-PREVIEW-INSTAGRAM':'Preview of your Instagaram comment',
          'LABEL-PREVIEW-CODE-SNIPET':'Preview of your code snippet',
          'LABEL-BUY-NOW':'BUY NOW',
          'LABEL-FOR':'for',
          'LABEL-SOLD-BY':'Sold by',

          // ERROR
          'NOTE-CURRENTLY-NO-UPDATE-FACEBOOK-POST':'Please note: There is currently no update functionality available for Facebook posts.',
          'NOTE-ACCESS-TOKEN-EXPIRED-FACEBOOK':'We are sorry, your Facebook profile could not be loaded. Please close the window and click again on "Create post".',
          'NOTE-POST-WILL-AUTOMATICALLY-BE-UPDATED':'Good to know: The post will automatically be updated, if you edit the product after the post.',
          'NOTE-CURRENTLY-NO-UPDATE-TWITTER-POST':'Good to know: There is currently no update functionality available for Twitter tweets.',
          'NOTE-INSTAGRAM-POST-AS-COMMENT':'Good to know: For Instagram all product information will be added as new comment including a link to the product details page to buy your product.',
          'NOTE-COPY-CODE-SNIPET-TO-ANY-SIDE':'Please copy the following code to any side you would like to make your product buyable. If you would like to remember where you put the code snippet you can add a comment in the input field and click "Save code snippet information".',
          'NOTE-INFORMATION-WHERE-SAVE-CODE-SNIPET':'Use this field to save information about where you place the HTML widget',
          'NOTE-NOT-FINAL-LOOK-OF-POST':'Please note that, this is what your post will look like. Further Facebook specific elements will be visible in the live post.',
          'NOTE-NOT-FINAL-LOOK-OF-PIN':'Please note that, this is what your pin will look like. Further Pinterest specific elements will be visible in the live post.',
          'NOTE-NOT-FINAL-LOOK-OF-TWEET':'Please note that, this is what your tweet will look like. Further Twitter specific elements will be visible in the live post.',
          'NOTE-NOT-FINAL-LOOK-OF-INSTAGRAM-COMMENT':'(This is not the final look of your comment. Instagram comments are limited to 300 characters. We therefore have to cut off the title and description after 200 characters to finally add the BUY NOW link.)',
          'NOTE-NOT-FINAL-LOOK-OF-CODE-SNIPET':'Good to know: Depending on the integration of your HTML widget on your website, the preview may slightly differ from the final view.',

          // BUTTON
          'BUTTON-TRY-POST-AGAIN':'Try post again',
          'BUTTON-TRY-TWEET-AGAIN':'Try tweet again',
          'BUTTON-POST-PRODUCT-AGAIN':'Post product as new post again',
          'BUTTON-PIN-PRODUCT-AGAIN':'Pin product as new pin again',
          'BUTTON-TWEET-PRODUCT-AGAIN':'Tweet product as new tweet again',
          'BUTTON-POST-PRODUCT-TO-FACEBOOK':'Post Product to Facebook',
          'BUTTON-PIN-PRODUCT-TO-PINTEREST':'Pin your product to Pinterest',
          'BUTTON-TWEET-PRODUCT-TO-TWITTER':'Tweet Product to Twitter',
          'BUTTON-ADD-DETAILS-TO-INSTAGRAM':'Add Product details to Instagram',
          'BUTTON-SAVE-CODE-SNIPPET-INFORMATION':'Save code snippet information',
          'BUTTON-POST-PRODUCT-TO-ETSY':'Post product to Etsy',

          // VIEW ----- list-product.client.view.html ------
          // LABELS
          'BREADCRUMB-YOUR-PRODUCTS':'Your products',
          'BREADCRUMB-ALL-YOUR-PRODUCTS':'All your products',

          // BUTTON
          'BUTTON-EDIT-PRODUCT':' Edit product',
          'BUTTON-UPGRADE-ACCOUNT':'Upgrade your account',
          'BUTTON-ADD-PRODUCT':'Add a product',

          // VIEW ----- edit-product.client.view.html ------
          // LABELS
          'LABEL-PRODUCT-ACTIVE-ON':'Product is active on: ',
          'LABEL-DESCRIBE-YOUR-PRODUCT':'Describe your product',
          'LABEL-IN-STOCK':'Is in stock',
          'LABEL-IN-ID':'ID',
          'LABEL-TITLE':'Title',
          'LABEL-DESCRIPTION':'Description',
          'LABEL-PRICE':'Price',
          'LABEL-TAX':'Tax',
          'LABEL-CURRENCY':'Currency',
          'LABEL-SHIPPING-OPTION':'Shipping Option',
          'LABEL-TOOLTIP-ITEM-NO-LONGER-IN-STOCK':'If your item is no longer in stock, the product will still be visible in the posted channels - but not buyable for the customer. In case the item is backordered, you might want to add a note for your customers in the title or description field.',
          'LABEL-TOOLTIP-PRODUCT-TITLE':'Any information about brand, colour, or size of the product should be added to the title separated by comma. Please make sure, that you don’t use one of the following special signs: /[^\{}]/. The characters % : & + can only be used once.',
          'LABEL-TOOLTIP-PRODUCT-PRICE':'Please enter prices in the format 12.40 or 2314.05 - there are no commas possible.',
          'LABEL-SET-PRICE-PRODUCT':'Set the price of your product',
          'LABEL-SELECT-SHIPPING-OPTION':'Select the applicable shipping option for your product',

          // ERROR
          'VALIDATION-PRODUCT-ID-REQ':'Please enter the product ID.',
          'VALIDATION-PRODUCT-TITLE-REQ':'Please enter the product title.',
          'VALIDATION-PRODUCT-TITLE-TO-LONG':'Please shorten the prduct title.',
          'VALIDATION-PRODUCT-DESCRIPTION-REQ':'Please enter the product description.',
          'VALIDATION-PRODUCT-DESCRIPTION-TO-LONG':'Please shorten the product description.',
          'VALIDATION-PRODUCT-TAX-REQ':'Please select the tax value.',
          'VALIDATION-PRODUCT-SHIPPING-OPTION-REQ':'Please select the shipping option.',
          'NOTE-ALREADY-POSTED-PRODUCT':'Please note if you have already posted the product:',
          'NOTE-UPDATE-PRODUCT-CHANGES-IN-CHANNELS':'Any changes made to the product details and medias will be updated in all selected channels to which the product has been posted - except for facebook. If you want changes to appear on facebook, you’ll need to post the product again.',

          // BUTTON
          'BUTTON-UPDATE-PRODUCT':'Update product',

          // VIEW ----- create-product.client.view.html ------
          // LABELS
          'BREADCRUMB-CREATE-PRODUCT':'Create Product',
          'LABEL-PLACEHOLDER-PRODUCT-PRICE':'Enter price in the format eg 23.00 or 134.53',

          // ERROR
          'VALIDATION-PRODUCT-CURRENCY-REQ':'Please select the currency.',

          // BUTTON
          'BUTTON-CREATE-PRODUCT':'Create product',

          // VIEW ----- edit-media-product.client.view.html ------
          // LABELS
          'LABEL-YOUR-PRODUCT-IMAGES':'Your product images',
          'LABEL-MAIN-IMAGE':'Main',
          'LABEL-SOON-AVAILABLE':'available soon',
          'LABEL-HOW-TO-ADD-IMAGES':'Introduction about how to add / maintain your product images',
          'LABEL-PRODUCT-IMAGES':'Product Images',
          'LABEL-MAINTAIN-PRODUCTS-TODO':'how to maintain your product images',
          'LABEL-STEP1':'Step 1:',
          'LABEL-STEP1-EXPLANATION':'Upload an image by clicking "Select image"',
          'LABEL-STEP2':'Step 2:',
          'LABEL-STEP2-EXPLANATION':'Verify all cropping areas of your image',
          'LABEL-STEP2-EXPLANATION-LONG':'Verify and change the image section for each channel',
          'LABEL-STEP3':'Step 3:',
          'LABEL-STEP3-EXPLANATION':'Maintain alt text for your product image',
          'LABEL-STEP-FINALLY':'Finally:',
          'LABEL-STEP-FINALLY-EXPLANATION':'Click "Save images"',
          'LABEL-MAINTAIN-FACEBOOK-IMAGE':'Maintain Facebook image',
          'LABEL-BEST-FIT-FACEBOOK':'Note: Best fit for Facebook image 1200px / 627px',
          'LABEL-MAINTAIN-PINTEREST-IMAGE':'Maintain Pinterest image',
          'LABEL-BEST-FIT-PINTEREST':'Note: Best fit for Pinterest image 736px / 1104px',
          'LABEL-MAINTAIN-TWITTER-IMAGE':'Maintain Twitter image',
          'LABEL-BEST-FIT-TWITTER':'Note: Best fit for Twitter image 1024px / 512px',
          'LABEL-ALT-TEXT':'Alt text',
          'LABEL-ORIGINAL-FILE-NAME':'Original file name',
          'LABEL-FILE-SIZE':'Size',
          'LABEL-PROGRESS-UPLOAD':'Progress',
          'LABEL-FILE-UPLOAD-STATUS':'Status',
          'LABEL-FILE-UPLOAD-ACTIONS':'Actions',
          'LABEL-UPLOAD-NEW-IMAGE-TO-REPLACE-EXISTING':'Upload a new image to add new image or replace an existing one.',

          // ERROR
          'NOTE-HOW-TO-PROCEED-ADD-IMAGE':'Note: you can add all images by following the steps below. The INSTAGRAM image has to be added by clicking the button in the table above.',
          'NOTE-HOW-TO-ADD-IMAGES':'Please select your main product image by clicking "Select image". Afterwards you will be able to zoom and rotate and crop the images based on your favorite view.',
          'NOTE-USE-DEFAULT-CROP-SETTINGS':'Note: you can use default crop settings and skip step 2.',
          'NOTE-CASE-CROPPER-NOT-ACTIVE':'Note: In case the cropper is not active please reload the page. We already know about this problem and will fix it as soon as possible.',
          'NOTE-TOOLTIP-DESCRIPTION-FALLBACK-IMAGE':'Give a brief description of your image. This is important as the text is displayed if the image may not be loaded is relevant to partially sighted visitors to get an idea of what is displayed will be considered by search engines',
          'VALIDATION-ALT-TEXT-REQ':'Alt text is required',

          // BUTTON
          'BUTTON-ADD-IMAGE':'Add image',
          'BUTTON-SELECT-IMAGE':'Select image',
          'BUTTON-EDIT-IMAGE':'Edit image',
          'BUTTON-UPLOAD-ALL-MAIN-IMAGES':'Upload all main images',
          'BUTTON-STOP-UPLOAD':'Stop upload',
          'BUTTON-REMOVE-FROM-UPLOAD-LIST':'Remove from upload list',
          'BUTTON-SAVE-IMAGES':'Save images',


          // NEWNEW
          // VIEW ----- ship-order.modal.view.html ------
          // LABELS
          'LABEL-SHIPPING-SERVICE':'Service',
          'LABEL-SHIPPING-INFORMATION':'Parcel Information',
          'LABEL-SHIPPING-FURTHER-INFORMATION':'Further Information',
          'LABEL-SELECT-SHIPPING-PROVIDER':'Select shipping provider: ',
          'LABEL-SHIPPING-PARCEL-INFORMATION-LENGTH':'Length (in cm)',
          'LABEL-SHIPPING-PARCEL-INFORMATION-HIGHT':'Hight (in cm)',
          'LABEL-SHIPPING-PARCEL-INFORMATION-WIDTH':'Width (in cm)',
          'LABEL-SHIPPING-PARCEL-INFORMATION-WEIGHT':'Weight (in cm)',


          // ERROR
          'ERROR-NOTE-SHIP-CLOUD-INFORMATION-I':'With mightymerce you are able to use the service of ',
          'ERROR-NOTE-SHIP-CLOUD-INFORMATION-II':' to print your shipping labels and to provide your customers parcel tracking availability.',
          'ERROR-NOTE-FURTHER-INFORMATION':'Any further information can be provided in this section. If you have your own shipping provider you can paste your URL or tracking code here. If you use shipcloud - please leave the field empty.'


  });

    /*
    $translateProvider.useStaticFilesLoader({
      prefix: 'lang-',
      suffix: '.json'
    });
    $translateProvider.useLocalStorage();
    */

    $translateProvider.preferredLanguage('de-DE');

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
      if (document.readyState === "complete") {
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
