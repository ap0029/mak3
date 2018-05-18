function belastingfeeds_particulier(){
    obj = ""; // Retrieve data from XML
    for (var i = 0; i < obj.length; i++) {
        record = obj.result[i];
        var news_id = record.Id;
        var heading = record.title;
        var date = record.date_time;
        var link = record.link;
        var content = record.description.substring(0, 80) + "...";
    }

}