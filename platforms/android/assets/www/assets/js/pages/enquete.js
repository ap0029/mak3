
function enquete() {
    var ready = 0;
    try {
	fetch_record( db_tables.SELECT_OPTIONS, { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'meta_key', value: 'survey_select_1' } }, ] } ] }, 'meta_value', function ( data ) {
	    $( 'select[name="survey_select_1"]' ).empty();
	    var survey1 = prase_select_options( JSON.parse( data.result[0].meta_value ), 'database_name', 'name' );
	    populate_select_options( $( 'select[name="survey_select_1"]' ), survey1, 'leeg' );
	    ready++;
	} );
	fetch_record( db_tables.SELECT_OPTIONS, { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'meta_key', value: 'survey_select_2_3' } }, ] } ] }, 'meta_value', function ( data ) {
	    $( 'select[name="survey_select_2"]' ).empty();
	    $( 'select[name="survey_select_3"]' ).empty();
	    var survey2 = prase_select_options( JSON.parse( data.result[0].meta_value ), 'database_name', 'name' );
	    populate_select_options( $( 'select[name="survey_select_2"]' ), survey2, 'leeg' );
	    populate_select_options( $( 'select[name="survey_select_3"]' ), survey2, 'leeg' );
	    ready++;
	} );
	fetch_record( db_tables.SELECT_OPTIONS, { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'meta_key', value: 'client' } }, ] } ] }, 'meta_value', function ( data ) {
	    $( 'select[name="survey_select_4"]' ).empty();
	    $( 'select[name="survey_select_7"]' ).empty();
	    var survey4 = prase_select_options( JSON.parse( data.result[0].meta_value ), 'database_name', 'name' );
	    populate_select_options( $( 'select[name="survey_select_4"]' ), survey4, 'leeg' );
	    populate_select_options( $( 'select[name="survey_select_7"]' ), survey4, 'leeg' );
	    ready++;
	} );
	fetch_record( db_tables.SELECT_OPTIONS, { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'meta_key', value: 'appointment' } }, ] } ] }, 'meta_value', function ( data ) {
	    $( 'select[name="survey_select_5"]' ).empty();
	    var survey5 = prase_select_options( JSON.parse( data.result[0].meta_value ), 'database_name', 'name' );
	    populate_select_options( $( 'select[name="survey_select_5"]' ), survey5, 'leeg' );
	    ready++;
	} );
	fetch_record( db_tables.SELECT_OPTIONS, { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'meta_key', value: 'survey_select_6' } }, ] } ] }, 'meta_value', function ( data ) {
	    $( 'select[name="survey_select_6"]' ).empty();
        console.log('data.result[0]');
        console.log(data.result[0]);
	    var survey6 = prase_select_options( JSON.parse( data.result[0].meta_value ), 'database_name', 'name' );
	    populate_select_options( $( 'select[name="survey_select_6"]' ), survey6, 'leeg' );
	    ready++;
	} );

    update_user_data(function () {
        if ( get_global_var( global_vars.USER_DATA ) != '0' && get_global_var( global_vars.USER_DATA ) != 0 ) {
            var current_user_data = JSON.parse( get_global_var( global_vars.USER_DATA ) );
            $( "#name" ).val( decode_data( current_user_data.contact ) );
            $( "#email" ).val( decode_data( current_user_data.email ) );
            $( "#phone" ).val( decode_data( current_user_data.phone ) );
            $( "#company" ).val( decode_data( current_user_data.company ) );
        }
        ready++;
    });
    }
    catch ( e ) {

    }

    $( 'button#survey_submit' ).off( 'click' ).on( 'click', function () {
	var form_data = $( 'form#survey_form' ).serializeObject();

	if ( validate( $$( "#name" ).val() ) && validate_email( $$( "#email" ).val() ) ) {
	    var data = {
		emailNotification: get_app_settings()['emailnotification'],
		isNew: '1',
		name: sanitize_value( form_data.name, "" ),
		email: sanitize_value( form_data.email, "" ),
		phone: sanitize_value( form_data.phone, "" ),
		deviceid: sanitize_value( get_device_id(), "" ),
		company: sanitize_value( form_data.company, "" ),
		comment: sanitize_value( form_data.comment, "" ),
		q1: sanitize_value( form_data.survey_select_1, "" ),
		q2: sanitize_value( form_data.survey_select_2, "" ),
		q3: sanitize_value( form_data.survey_select_3, "" ),
		q4: sanitize_value( form_data.survey_select_4, "" ),
		q5: sanitize_value( form_data.survey_select_5, "" ),
		q6: sanitize_value( form_data.survey_select_6, "" ),
		q7: sanitize_value( form_data.survey_select_7, "" ),
	    };
	    var user_data = {
		deviceID: get_device_id(),
		company: sanitize_value( form_data.company, "" ),
		contact: sanitize_value( form_data.name, "" ),
		email: sanitize_value( form_data.email, "" ),
		phone: sanitize_value( form_data.phone, "" ),
	    };
	    log( JSON.stringify( data ) );
	    //------------------------------------------------
	    var table = db_tables.SURVEY_TABLE;
	    insert_record( table, data, function ( data ) {
		if ( isset( data.result ) ) {
		    if ( isset( get_global_var( global_vars.USER_ID ) ) && get_global_var( global_vars.USER_ID ) != 0 ) {
			update_global_user_data( user_data );
		    }
		    show_toast( 'success', messages.SURVEY_SUCCESS, function ( ) {
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

    var loader = setInterval( function () {
	if ( ready > 5 )
	{
	    hide_indicator();
	    clearInterval( loader );
	}
    }, 700 );
}

// for initial load
enquete();