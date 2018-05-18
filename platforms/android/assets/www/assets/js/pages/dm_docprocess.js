try{
    function dm_docprocess( ) {
        forceAppendLoader();
        initGridDocProcess();
    }
        
    function initGridDocProcess(){
        var headerBgColor = $('.navbar').css("background-color");
        fetchSessionId(function(sessionId){
            fetchDocsProcess(sessionId,function(result){
                var tileDisplay = "";
                $(result).find("resp").children().each(function(index){
                    var id = $(this).children().eq(0).text(),
                        name = $(this).children().eq(1).text(),
                        icon = $(this).children().eq(2).text();
                    console.log('id: '+id);
                    console.log('name: '+name);
                    console.log('name: '+icon);
                    tileDisplay+='<div onclick="gotoArchief('+id+')" class="brixxsTile">'+
                        '<div class="brixxsTileIcon">'+
                            '<span class="'+icon+'" style="color:'+headerBgColor+'"></span>'+
                            '<h6 style="color:'+headerBgColor+'">'+name+'</h6>'+
                        '</div>'+
                    '</div>';
                });
                $('#doc-process-tile').html(tileDisplay);
                hideLoader();
            });
        });
    }

    function fetchDocsProcess(sessionId, callback){
        var query = encodeURI("SELECT id, name, Mobile_Icon FROM Document_Process ORDER BY name");
        $.ajax({
            url: "http://cloudapps.services/rest/api/selectQuery?sessionId="+sessionId+"&query="+query+"&startRow=0&maxRows=20000",
            type: "GET",
            error: function(xhr){
                console.log('error');
                console.log(xhr.responseText);
            },
            success: function(xhr){
                if(typeof callback == 'function') callback(xhr);
            }
        });
    }

    function gotoArchief(id){
        GLOBAL_DOC_PROCESS=id;
        console.log("working event");
        console.log(id);
        //$.mobile.changePage("#dmarchief");
        main_view.router.loadPage( 'pages/dm_archief.html' );
    }

    function hideLoader(){
        var loader = setInterval( function ( ) {
            hide_indicator( );
            clearInterval( loader );
        }, 700 );
    }
    // for inital load
    dm_docprocess( );
}catch(e){
    alert(JSON.stringify(e));
}