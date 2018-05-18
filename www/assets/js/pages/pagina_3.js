function pagina_3() {
    try {
        function populate_page_data( pages ) {
            $.each( pages, function ( i, page ) {
            if ( ( page.name ).toLowerCase() == "pagina_3" )
                $( '.details' ).html( decode_data( page.htmlpagina ) );
            } );
        }

        if ( isset(get_global_var( global_vars.PAGES_DATA )) && get_global_var( global_vars.PAGES_DATA ) ) {
            var pages_data = JSON.parse( get_global_var( global_vars.PAGES_DATA ) );
            populate_page_data( pages_data );
            hide_indicator();
        } else{
            fetch_record( db_tables.PAGE_TABLE, { }, '', function ( data ) {
                // set_global_var( global_vars.PAGES_DATA, JSON.stringify( data.result ) );
                populate_page_data( data.result );
                hide_indicator();
            } );
        }
    } catch ( e ) {
        log( "pagina 3" );
        log( e );
    }
}

// for initial load
pagina_3();