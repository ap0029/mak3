function login() {
    console.log("login exe");
    $( '#login_page' ).css('display','none');
    forceAppendLoader();
    $( 'button#login-user' ).off('click').on( 'click', function ( ) {
        executeLogin();
    } );
    var userData = get_global_var( "EL_USER_DATA");
    console.log('userData: '+userData);
    console.log(String( (userData!="") ));
    if(userData!=""){
        var fromLogin = get_global_var( "fromLogin" );
        hideLoader();
        if(fromLogin=='true'){
            main_view.router.loadPage("pages/"+app_name.toLowerCase()+"/filter.html");
        }else{
            main_view.router.loadPage("pages/"+app_name.toLowerCase()+"/home.html");
        }
    }else{
        console.log("else");
        $( '#login_page' ).css('display','block');
        hideLoader();
        var current_user_data = JSON.parse( get_global_var( global_vars.USER_DATA ) );
    		console.log("current_user_data: " + current_user_data);
    		if(current_user_data.email!="") $( "#mk_username" ).val( decode_data( current_user_data.email ) );
    }
}
function executeLogin(){
    console.log("executeLogin");
    forceAppendLoader();
    var el = new Everlive(db_api_key),
        username = $("#mk_username").val(),
        password = $("#mk_password").val();
    if(username!=""&&password!=""){
        db_obj.authentication.login(
            username, // username
            password, // password
            function (data) {
                console.log(JSON.stringify(data));
                var loader = setInterval( function ( ) {
                    $( '#login_page' ).css('display','block !important');
                    hideLoader();
                    clearInterval( loader );
                    var token = data.result.access_token;
                    var tokenType = data.result.token_type;
                    var userId = data.result.principal_id;
                    db_obj.authentication.setAuthorization(token, tokenType, userId);
                    set_global_var( "EL_USER_DATA", JSON.stringify(data) );
                    set_global_var( "fromLogin", "true" );
                    set_global_var( "registered", "true" );
                    main_view.router.loadPage("pages/"+app_name.toLowerCase()+"/filter.html");
                }, 700 );
            },
            function(error){
                console.log(JSON.stringify(error));
                var loader = setInterval( function ( ) {
                    $( '#login_page' ).css('display','block !important');
                    hideLoader();
                    clearInterval( loader );
                    show_alert(messages.INVALID_CREDENTIALS, function(){

                    });
                }, 700 );
            }
        );
    }else{
        var loader = setInterval( function ( ) {
                    $( '#login_page' ).css('display','block !important');
                    hideLoader();
                    clearInterval( loader );
                    show_alert(messages.REQUIRED_FIELDS, function(){
                        console.log('request error');
                    });
        }, 700 );
    }
}
// for inital load
login();
