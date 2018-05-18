function hide_show_details() {
    /*
    if ( $( "#i_am" ).is( ':checked' ) ) {
	$( 'div.customer-info-block' ).show( 200 );
	$( 'div.customer-info-block input' ).removeAttr( 'disabled' );
    } else {
	$( 'div.customer-info-block' ).hide( 200 );
	$( 'div.customer-info-block input' ).attr( 'disabled', true );
    }*/
    $( 'div.customer-info-block' ).show( 200 );
	$( 'div.customer-info-block input' ).removeAttr( 'disabled' );
}

function check_newsletter( enabled ) {
    var all_ok = true;
    if ( enabled ) {
	var par = $( 'form#post-profile-form' );
	$( 'div.customer-info-block' ).show( 200 );
	$( 'div.customer-info-block input' ).removeAttr( 'disabled' );
	if ( !validate_email( $( "#email", par ).val() ) ) {
	    show_alert( messages.NEWSLETTER, function(){
	        $( "#email", par ).focus();
        } );
	    all_ok = false
	}
    } else {
	//$( 'div.customer-info-block' ).hide( 200 );
	//$( 'div.customer-info-block input' ).attr( 'disabled', true );
    }

    return all_ok;
}

function create_or_update() {
    var form_data = $( 'form#post-profile-form' ).serializeObject();
    var user_data = {
	deviceID: get_device_id(),
	company: sanitize_value( form_data.company, "" ),
	contact: sanitize_value( form_data.name, "" ),
    postcode: sanitize_value( form_data.postcode, "" ),
    huisnummer: sanitize_value( form_data.house_number, "" ),
	customer: eval( sanitize_value( form_data.client, false ) ),
	email: sanitize_value( form_data.email, "" ),
	newsletter: eval( sanitize_value( form_data.newsletter, false ) ),
	place: sanitize_value( form_data.place, "" ),
	phone: sanitize_value( form_data.phone, "" ),
	rechtsvorm: sanitize_value( form_data.sector, "Leeg" ),
	totalEmployees: sanitize_value( form_data.company_size, "Leeg" ),
	targetGroup: sanitize_value( form_data.target_audience, "Leeg" ),
	isNew: isset( get_user_id() ) && get_user_id() > 0 ? '0' : '1',
	push: true,
    };
    if ( check_newsletter( user_data.newsletter ) ) {
	if ( isset( get_global_var( global_vars.USER_ID ) ) && get_global_var( global_vars.USER_ID ) != 0 ) {
	    update_global_user_data( user_data );

	    show_toast( 'success', messages.GENERAL_SUCCESS, function ( ) {
		    main_view.router.loadPage( 'pages/'+app_name.toLowerCase()+'/'+landingPage+'.html' );
            console.log('saved successfully');
	    } );
	} else {
	    insert_record( db_tables.APP_USER_TABLE, user_data, function ( data ) {
		if ( isset( data.result ) ) {
		    set_global_var( global_vars.USER_ID, data.result.Id );
		    update_user_data();
		    $( 'div.berichten-profiel-fragment' ).fadeOut( 200, function () {
			$( 'div.alerts-fragment' ).fadeIn( 200 );
		    } );
		} else
		    show_alert( messages.FORMALERT_TEXT );

		hide_indicator();
	    } );
	}
    }
}

function berichten_profiel_fragment() {
    var ready = 0;
    show_indicator();
    if ( $( "#i_am" ).is( ':checked' ) || $( "#i_am_not" ).is( ':checked' ) ) {
        $( 'div.customer-info-block' ).show( 200 );
        $( 'div.customer-info-block input' ).removeAttr( 'disabled' );
    }
    if ( !isset( get_user_id() ) || get_user_id() == 0 || get_user_id() == '0' ) {
	    var welkom_text = get_device_platform() == "android" ? messages.ANDROID_TEXT : messages.IOS_TEXT;
	    $( 'p#text' ).html( welkom_text ).text( welkom_text );
        fetch_record( db_tables.APP_SETTINGS_TABLE, { }, '', function ( data ) {
            log( 'fetch_app_settings()' );

            set_global_var( global_vars.APP_SETTINGS_DATA, JSON.stringify( data.result[0] ) );
            app_settings_data = data.result[0];
            console.log('userData');
            console.log(app_settings_data.welkomtekst);
            $('div#customWelcome').html(decodeURIComponent(app_settings_data.welkomtekst));
	    } );
	if ( get_device_platform() == "android" ) {
	    launch_push_notification();
	    $( '.bottom-fixed.next.hide' ).removeClass( 'hide' );
	} else {
	    $( '#toestaan' ).removeClass( 'hide' );
	    $( document )
		    .off( 'click', '#toestaan' )
		    .on( 'click', '#toestaan', function () {
                show_indicator();
                launch_push_notification( function ( all_ok ) {
                    console.log('launch_push_notification callback');
                    console.log('all_ok: '+all_ok);
                    if ( all_ok ) {
                        $( 'p#message' ).css( 'color', 'green' ).html( messages.PUSH_SUCCESS ).removeClass( 'hide' );
                        $( '#toestaan' ).addClass( 'hide' );
                        $( '.bottom-fixed.next.hide' ).removeClass( 'hide' );
                    } else {
                        $( 'p#message' ).html( messages.PUSH_ERROR ).removeClass( 'hide' );
                        $( '#toestaan' ).addClass( 'hide' );
                        $( '.bottom-fixed.next.hide' ).removeClass( 'hide' );
                    }
                } );
		    } );
	    }
    }

    fetch_record( db_tables.TARGETGROUP_TABLE, { }, 'ModifiedAt', function ( data ) {
	    $( 'select[name="target_audience"]' ).empty();
        console.log('target_audience');
        console.log(get_pre_selected_options( get_global_var( global_vars.USER_DATA ), 'targetGroup', 'leeg' ));
        var target_audience_options = prase_select_options( data.result, 'database_name', 'name', false );
        populate_select_options( $( 'select[name="target_audience"]' ), target_audience_options, get_pre_selected_options( get_global_var( global_vars.USER_DATA ), 'targetGroup', 'leeg' ), false );
        ready++;
    } );

    fetch_record( db_tables.SECTOR_TABLE, { }, 'ModifiedAt', function ( data ) {
	$( 'select[name="sector"]' ).empty();
	var sector_options = prase_select_options( data.result, 'database_name', 'name', false );
	populate_select_options( $( 'select[name="sector"]' ), sector_options, get_pre_selected_options( get_global_var( global_vars.USER_DATA ), 'rechtsvorm', 'leeg' ), false );
	ready++;
    } );

    fetch_record( db_tables.TOTAL_EMPLOYEES_TABLE, { }, 'ModifiedAt', function ( data ) {
	$( 'select[name="company_size"]' ).empty();
	var total_employees_options = prase_select_options( data.result, 'database_name', 'name', false );
	populate_select_options( $( 'select[name="company_size"]' ), total_employees_options, get_pre_selected_options( get_global_var( global_vars.USER_DATA ), 'totalEmployees', 'leeg' ), false );
	ready++;
    } );

    update_user_data( function () {
	if ( isset( get_global_var( global_vars.USER_DATA ) ) && get_global_var( global_vars.USER_DATA ).length ) {
	    var current_user_data = JSON.parse( get_global_var( global_vars.USER_DATA ) );
	    $( "#name" ).val( decode_data( current_user_data.contact ) );
	    $( "#email" ).val( decode_data( current_user_data.email ) );
	    $( "#place" ).val( decode_data( current_user_data.place ) );
	    $( "#phone" ).val( decode_data( current_user_data.phone ) );
	    $( "#company" ).val( decode_data( current_user_data.company ) );
        $( "#postcode" ).val( decode_data( current_user_data.postcode ) );
        $( "#house_number" ).val( decode_data( current_user_data.huisnummer ) );
        console.log('current_user_data');
        console.log(current_user_data);
        if(get_global_var('yes-no-updated')=='true'){
            if ( current_user_data.customer == true ) {
                $( "#i_am" ).prop( 'checked', true );
                $( "#i_am_not" ).prop( 'checked', false );
                hide_show_details();
            } else {
                $( "#i_am" ).prop( 'checked', false );
                $( "#i_am_not" ).prop( 'checked', true );
                hide_show_details();
            }
        }
	    current_user_data.newsletter == true ? $( "input[name='newsletter']" ).prop( 'checked', true ) : $( "input[name='newsletter']" ).prop( 'checked', false );
	}
	ready++;
    } );

    $( 'input[name="client"]' ).on( 'change', function () {
	    hide_show_details();
    } );

    $( 'input[name="newsletter"]' ).on( 'change', function () {
	check_newsletter( $( this ).is( ':checked' ) );
    } );

    $( 'button#berichten-profiel' ).off( 'click' ).on( 'click', function () {
        if ( !$( "#i_am" ).is( ':checked' )&&!$( "#i_am_not" ).is( ':checked' ) ){
            console.log('not checked');
            create_or_update();
        }else{
            console.log('checked');
            if( $( "#name" ).val() !="" && $( "#email" ).val() !="" && 
                $( "#phone" ).val() !="" && $( "#postcode" ).val() !="" && $( "#house_number" ).val()!="" ){
                create_or_update();
            }else{
                var loader = setInterval( function () {
                    $(".preloader-indicator-overlay, .preloader-indicator-modal").hide();
                    show_alert( messages.REQUIRED_FIELDS );
                    clearInterval( loader );
                }, 700 );
                
            }
        }
    } );

    var loader = setInterval( function () {
	    hide_indicator();
	    clearInterval( loader );
    }, 700 );
    
        $('body').on('click', '.client-yes-no', function(event) {
            set_global_var('yes-no-updated',true);
            console.log(get_global_var('yes-no-updated'));
            $( 'div.customer-info-block' ).show( 200 );
	        $( 'div.customer-info-block input' ).removeAttr( 'disabled' );
        });
}

// for initail load
berichten_profiel_fragment();