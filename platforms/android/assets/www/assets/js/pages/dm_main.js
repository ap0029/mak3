try{
    function dm_main( ) {
        var ready = 0;
        var headerBgColor = $('.navbar').css("background-color");
        $("#reviewTile").off("click").on("click",function() {
			//alert('pages/' + app_name.toLowerCase() + '/dm_login.html');
            main_view.router.loadPage( 'pages/dm_review.html' );
        });
        $("#reviewTile span, #reviewTile h6").css('color',headerBgColor);
        $("#goedkeurenTile").off("click").on("click",function() {
			//alert('pages/' + app_name.toLowerCase() + '/dm_login.html');
            main_view.router.loadPage( 'pages/dm_goedkeuren.html' );
        });
        $("#goedkeurenTile span, #goedkeurenTile h6").css('color',headerBgColor);
        $("#archiefTile").off("click").on("click",function() {
			//alert('pages/' + app_name.toLowerCase() + '/dm_login.html');
            main_view.router.loadPage( 'pages/dm_docprocess.html' );
        });
        $("#archiefTile span, #archiefTile h6").css('color',headerBgColor);
        $("#settingsTile").off("click").on("click",function() {
			//alert('pages/' + app_name.toLowerCase() + '/dm_login.html');
            main_view.router.loadPage( 'pages/dm_settings.html' );
        });
        $("#settingsTile span, #settingsTile h6").css('color',headerBgColor);
        forceAppendLoader();
        reviewBadgeCounter();
    }
    function reviewBadgeCounter(){
        fetchSessionId(function(sessionId){
            fetchDocs(sessionId,function(result){
                var counter = 0;
                $(result).find("resp").children().each(function(){
                    var Status_Text = $(this).children().eq(5).text();
                    if(Status_Text=='In behandeling'||Status_Text=='In progress') counter++;
                });
                if(counter>0){
                    $('#reviewBadge').html(counter).show();
                }else{ $('#reviewBadge').html("0").hide(); }
                goedkeurenBadgeCounter();
            });
        });
    }
    function goedkeurenBadgeCounter(){
        fetchSessionId(function(sessionId){
            fetchDocsGoedkeuren(sessionId,function(result){
                var counter = 0;
                $(result).find("resp").children().each(function(){
                    var Signing_Status_Text = $(this).children().eq(4).text();
                    if(Signing_Status_Text=='INVITED'||Signing_Status_Text=='VISITED'||Signing_Status_Text=='VIEWED_DOCUMENT') counter++;
                });
                if(counter>0){
                    $('#goedkeurenBadge').html(counter).show();
                }else{ $('#goedkeurenBadge').html("0").hide(); }
                var loader = setInterval( function ( ) {
                    hide_indicator( );
                    clearInterval( loader );
                }, 700 );
            });
        });
    }
    // for inital load
    dm_main( );

}catch(e){
    alert(JSON.stringify(e));
}