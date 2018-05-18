function afspraak() {
    var ready = 0;
    try {
		fetch_record( db_tables.SELECT_OPTIONS, { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'meta_key', value: 'client' } }, ] } ] }, 'meta_value', function ( data ) {
			$( 'select[name="is_client"]' ).empty( );
			console.log('fetch_record');
			console.log(data);
			var client_options = prase_select_options( JSON.parse( data.result[0].meta_value ), 'database_name', 'name' );
			populate_select_options( $( 'select[name="is_client"]' ), client_options, 'leeg' );
			ready++;
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
			
			var calendarDefault = main_app.calendar( {
				input: '#calendar-default',
				dateFormat: 'dd-mm-yyyy',
				closeOnSelect: true,
				monthNames: [ 
					'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli',
					'Augustus', 'September', 'Oktober', 'November', 'December',
				 ],
				dayNamesShort: [ 'Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Zat' ],
			} );
			var today = new Date( ),
				dd = ( today.getDate( ) ),
				mm = ( today.getMonth( ) + 1 ),
				yyyy = ( today.getFullYear( ) );
			if ( dd < 10 )
				dd = '0' + dd;
			if ( mm < 10 )
				mm = '0' + mm;
			today = dd + '-' + mm + '-' + yyyy;
			$( "#calendar-default" ).val( today );
			ready++;
		} );

		$( 'button#versturen' ).off('click').on( 'click', function ( ) {
			var form_data = $( 'form#appointment_form' ).serializeObject( );
			if( $( "#name" ).val() == "" ||
				$( "#email" ).val() == "" ||
				$( "#house_number" ).val() == "" ||
				$( "#postcode" ).val() == "" ||
				$( "#phone" ).val() == "" ){
				show_alert( messages.REQUIRED_FIELDS );
			}else{
				if( !validate( $( "#name" ).val() ) && ($( "#name" ).val() == "") ){
					show_alert( messages.NAME_REQUIRED );
				} else if (( validate( $$( "#name" ).val() ) && validate_email( $$( "#email" ).val()) ) ||  ( validate( $$( "#name" ).val() ) && validate( $$( "#phone" ).val() ) ) ) {
					var temp = form_data.calendar_default.split( '-' );
					form_data.calendar_default = temp[2] + "-" + temp[1] + "-" + temp[0];
					var data = {
						emailNotification: get_app_settings( )['emailnotification'],
						isNew: '1',
						name: sanitize_value( form_data.name, "" ),
						email: sanitize_value( form_data.email, "" ),
						huisnummer: sanitize_value( form_data.house_number, "" ),
						postcode: sanitize_value( form_data.postcode, "" ),
						phone: sanitize_value( form_data.phone, "" ),
						company: sanitize_value( form_data.company, "" ),
						comment: sanitize_value( form_data.comment, "" ),
						topic: sanitize_value( form_data.appointment, "" ),
						alreadyCustomer: sanitize_value( form_data.is_client, "leeg" ),
						deviceid: sanitize_value( get_device_id( ), "" ),
						date: sanitize_value( form_data.calendar_default, "" ),
						time: sanitize_value( form_data.time, "" ),
						place: sanitize_value( form_data.place, "" ),
					};
					//alert(JSON.stringify(data));
					var user_data = {
						deviceID: get_device_id( ),
						contact: sanitize_value( form_data.name, "" ),
						email: sanitize_value( form_data.email, "" ),
						huisnummer: sanitize_value( form_data.house_number, "" ),
						postcode: sanitize_value( form_data.postcode, "" ),
						phone: sanitize_value( form_data.phone, "" ),
						company: sanitize_value( form_data.company, "" ),
						place: sanitize_value( form_data.place, "" ),
					};
					// appointment data inserted
					insert_record( db_tables.APPOINTMENTS_TABLE, data, function ( data ) {
						console.log('insert_record');
						console.log(data);
						console.log( String( data.result ));
						console.log(( String( data.result )!=="" ));
						if ( String( data.result )!=="" ) {
							console.log('pasok');
							console.log(get_global_var( global_vars.USER_ID ));
							console.log((String( get_global_var( global_vars.USER_ID ) )!==""));
							console.log((get_global_var( global_vars.USER_ID ) != 0));
							if ( String( get_global_var( global_vars.USER_ID ) )!=="" && get_global_var( global_vars.USER_ID ) != 0 ) {
								update_global_user_data( user_data );
							}
							show_toast( 'success', messages.APPOINTMENT_SUCCESS, function ( ) {
								main_view.router.loadPage( 'pages/meer.html' );
							} );
						} else {
							show_toast( 'error', messages.GENERAL_ERROR );
						}
					} );
					update_global_user_data( user_data );
				}else{
					show_alert( messages.EMAIL_OR_PHONE );
				}
			}
		} );
		var loader = setInterval( function ( ) {
			if ( ready > 2 ) {
			hide_indicator( );
			clearInterval( loader );
			}
		}, 700 );
    } catch ( e ) {
    	alert( 'error: '+JSON.stringify( e ) );
    }
}
// for inital load
afspraak();