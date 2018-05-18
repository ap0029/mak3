function populate_messages_archieve(data) {
    try {
        update_user_data(function () {
            if (isset(get_global_var(global_vars.USER_DATA)) && get_global_var(global_vars.USER_DATA).length) {
                var current_user_data = JSON.parse(get_global_var(global_vars.USER_DATA));
                log(current_user_data.targetGroup);
                log(current_user_data.totalEmployees);
                log(current_user_data.rechtsvorm);

                $.each(data, function (i, record) {
                    if (record.doelgroep.indexOf(current_user_data.targetGroup) !== -1 && record.aantalmedewerkers.indexOf(current_user_data.totalEmployees) !== -1 && record.rechtsvorm.indexOf(current_user_data.rechtsvorm) !== -1) {
                        var message_archieve_section = $(".repeat_message_archieve:first").clone();

                        //$('a.url', message_archieve_section).addClass("open-indicator");
                        $('a.url', message_archieve_section).off('click').on('click', function () {
                            if (decode_data(record.webpagina.toLowerCase()).indexOf('page.') > -1) {
                                var page = decode_data(record.webpagina.toLowerCase()).split('page.')[1];
                                if (isset(page)) {
                                    show_indicator();
                                    main_view.router.loadPage("pages/" + page + ".html");
                                }
                            } else {
                                app_browser( decode_data(record.webpagina), record.bericht , false );
                            }
                        });
                        $('.title', message_archieve_section).html(record.bericht + "<br>" + (new Date(record.ModifiedAt).toLocaleString()));

                        message_archieve_section.show().appendTo($('#document_listing'));
                    }
                });
            }

            $(".repeat_message_archieve:first").remove();

            $('#demo').jplist({
                itemsBox: '.list',
                itemPath: '.list-item',
                panelPath: '.jplist-panel'
            });
            $('.jplist-panel').fadeIn(200);
            hide_indicator();
        });
        
    } catch (e) {
        log('populate_messages_archieve()');
        log(e);
    }
}

function message_archieve() {
    try {
        fetch_record(db_tables.MESSAGE_ARCHIVE_TABLE, {}, 'Created at', function (data) {
            populate_messages_archieve(data.result);
        });
    } catch (e) {
        show_alert("Mijn Berichtenarchief");
        show_alert(e);
    }
}

// For Initial loading
message_archieve();