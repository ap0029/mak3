try{
    function dm_login( ) {
        var ready = 0;
        if (device.platform == "iOS") {
			if(get_global_var("uname")){
				$('#username').val(get_global_var("uname"));
				$('#password').val(get_global_var("pass"));
			}

		}else{
			if( String(localStorage.getItem("uname"))!="null" ){
				$('#username').val( localStorage.getItem("uname") );
				$('#password').val( localStorage.getItem("pass") );
			}
		}
        hideLoader();
    }
    // for inital load
    dm_login( );

    function dmPerformLogin(fromLoader){
        //if(!fromLoader) loaderLogo();
        forceAppendLoader();
        var uname = document.mForm.username.value;
        var pass = document.mForm.password.value;
        console.log("http://cloudapps.services/rest/api/login?loginName="+encodeURIComponent(uname)+"&password="+pass);
        if(uname!==""&&pass!==""){
            $.ajax({
                url:"http://cloudapps.services/rest/api/login?loginName="+encodeURIComponent(uname)+"&password="+pass,
                type:"GET",
                error: function(xhr){
                    if(!fromLoader){
                        alert('Gebruikersnaam of wachtwoord is niet juist');
                        var loader = setInterval( function ( ) {
                            hide_indicator( );
                            clearInterval( loader );
                        }, 700 );
                    }else{ main_view.router.loadPage( 'pages/dm_main.html' ); }
                },
                success: function(xhr){
                    var sid = $(xhr).find("sessionId").text(),
                        devid = device.uuid;
                    if (device.platform == "iOS"){
                        set_global_var("uname",uname);
                        set_global_var("pass",pass);
                        set_global_var("sessionId",sid);
                    }else{
                        localStorage.setItem("uname",uname);
                        localStorage.setItem("pass",pass);
                        localStorage.setItem("sessionId",sid);
                    }
                    console.log('login success');
                    console.log(xhr);
                    fetchUserId(sid,function(sessionId,uid){
                        updateDeviceId(sessionId,uid,devid,function(){
                            main_view.router.loadPage( 'pages/dm_main.html' );
                        });
                    });
                }
            }).done(function(data){
                console.log('login done');
                console.log(data);
            });
        }else{
            if(fromLoader){
                main_view.router.loadPage( 'pages/dm_login.html' );
            }else{
                var loader = setInterval( function ( ) {
                    hide_indicator( );
                    clearInterval( loader );
                }, 700 );
                alert("Gebruikersnaam of wachtwoord is niet juist");
            }
            //alert("Invalid username or password");
        }
    }
    function fetchUserId(sessionId,callback){
        var loginName = localStorage.getItem("uname")==null?globalStorage.getItem("uname"):localStorage.getItem("uname");
        var query = encodeURIComponent("SELECT id FROM USER WHERE loginName = '"+loginName+"'");
        console.log('query');
        console.log("http://cloudapps.services/rest/api/selectValue?sessionId="+sessionId+"&query="+query);
        $.ajax({
            url: "http://cloudapps.services/rest/api/selectValue?sessionId="+sessionId+"&query="+query,
            type: "GET",
            error: function(xhr){
                console.log('fetchUserId error');
                console.log(xhr);
                alert("Something went wrong with the request \n "+xhr.responseText);
            },
            success: function(xhr){
                console.log('fetchUserId success');
                console.log(xhr);
                var uid = $(xhr).find("value").text();
                callback(sessionId,uid);
            }
        });
    }

    function updateDeviceId(sessionId,uid,deviceId,callback){ 
        $.ajax({
            url: "http://cloudapps.services/rest/api/updateRecord",
            type: "POST",
            data: {sessionId:sessionId,objName:"USER",useIds:false,deviceid:deviceId,id:uid},
            error: function(xhr){
                alert("Something went wrong with the request \n "+xhr.responseText);
            },
            success: function(xhr){
                var uid = $(xhr).find("value").text();
                callback();
            }
        });
    }

}catch(e){
    alert(JSON.stringify(e));
}