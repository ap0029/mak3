function alerts_fragment() {
    var ready = 0;

    try {
	fetch_record( db_tables.TOPICS_TABLE, { }, 'name', function ( data ) {
	    $( 'select[name="breaking_news"]' ).empty();
	    var update_alert_options = prase_select_options( data.result, 'database_name', 'name', true );
        populate_select_options( $( 'select[name="breaking_news"]' ), update_alert_options, get_pre_selected_options( get_global_var( global_vars.USER_DATA ), 'rubriek', 'leeg' ), true );
	    ready++;
	} );

	update_user_data( function () {
	    var today = "";
	    if ( get_global_var( global_vars.USER_DATA ) != '0' && get_global_var( global_vars.USER_DATA ) != 0 ) {
		var current_user_data = JSON.parse( get_global_var( global_vars.USER_DATA ) );
		$( "#schenkbelasting-alert" ).prop( 'checked', ( current_user_data.schenkbelasting == true ) )
		$( "#schenkingsplan-alert" ).prop( 'checked', ( current_user_data.schenkingsplan == true ) );
		$( "#erfbelasting-alert" ).prop( 'checked', ( current_user_data.erfbelasting == true ) );
		if ( isset( current_user_data.erfbelastingDatum ) && current_user_data.erfbelastingDatum.length ) {
		    var date = current_user_data.erfbelastingDatum.split( " " );
		    var date1 = date[0];
		    var date_parts = date1.split( "-" );
		    today = date_parts[2].substring( 0, 2 ) + '-' + date_parts[1] + '-' + date_parts[0];
		}
	    } else {
		/*today = new Date( ),
			dd = ( today.getDate( ) ),
			mm = ( today.getMonth( ) + 1 ),
			yyyy = ( today.getFullYear( ) );
		if ( dd < 10 )
		    dd = '0' + dd;
		if ( mm < 10 )
		    mm = '0' + mm;*/
		today = 'dd' + '-' + 'mm' + '-' + 'yyyy';
	    }
	    var calendarDefault = main_app.calendar( {
		input: '#erfbelastingDatum',
		dateFormat: 'dd-mm-yyyy',
		closeOnSelect: true,
		monthNames: [
		    'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli',
		    'Augustus', 'September', 'Oktober', 'November', 'December',
		],
		dayNamesShort: [ 'Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Zat' ],
		onChange: function () {

		}
	    } );
	    $( "#erfbelastingDatum" ).val( today );
	    ready++;
	} );

    } catch ( e ) {

    }

    $( 'button#alerts' ).off( 'click' ).on( 'click', function () {
        show_toast( 'success', messages.GENERAL_SUCCESS, function ( ) {
            main_view.router.loadPage( 'pages/'+app_name.toLowerCase()+'/'+landingPage+'.html' );
        } );
    } );

    $( "input[name='schenkbelasting_alert']" ).off( 'change' ).on( 'change', function () {
	var single_record = $( "input[name='schenkbelasting_alert']" ).is( ':checked' ) ? { schenkbelasting: true } : { schenkbelasting: false };
	log( single_record );
	update_global_user_data( single_record );
    } );

    $( "input[name='schenkingsplan_alert']" ).off( 'change' ).on( 'change', function () {
	var single_record = $( "input[name='schenkingsplan_alert']" ).is( ':checked' ) ? { schenkingsplan: true } : { schenkingsplan: false };
	log( single_record );
	update_global_user_data( single_record );
    } );

    $( "input[name='erfbelasting_alert']" ).off( 'change' ).on( 'change', function () {
	var single_record = $( "input[name='erfbelasting_alert']" ).is( ':checked' ) ? { erfbelasting: true } : { erfbelasting: false };
	log( single_record );
	update_global_user_data( single_record );
    } );

    $( "input[name='erfbelastingDatum']" ).off( 'change' ).on( 'change', function () {
	var date = $( "input[name='erfbelastingDatum']" ).val().split( '-' );
	date = date[2] + "-" + date[1] + "-" + date[0];
	update_global_user_data( { erfbelastingDatum: date } );
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

    var loader = setInterval( function () {
	if ( ready > 1 ) {
	    hide_indicator();
	    clearInterval( loader );
	}
    }, 700 );
}

// for initial load
alerts_fragment();