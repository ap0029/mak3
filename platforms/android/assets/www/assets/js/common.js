/*
 * All common function below.
 */

function log( message ) {
    if ( debug )
	console.log( message );
}

function get_device_id() {
    return isset( device.uuid ) ? device.uuid : 0; // (new Date())
}

function get_device_platform() {
    return isset( device.platform ) ? device.platform.toLowerCase() : '';
}

function hide_statusbar() {
    if ( get_device_platform() == "ios" || get_device_platform() == "android" ) {
	// StatusBar.styleBlackTranslucent();
	StatusBar.hide();
    }
}

function isset( value ) {
    return typeof value !== 'undefined' && value !== null && value !== 'undefined';
}

function sanitize_value( value, default_value ) {
    return isset( value ) && value ? value : default_value;
}

function validate( value ) {
    return isset( value ) && value.length > 0 && value !== '' ? true : false;
}

function ucwords( str ) {
    return ( str + '' ).replace( /^([a-z])|\s+([a-z])/g, function ( $1 ) {
	return $1.toUpperCase();
    } );
}

function validate_email( email ) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test( email );
}

function is_numeric( num ) {
    return !isNaN( parseFloat( num ) ) && isFinite( num );
}

function show_indicator() {
    main_app.showIndicator();
}

function hide_indicator() {
    main_app.hideIndicator();
    $( '.page-content' ).attr( 'style', "display: block !important" );
}

function show_alert( message, callback ) {
    try {
	main_app.alert( message, '', function () {
	    if ( isset( callback ) )
		callback();
	} );
    } catch ( e ) {
	log( 'show_alert()' );
	log( e );
    }
}

function show_toast( type, message, callback ) {
    try {
        window.plugins.toast.showWithOptions( {
            message: message,
            duration: "1500",
            position: "center",
            styling: {
            opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
            // backgroundColor: type == 'success' ? '#4caf50' : '#F44332', // make sure you use #RRGGBB. Default #333333
            cornerRadius: 10, // minimum is 0 (square). iOS default 20, Android default 100
            },
        }, function ( result ) {
			console.log('show_toast callback working');
            if ( isset( callback ) ) callback();
        } );
    } catch ( e ) {
        console.log( 'show_toast()' );
        console.log( e );
        if ( isset( callback ) ) callback();
    }
}

function bind_clicks() {
    $( document )
	    .off( 'click', '.open-indicator' )
	    .on( 'click', '.open-indicator', function () {
		show_indicator();
	    } );

    $( document )
	    .off( 'click', '.under-construction' )
	    .on( 'click', '.under-construction', function () {
		main_app.hideIndicator();
		show_alert( 'Deze functie zal binnenkort worden toegevoegd. Blijf kijken.' );
	    } );

    $( document )
	    .off( 'click', '.left a.HistoryBack' )
	    .on( 'click', '.left a.HistoryBack', function () {
		window.history.back();
	    } );


    $( document )
	    .off( 'click', 'a.mlink-hist' )
	    .on( 'click', 'a.mlink-hist', function () {
            console.log('clicked');
            //window.history.back();
            main_view.router.loadPage("pages/assufree/mijn_schademelder.html");
	    } );


    $( document )
	    .off( 'click', '.left a.mlink' )
	    .on( 'click', '.left a.mlink', function () {
            //main_view.router.loadPage("./pages/assufree/home.html");
            main_view.router.loadPage( String( $(this).attr("data-destination") )=="app_home"?"pages/"+app_name.toLowerCase()+"/"+landingPage+".html":String( $(this).attr("data-destination") ) );
	    } );

    $( document )
	    .off( 'click', '.left a.home' )
	    .on( 'click', '.left a.home', function () {
            //main_view.router.loadPage("./pages/assufree/home.html");
            main_view.router.loadPage("pages/"+app_name.toLowerCase()+"/home.html");
	    } );
    $( document )
	    .off( 'click', '.left a.logout' )
	    .on( 'click', '.left a.logout', function () {
            forceAppendLoader();
            var userObj = JSON.parse( get_global_var("EL_USER_DATA") ),
                accessToken = userObj.result.access_token;
            $.ajax({
                type: "GET",
                url: 'https://api.everlive.com/v1/'+db_api_key+'/oauth/logout',
                headers: {"Authorization" : "Bearer "+accessToken},
                success: function (data) {
                    var el = new Everlive(db_api_key);
                    el.authentication.clearAuthorization();
                    main_view.router.loadPage("pages/"+app_name.toLowerCase()+"/login.html");
                },
                error: function (error) {
                    alert(JSON.stringify(error));
                }
            });
	    } );
    $( document )
	    .off( 'click', 'a[href^="tel:"]' )
	    .on( 'click', 'a[href^="tel:"]', function () {
		window.open( $( this ).attr( 'href' ), '_system' );
	    } );

    $( document )
	    .off( 'click', 'a[href^="mailto:"]' )
	    .on( 'click', 'a[href^="mailto:"]', function () {
		window.open( $( this ).attr( 'href' ), '_system' );
	    } );
      $( document )
	    .off( 'click', '.left a.tohome' )
	    .on( 'click', '.left a.tohome', function () {
            set_global_var( "fromLogin", "false" );
            main_view.router.loadPage("pages/"+app_name.toLowerCase()+"/home.html");
        });
}

function encode_data( data ) {
    return encodeURIComponent( data );
}

function decode_data( data ) {
    return decodeURIComponent( data );
}

function page_visited( page ) {
    var visited = false;
    for ( var i = 0; i < main_view.history.length; i++ ) {
	if ( main_view.history[i].indexOf( page ) > -1 ) {
	    visited = true;
	    break;
	}
    }

    return visited;
}

function adjust_history( url ) {
    try {
	for ( var i = 0; i < main_view.history.length; i++ ) {
	    if ( $.isArray( url ) ) {
		for ( var j = 0; j < url.length; j++ ) {
		    if ( main_view.history[i].indexOf( url[j] ) > -1 )
			main_view.history.splice( i, 1 );
		}
	    } else {
		if ( main_view.history[i].indexOf( url ) > -1 )
		    main_view.history.splice( i, 1 );
	    }
	}
    } catch ( e ) {

    }
}

function setup_keyboard() {
    try {
	if ( get_device_platform() != "ios" ) {
	    window.addEventListener( "native.keyboardshow", function ( e ) {
		var node = $( ':focus' );
		var par = node.closest( '.page-content' );
		var header = $( '.navbar', par.closest( '.page' ) ).height() + 15;
		header = header ? header : 85;
		par
			.attr( "style", "display: block !important; padding-bottom: 450px;" )
			.scrollTop( 0 )
			.animate( {
			    scrollTop: node.offset().top - header - par.offset().top + par.scrollTop()
			}, 0 );
		cordova.plugins.Keyboard.disableScroll( true );
		hide_statusbar();
	    } );
	    window.addEventListener( "native.keyboardhide", function () {
		$( ':focus' ).closest( '.page-content' ).attr( "style", "display: block !important;" );
		cordova.plugins.Keyboard.disableScroll( false );
		cordova.plugins.Keyboard.hideKeyboardAccessoryBar( true );
		hide_statusbar();
	    } );
	    document.addEventListener( "backbutton", function () {
		if ( $( '.modal-in' ).length > 0 ) {
		    main_app.closeModal( '.modal-in' );
		} else
		    window.history.back();
	    }, false );
	}
    } catch ( e ) {
	log( 'setup_keyboard()' );
	log( e );
    }
}

function social_share( message, subject, image, link ) {
    window.plugins.socialsharing.share( message, subject, image, link );
}

function share_app() {
    var url = "";
    var url_ios = "";
    var url_and = "";
    get_store_link( function ( data ) {
        try{
            url_ios = decode_data(data[1].value);
            url_and = decode_data(data[0].value);

            if(get_device_platform() == "ios")
                url = url_ios;
            else
                url = url_and;
        }catch(e){
            url = "Url not specified";
        }
        window.plugins.socialsharing.share(
            "Download de app van " + app_name + " en blijf op de hoogte! " + url,
            "Download de app van " + app_name + " en blijf op de hoogte!",
            null,
            null,
            function(success){}, // e.g. function(result) {console.log('result: ' + result)}
            function(error){}
        );
    });
}

function share_app_2() {
        window.plugins.socialsharing.share(
            "Download de app van " + client_name + " en blijf op de hoogte! ",
            "Download de app van " + client_name + " en blijf op de hoogte!",
            null,
            promootlink,
            function(success){}, // e.g. function(result) {console.log('result: ' + result)}
            function(error){}
        );
}

function share_via_email( address, title, body, attachment ) {
    window.plugins.socialsharing.shareViaEmail(
	    body, //Message
	    title, //title
	    [ address ], // TO: must be null or an array
	    null, // CC: must be null or an array
	    null, // BCC: must be null or an array
	    attachment, // FILES: null, a string, or an array
	    function () {
		log( "Success" );
	    }, // called when email was sent or canceled, no way to differentiate
	    function () {
		log( "Error" );
	    } // called when something unexpected happened
    );
}

function get_global_var( key ) {
    try {
	var result = "";
	if ( get_device_platform() == "ios" ) {
	    log( "Get from keychain" );
	    try {
		new Keychain().getForKey( function ( value ) {
		    set_global_var( key, value );
		}, function ( message ) {
		    log( "Failure in Get" );
		    log( message );
		}, key, servicename );
	    } catch ( e ) {
		log( "Exception: get_global_var()" );
		// will do something here
	    }
	}
	if ( isset( localStorage ) && isset( localStorage.getItem( key ) ) ) {
	    result = localStorage.getItem( key );
	}
    } catch ( e ) {
	log( 'set_global_var()' );
	log( "Outer Exception - In Get" );
	log( e );
    }
    return result;
}

function set_global_var( key, value ) {
    try {

	if ( get_device_platform() == "ios" ) {
	    try {
		new Keychain().setForKey( function ( data ) {
		    log( 'success' );
		}, function ( data ) {
		    log( 'failuare' );
		}, key, servicename, value );
	    } catch ( e ) {
		log( "Exception: set_global_var()" );
	    }
	}

	localStorage.setItem( key, value );
    } catch ( e ) {
	log( "set_global_var()" );
	log( e );
    }
}

function set_auth_token( token ) {
    log( 'set_auth_token()' );

    try {
	localStorage.token = token;
	set_global_var( 'access_token', token );
    } catch ( e ) {
	log( e );
    }
}

function launch_push_notification( callback ) {
    var all_ok = true;
    var devicePushSettings = {
	iOS: {
	    badge: true,
	    sound: true,
	    alert: true,
	    clearBadge: true
	},
	android: {
	    senderID: android_sender_id
	},
	wp8: {
	    channelName: 'EverlivePushChannel'
	},
	notificationCallbackIOS: function ( data ) {
	    // alert('Notification');
	    hook_push_notification_action( data );
	},
	notificationCallbackAndroid: function ( data ) {
	    hook_push_notification_action( data );
	},
	notificationCallbackWP8: function ( e ) {
	    // will do something here
	},
	customParameters: {
	    // will do something here
	}
    };

    return all_ok;
}

function insertPlayerId(){
setTimeout(function(){
  var filter = { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'Id', value: get_user_id() } }, ] } ] };
  fetch_record( db_tables.APP_USER_TABLE, filter, '', function ( data ) {
      log( 'update_user_data()' );
      log( data );
      set_global_var( global_vars.USER_DATA, JSON.stringify( data.result[0] ) );
      var current_user_data = JSON.parse( get_global_var( global_vars.USER_DATA ) );
      window.plugins.OneSignal.getIds(function (ids) {
        //alert(JSON.stringify(ids.userId));
        if (ids && ids.userId) {
          var player_id = ids.userId;
          current_user_data.player_id = player_id;
          //alert(JSON.stringify(current_user_data));
          update_record( db_tables.APP_USER_TABLE, current_user_data, filter, function ( data ) {
            if(isset( data.result )){
              // alert("player_id updated");
            }
          })
          var tag_device_id = current_user_data.deviceID;
          window.plugins.OneSignal.sendTag("deviceID", tag_device_id);
        }
      })
  });
},2000);

}

// update playerId in App_USer collection after registration
function updatePlayerId(){
  // Update playerId in db
  window.plugins.OneSignal.getIds(function (ids) {
    //alert(JSON.stringify(ids.userId));
    if (ids && ids.userId) {
      // get player ID
      var player_id = ids.userId;
      if ( isset( get_global_var( global_vars.USER_DATA ) ) ) {
    	var current_user_data = JSON.parse( get_global_var( global_vars.USER_DATA ) );
      current_user_data.player_id = player_id;
    	var filter = { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'Id', value: get_user_id() } } ] } ] };
    	update_record( db_tables.APP_USER_TABLE, current_user_data, filter, function ( data ) {
    	    if ( isset( data.result ) ) {
    		/*window.plugins.toast.showWithOptions( {
    		 message: messages.GENERAL_SUCCESS,
    		 duration: "long",
    		 position: "center",
    		 }, function ( result ) {
    		 log( result );
    		 } );*/
    	    } else {
    		// will do something here
    	    }
    	    hide_indicator();
    	} );
        }
    }
  });
  if ( isset( get_global_var( global_vars.USER_DATA ) ) ) {
  var current_user_data_r = JSON.parse( get_global_var( global_vars.USER_DATA ) );
  var tag_device_id_r = current_user_data_r.deviceID;
  window.plugins.OneSignal.sendTag("deviceID", tag_device_id_r);
 }
}

// function called after receiving push messages
function afterReceived( data ) {
    //alert(JSON.stringify(data.notification.payload.additionalData.page));
    if("additionalData" in data.payload){
      if(data.payload.additionalData.page){
        var page = data.payload.additionalData.page;
        data.alert = data.payload.title;
        data.message = data.payload.body;
        set_global_var( global_vars.NOTIFICATION_MESSAGES, ( get_device_platform() == 'ios' ) ? data.message : data.message );
        if ( ( get_device_platform() == 'android' && data ) || ( get_device_platform() == 'ios' && data) ) {
    	try {
    	    main_app.alert( get_global_var( global_vars.NOTIFICATION_MESSAGES ), messages.NOTIFICATIONS, function () {
    		show_indicator();
    		perform_notification_action_without_fetch_webpage(page);
    	    } );
    	} catch ( e ) {
    	    log( JSON.stringify( e ) );
    	}
        } else {
    	if ( document.readyState === "complete" ) {
    	    perform_notification_action_without_fetch_webpage(page);
    	}
        }
        $( document ).trigger( 'push-notification', data );
    }
  }else {
    data.alert = data.payload.title;
    data.message = data.payload.body;
    set_global_var( global_vars.NOTIFICATION_MESSAGES, ( get_device_platform() == 'ios' ) ? data.message : data.message );
    if ( ( get_device_platform() == 'android' && data ) || ( get_device_platform() == 'ios' && data) ) {
	try {
	    main_app.alert( get_global_var( global_vars.NOTIFICATION_MESSAGES ), messages.NOTIFICATIONS, function () {
		show_indicator();
		perform_notification_action(data.message);
	    } );
	} catch ( e ) {
	    log( JSON.stringify( e ) );
	}
    } else {
	if ( document.readyState === "complete" ) {
	    perform_notification_action(data.message);
	}
    }
    $( document ).trigger( 'push-notification', data );
  }
}

// after receiving the push notification get additional data
function OSNotificationPayload(data){
  hook_push_notification_action(data);

}

function hook_push_notification_action( data ) {
    //alert(JSON.stringify(data.notification.payload.additionalData.page));
    if("additionalData" in data.notification.payload){
        var page = data.notification.payload.additionalData.page;
        data.alert = data.notification.payload.title;
        data.message = data.notification.payload.body;
        set_global_var( global_vars.NOTIFICATION_MESSAGES, ( get_device_platform() == 'ios' ) ? data.message : data.message );
        if ( ( get_device_platform() == 'android' && data ) || ( get_device_platform() == 'ios' && data) ) {
    	try {
          perform_notification_action_without_fetch_webpage(page);
    	  //   main_app.alert( get_global_var( global_vars.NOTIFICATION_MESSAGES ), messages.NOTIFICATIONS, function () {
    		// show_indicator();
    		// perform_notification_action_without_fetch_webpage(page);
    	    //} );
    	} catch ( e ) {
    	    log( JSON.stringify( e ) );
    	}
        } else {
    	if ( document.readyState === "complete" ) {
    	    perform_notification_action_without_fetch_webpage(page);
    	}
        }
        $( document ).trigger( 'push-notification', data );

  }else {
    data.alert = data.notification.payload.title;
    data.message = data.notification.payload.body;
    set_global_var( global_vars.NOTIFICATION_MESSAGES, ( get_device_platform() == 'ios' ) ? data.message : data.message );
    if ( ( get_device_platform() == 'android' && data ) || ( get_device_platform() == 'ios' && data) ) {
	try {
    perform_notification_action(data.message);
	  //   main_app.alert( get_global_var( global_vars.NOTIFICATION_MESSAGES ), messages.NOTIFICATIONS, function () {
		// show_indicator();
		// perform_notification_action();
	  //   } );
	} catch ( e ) {
	    log( JSON.stringify( e ) );
	}
    } else {
	if ( document.readyState === "complete" ) {
	    perform_notification_action(data.message);
	}
    }
    $( document ).trigger( 'push-notification', data );
  }
}

function perform_notification_action_without_fetch_webpage(page){
  if ( page.indexOf( 'http' ) != -1 || page.indexOf( 'https' ) != -1) {
      app_browser( decode_data( page ), messages.NOTIFICATIONS, false );
  }else {
      if ( isset( page ) ) {
        show_indicator();
        set_global_var( global_vars.HIDE_LOADER, 'true' );
        //alert("inside if"+page);
        //main_view.allowPageChange = true;
        //main_view.router.load({url:"pages/" + page + ".html", ignoreCache: true, reload: false});
        main_view.router.loadPage( "pages/" + page.toLowerCase() + ".html" );
      }
  }
}


function perform_notification_action(msg) {
    try {
	fetch_record( db_tables.WEBPAGE_TABLE, {
	    type: 'single',
	    where: [ {
		    type: 'none',
		    clauses: [ {
			    action: '=',
			    clause: {
				column: 'message',
				value: msg
			    } },
		    ] }
	    ] }, 'meta_value', function ( data ) {
	    hide_indicator();
	    if ( isset( data.result ) && data.result.length ) {

        //alert(data.result[0].webpage.indexOf( 'http' ));
		if ( data.result[0].webpage.indexOf( 'http' ) != -1 || data.result[0].webpage.indexOf( 'https' ) != -1) {
		    app_browser( decode_data( data.result[0].webpage ), messages.NOTIFICATIONS, false );
		} else {
        var page = data.result[0].webpage;
        page = page.toLowerCase();
          if ( isset( page ) ) {
            show_indicator();
            set_global_var( global_vars.HIDE_LOADER, 'true' );
            //alert("inside if"+page);
            //main_view.allowPageChange = true;
            //main_view.router.load({url:"pages/" + page + ".html", ignoreCache: true, reload: false});
            main_view.router.loadPage( "pages/" + page + ".html" );
        }
        //alert("inside else"+data.result[0].webpage);
        //main_view.router.loadPage( "pages/" + page + ".html" );
		}
	    }
	} );
    } catch ( e ) {
	log( 'perform_notification_action()' );
	log( JSON.stringify( e ) );
	hide_indicator();
    }
}

function json_to_array( json ) {
    try {
	var array = new Array();
	for ( var i in json )
	    array[i] = json[i];

    } catch ( e ) {
	log( 'json_to_array()' );
	log( e );
    }

    return array;
}

$.fn.serializeObject = function () {
    var o = { };
    var a = this.serializeArray();
    $.each( a, function () {
	if ( o[this.name] ) {
	    if ( !o[this.name].push ) {
		o[this.name] = [ o[this.name] ];
	    }
	    o[this.name].push( this.value || '' );
	} else {
	    o[this.name] = this.value || '';
	}
    } );
    return o;
};

function print_map( node, longitude, latitude ) {
    try {
	log( node );
	var position = new google.maps.LatLng( latitude, longitude );
	var map = new google.maps.Map( node[0], { center: position, zoom: 10 } );
	var marker = new google.maps.Marker( {
	    position: position
	} );
	marker.setMap( map );
    } catch ( e ) {
	log( 'print_map()' );
	log( e );
    }
}

function get_pre_selected_options( data, key, default_value ) {
    console.log( 'get_pre_selected_options()' );
    console.log(key);
    console.log(default_value);
    console.log(data);
    try {
	if ( isset( data ) ) {
	    data = json_to_array( JSON.parse( data ) );
	    console.log( isset( data ) && isset( data[key] ) ? data[key] : default_value );
	    return isset( data ) && isset( data[key] ) ? data[key] : default_value;
	}
    } catch ( e ) {
	console.log( 'get_pre_selected_options() error' );
	console.log( e );
    return default_value;
    }

    return default_value;
}

function update_user_data( callback ) {
    try {
	var filter = { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'Id', value: get_user_id() } }, ] } ] };
	fetch_record( db_tables.APP_USER_TABLE, filter, '', function ( data ) {
	    log( 'update_user_data()' );
	    log( data );
	    set_global_var( global_vars.USER_DATA, JSON.stringify( data.result[0] ) );
	    if ( isset( callback ) )
		callback();
	} );
    } catch ( e ) {
	log( e );
    }
}

function update_global_user_data( new_data ) {
	console.log('update_global_user_data');
    console.log( JSON.stringify( new_data ) );
    if ( isset( get_global_var( global_vars.USER_DATA ) ) ) {
	    var current_user_data = JSON.parse( get_global_var( global_vars.USER_DATA ) );
	    $.each( new_data, function ( i, val ) {
		if ( isset( new_data[i] ) ) {
		    current_user_data[i] = val;
		}
	    } );
	    set_global_var( global_vars.USER_DATA, JSON.stringify( current_user_data ) );
	    localstorage_to_db();
	}
}

function localstorage_to_db() {
    // Update record in db
    if ( isset( get_global_var( global_vars.USER_DATA ) ) ) {
	var current_user_data = JSON.parse( get_global_var( global_vars.USER_DATA ) );
	var filter = { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'Id', value: get_user_id() } } ] } ] };
	update_record( db_tables.APP_USER_TABLE, current_user_data, filter, function ( data ) {
	    if ( isset( data.result ) ) {
		/*window.plugins.toast.showWithOptions( {
		 message: messages.GENERAL_SUCCESS,
		 duration: "long",
		 position: "center",
		 }, function ( result ) {
		 log( result );
		 } );*/
	    } else {
		// will do something here
	    }
	    hide_indicator();
	} );
    }
}

function get_app_settings( callback ) {
    try {
	var app_settings_data = { };
	if ( isset( get_global_var( global_vars.APP_SETTINGS_DATA ) ) && get_global_var( global_vars.APP_SETTINGS_DATA ) ) {
	    app_settings_data = JSON.parse( get_global_var( global_vars.APP_SETTINGS_DATA ) );
	    if ( isset( callback ) )
		callback();
	    // $( '.details' ).html( decode_data( app_settings_data.overonsbedrijf ) );
	} else
	    fetch_record( db_tables.APP_SETTINGS_TABLE, { }, '', function ( data ) {
		log( 'fetch_app_settings()' );

		set_global_var( global_vars.APP_SETTINGS_DATA, JSON.stringify( data.result[0] ) );
		app_settings_data = data.result[0];
		if ( isset( callback ) )
		    callback();
		// $( '.details' ).html( decode_data( data.result[0].overonsbedrijf ) );
	    } );
	return app_settings_data;
    } catch ( e ) {
	log( 'get_app_settings()' );
	log( e );
    }
}

function get_store_link( callback ) {
    try {
	var store_data = { };
	fetch_record( db_tables.SETTINGS_TABLE, { }, '', function ( data ) {
        console.log(data);
	    store_data = data.result;
	    callback( store_data );
	} );
    } catch ( e ) {
	log( 'get_store_link()' );
	log( e );
    }
}

function get_user_id() {
    try {
	var id = "";
	if ( isset( get_global_var( global_vars.USER_ID ) ) && get_global_var( global_vars.USER_ID ) && get_global_var( global_vars.USER_ID ) != 'undefined' ) {
	    id = get_global_var( global_vars.USER_ID );
	} else {
	    if ( !in_progress ) {
		in_progress = true;
		var filter = { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'deviceID', value: get_device_id() } } ] } ] };
		fetch_record( db_tables.APP_USER_TABLE, filter, '', function ( data ) {
		    console.log( 'fetch_user_id_callback()' );
		    console.log( data );

		    if ( isset( data.result ) && data.result.length ) {
			set_global_var( global_vars.USER_ID, data.result[0].Id );
			set_global_var( global_vars.USER_DATA, JSON.stringify( data.result[0] ) );
		    } else {
			set_global_var( global_vars.USER_ID, 0 );
		    }
		    in_progress = false;
		} );
	    }
	}
    } catch ( e ) {
	log( 'get_user_id()' );
	show_alert( e );
    }

    return id;
}
function parse_select_options( data, key, value, multiple ) {
    try {
	if ( isset( multiple ) && multiple )
	    var options = [ ];
	else
	    var options = [ { value: '', text: 'Maak uw keuze', html: 'Maak uw keuze', disabled: false } ];

    capitalizeFirstLetter("hello world");
	$.each( data, function ( i, option ) {
	    option = json_to_array( option );
	    if ( $.isArray( key ) ) {
            $.each( key, function ( i, k ) {
                if ( isset( option[key[i]] ) ) {
                options.push( {
                    value: option[key[i]],
                    text: ucwords( option[value[i]] ),
                    html: ucwords( option[value[i]] ),
                } );
                }
            } );
	    } else {
            options.push( {
                value: option[key],
                text: ucwords( option[value] ),
                html: ucwords( option[value] ),
            } );
        }

	} );
    } catch ( e ) {
	console.log( 'prase_select_options()' );
	console.log( e );
    }

    return options;
}
function prase_select_options( data, key, value, multiple ) {
    try {
	if ( isset( multiple ) && multiple )
	    var options = [ ];
	else
	    var options = [ { value: 'leeg', text: 'Maak uw keuze', html: 'Maak uw keuze', disabled: true } ];

    capitalizeFirstLetter("hello world");
	$.each( data, function ( i, option ) {
	    option = json_to_array( option );
	    if ( $.isArray( key ) ) {
            $.each( key, function ( i, k ) {
                if ( isset( option[key[i]] ) ) {
                options.push( {
                    value: option[key[i]],
                    text: ucwords( option[value[i]] ),
                    html: ucwords( option[value[i]] ),
                } );
                }
            } );
	    } else {
            options.push( {
                value: option[key],
                text: ucwords( option[value] ),
                html: ucwords( option[value] ),
            } );
        }

	} );
    } catch ( e ) {
	console.log( 'prase_select_options()' );
	console.log( e );
    }

    return options;
}

function capitalizeFirstLetter(data_string)
{
    return data_string.charAt(0).toUpperCase() + data_string.slice(1);
}

function populate_select_options( select, options, selected, multiple ) {
    try {
    	$.each( options, function ( i, option ) {
          var option_text = option.text;
    	    var option_values = { value: option.value, text: capitalizeFirstLetter(option_text.toLowerCase()), html: capitalizeFirstLetter(option_text.toLowerCase()) };
    	    if ( isset( multiple ) && multiple ) {
            console.log(`multiple: ${selected}`)
        		if ( $.inArray( option.value, selected ) > -1 ) {
        		    option_values.selected = true;
                console.log(option_values)
        		    select.parent().find( '.item-after .badge' ).text( selected.length );
        		    select.parent().find( '.item-after' ).text( selected );
        		}
    	    } else if ( option.value == selected ) {
        		option_values.selected = true;
        		select.parent().find( '.item-after' ).html( option.text );
    	    }
    	    if ( isset( option.disabled ) && option.disabled ) {
        		option_values.selected = true;
        		option_values.disabled = true;
    	    }
    	    $( '<option>', option_values ).appendTo( select );
            //console.log(option_values);
    	} );
    } catch ( e ) {
    	console.log( 'populate_select_options() error' );
    	console.log( e );
    }
}

function app_browser( url, title, is_pdf ) {
    try {

        if (window.navigator.simulator === true) {      // When "true" app is in web-preview
        url = decode_data( url );
        window.open(url,'Demo preview', 'width=360, height=640');      //Just a popup in
         setTimeout(function() {
        $(".preloader-indicator-overlay, .preloader-indicator-modal").hide();
        }, 400);

        } else {

         setTimeout(function() {
        $(".preloader-indicator-overlay, .preloader-indicator-modal").hide();
        }, 400);
	    hide_indicator();
	if ( get_device_platform() == 'ios' && url.indexOf( '//drive' ) > -1 ) {
	    url = url.substring( 45, url.length );
        url = decode_data( url );
    } else if ( get_device_platform() == 'android' && isset( is_pdf ) && is_pdf ) {
        url = "https://drive.google.com/viewerng/viewer?url=" + encode_data(url);
    } else if ( get_device_platform() == 'android' && isset( is_pdf ) && !is_pdf ) {
        url = url;
    } else
        url = decode_data( url );
//    alert(url);
    var parameters = "closebuttoncaption=Sluiten,location=no,EnableViewPortScale=yes,fj_navigationbar=yes,fj_title=" + title + ",fj_titlecolor=" + hexheaderColor + ",fj_barcolor=" + hexheaderBgColor;
	var new_window = cordova.InAppBrowser.open( url, '_blank', parameters );
	new_window.addEventListener( "exit", function () {
	    hide_statusbar();
	}, false );
	new_window.addEventListener( "loadstart", function () {
	    hide_statusbar();
	}, false );
}

    } catch ( e ) {
        log( 'app_browser()' );
        log( JSON.stringify( e ) );
    }
}

function parse_list_options( data, title, url, icon ) {
    try {
	var options = [ ];
	$.each( data, function ( i, option ) {
	    option = json_to_array( option );
	    options.push( {
            title: option['title'] ? option['title'] : option[title],
            url: ucwords( option[url] ),
            icon: icon.length ? icon : option['icon'],
            catagory: isset( option['catagory'] ) ? option['catagory'] : '',
	    } );
	} );
    } catch ( e ) {
	log( 'parse_list_options()' );
	log( e );
    }
    return options;
}

function populate_list_options( list_records, list_type, repeat_element, parent_ref ) {
    try {
	$.each( list_records, function ( i, record ) {
	    var record_section = repeat_element.clone();
        $( '.title', record_section ).html( record.title );
	    $( '.icon', record_section ).addClass( record.icon.toLowerCase() );

	    if ( record.catagory == 'page' ) {
            $( 'a.url', record_section ).addClass( "open-indicator" );
            $( 'a.url', record_section ).attr( 'href', record.url.toLowerCase() );
	    } else if ( record.catagory == 'function' ) {
            $( 'a.url', record_section ).attr( 'href', record.url.toLowerCase() );
	    } else {
		switch ( list_type ) {
		    case 'pdf':
                $( '.item-after i', record_section ).off( 'click' ).on( 'click', function () {
                    social_share( "hierbij het bestand: ", "", "", record.url );
                } );
                $( 'div.title', record_section ).off( 'click' ).on( 'click', function () {
                    app_browser( record.url, record.title , true);
                } );
                break;
		    case 'video':
                $( record_section ).attr( 'data-src', record.url );
                break;
		    default:
                $( 'a.url', record_section ).off( 'click' ).on( 'click', function () {
                    app_browser( record.url, record.title , false);
                } );
                break;
		}
		log( $( '.title' ).val() );
	    }
        console.log( $(record_section).html() );
	    record_section.show().appendTo( parent_ref );
	} );
    } catch ( e ) {
	console.log( 'populate_external_links()' );
	console.log( e );
    }
}

function populate_group_options( list_records, list_type, repeat_element, child_element, parent_ref ) {
    try {
	$.each( list_records, function ( title, data ) {
	    var item = repeat_element.clone();
	    $( '.heading', item ).html( title ).css( 'color', hexheaderBgColor );

	    $.each( data, function ( i, record ) {
		var record_section = $( child_element, item ).clone();
		$( '.item-title', record_section ).html( record.title );
		$( '.icon', record_section ).addClass( record.icon.toLowerCase() );

		if ( record.catagory == 'page' ) {
		    $( 'a.url', record_section ).addClass( "open-indicator" );
		    $( 'a.url', record_section ).attr( 'href', record.url.toLowerCase() );
		} else {
		    switch ( list_type ) {
			case 'pdf':
			    $( '.item-after i', record_section ).off( 'click' ).on( 'click', function () {
				social_share( "hierbij het bestand: ", "", "", record.url );
			    } );
			    $( 'div.title', record_section ).off( 'click' ).on( 'click', function () {
				app_browser( record.url, record.title , true);
			    } );
			    break;
			case 'video':
			    $( record_section ).attr( 'data-src', record.url );
			    break;
			default:
			    $( 'a.url', record_section ).off( 'click' ).on( 'click', function () {
				app_browser( record.url, record.title , false);
			    } );
			    break;
		    }
		    log( $( '.title' ).val() );
		}
		record_section.show().appendTo( $( 'ul', item ) );
	    } );
        $( child_element, item ).remove();
	    item.show().appendTo( parent_ref );
	} );
    } catch ( e ) {
	log( 'populate_external_links()' );
	log( e );
    }
}

function asset_loaded( filename, filetype ) {
    try {
	var already_loaded = false;
	switch ( filetype ) {
	    case 'js':
		var assets = document.getElementsByTagName( "script" );
		break;
	    case 'css':
		var assets = document.getElementsByTagName( "link" );
		break;
	}

	for ( var i = 0; i < assets.length; i++ ) {
	    if ( assets[i].getAttribute( 'src' ) == filename ) {
		already_loaded = true;
		break;
	    } else if ( assets[i].getAttribute( 'href' ) == filename ) {
		already_loaded = true;
		break;
	    }
	}
    } catch ( e ) {
	log( 'asset_loaded()' );
	log( e );
    }

    return already_loaded;
}

function load_js_css_file( filename, filetype ) {
    try {
	if ( !asset_loaded( filename, filetype ) )
	    switch ( filetype ) {
		case 'js':
		    var fileref = document.createElement( 'script' );
		    fileref.setAttribute( "type", "text/javascript" );
		    fileref.setAttribute( "src", filename );
		    break;
		case 'css':
		    var fileref = document.createElement( "link" );
		    fileref.setAttribute( "rel", "stylesheet" );
		    fileref.setAttribute( "type", "text/css" );
		    fileref.setAttribute( "href", filename );
		    break;
	    }

	if ( isset( fileref ) && fileref !== "" && fileref !== null && fileref !== "null" )
	    document.getElementsByTagName( "head" )[0].appendChild( fileref )
    } catch ( e ) {
	log( 'loadjscssfile()' );
	log( e );
    }
}

function load_fragment( page ) {
    try {
	var z, i, elmnt, file, xhttp, type, script;
	z = document.getElementsByTagName( "div" );
	for ( i = 0; i < z.length; i++ ) {
	    elmnt = z[i];
	    // load fragment related scripts
	    type = elmnt.getAttribute( "data-type" );
	    script = elmnt.getAttribute( "data-script" );
	    if ( type === 'fragment' && isset( script ) && script.length ) {
		elmnt.removeAttribute( "data-type" );
		elmnt.removeAttribute( "data-script" );
		load_js_css_file( ( 'assets/js/pages/%script%.js' ).replace( '%script%', script ), 'js' );
	    }

	    // load fragments
	    file = elmnt.getAttribute( "data-load-fragment" );
	    if ( file ) {
		try {
		    xhttp = new XMLHttpRequest();
		    log( file )
		    xhttp.onreadystatechange = function () {
			elmnt.innerHTML = this.responseText;
			elmnt.removeAttribute( "data-load-fragment" );
			var script = $( page.container ).data( 'script' );
			if ( isset( script ) && script.length ) {
			    var script_path = ( 'assets/js/pages/%script%.js' ).replace( '%script%', script );
			    if ( asset_loaded( script_path, 'js' ) && isset( $( page.container ).data( 'runner' ) ) && $( page.container ).data( 'runner' ) ) {
				var run = eval( 'run_' + $( page.container ).data( 'runner' ) );
				run();
			    }
			}
			load_fragment( page );
		    }
		    xhttp.open( "GET", file, true );
		    xhttp.send();
		    return;
		} catch ( e ) {
		    log( e );
		}
	    }
	}
    } catch ( e ) {
	log( 'load_fragment()' );
	log( e );
    }
}

function is_connected() {
    var networkState = navigator.connection.type;
    var states = { };
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';

    if ( states[networkState] == 'No network connection' ) {
	return false;
    } else {
	return true;
    }
}

function $_GET( param ) {
    try {
	var vars = { };
	URL.replace( location.hash, '' ).replace(
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function ( m, key, value ) { // callback
		    vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
	    return vars[param] ? vars[param] : null;
	}
    } catch ( e ) {
	log( "$_GET()" );
	log( e );
    }
    return vars;
}
var PDFJS_DOMAIN = "https://cloudapps.services/pdfjs/web/viewer.html";
var GLOBAL_DOC_PROCESS=0;
function closeMask(){
	$('#pdfviewer-mask').hide();
	$('#pdfviewer-mask-goedkeuren').hide();
	$('#pdfviewer-mask-archief').hide();
    $('div.navbar').show();
}
function checkSigningfirst(){
	console.log('working checkSigningfirst: '+device.platform);
	//localStorage.setItem("actionId","14HssPyxQ92GLLWMiLpvpQ");
    localStorage.setItem("actionId","HDynAPBbSwi7FMoCHwt9pA");
	localStorage.setItem("pageTitle","Goedkeuren");
	//$.mobile.changePage("#dmstatuspage");
    main_view.router.loadPage( 'pages/dm_statuspage.html' );
}
function actionReject(){
	//localStorage.setItem("actionId","ym36vpFJTd6GV3jeWlgtNw");
    localStorage.setItem("actionId","9oNXlGQFS6msW3E-81o_yQ");
	localStorage.setItem("pageTitle","Afkeuren");
	//$.mobile.changePage("#dmstatuspage");
    main_view.router.loadPage( 'pages/dm_statuspage.html' );
}
function updateStatus(){
	var docid, actionId, pageTitle, docname;
			docid = localStorage.getItem("docid");
			actionId = localStorage.getItem("actionId");
			pageTitle = localStorage.getItem("pageTitle");
			docname = localStorage.getItem("docname");
	var comment = $('#tacomment').val();
    forceAppendLoader();
	if(comment!==""){
		fetchSessionId(function(sessionId){
			$.ajax({
				url: "http://cloudapps.services/rest/api/updateRecord",
				type: "POST",
				data: {sessionId:sessionId,objName:"approval_signing",useIds:false,Comments:comment,id:parseInt(docid)},
				error: function(xhr){
                    var loader = setInterval( function ( ) {
                        hide_indicator( );
                        clearInterval( loader );
                    }, 700 );
					alert("Something went wrong with the request \n "+xhr.responseText);
				},
				success: function(xhr){
					console.log('comment updated');
					$.ajax({
						url: "http://cloudapps.services/rest/api/runAction",
						type: "POST",
						data: {sessionId:sessionId,objName:"approval_signing",useIds:false,actionId:actionId,id:parseInt(docid)},
						error: function(xhr){
							alert("Something went wrong with the request \n "+xhr.responseText);
                            var loader = setInterval( function ( ) {
                                hide_indicator( );
                                clearInterval( loader );
                            }, 700 );
						},
						success: function(xhr){
							//console.log(xhr.responseText);
							//Progress.navigateTo("dmreview");
							main_view.router.loadPage( 'pages/dm_review.html' );
						}
					});
				}
			});
		});
	}else{
		if(actionId=="9oNXlGQFS6msW3E-81o_yQ"){
			alert('Geef een comentaar');
            var loader = setInterval( function ( ) {
                hide_indicator( );
                clearInterval( loader );
            }, 700 );
		}else{
			fetchSessionId(function(sessionId){
				$.ajax({
					url: "http://cloudapps.services/rest/api/runAction",
					type: "POST",
					data: {sessionId:sessionId,objName:"approval_signing",useIds:false,actionId:actionId,id:parseInt(docid)},
					error: function(xhr){
						alert("Something went wrong with the request \n "+xhr.responseText);
						var loader = setInterval( function ( ) {
                            hide_indicator( );
                            clearInterval( loader );
                        }, 700 );
					},
					success: function(xhr){
						//console.log(xhr.responseText);
						//Progress.navigateTo("dmreview");
						main_view.router.loadPage( 'pages/dm_review.html' );
					}
				});
			});
		}
	}
}

function fetchSessionId(callback){
    var uname = "";
    var pass = "";
    if (device.platform == "iOS"){
        uname = localStorage.getItem("uname");
        pass = localStorage.getItem("pass");
    }else{
        uname = localStorage.getItem('uname');
        pass = localStorage.getItem('pass');
    }
    $.ajax({
        url: "http://cloudapps.services/rest/api/login?loginName="+encodeURIComponent(uname)+"&password="+pass,
        type: "GET",
        error: function(xhr){
            console.log('error');
            console.log(xhr.responseText);
        },
        success: function(xhr){
            var sid = $(xhr).find("sessionId").text();
            console.log('fetchSessionId: '+sid);
            if(typeof callback == 'function') callback(sid);
        }
    });
}
function forceAppendLoader(){
    var loader = '<div class="preloader-indicator-overlay"></div>'+
        '<div class="preloader-indicator-modal"><span class="preloader preloader-white"></span></div>';
    $('body').append(loader);
}
var objectId;
function onShow(mod,selectedItem) {
	console.log('working onshow');
	objectId = selectedItem.id;
	docRes(mod,selectedItem.url);
}
function docRes(mod,res){
	var imageurl = res;
	console.log(res);
	var startstring = imageurl.search("&sessionId=");
    $('div.navbar').hide();
	if (startstring != -1){
		var stringlength = imageurl.length;
		var result = imageurl.substring(0,startstring);
		//window.open(result,'_blank','EnableViewPortScale=yes,fj_navigationbar=yes');
		//openPdf(result);
		var urlParams = "dir="+getParameterStr(result,"dir")+"&objDefId="+getParameterStr(result,"objDefId")+"&id="+getParameterStr(result,"id")+"&name="+getParameterStr(result,"name")+"&c="+getParameterStr(result,"c");
		console.log(urlParams);
		if(mod==0){
			$('#pdfviewer').attr('src',PDFJS_DOMAIN+"?"+urlParams);
			$('#pdfviewer-mask').show();
		}else{
			$('#pdfviewer_archief').attr('src',PDFJS_DOMAIN+"?"+urlParams);
			$('#pdfviewer-mask-archief').show();
		}
	}else{
		//window.open(imageurl,'_blank','EnableViewPortScale=yes,fj_navigationbar=yes');
		//openPdf(imageurl);
		//$('#pdfviewer').attr('src',mime+theBinary);
		//$('#pdfviewer').attr('src',imageurl);
		var urlParams = "dir="+getParameterStr(imageurl,"dir")+"&objDefId="+getParameterStr(imageurl,"objDefId")+"&id="+getParameterStr(imageurl,"id")+"&name="+getParameterStr(imageurl,"name")+"&c="+getParameterStr(imageurl,"c");
		console.log(urlParams);
		if(mod==0){
			$('#pdfviewer').attr('src',PDFJS_DOMAIN+"?"+urlParams);
			$('#pdfviewer-mask').show();
		}else{
			$('#pdfviewer_archief').attr('src',PDFJS_DOMAIN+"?"+urlParams);
			$('#pdfviewer-mask-archief').show();
		}
	}
}
function fetchDocs(sessionId, callback){
    var query = encodeURI("SELECT id, Date_Format_Text, name, Document_Type_Image, afbeelding_url_txt, Status_Text FROM approval_signing");
    $.ajax({
        url: "http://cloudapps.services/rest/api/selectQuery?sessionId="+sessionId+"&query="+query+"&startRow=0&maxRows=20000",
        type: "GET",
        error: function(xhr){
            console.log('error');
            console.log(xhr.responseText);
        },
        success: function(xhr){
            if(typeof callback == 'function') callback(xhr);
        }
    });
}
function fetchDocsGoedkeuren(sessionId, callback){
    var query = encodeURI("SELECT id, Date_Time_Text, Document_name, signatoryName, Signing_Status_Text, Document_Type_Image, url FROM Signatures_List");
    $.ajax({
        url: "http://cloudapps.services/rest/api/selectQuery?sessionId="+sessionId+"&query="+query+"&startRow=0&maxRows=20000",
        type: "GET",
        error: function(xhr){
            console.log('error');
            console.log(xhr.responseText);
        },
        success: function(xhr){
            if(typeof callback == 'function') callback(xhr);
        }
    });
}
function getParameterStr(url,name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(url);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function onSuccessGetDMuname (msg) {
    localStorage.setItem('uname',msg);
}
function onSuccessGetDMpass (msg) {
    localStorage.setItem('pass',msg);
}
var getGlobalStorageDMuname = function(key){
     if (device.platform == "iOS") {
        try{
         //  alert("key bij get is " + key)
           new Keychain().getForKey(onSuccessGetDMuname, onError, key, servicename);
        }
        catch(ex) {
        	return localStorage.getItem(key, onSuccessGetDMuname);
        }
    }
}
var getGlobalStorageDMpass = function(key){
     if (device.platform == "iOS") {
        try{
           new Keychain().getForKey(onSuccessGetDMpass, onError, key, servicename);
        }
        catch(ex) {
        	return localStorage.getItem(key, onSuccessGetDMpass);
        }
    }
}
var servicename = 'accountant';
function storageSetup(){
    if(!localStorage.getItem('uname')){
        getGlobalStorageDMuname('uname');
    }else{
		if(device.platform == "iOS"){
            new Keychain().setForKey(onSuccessSet, onError, 'uname', servicename, localStorage.getItem('uname'));
        }
    }
    if(!localStorage.getItem('pass')){
        getGlobalStorageDMpass('pass');
    }else{
		if(device.platform == "iOS"){
            new Keychain().setForKey(onSuccessSet, onError, 'pass', servicename, localStorage.getItem('pass'));
        }
    }
}
function onSuccessSet (msg) {
    console.log('onSuccessSet: ' + JSON.stringify(msg));
}
function onError (msg) {
    console.log('onError: ' + JSON.stringify(msg));
}
function openWindow(externalurl,windowTitle){
	function rgb2hex(rgb) {
		rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
		return (rgb && rgb.length === 4) ? "#" + ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
	}
	var headerColor = $('.navbar .navbar-inner').css("color");
	var headerBgColor = $('.navbar').css("background-color");
	var hexheaderColor = rgb2hex(headerColor);
	var hexheaderBgColor = rgb2hex(headerBgColor);
	var parameters = "EnableViewPortScale=yes,fj_navigationbar=yes,fj_title="+windowTitle+",fj_titlecolor=" + hexheaderColor + ",fj_barcolor=" + hexheaderBgColor;
	if (device.platform == 'iOS') { window.open(externalurl, '_blank', parameters);} else {window.open(externalurl, '_blank', parameters); }
}
function scanqr(){
	try{
        cordova.plugins.barcodeScanner.scan(
            function(result) {
                if ( !result.cancelled ) {
                    openWindow(result.text,"QR Scanner");
                }
            }, // success
            function(error) {
                alert( "Unfortunately there was a problem reading the barcode." );
            }  // error
        );
    }catch(e){
        alert(e);
    }
}
function hideLoader(){
    var loader = setInterval( function ( ) {
        hide_indicator( );
        clearInterval( loader );
    }, 700 );
}
$('#pdfviewer-mask').on('click',function(){
	$(this).hide();
});
//override existing database logic
function updateUserData( callback ) {
	fetchUserId(function(userId){
		console.log('fetchUserId');
		console.log(userId);
		var filter = { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'Id', value: userId } }, ] } ] };
		fetch_record( db_tables.APP_USER_TABLE, filter, '', function ( data ) {
			log( 'update_user_data()' );
			log( data );
			set_global_var( global_vars.USER_DATA, JSON.stringify( data.result[0] ) );
			if ( isset( callback ) )
			callback();
		} );
	});
}

function update_global_user_data( new_data ) {
    console.log('update_global_user_data');
    console.log( JSON.stringify( new_data ) );
    try {
	if ( isset( get_global_var( global_vars.USER_DATA ) ) ) {
	    var current_user_data = JSON.parse( get_global_var( global_vars.USER_DATA ) );
	    $.each( new_data, function ( i, val ) {
		if ( isset( new_data[i] ) ) {
		    current_user_data[i] = val;
		}
	    } );
	    set_global_var( global_vars.USER_DATA, JSON.stringify( current_user_data ) );
	    localstorage_to_db();
	}
    } catch ( e ) {
	log( e );
    }
}
function fetchUserId(callback) {
    try {
		var id = "";
		if ( issetGlobalVarId() ) {
			id = get_global_var( global_vars.USER_ID );
			console.log('id already set: '+id);
			if(typeof callback == 'function') callback(id);
		} else {
			console.log('id not set');
			if ( !in_progress ) {
				in_progress = true;
				var filter = { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'deviceID', value: get_device_id() } } ] } ] };
				fetch_record( db_tables.APP_USER_TABLE, filter, '', function ( data ) {
					console.log( 'fetchUserId()' );
					console.log( data );
					id=data.result[0].Id;
					if ( isset( data.result ) && data.result.length ) {
						set_global_var( global_vars.USER_ID, data.result[0].Id );
						set_global_var( global_vars.USER_DATA, JSON.stringify( data.result[0] ) );
					} else {
						set_global_var( global_vars.USER_ID, 0 );
					}
					in_progress = false;
					if(typeof callback == 'function') callback(id);
				} );
			}
		}
    } catch ( e ) {
		console.log( 'fetchUserId error' );
		console.log(e);
		show_alert( e );
    }

    return id;
}
function issetGlobalVarId(){
	return ( get_global_var( global_vars.USER_ID )!=""&&get_global_var( global_vars.USER_ID )!='undefined' );
}

function mpopulate_select_options( select, options, selected, multiple, badgeClass ) {
    try {
        console.log( 'populate_select_options()' );
        console.log(options);
	$.each( options, function ( i, option ) {
        var option_text = option.text;
	    var option_values = { value: option.value, text: capitalizeFirstLetter(option_text.toLowerCase()), html: capitalizeFirstLetter(option_text.toLowerCase()) };
	    if ( isset( multiple ) && multiple ) {
		if ( $.inArray( option.value, selected ) > -1 ) {
		    option_values.selected = true;
		    //select.parent().find( '.item-after .badge' ).text( selected.length );
            //$(badgeClass).text( selected.length );
		}
	    } else if ( option.value == selected ) {
		option_values.selected = true;
		//select.parent().find( '.item-after' ).html( option.text );
	    }
	    if ( isset( option.disabled ) && option.disabled ) {
		option_values.selected = true;
		option_values.disabled = true;
	    }
	    $( '<option>', option_values ).appendTo( select );
        //console.log(option_values);
	} );
    } catch ( e ) {
	console.log( 'populate_select_options() error' );
	console.log( e );
    }
}
function getWoning(){
    console.log(`getWoning`)
    var woningRecords = JSON.parse( get_global_var("WONING_RECORDS") ),
        woningId = get_global_var("CURRENT_WONING_ID"),
        crec=[];
    console.log(woningRecords)
    Object.keys(woningRecords).forEach(function(key,index){
        if(woningRecords[index].identificatie==woningId) crec = woningRecords[index];
    });
    return crec;
}
