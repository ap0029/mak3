function populate_emploees( employee_groups ) {
    try {
	$.each( employee_groups, function ( title, employees ) {
	    var group_title = $( ".list-group-title:first" ).clone();
	    group_title.html( title ).show().appendTo( $( '.employees-list' ) );
	    $.each( employees, function ( i, employee ) {
		var employee_section = $( ".repeat-employees:first" ).clone();
		if ( isset( employee.image_url.length ) && employee.image_url )
		    $( '.item-media img', employee_section ).attr( {
			src: employee.image_url,
			alt: employee.name,
		    } );
		$( '.item-link', employee_section ).attr( 'href', 'pages/' + app_name.toLowerCase() + '/employee_detail.html?emp_id=' + employee.id );
		$( '.item-title', employee_section ).html( employee.name );
		$( '.item-after', employee_section ).html( employee.title );
		$( '.item-text', employee_section ).html( employee.background_details );
		employee_section.show().appendTo( $( '.employees-list' ) );
	    } );
	} );
	$( ".list-group-title:first, .repeat-employees:first" ).remove();

	$( '.search-filter' ).off( 'click' ).on( 'click', function () {
	    var string = $( '#search-field' ).val().toLowerCase();
	    if ( isset( string ) && string.length ) {
		$( '.repeat-employees' ).each( function () {
		    if ( ( $( '#name', $( this ) ).html().toLowerCase() ).indexOf( string ) > -1 )
			$( this ).show();
		    else
			$( this ).hide();
		} );
	    } else
		$( '.repeat-employees' ).show();
	} );

	$( '.jplist-panel' ).fadeIn( 200 );
	hide_indicator();
    } catch ( e ) {
	log( 'populate_employees()' );
	log( e );
    }
}

function get_employee_groups( employees ) {
    try {
	var data = { };
	$.each( employees, function ( i, employee ) {
	    try {
		data[( employee.name.charAt( 0 ) ).toUpperCase()].push( employee );
	    } catch ( e ) {
		data[( employee.name.charAt( 0 ) ).toUpperCase()] = [ ];
		data[( employee.name.charAt( 0 ) ).toUpperCase()].push( employee );
	    }
	} );
    } catch ( e ) {
	log( 'get_employee_groups()' );
	log( e );
    }

    return data;
}

function fetch_employees( filters ) {
    try {
	fetch_record( db_tables.EMPLOYEE_TABLE, filters.filter, filters.order, function ( data ) {
	    set_global_var( global_vars.EMPLOYEES_DETAILS, JSON.stringify( data.result ) );
	    populate_emploees( get_employee_groups( data.result ) );
	} );
    } catch ( e ) {
	log( 'fetch_employees()' );
	log( e );
    }
}

function team_alphabetic() {
    try {
	var filters = { filter: { }, order: '' };
	if ( isset( $_GET( 'order' ) ) )
	    switch ( $_GET( 'order' ) ) {
		case 'alphabetic':
		    filters.order = 'name';
		    fetch_employees( filters );
		    break;
		case 'favourite':
		    show_indicator();
		    fetch_record( db_tables.FAVOURITE_EMPLOYEE_TABLE, { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'deviceid', value: get_device_id() } } ] } ] }, 'name', function ( data ) {
			var _in = [ ];
			if ( isset( data.result ) && data.result.length ) {
			    $.each( data.result, function ( i, row ) {
				_in.push( row.employeeID );
			    } );
			}
			filters.filter = { type: 'single', where: [ { type: 'none', clauses: [ { action: 'in', clause: { column: 'Id', value: _in } } ] } ] };
			filters.order = 'name';
			fetch_employees( filters );
		    } );
		    break;
		case 'expertise':
		    fetch_employees( filters );
		    filters.order = 'Expertise';
		    break;
		default:
		    show_alert( messages.GENERAL_ERROR );
		    break;
	    }
    } catch ( e ) {
	show_alert( e );
    }
}

// For Initial loading
team_alphabetic();