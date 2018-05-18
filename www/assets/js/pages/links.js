function simple_document_listing() {
    var ready = 0;
    var list_items = [];
    try {
        if ($('#simple_document').data('document') == "recommendation") {
            fetch_record(db_tables.RECOMMENDATIONS_SORTING_TABLE, { type: 'single', where: [{ type: 'none', clauses: [{ action: '=', clause: { column: 'hide_listitem', value: false } },] }] }, 'volgorde_nummer', function (data) {
                if (isset(data.result)) {
                    $.each(data.result, function (i, row) {
                        var item = { 
                            name: row.list_item_naam, 
                            icon: row.icon, 
                            catagory: row.category, 
                            url: row.link
                        };
                        list_items.push(item);
                    });
                    var list_options = parse_list_options(list_items, 'name', 'url', '');
                    populate_list_options(list_options, "", $(".repeat-document:first"), $('#document_listing'));
                    bind_clicks();
                }
                ready++;
            });
        } else if ($('#simple_document').data('document') == "social_media") {
            fetch_record(db_tables.SOCIALS_SORTING_TABLE, { type: 'single', where: [{ type: 'none', clauses: [{ action: '=', clause: { column: 'hide_listitem', value: false } },] }] }, 'volgorde_nummer', function (data) {
                if (isset(data.result)) {
                    $.each(data.result, function (i, row) {
                        var item = { 
                            name: row.list_item_naam, 
                            icon: row.icon, 
                            catagory: row.category, 
                            url: row.link
                        };
                        list_items.push(item);
                    });
                    var list_options = parse_list_options(list_items, 'name', 'url', '');
                    populate_list_options(list_options, "", $(".repeat-document:first"), $('#document_listing'));
                    bind_clicks();
                }
                ready++;
            });
        } else if ($('#simple_document').data('document') == "login") {
            fetch_record(db_tables.LOGINS_SORTING_TABLE, { type: 'single', where: [{ type: 'none', clauses: [{ action: '=', clause: { column: 'hide_listitem', value: false } },] }] }, 'volgorde_nummer', function (data) {
                if (isset(data.result)) {
                    $.each(data.result, function (i, row) {
                        var item = { 
                            name: row.list_item_naam, 
                            icon: row.icon, 
                            catagory: row.category, 
                            url: row.link
                        };
                        list_items.push(item);
                    });
                    var list_options = parse_list_options(list_items, 'name', 'url', '');
                    populate_list_options(list_options, "", $(".repeat-document:first"), $('#document_listing'));
                    bind_clicks();
                }
                ready++;
            });
        } else if ($('#simple_document').data('document') == "youtube_videos") {
            var gallary = "";
            if (app_name.toLowerCase() == 'notaris') {
                gallary = ".accordion-item-content ul";
                $('[data-type="single"]').remove();
                fetch_record(db_tables.VIDEOS_SORTING_TABLE, { type: 'single', where: [{ type: 'none', clauses: [{ action: '=', clause: { column: 'video_type', value: $_GET('type') } },] }] }, 'volgorde_nummer', function (data) {
                    if (isset(data.result)) {
                        var list_options = {};
                        $.each(data.result, function (i, row) {
                            var prnt = row.parent;
                            var group = [];
                            $.each(data.result, function (i, row1) {
                                if(row1.parent == prnt){
                                    var item = {
                                        name: row1.list_item_naam,
                                        icon: row1.icon,
                                        catagory: row1.category,
                                        url: row1.link
                                    };
                                    group.push(item);
                                }
                            });
                            list_options[row.parent] = group;
                        });
                        $.each(list_options, function (i, row) {
                            list_options[i] = parse_list_options(row, 'name', 'url', '');
                        });
                        console.log(list_options);
                        populate_group_options(list_options, "video", $(".repeat-document:first"), $(".sub-list:first"), $('#document_listing'));
                        $(".repeat-document:first").remove();
                        $(gallary).lightGallery({
                        fullScreen: false,
                            zoom: false,
                            download: false,
                            thumbnail: false,
                            autoplayControls: false,
                            animateThumb: false,
                            loadYoutubeThumbnail: false,
                            youtubePlayerParams: { rel: 0 }
                        });
                    }
                });
            } else {
                gallary = "ul#document_listing";
                $('[data-type="multiple"]').remove();
                fetch_record(db_tables.VIDEOS_SORTING_TABLE, { type: 'single', where: [{ type: 'none', clauses: [{ action: '=', clause: { column: 'hide_listitem', value: false } },] }] }, 'volgorde_nummer', function (data) {
                    if (isset(data.result)) {
                        $.each(data.result, function (i, row) {
                            var item = { 
                                name: row.list_item_naam, 
                                icon: row.icon, 
                                catagory: row.category, 
                                url: row.link
                            };
                            list_items.push(item);
                        });
                        var list_options = parse_list_options(list_items, 'name', 'url', '');
                        populate_list_options(list_options, "video", $(".repeat-document:first"), $('#document_listing'));
                        $(".repeat-document:first").remove();
                        $(gallary).lightGallery({
                        fullScreen: false,
                            zoom: false,
                            download: false,
                            thumbnail: false,
                            autoplayControls: false,
                            animateThumb: false,
                            loadYoutubeThumbnail: false,
                            youtubePlayerParams: { rel: 0 }
                        });
                    }
                });
            }
            
            ready++;
        }
    } catch (e) {
        log("List Data");
        log(e);
    }
    var loader = setInterval(function () {
        if (ready > 0) {
            hide_indicator();
            clearInterval(loader);
        }
    }, 700);
}
// for initial load
simple_document_listing();