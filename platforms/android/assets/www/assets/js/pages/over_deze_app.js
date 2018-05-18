function over_deze_app(){
    //get phone_no & email from backend
    get_app_settings( function() {
//        var phone_nummer = "tel:" + get_app_settings().algemenetelefoonnummer;
//        var email = "mailto:" + get_app_settings().algemeneemail;
        var phone_nummer = "tel:+31203892288";
        var email = "mailto:info@apptomorrow.nl";
        $("#call").attr("href", phone_nummer);
        $("#mail").attr("href", email);
        hide_indicator();
    } );
}

over_deze_app();