try{
    function dm_statuspage( ) {
        var docid, actionId, pageTitle, docname;
		docid = localStorage.getItem("docid");
		actionId = localStorage.getItem("actionId");
		pageTitle = localStorage.getItem("pageTitle");
		docname = localStorage.getItem("docname");
		$('#tacomment').val("");
		$('#action-text').html(pageTitle+" "+docname);
		$('#btsubmit').html(pageTitle);
		console.log('docid: '+docid);
		console.log('actionId: '+actionId);
        var loader = setInterval( function ( ) {
            hide_indicator( );
            clearInterval( loader );
        }, 700 );
    }
    
    // for inital load
    dm_statuspage( );

}catch(e){
    alert(JSON.stringify(e));
}