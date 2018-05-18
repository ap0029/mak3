function populate_emploee_details( employees ) {
    try {
	$.each( employees, function ( i, employee ) {
	    if ( employee.id == $_GET( 'emp_id' ) ) {
		if ( isset( employee.image_url.length ) && employee.image_url ) {
		    $( '#image img', $( '[data-page="employee_detail"]' ) ).attr( {
			src: employee.image_url,
			alt: employee.name,
		    } );
		}
		$( '#name', $( '[data-page="employee_detail"]' ) ).html( employee.name );
		$( '#city', $( '[data-page="employee_detail"]' ) ).html( employee.city );
		$( '#expertise', $( '[data-page="employee_detail"]' ) ).html( employee.Expertise );
		$( '#details', $( '[data-page="employee_detail"]' ) ).html( employee.background_details );

		$( "#call", $( '[data-page="employee_detail"]' ) ).off( 'click' ).on( 'click', function () {
		    var contacts = [
			{ text: 'Telefoonnummer', label: true },
			{ text: 'Kantoornummer: ' + employee.phone, bold: true, onClick: function () {
				window.open( 'tel:' + employee.phone, '_system' );
			    } },
			{ text: 'Mobiel: ' + ( isset( employee.mobilePhone ) && employee.mobilePhone != '' ? employee.mobilePhone : 'Niet beschikbaar' ), bold: true, onClick: function () {
				window.open( 'tel:' + employee.mobilePhone, '_system' );
			    } }
		    ];
		    var cancel = [ { text: 'Cancel', color: 'red' } ];
		    main_app.actions( [ contacts, cancel ] );
		} );

		$( "#sms", $( '[data-page="employee_detail"]' ) ).off( 'click' ).on( 'click', function () {
		    window.plugins.socialsharing.shareViaSMS( '', employee.mobilePhone, function ( msg ) {
			log( 'ok: ' + msg );
		    }, function ( msg ) {
			log( 'error: ' + msg );
		    } );
		} );

		$( "#mail", $( '[data-page="employee_detail"]' ) ).off( 'click' ).on( 'click', function () {
		    window.plugins.socialsharing.shareViaEmail(
			    null, null, [ employee.email ], null, null, null, function () {
		    }, function () {
		    } );

		} );

		$( "#favourite", $( '[data-page="employee_detail"]' ) ).off( 'click' ).on( 'click', function () {
		    make_favourite( employee, true );
		} );

		make_favourite( employee, false );
	    }
	} );
    } catch ( e ) {
	log( 'populate_employees()' );
	log( e );
		hide_indicator();
    }
}

function make_favourite( employee, click ) {
    try {
	var filter = { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'employeeID', value: employee.Id } } ] } ] };
	show_indicator();
	fetch_record( db_tables.FAVOURITE_EMPLOYEE_TABLE, filter, 'name', function ( data ) {
	    if ( isset( click ) && click ) {
		if ( isset( data.result ) && isset( data.result.length ) && data.result.length ) {
		    delete_record( db_tables.FAVOURITE_EMPLOYEE_TABLE, filter, function ( data ) {
			$( "#favourite", $( '[data-page="employee_detail"]' ) ).html( 'Favoriet' );

			hide_indicator();
		    } );
		} else {
		    insert_record( db_tables.FAVOURITE_EMPLOYEE_TABLE, {
			employeeID: employee.Id,
			deviceid: get_device_id()
		    }, function ( data ) {
			if ( !isset( data.result ) )
			    show_alert( messages.GENERAL_ERROR );

			$( "#favourite", $( '[data-page="employee_detail"]' ) ).html( 'Niet favoriet' );
			hide_indicator();
		    } );
		}
	    } else {
		if ( isset( data.result ) && data.result.length )
		    $( "#favourite", $( '[data-page="employee_detail"]' ) ).html( 'Niet favoriet' );
		else
		    $( "#favourite", $( '[data-page="employee_detail"]' ) ).html( 'Favoriet' );
	    }
		hide_indicator();
	} );
    } catch ( e ) {
	log( e );
	hide_indicator();
    }
}

function employee_details( ) {
    try {
	if ( isset( get_global_var( global_vars.EMPLOYEES_DETAILS ) ) && get_global_var( global_vars.EMPLOYEES_DETAILS ) ) {
	    var employee_data = JSON.parse( get_global_var( global_vars.EMPLOYEES_DETAILS ) );
	    populate_emploee_details( employee_data );
	} else {
	    if ( isset( $_GET( 'emp_id' ) ) && $_GET( 'emp_id' ) ) {
		var filter = { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'id', value: $_GET( 'emp_id' ) } } ] } ] };
		fetch_record( db_tables.EMPLOYEE_TABLE, filter, 'name', function ( data ) {
		    set_global_var( global_vars.EMPLOYEES_DETAILS, JSON.stringify( data.result ) );
		    populate_emploee_details( data.result );
		} );
	    } else
		window.history.back();
	}
    } catch ( e ) {
	show_alert( e );
    }
}

// For Initial loading
employee_details( );