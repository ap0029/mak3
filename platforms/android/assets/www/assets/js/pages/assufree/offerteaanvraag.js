function offerteaanvraag() {
    var ready = 0;
        fetch_record( db_tables.SELECT_OPTIONS, { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'meta_key', value: 'client' } }, ] } ] }, 'meta_value', function ( data ) {
            $( 'select[name="klant"]' ).empty();
            var klant = prase_select_options( JSON.parse( data.result[0].meta_value ), 'database_name', 'name' );
            populate_select_options( $( 'select[name="klant"]' ), klant, '' );
            ready++;
        } );
        fetch_record( db_tables.SELECT_OPTIONS, { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'meta_key', value: 'quotation_zakelijk' } }, ] } ] }, 'meta_value', function ( data ) {
            $( 'select[name="zakelijke"]' ).empty();
            var zakelijke = prase_select_options( JSON.parse( data.result[0].meta_value ), 'database_name', 'name' );
            populate_select_options( $( 'select[name="zakelijke"]' ), zakelijke, '' );
            ready++;
        } );
        fetch_record( db_tables.SELECT_OPTIONS, { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'meta_key', value: 'quotation_particulier' } }, ] } ] }, 'meta_value', function ( data ) {
            $( 'select[name="particuliere"]' ).empty();
            var particuliere = prase_select_options( JSON.parse( data.result[0].meta_value ), 'database_name', 'name' );
            populate_select_options( $( 'select[name="particuliere"]' ), particuliere, '' );
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
                    //$( "#kenteken" ).val( ( decode_data( current_user_data.kenteken )=='undefined'?'':decode_data( current_user_data.kenteken ) ) );
				}
				ready++;
			} );

        $( 'button#quotation_submit').off('click').on('click', function () {
            var form_data = $( 'form#quotation_form' ).serializeObject();
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
                        kenteken: sanitize_value( form_data.kenteken, "" ),
                        deviceid: sanitize_value( get_device_id(), "" ),
                        company: sanitize_value( form_data.company, "" ),
                        comment: sanitize_value( form_data.comment, "" ),
                        topic: sanitize_value( form_data.zakelijke, "" ),
                        topic2: sanitize_value( form_data.particuliere, "" ),
                        isNew: sanitize_value( form_data.klant, "" ),
                    };
                    var user_data = {
                        deviceID: get_device_id(),
                        contact: sanitize_value( form_data.name, "" ),
                        email: sanitize_value( form_data.email, "" ),
                        huisnummer: sanitize_value( form_data.house_number, "" ),
                        postcode: sanitize_value( form_data.postcode, "" ),
                        phone: sanitize_value( form_data.phone, "" ),
                        kenteken: sanitize_value( form_data.kenteken, "" ),
                        company: sanitize_value( form_data.company, "" ),
                    };
                    console.log( JSON.stringify( data ) );
                    //------------------------------------------------
                    var table = db_tables.QUOTATIONS_TABLE;
                    insert_record( table, data, function ( data ) {
                        console.log('insert!');
                        console.log(data);
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
                } else {
                    show_alert( messages.FORMALERT_TEXT );
                }
            }
        } );
        var loader = setInterval( function ( ) {
            if ( ready > 2 ) {
            hide_indicator( );
            clearInterval( loader );
            }
        }, 700 );
}

// for initial load
offerteaanvraag();