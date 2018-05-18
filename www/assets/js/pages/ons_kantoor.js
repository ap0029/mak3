function ons_kantoor() {
    try {

        if ( isset(get_global_var(global_vars.APP_SETTINGS_DATA)) && get_global_var(global_vars.APP_SETTINGS_DATA) ) {
            var app_settings_data = JSON.parse(get_global_var(global_vars.APP_SETTINGS_DATA));
            $('.details').html(decode_data(app_settings_data.overonsbedrijf));
            hide_indicator();
            console.log('STORAGE');
        } else
            fetch_record(db_tables.APP_SETTINGS_TABLE, {}, '', function (data) {
                log('fetch_app_settings()');
                log(data);

                // set_global_var(global_vars.APP_SETTINGS_DATA, JSON.stringify(data.result[0]));
                $('.details').html(decode_data(data.result[0].overonsbedrijf));
                hide_indicator();
                console.log('FRESH');
            });
    } catch (e) {
        console.log("team page");
        console.log(e);
    }
}

// for initial load
ons_kantoor();