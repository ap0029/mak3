try{
    function dm_settings( ) {
        //forceAppendLoader();
    }
    
    function gotoCpass(){
        var externalurl = "http://cloudapps.services/router/login/forgotPassword.jsp?language=nl";
        function rgb2hex(rgb) {
            rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return (rgb && rgb.length === 4) ? "#" + ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
        }
        var headerColor = $('.navbar .navbar-inner').css("color");
        var headerBgColor = $('.navbar').css("background-color");
        var hexheaderColor = rgb2hex(headerColor);
        var hexheaderBgColor = rgb2hex(headerBgColor);
        var parameters = "EnableViewPortScale=yes,fj_navigationbar=yes,fj_title=Document Manager,fj_titlecolor=" + hexheaderColor + ",fj_barcolor=" + hexheaderBgColor;
        if (device.platform == 'iOS') { window.open(externalurl, '_blank', parameters);} else {window.open(externalurl, '_blank', parameters); }
    }
    // for inital load
    dm_settings( );

}catch(e){
    alert(JSON.stringify(e));
}