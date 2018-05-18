//try {
    var main_app = new Framework7( {
		sortable: false,
		swipeout: false,
		swipeBackPage: false,
		pushState: true,
		cache: false
    } );

    var debug = 0;
    var $$ = Dom7;
    var URL = '';

    var main_slider;
    var in_progress = false;
    var total_vars = 0;
    var global_vars = {
	// old ones
	DEVICE_ID: 'deviceID',
	USER_ID: 'appUserId',
    FILTER_DATA: 'filterData',
	COLUMN: 'rubriek',
	PORTAL_USER_ID: 'everliveUserId',
	APP_USER_ID: 'appUserId',
	PUSH_ID: 'pushNotificationDeviceID',
	// new
	ZEND_PDF_DATA: 'zend_pdf_data',
	ZEND_SELECTION: 'zend_selection',
	USER_DATA: 'user_data',
	COMPANY_EMPLOYEES: 'company_employees',
	APP_SETTINGS_DATA: 'app_settings_data',
	PAGES_DATA: 'pages_data',
	OFFICE_DATA: 'office_data',
	HIDE_LOADER: 'hide_loader',
	// listing
	OVERONS_LIST_ITEMS: 'overons_list_items',
	MEER_LIST_ITEMS: 'meer_list_items',
	// webpages
	NOTIFICATION_MESSAGES: 'message'
    }

    var client_vars = {
	rss: '',
	bel_part: '',
	bel_zak: '',
	kennisbank_personeel: '',
	kennisbank_rechtpersonen: '',
	promoot_deze_app: '',
	exact_online_app: '',
	client_online_app: '',
	unit_app: '',
    }

    // init main view
    var main_view = main_app.addView( '.view-main' );
    var everlive = new Everlive( {
	appId: db_api_key,
	scheme: url_scheme, // switch this to 'https' if you'd like to use TLS/SSL encryption and if it is included in your subscription tier,
	offline: true
    } );
    document.addEventListener( "deviceready", function () {
	hide_statusbar();

 if(my_app_id != '' && my_app_id != undefined){
  // start notification
      // Set your iOS Settings
       var iosSettings = {};
       iosSettings["kOSSettingsKeyAutoPrompt"] = false;
       iosSettings["kOSSettingsKeyInAppLaunchURL"] = false
    //window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
     var notificationOpenedCallback = function(jsonData) {
       console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
       //alert(JSON.stringify(jsonData));
       OSNotificationPayload(jsonData);
     };

     var notificationReceivedCallback = function(jsonData){
       afterReceived(jsonData);
     };

       if(my_app_id != null && my_app_id != ''){
         window.plugins.OneSignal.startInit(my_app_id)
         .iOSSettings(iosSettings)
         .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.None)
         .handleNotificationReceived(notificationReceivedCallback)
         .handleNotificationOpened(notificationOpenedCallback)
         .endInit();

          setTimeout(function(){
            updatePlayerId();
          },5000);
       }

    // end push notification
  }

	if ( !is_connected() ) {
	    show_alert( messages.NO_CONNECTION );
	}

	if ( get_device_platform() == "android" ) {
	    if ( typeof screen.lockOrientation == 'function' ) {
		screen.lockOrientation( 'portrait' );
	    }
	}

	init_db( everlive ); // init DB
	init_jsdo(); // init JSDO

	// register / login into telerik
	register_portal_user( get_device_id(), get_device_id(), function () {
	    var render_page = setInterval( function () { // wait for user_id
		in_progress = false;
		var user_id = get_user_id();
		if ( isset( user_id ) && user_id.length ) {
		    if ( get_user_id() != 0 || ( isset( get_global_var( global_vars.PUSH_ID ) ) && get_global_var( global_vars.PUSH_ID ) ) ) {
			launch_push_notification();
		    }

		    setup_keyboard();
		    clearInterval( render_page );
            console.log("--------------------------------");
            console.log("user_id: "+user_id);
            console.log("--------------------------------");
		    var landing_page_options = {
			url: ( user_id == 0 || user_id == '0' || user_id == 'undefined' ) ? 'pages/' + app_name.toLowerCase() + '/welkom.html' : 'pages/' + app_name.toLowerCase() + '/'+landingPage+'.html',
			animatePages: false
		    };
		    main_view.router.load( landing_page_options );
		    adjust_history( [ '/index.html', '/welkom.html' ] );

		    $$( document ).off( 'page:beforeinit' ).on( 'page:beforeinit', function ( e ) {
			hide_statusbar();
			var page = e.detail.page;
			URL = page.url;
			var script = $( page.container ).data( 'script' );
			load_fragment( page );

			if ( isset( script ) && script.length ) {
			    var script_path = ( 'assets/js/pages/%script%.js' ).replace( '%script%', script );
			    if ( asset_loaded( script_path, 'js' ) && isset( $( page.container ).data( 'runner' ) ) && $( page.container ).data( 'runner' ).length ) {
				var run = eval( 'run_' + $( page.container ).data( 'runner' ) );
				run();
			    }
			    // show_indicator();
			    load_js_css_file( script_path, 'js' );
			}
		    } ).off( 'page:init' ).on( 'page:init', function ( e ) {
			var page = e.detail.page;
			var hide = $( page.container ).data( 'hideindicator' );

			if ( typeof hide === 'undefined' || eval( hide ) )
			    hide_indicator();
/*
			$( 'img' ).each( function () {
			    if ( $( this ).attr( 'src' ).indexOf( 'logo' ) > -1 )
				$( this ).attr( 'src', $( this ).attr( 'src' ).replace( 'home-logo', 'logo-' + app_name ) );
			    else if ( $( this ).attr( 'src' ).indexOf( 'slide-1.jpg' ) > -1 )
				$( this ).attr( 'src', $( this ).attr( 'src' ).replace( 'slide-1', 'slide-1-' + app_name ) );
			    else if ( $( this ).attr( 'src' ).indexOf( 'slide-2.jpg' ) > -1 )
				$( this ).attr( 'src', $( this ).attr( 'src' ).replace( 'slide-2', 'slide-2-' + app_name ) );
			} );

			if ( $( '.left .icon.icon-back', $( page.container ) ).length ) {
			    $( '.left a', $( page.container ) ).attr( 'href', "javascript:void(0);" );
			    if ( isset( get_global_var( global_vars.HIDE_LOADER ) ) && eval( get_global_var( global_vars.HIDE_LOADER ) ) ) {
				$( '.left a', $( page.container ) ).removeClass( 'open-indicator' );
			    }
			}
*/
            backLink =  $( '.left a', $( page.container ) ).attr( 'href' );
            pageID = $( page.container ).data( 'page' );
//           alert(pageID);
            editPageDetails(); // Hook back to override.js after pageloading

			if ( get_device_platform() == "ios" && page.name.indexOf( 'welkom' ) > -1 ) {
			    $( '.popup-welkom' ).css( { 'margin-top': '-20px', height: '100%' } );
			}
			var slider = $( page.container ).data( 'slider' );
			if ( slider ) { // init slider
			    main_slider = main_app.swiper( '.swiper-container', {
                slidesPerView: 1,
                loop: true,
                autoplay: 7000,
                autoplayDisableOnInteraction: false,
                speed: 1800,
                spaceBetween: MainSliderSpaceBetween,
                effect: MainSliderEffect
			    } );
			}
			var iconslider = $( page.container ).data( 'iconslider' );
			if ( iconslider ) { // init iconslider
                initIconslider();
			}
			var imageslider = $( page.container ).data( 'imageslider' );
			if ( imageslider ) { // init imageslider
                initImageslider();
			}

			bind_clicks();
		    } ).off( 'page:back' ).on( 'page:back', function ( e ) {
			var page = e.detail.page;
			set_global_var( global_vars.HIDE_LOADER, 'false' );
			if ( page.name.indexOf( 'smart-select' ) > -1 ) {
			    $( 'a.smart-select.update-alert div.item-after' ).html( "<span class='badge'>" + ( $( 'input[type="checkbox"]:checked', $( page.container ) ).length ? $( 'input[type="checkbox"]:checked', $( page.container ) ).length : 0 ) + "</span>" );
			}
		    } );
		}
	    }, 800 );
	} );
    }, false );
    document.addEventListener( "resume", function () {
	hide_statusbar();
    }, false );
    /*
    $(document).on({
         'DOMNodeInserted': function() {
             $('.pac-item, .pac-item span', this).addClass('no-fastclick');
            }
        }, '.pac-container'
    );*/
//} catch ( e ) {
//    log( 'EXCEPTION : ' + JSON.stringify( e ) );
//}
