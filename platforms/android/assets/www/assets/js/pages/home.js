
function home_listing() {
    var ready = 0;
	if ( isset( get_global_var( global_vars.MEER_LIST_ITEMS ) ) && get_global_var( global_vars.MEER_LIST_ITEMS ) ) {
	    list_options = JSON.parse( get_global_var( global_vars.MEER_LIST_ITEMS ) );
	    populate_list_options( list_options, "", $( ".repeat-home:first" ), $( '#home_listing' ) );
	    set_global_var( global_vars.MEER_LIST_ITEMS, JSON.stringify( list_options ) );
        console.log(global_vars.MEER_LIST_ITEMS);
	    ready++;
	} else {
	    fetch_record( db_tables.MORE_SORTING_TABLE, {
		type: 'single',
		where: [ {
			type: 'none',
			clauses: [ {
				action: '=',
				clause: {
				    column: 'hide_listitem',
				    value: false
				}
			    }, ]
		    } ]
	    }, 'volgorde_nummer', function ( data ) {
		console.log( data );
		var meer_options = [ ];
		if ( isset( data.result ) && isset( data.result.length ) )
		    for ( var i = 0; i < data.result.length; i++ ) {
                if ( meer_data[app_name][data.result[i].list_item_naam] ) {
                    meer_options.push( meer_data[app_name][data.result[i].list_item_naam] );
                }
		    }
        for( var j = 0; j < new_customer_pages.length; j++){
            meer_options.push( new_customer_pages[j] );
        }
		var list_options = parse_list_options( meer_options, 'name', 'url', '' );
		populate_list_options( list_options, "", $( ".repeat-home:first" ), $( '#home_listing' ) );
		// set_global_var(global_vars.MEER_LIST_ITEMS, JSON.stringify(list_options));
		bind_clicks( );
		ready++;
	    } );
	}

    var loader = setInterval( function ( ) {
	if ( ready > 0 ) {
	    hide_indicator( );
	    clearInterval( loader );
	}
    }, 700 );
}

// for initial load
home_listing( );