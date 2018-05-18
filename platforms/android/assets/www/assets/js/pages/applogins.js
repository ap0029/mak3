function applogins() {
//    $('body').find('#applogins_listing').html(apploginlinks);


                var list_options = parse_list_options(apploginlinks_data, 'name', 'url', '');
               populate_list_options(list_options, "" , $(".repeat-applogins:first") , $('#applogins_listing'));
                //bind_clicks( );

}
applogins();