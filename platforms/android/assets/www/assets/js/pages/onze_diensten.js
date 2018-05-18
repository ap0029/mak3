function onze_diensten() {
    try {
        function populate_page_data( pages ) {
            $.each( pages, function ( i, page ) {
            if ( ( page.name ).toLowerCase() == "onze diensten" )
                $( '.details' ).html( decode_data( page.htmlpagina ) );
            } );
        }
            fetch_record( db_tables.PAGE_TABLE, { }, '', function ( data ) {
                // set_global_var( global_vars.PAGES_DATA, JSON.stringify( data.result ) );
                console.log('fetch_record');
                console.log(data);
                console.log(data.result);
                populate_page_data( data.result );
                hide_indicator();
            } );
        /*if ( isset(get_global_var( global_vars.PAGES_DATA )) && get_global_var( global_vars.PAGES_DATA ) ) {
            var pages_data = JSON.parse( get_global_var( global_vars.PAGES_DATA ) );
            populate_page_data( pages_data );
            hide_indicator();
        } else{
            
        }*/
    } catch ( e ) {
        log( "team page" );
        log( e );
    }
}

// for initial load
onze_diensten();