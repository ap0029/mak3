function offerteaanvraag() {
    try {
	fetch_record( db_tables.SELECT_OPTIONS, { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'meta_key', value: 'quotation_1' } }, ] } ] }, 'meta_value', function ( data ) {
	    $( 'select[name="zakelijke"]' ).empty();
	    var zakelijke = prase_select_options( JSON.parse( data.result[0].meta_value ), 'database_name', 'name' );
	    populate_select_options( $( 'select[name="zakelijke"]' ), zakelijke, '' );
	} );
    fetch_record( db_tables.SELECT_OPTIONS, { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'meta_key', value: 'quotation_2' } }, ] } ] }, 'meta_value', function ( data ) {
	    $( 'select[name="particuliere"]' ).empty();
	    var particuliere = prase_select_options( JSON.parse( data.result[0].meta_value ), 'database_name', 'name' );
	    populate_select_options( $( 'select[name="particuliere"]' ), particuliere, '' );
	} );
	update_user_data( function () {
	    if ( get_global_var( global_vars.USER_DATA ) != '0' && get_global_var( global_vars.USER_DATA ) != 0 ) {
		var current_user_data = JSON.parse( get_global_var( global_vars.USER_DATA ) );
		$( "#name" ).val( decode_data( current_user_data.contact ) );
		$( "#email" ).val( decode_data( current_user_data.email ) );
		$( "#phone" ).val( decode_data( current_user_data.phone ) );
		$( "#company" ).val( decode_data( current_user_data.company ) );
	    }
	    hide_indicator();
	} );
    }
    catch ( e ) {
	log( e );
    }

    $( 'button#quotation_submit').off('click').on( 'click', function () {
	var form_data = $( 'form#quotation_form' ).serializeObject();

	if ( validate( $$( "#name" ).val() ) && validate_email( $$( "#email" ).val() ) ) {
	    var data = {
		emailNotification: get_app_settings()['emailnotification'],
		name: sanitize_value( form_data.name, "" ),
		email: sanitize_value( form_data.email, "" ),
		phone: sanitize_value( form_data.phone, "" ),
		deviceid: sanitize_value( get_device_id(), "" ),
		company: sanitize_value( form_data.company, "" ),
		comment: sanitize_value( form_data.comment, "" ),
		topic: sanitize_value( form_data.zakelijke, "" ),
        topic2: sanitize_value( form_data.particuliere, "" ),
	    };
	    var user_data = {
		deviceID: get_device_id(),
		contact: sanitize_value( form_data.name, "" ),
		email: sanitize_value( form_data.email, "" ),
		phone: sanitize_value( form_data.phone, "" ),
		company: sanitize_value( form_data.company, "" ),
	    };
	    log( JSON.stringify( data ) );
	    //------------------------------------------------
	    var table = db_tables.QUOTATIONS_TABLE;
	    insert_record( table, data, function ( data ) {
		if ( isset( data.result ) ) {
		    if ( isset( get_global_var( global_vars.USER_ID ) ) && get_global_var( global_vars.USER_ID ) != 0 ) {
			update_global_user_data( user_data );
		    }
		    show_toast( 'success', messages.OFFER_SUCCESS, function ( ) {
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
	    show_alert( messages.FORMALERT_TEXT );
	}
    } );
}

// for initial load
offerteaanvraag();