function resetpass(){
    var loader = setInterval( function ( ) {
		hide_indicator( );
		clearInterval( loader );
	}, 700 );
    $( 'button#resetpassword' ).off('click').on( 'click', function ( ) {
        execResetPass();
    } );
}

function execResetPass(){
    forceAppendLoader();
    var el = new Everlive(db_api_key),
        email = $("#rsemail").val(),
        par = $( 'form#resetpass_form' );
    if(email!=""){
        if ( !validate_email( $( "#rsemail", par ).val() ) ) {
            var loader = setInterval( function ( ) {
                hide_indicator( );
                clearInterval( loader );
                show_alert( messages.NEWSLETTER, function(){
                    $( "#rsemail", par ).focus();
                } );
            }, 700 );
        }else{
            var obj = {
                Email: email
            };

            db_obj.users.resetPassword(obj,
                function (data) {
                    console.log(JSON.stringify(data));
                    var loader = setInterval( function ( ) {
                        hide_indicator( );
                        clearInterval( loader );
                        show_alert(messages.RESET_PASSWORD_MSG, function(){
                            window.history.back();
                        });
                    }, 700 );
                },
                function(error){
                    console.log(JSON.stringify(error));
                    var loader = setInterval( function ( ) {
                        hide_indicator( );
                        clearInterval( loader );
                        show_alert(messages.USER_NOT_FOUND, function(){
                            console.log('request error');
                        });
                    }, 700 );
                }
            );
        }
    }else{
        var loader = setInterval( function ( ) {
            hide_indicator( );
            clearInterval( loader );
            show_alert( messages.REQUIRED_FIELDS, function(){

            } );
        }, 700 );
    }
}

resetpass();
