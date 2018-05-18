function documenten_listing() {
    
    var list_options = parse_list_options(documenten, 'name', 'url', '');
    populate_list_options(list_options, "", $(".repeat-documenten:first") , $('#documenten_listing'));
    hide_indicator();
}

// for initial load
documenten_listing();