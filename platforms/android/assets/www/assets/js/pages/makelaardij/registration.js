function registration() {
    loadEvents();

}

function loadEvents(){
  $( '#registration_form' ).css('display','none');
  forceAppendLoader();
  var userData = get_global_var( "EL_USER_DATA");
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
      $( '#registration_form' ).css('display','block');
      hideLoader();
      console.log(get_global_var( global_vars.USER_DATA ))
      var current_user_data = JSON.parse( get_global_var( global_vars.USER_DATA ) );
  		console.log("current_user_data: " + current_user_data);
  		if(current_user_data.email!="") $( "#mkemail" ).val( decode_data( current_user_data.email ) );
      $( '#mkpassword' ).on( 'keyup',function(){
          validatePasswords();
      });
      $( '#mkcpassword' ).on( 'keyup',function(){ validatePasswords(); });
      $( '#mkemail' ).on( 'keyup',function(){ validatePasswords(); });
      $( 'button#reg-user' ).off('click').on( 'click', function ( ) {
          registerUser();
      } );
      $( 'button#log-user' ).off('click').on( 'click', function ( ) {
          main_view.router.loadPage("pages/"+app_name.toLowerCase()+"/login.html");
      } );
  }
}

function validatePasswords(){
    $('#cpasssection').css('visibility','visible');
    var pass1 = $("#mkpassword").val(),
        pass2 = $("#mkcpassword").val();
    if(pass1==pass2&&pass1!=""){
        $( '#mkcpassword' ).attr("class","padded-input green-color");
        $( '#cpass-icon' ).attr("class","fa fa-check green-color");
        $( '#cpass-holder' ).attr("class","item-content no-border-input green-border");
        if($( '#mkemail' ).val()!=""){
            $( 'button#reg-user' ).removeAttr('disabled');
        }else{ $( 'button#reg-user' ).attr('disabled',true); }
    }else{
        $( '#mkcpassword' ).attr("class","padded-input red-color");
        $( '#cpass-icon' ).attr("class","fa fa-ban red-color");
        $( '#cpass-holder' ).attr("class","item-content bordered-input red-border");
        $( 'button#reg-user' ).attr('disabled',true);
    }
}

function registerUser(){
    forceAppendLoader();
    var el = new Everlive(db_api_key),
        username = $("#mkemail").val(),
        password = $("#mkpassword").val(),
        attrs = {
            Email: username,
            DisplayName:  null
        };
    if(username!=""&&password!=""){
        var par = $( 'form#registration_form' );
        if ( !validate_email( $( "#mkemail", par ).val() ) ) {
            var loader = setInterval( function ( ) {
                hide_indicator( );
                clearInterval( loader );
                show_alert( messages.NEWSLETTER, function(){
                    $( "#mkemail", par ).focus();
                } );
            }, 700 );
        }else{
          var ob = {PasswordSalt:password,Email:username,DisplayName:null};
          var filter = { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'Username', value: get_device_id() } } ] } ] };
          update_record( 'users', ob, filter, function ( data ) {
            if ( isset( data.result ) ) {
              var loader = setInterval( function ( ) {
                  hide_indicator( );
                  clearInterval( loader );
                  show_alert(messages.REGISTRATION_SUCCESS_MSG, function(){
                      // window.history.back();
                      executeLogin();
                  });
              }, 700 );
            }else{
              var loader = setInterval( function ( ) {
                  hide_indicator( );
                  clearInterval( loader );
                  show_alert(messages.USER_EXISTS, function(){
                      console.log('request error');
                  });
              }, 700 );
            }

          })
        }
    }else{
        var loader = setInterval( function ( ) {
                    hide_indicator( );
                    clearInterval( loader );
                    show_alert(messages.REQUIRED_FIELDS, function(){
                        console.log('request error');
                    });
        }, 700 );
    }
}
function executeLogin(){
    console.log("executeLogin");
    forceAppendLoader();
    var el = new Everlive(db_api_key),
        username = $("#mkemail").val(),
        password = $("#mkpassword").val();
    if(username!=""&&password!=""){
        db_obj.authentication.login(
            username, // username
            password, // password
            function (data) {
                console.log(JSON.stringify(data));
                var loader = setInterval( function ( ) {
                    $( '#registration_form' ).css('display','block !important');
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
                    $( '#registration_form' ).css('display','block !important');
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
registration();
