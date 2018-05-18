function share_app() {
    $('#sms').off('click').on('click', function () {
        get_store_link( function ( data ) {
            window.plugins.socialsharing.shareViaSMS("Mijn downloadtip: " + decode_data(data[1].value) + " or via de Google Play Store: " + decode_data(data[0].value), "");
        });
    });
    
    $('#mail').off('click').on('click', function () {
        var address = get_app_settings()['emailnotification'];
        var title = 'Join ' + app_name + ' Today!';
        if (get_device_platform() == "android") {
            share_via_email(address, title, "", null);
        } else{
            $( this ).attr( 'href' , "mailto:"+address+"")
		    window.open( $( this ).attr( 'href' ), '_system' );
            //window.location.href = "mailto:"+address+"?subject="+title+"";
        }
    });
}

// for initial load
share_app();