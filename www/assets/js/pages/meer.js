try{
function meer_listing( ) {
    var ready = 0;
    try {
	if ( isset( get_global_var( global_vars.MEER_LIST_ITEMS ) ) && get_global_var( global_vars.MEER_LIST_ITEMS ) ) {
	    list_options = JSON.parse( get_global_var( global_vars.MEER_LIST_ITEMS ) );
	    populate_list_options( list_options, "", $( ".repeat-meer:first" ), $( '#meer_listing' ) );
	    set_global_var( global_vars.MEER_LIST_ITEMS, JSON.stringify( list_options ) );
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
		var meer_options = [ ];
		if ( isset( data.result ) && isset( data.result.length ) )
		    for ( var i = 0; i < data.result.length; i++ ) {
                var item = { 
                    name: data.result[i].name,
                    icon: data.result[i].icon,
                    catagory: data.result[i].category,
                    url: data.result[i].link
                };
                if(isset(data.result[i].platform) && isset(data.result[i].platform.length) && data.result[i].platform != ""){
                    if(data.result[i].platform == get_device_platform())
                        meer_options.push(item);
                }else{
                    meer_options.push(item);
                }
		    }
        for( var j = 0; j < new_customer_pages.length; j++){
            meer_options.push( new_customer_pages[j] );
        }
		var list_options = parse_list_options( meer_options, 'name', 'url', '' );
		populate_list_options( list_options, "", $( ".repeat-meer:first" ), $( '#meer_listing' ) );
		// set_global_var(global_vars.MEER_LIST_ITEMS, JSON.stringify(list_options));
		bind_clicks( );
		ready++;
	    } );
	}
    } catch ( e ) {
	log( "meer_sorting()" );
	log( e );
    }

    var loader = setInterval( function ( ) {
	if ( ready > 0 ) {
	    hide_indicator( );
	    clearInterval( loader );
	}
    }, 700 );
}

// for initial load
meer_listing( );
}
catch(e){
    log(e);
}