function kennisbank_auto_fiscus_listing() {
    
    var list_options = parse_list_options(kennisbanken, 'name', 'url', '');
    populate_list_options(list_options, "", $(".repeat-kennisbank:first") , $('#kennisbank_auto_fiscus_listing'));
    hide_indicator();
}

// for initial load
kennisbank_auto_fiscus_listing();