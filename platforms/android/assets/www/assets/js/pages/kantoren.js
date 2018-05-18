function kantoren() {
    try {
	function populate_offices( pages ) {
	    var node = $( 'ul.offices-list li:first' ).clone();
	    $.each( pages, function ( i, page ) {
		var office = node.clone();
		$( 'a', office ).attr( 'href', 'pages/kantoren_detail.html?office=' + encode_data( ( page.Plaats ).toLowerCase() ) );
		$( 'div.item-title', office ).html( page.Kantoornaam );
		office.show().appendTo( $( 'ul.offices-list' ) );
	    } );
	}

	function populate_page_data( pages ) {
	    $.each( pages, function ( i, page ) {
		if ( ( page.Plaats ).toLowerCase() == decode_data( $_GET( 'office' ) ) ) {
		    $( '#address' ).html( page.Adres );
		    $( '#postcode' ).html( page.Postcode );
		    $( '#place' ).html( page.Plaats );
		    $( '.timing.mon' ).html( page.Maandag );
		    $( '.timing.tue' ).html( page.Dinsdag );
		    $( '.timing.wed' ).html( page.Woensdag );
		    $( '.timing.thu' ).html( page.Donderdag );
		    $( '.timing.fri' ).html( page.Vrijdag );
		    $( '.holiday.sat' ).html( page.Zaterdag );
		    $( '.holiday.sun' ).html( page.Zondag );
		    $( '.toolbar .call' ).attr( 'href', 'tel:' + page.Telefoonnummer );
		    $( '.toolbar .mail' ).attr( 'href', 'mailto:' + page.Email );

		    log( $( '#office-page div#map' ).length );
		    print_map( $( '#office-page div#map' ), page.Long_instelling, page.Lat_instelling );

		    $( '.toolbar .map' ).click( function () {
			var location = page.Lat_instelling + ',' + page.Long_instelling;
			window.open( ( ( get_device_platform() == 'ios' ) ?
				'maps://maps.apple.com/?q=' : 'geo:0,0?q=' ) + location,
				'_system' );
		    } );
		}
	    } );
        fetch_record( db_tables.APP_SETTINGS_TABLE, { }, '', function ( data ) {
            log( 'fetch_app_settings()' );
            // set_global_var( global_vars.APP_SETTINGS_DATA, JSON.stringify( data.result[0] ) );
		    hide_indicator();

            $( '.toolbar .web' ).off( 'click' ).on( 'click', function () {
                app_browser( ( data.result[0].klantwebsite ), "Website");
            } );
        } );
	}

	if ( isset( $_GET( 'office' ) ) && $_GET( 'office' ) ) {
	    if ( isset( get_global_var( global_vars.OFFICE_DATA ) ) && get_global_var( global_vars.OFFICE_DATA ) ) {
		var pages_data = JSON.parse( get_global_var( global_vars.OFFICE_DATA ) );
		populate_page_data( pages_data );
		hide_indicator();
	    } else
		fetch_record( db_tables.OFFICE_TABLE, { }, 'Kantoornaam', function ( data ) {
		    log( 'fetch_app_settings()' );

		    // set_global_var( global_vars.OFFICE_DATA, JSON.stringify( data.result ) );
		    populate_page_data( data.result );
		} );
	} else {
	    fetch_record( db_tables.OFFICE_TABLE, { }, 'Kantoornaam', function ( data ) {
		log( 'fetch_app_settings()' );

		set_global_var( global_vars.OFFICE_DATA, JSON.stringify( data.result ) );
		populate_offices( data.result );
		hide_indicator();
	    } );
	}
    } catch ( e ) {
	log( "team page" );
	log( e );
    }
}

// for initial load
kantoren();