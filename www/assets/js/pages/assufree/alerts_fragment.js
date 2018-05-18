function countPreSelected(mode){
    console.log('countPreSelected');
    console.log('----------------------------------');
    console.log(get_pre_selected_options( get_global_var( global_vars.USER_DATA ), mode, 'leeg' ));
    console.log('----------------------------------');
    return get_pre_selected_options( get_global_var( global_vars.USER_DATA ), mode, 'leeg' )=='leeg'?0:get_pre_selected_options( get_global_var( global_vars.USER_DATA ), mode, 'leeg' ).length;
}
function updateBadges(){
    $('.zakelijk-badge').text(countPreSelected('rubriek'));
    $('.particulier-badge').text(countPreSelected('particulier'));
}
function alerts_fragment() {
    var ready = 0;
    console.log("alerts_fragment() load event");
    updateBadges();
    try {
        fetch_record( db_tables.TOPICS_TABLE, { }, 'name', function ( data ) {
            //console.log('zakelijk_news');
            //console.log(data);
            $( 'select[name="zakelijk_news"]' ).empty();
            var filteredResult = [];
            for(var i = 0; i < data.result.length; i++){
                if(data.result[i].type=='Zakelijk'){
                    //console.log('data.result[i].type==Zakelijk');
                    //console.log(data.result[i].type, data.result[i].name);
                    filteredResult.push(data.result[i]);
                }
            }
            var zakelijk_alert_options = prase_select_options( filteredResult, 'database_name', 'name', true );
            mpopulate_select_options( $( 'select[name="zakelijk_news"]' ), zakelijk_alert_options, get_pre_selected_options( get_global_var( global_vars.USER_DATA ), 'rubriek', 'leeg' ), true, ".zakelijk-badge" );
            ready++;
        } );
        fetch_record( db_tables.TOPICS_TABLE, { }, 'name', function ( data ) {
            //console.log('particulier_news');
            //console.log(data);
            $( 'select[name="particulier_news"]' ).empty();
            var filteredResult = [];
            for(var i = 0; i < data.result.length; i++){
                if(data.result[i].type=='Particulier'){
                    //console.log('data.result[i].type==Particulier');
                    //console.log(data.result[i].type, data.result[i].name);
                    filteredResult.push(data.result[i]);
                }
            }
            var particulier_alert_options = prase_select_options( filteredResult, 'database_name', 'name', true );
            mpopulate_select_options( $( 'select[name="particulier_news"]' ), particulier_alert_options, get_pre_selected_options( get_global_var( global_vars.USER_DATA ), 'particulier', 'leeg' ), true, ".particulier-badge" );
            ready++;
        } );

        update_user_data( function () {
            var today = "";
            if ( get_global_var( global_vars.USER_DATA ) != '0' && get_global_var( global_vars.USER_DATA ) != 0 ) {
                var current_user_data = JSON.parse( get_global_var( global_vars.USER_DATA ) );
                $( "#hypotheekrente-alert" ).prop( 'checked', ( current_user_data.hypotheekrente == true ) )
                $( "#zorgverzekering-alert" ).prop( 'checked', ( current_user_data.zorgverzekering == true ) );
            }
            ready++;
        } );
    } catch ( e ) {
        console.log('alerts fragment catch error');
        console.log(e);
    }

    $( 'button#alerts' ).off( 'click' ).on( 'click', function () {
        console.log('button clicked!');
        show_toast( 'success', messages.GENERAL_SUCCESS, function ( ) {
            main_view.router.loadPage( 'pages/'+app_name.toLowerCase()+'/'+landingPage+'.html' );
        } );
    } );

    $( "input[name='hypotheekrente_alert']" ).off( 'change' ).on( 'change', function () {
	var single_record = $( "input[name='hypotheekrente_alert']" ).is( ':checked' ) ? { hypotheekrente: true } : { hypotheekrente: false };
	log( single_record );
	update_global_user_data( single_record );
    } );

    $( "input[name='zorgverzekering_alert']" ).off( 'change' ).on( 'change', function () {
	var single_record = $( "input[name='zorgverzekering_alert']" ).is( ':checked' ) ? { zorgverzekering: true } : { zorgverzekering: false };
	log( single_record );
	update_global_user_data( single_record );
    } );

    $( "#zakelijk_news" ).on( 'change', function () {
        try {
            var zakelijk_news = $( 'select[name="zakelijk_news"]' ).val();
            single_record = { rubriek: isset( zakelijk_news.length ) && zakelijk_news.length ? zakelijk_news : 'Leeg' };
        } catch ( e ) {
            single_record = { rubriek: 'Leeg' };
        }
        log( single_record );
        update_global_user_data( single_record );
        updateBadges();
    } );

    $( "#particulier_news" ).on( 'change', function () {
        try {
            var particulier_news = $( 'select[name="particulier_news"]' ).val();
            single_record = { particulier: isset( particulier_news.length ) && particulier_news.length ? particulier_news : 'Leeg' };
        } catch ( e ) {
            single_record = { particulier: 'Leeg' };
        }
        log( single_record );
        update_global_user_data( single_record );
        updateBadges();
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