function forms() {
                var list_options = parse_list_options(forms_data, 'name', 'url', '');
               populate_list_options(list_options, "" , $(".repeat-forms:first") , $('#forms_listing'));
                //bind_clicks( );

}
forms();