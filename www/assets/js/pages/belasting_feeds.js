function belasting_feeds() {

var belasting_feeds_data = {
 	Particulier: {"name":"Particulier","icon":"flaticon-file-2","catagory":"link","url":"http://apptomorrow.nl/rss2html/belastingrssparticulier.php"},
 	Zakelijk: {"name":"Zakelijk","icon":"flaticon-file-2","catagory":"link","url":"http://apptomorrow.nl/rss2html/belastingrsszakelijk.php"},
    }  

                var list_options = parse_list_options(belasting_feeds_data, 'name', 'url', '');
               populate_list_options(list_options, "" , $(".repeat-belasting_feeds:first") , $('#belasting_feeds_listing'));
                //bind_clicks( );

}
belasting_feeds();