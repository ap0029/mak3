function steleenvraag() {
    try {
        var ready = 0;
        fetch_record( db_tables.SELECT_OPTIONS, { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'meta_key', value: 'appointment' } }, ] } ] }, 'meta_value', function ( data ) {
            $( 'select[name="quotation_topic"]' ).empty();
            var question_topic = prase_select_options( JSON.parse( data.result[0].meta_value ), 'database_name', 'name', true );
            populate_select_options( $( 'select[name="question_topic"]' ), question_topic, '' );
            ready++;
        } );
        updateUserData( function() {
				console.log('updateUserData');
				console.log( (String( get_global_var( global_vars.USER_DATA ) )!=="") );
				console.log( (String( get_global_var( global_vars.USER_DATA ) )!=="") );
				if( String( get_global_var( global_vars.USER_DATA ) )!=="" && String( get_global_var( global_vars.USER_DATA ) )!=="" ) {
					var current_user_data = JSON.parse( get_global_var( global_vars.USER_DATA ) );
					console.log("current_user_data: " + current_user_data);
					$( "#name" ).val( decode_data( current_user_data.contact ) );
					$( "#email" ).val( decode_data( current_user_data.email ) );
					$( "#house_number" ).val( decode_data( current_user_data.huisnummer ) );
					$( "#postcode" ).val( decode_data( current_user_data.postcode ) );
					$( "#phone" ).val( decode_data( current_user_data.phone ) );
					$( "#company" ).val( decode_data( current_user_data.company ) );
					$( "#place" ).val( decode_data( current_user_data.place ) );
				}
				ready++;
			} );
    }
    catch ( e ) {
	log( e );
    }

    $( 'button#question_submit').off('click').on('click', function () {
        var form_data = $( 'form#question_form' ).serializeObject();
        if( $( "#name" ).val() == "" ||
                    $( "#email" ).val() == "" ||
                    $( "#house_number" ).val() == "" ||
                    $( "#postcode" ).val() == "" ||
                    $( "#phone" ).val() == "" ){
                    show_alert( messages.REQUIRED_FIELDS );
        }else{
            if ( validate( $$( "#name" ).val() ) && validate_email( $$( "#email" ).val() ) ) {
                var data = {
                emailNotification: get_app_settings()['emailnotification'],
                name: sanitize_value( form_data.name, "" ),
                email: sanitize_value( form_data.email, "" ),
                huisnummer: sanitize_value( form_data.house_number, "" ),
                postcode: sanitize_value( form_data.postcode, "" ),
                phone: sanitize_value( form_data.phone, "" ),
                deviceid: sanitize_value( get_device_id(), "" ),
                company: sanitize_value( form_data.company, "" ),
                question: sanitize_value( form_data.question, "" ),
                topic: sanitize_value( form_data.question_topic, "" ),
                };
                var user_data = {
                    deviceID: get_device_id(),
                    company: sanitize_value( form_data.company, "" ),
                    contact: sanitize_value( form_data.name, "" ),
                    email: sanitize_value( form_data.email, "" ),
                    huisnummer: sanitize_value( form_data.house_number, "" ),
                    postcode: sanitize_value( form_data.postcode, "" ),
                    phone: sanitize_value( form_data.phone, "" ),
                };
                log( JSON.stringify( data ) );
                //------------------------------------------------
                var table = db_tables.QUESTIONS_TABLE;
                insert_record( table, data, function ( data ) {
                if ( isset( data.result ) ) {
                    if ( isset( get_global_var( global_vars.USER_ID ) ) && get_global_var( global_vars.USER_ID ) != 0 ) {
                    update_global_user_data( user_data );
                    }
                    show_toast( 'success', messages.QUESTION_SUCCESS, function ( ) {
                    main_view.router.loadPage( 'pages/meer.html' );
                    } );
                } else {
                    show_toast( 'error', messages.GENERAL_ERROR );
                }
                } );
                //---------------------------------------------------
                update_global_user_data( user_data );
            }
            else {
                show_alert( "Gelieve op dit gebied te vullen voordat u het formulier" );
            }
        }
    } );
    var loader = setInterval( function ( ) {
	    if ( ready > 1 ) {
            hide_indicator( );
            clearInterval( loader );
	    }
	}, 700 );
}


// for initial load
steleenvraag();