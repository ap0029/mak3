function changepass() {
    var loader = setInterval( function ( ) {
		hide_indicator( );
		clearInterval( loader );
	}, 700 );
    $( '#rs_newpassword' ).on( 'keyup',function(){
        validatePasswords();
    });
    $( '#rscpassword' ).on( 'keyup',function(){ validatePasswords(); });
    $( 'button#changepassword' ).off('click').on( 'click', function ( ) {
        execChangePassword();
    } );
}

function validatePasswords(){
    $('#rscpasssection').css('visibility','visible');
    var pass1 = $("#rs_newpassword").val(),
        pass2 = $("#rscpassword").val();
    if(pass1==pass2&&pass1!=""){
        $( '#rscpassword' ).attr("class","padded-input green-color");
        $( '#rscpass-icon' ).attr("class","fa fa-check green-color");
        $( '#rscpass-holder' ).attr("class","item-content no-border-input green-border");
        $( 'button#changepassword' ).removeAttr('disabled');
    }else{
        $( '#rscpassword' ).attr("class","padded-input red-color");
        $( '#rscpass-icon' ).attr("class","fa fa-ban red-color");
        $( '#rscpass-holder' ).attr("class","item-content bordered-input red-border");
        $( 'button#changepassword' ).attr('disabled',true);
    }
}

function execChangePassword(){
    forceAppendLoader();
    var el = new Everlive(db_api_key),
        username = $('#rsusername').val(),
        oldpass = $('#rs_oldpassword').val(),
        newpass = $('#rs_newpassword').val();
    if(username!=""&&oldpass!=""&&newpass!=""){
        db_obj.Users.changePassword(
            username, // username
            oldpass, // current password
            newpass, // new password
            true, // keep the user's tokens
            function (data) {
                console.log(JSON.stringify(data));
                var loader = setInterval( function ( ) {
                    hide_indicator( );
                    clearInterval( loader );
                    show_alert('Password has been changed', function(){
                        window.history.back();
                    });
                }, 700 );
            },
            function(error){
                console.log(JSON.stringify(error));
                var loader = setInterval( function ( ) {
                    hide_indicator( );
                    clearInterval( loader );
                    show_alert(error.message, function(){

                    });
                }, 700 );
            }
        );
    }else{
        var loader = setInterval( function ( ) {
                    hide_indicator( );
                    clearInterval( loader );
                    show_alert("Incomplete Information", function(){
                        console.log('request error');
                    });
        }, 700 );
    }
}

// for inital load
changepass();
