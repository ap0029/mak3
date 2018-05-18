function alerts_fragment() {
    var ready = 0;

    try {
	fetch_record( db_tables.TOPICS_TABLE, { }, 'name', function ( data ) {
	    $( 'select[name="breaking_news"]' ).empty();
	    var update_alert_options = prase_select_options( data.result, 'database_name', 'name', true );
	    populate_select_options( $( 'select[name="breaking_news"]' ), update_alert_options, get_pre_selected_options( get_global_var( global_vars.USER_DATA ), 'rubriek', 'leeg' ), true );
	    ready++;
	} );

	fetch_record( db_tables.SELECT_OPTIONS, { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'meta_key', value: 'btw_alert' } }, ] } ] }, 'meta_value', function ( data ) {
	    $( 'select[name="btw_alert_option"]' ).empty();
	    var btw_alert_options = prase_select_options( JSON.parse( data.result[0].meta_value ), 'database_name', 'name' );
	    populate_select_options( $( 'select[name="btw_alert_option"]' ), btw_alert_options, get_pre_selected_options( get_global_var( global_vars.USER_DATA ), 'kw_ma', 'leeg' ) );
	    ready++;
	} );

	fetch_record( db_tables.SELECT_OPTIONS, { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'meta_key', value: 'loonbelasting_alert' } }, ] } ] }, 'meta_value', function ( data ) {
	    $( 'select[name="loonblasting_option"]' ).empty();
	    var loonblasting_option_options = prase_select_options( JSON.parse( data.result[0].meta_value ), 'database_name', 'name' );
	    populate_select_options( $( 'select[name="loonblasting_option"]' ), loonblasting_option_options, get_pre_selected_options( get_global_var( global_vars.USER_DATA ), 'kw_ma_lh', 'leeg' ) );
	    ready++;
	} );

    update_user_data(function () {
        if ( get_global_var( global_vars.USER_DATA ) != '0' && get_global_var( global_vars.USER_DATA ) != 0 ) {
            var current_user_data = JSON.parse( get_global_var( global_vars.USER_DATA ) );
            current_user_data.BTW == true ? $( "#btw-alert" ).prop( 'checked', true ) : $( "#btw-alert" ).prop( 'checked', false );
            current_user_data.LoonBelasting == true ? $( "#loonbelasting-alert" ).prop( 'checked', true ) : $( "#loonbelasting-alert" ).prop( 'checked', false );
        }
        ready++;
    });

    } catch ( e ) {

    }

    $( 'button#alerts' ).off( 'click' ).on( 'click', function () {
	/*
    var form_data = $( 'form#alerts-form' ).serializeObject();
	var user_data = {
	    BTW: eval( sanitize_value( form_data.btw_alert, false ) ),
	    LoonBelasting: eval( sanitize_value( form_data.loonbelasting_alert, false ) ),
	    rubriek: sanitize_value( JSON.stringify( form_data.breaking_news ), "Leeg" ),
	    kw_ma_lh: sanitize_value( form_data.loonblasting_option, "" ),
	    kw_ma: sanitize_value( form_data.btw_alert_option, "" ),
	};
    
	update_global_user_data( user_data );
    */
    show_toast( 'success', messages.GENERAL_SUCCESS, function ( ) {
        main_view.router.loadPage( 'pages/'+app_name.toLowerCase()+'/'+landingPage+'.html' );
    } );
	
    } );

    $( "input[name='btw_alert']" ).on( 'change', function () {
	var single_record = $( "input[name='btw_alert']" ).is( ':checked' ) ? { BTW: true } : { BTW: false };
	log( single_record );
	update_global_user_data( single_record );
    } );
    $( "input[name='loonbelasting_alert']" ).on( 'change', function () {
	var single_record = $( "input[name='loonbelasting_alert']" ).is( ':checked' ) ? { LoonBelasting: true } : { LoonBelasting: false };
	log( single_record );
	update_global_user_data( single_record );
    } );
    $( "#breaking_news" ).on( 'change', function () {
	try {
	    var breaking_news = $( 'select[name="breaking_news"]' ).val();
	    single_record = { rubriek: isset( breaking_news.length ) && breaking_news.length ? breaking_news : 'Leeg' };
	} catch ( e ) {
	    single_record = { rubriek: 'Leeg' };
	}
	log( single_record );
	update_global_user_data( single_record );
    } );
    $( "#btw-alert-option" ).on( 'change', function () {
	var e = document.getElementById( "btw-alert-option" );
	var btw_alert_option = e.options[e.selectedIndex].value;
	var single_record = { kw_ma: btw_alert_option };
	log( single_record );
	update_global_user_data( single_record );
    } );
    $( "#loonblasting-option" ).on( 'change', function () {
	var e = document.getElementById( "loonblasting-option" );
	var loonblasting_option = e.options[e.selectedIndex].value;
	var single_record = { kw_ma_lh: loonblasting_option };
	log( single_record );
	update_global_user_data( single_record );
    } );

    var loader = setInterval( function () {
	if ( ready > 2 )
	{
	    hide_indicator();
	    clearInterval( loader );
	}
    }, 700 );
}

// for initial load
alerts_fragment();