function overons_listing() {
    var ready = 0;
    try {
        fetch_record(db_tables.OVER_ONS_SORTING_TABLE, { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'hide_listitem', value: false }}, ]} ]}, 'volgorde_nummer', function ( data ) {
            var overons_options = [ ];
            if ( isset( data.result ) && isset( data.result.length ) ){
                for ( var i = 0; i < data.result.length; i++ ) {
                    var item = { 
                        name: data.result[i].list_item_naam,
                        icon: data.result[i].icon,
                        catagory: data.result[i].category,
                        url: data.result[i].link
                    };
                    overons_options.push(item);
                    /*if ( overons_data[data.result[i].list_item_naam] ) {
                        overons_options.push( overons_data[data.result[i].list_item_naam] );
                    }*/
                }
                var list_options = parse_list_options(overons_options, 'name', 'url', '');
                populate_list_options(list_options, "" , $(".repeat-overons:first") , $('#overons_listing'));
                bind_clicks( );
                ready++;
            }
        });
        
    } catch (e) {
        log("overons_listing()");
        log(e);
    }
    var loader = setInterval(function () {
        if ( ready > 0 ) {
            hide_indicator();
            clearInterval(loader);
        }
    }, 700 );
}

// for initial load
overons_listing();