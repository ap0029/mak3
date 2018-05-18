try{
    var COLUMN_JSON = [
        {
        field: "id",
        title: "ID",
        hidden: true,
        width: "100px"
        },
        {
        field: "Date_Format_Text",
        title: "Datum",
        format: "{0:dd-MM-yyyy}",
        width: "30%"
        },
        {
        field: "afbeelding_url_txt",
        title: "url",
        hidden: true
        },
        {
        template: "<div class='customer-photo'" +
        "style='background-image: url(#: Document_Type_Image #);'></div>" +
        "<div class='customer-name'>#: name #</div>",
        field: "name",
        title: "Document",
        width: "70%",
        hidden:false
        },
        {
        field: "Document_Type_Image",
        title: "Foto url",
        hidden: true
        }
    ];
    function dm_review( ) {
		closeMask();
        forceAppendLoader();
        initGrid();
    }
    function initGrid() {
        fetchSessionId(function(sessionId){
            fetchDocs(sessionId,function(result){
                var jsonObj = [];
                $(result).find("resp").children().each(function(index){
                    var id = $(this).children().eq(0).text(),
                        Date_Format_Text = $(this).children().eq(1).text(),
                        name = $(this).children().eq(2).text(),
                        Document_Type_Image = $(this).children().eq(3).text(),
                        Status_Text = $(this).children().eq(5).text(),
                        afbeelding_url_txt = $(this).children().eq(4).text();
                    console.log('Status_Text: '+Status_Text);
                    if(Status_Text=='In behandeling'||Status_Text=='In progress'){
                        console.log('PASOK');
                        var jsonItem = {};
                        for (var j = 0; j < COLUMN_JSON.length; j++) {
                            if(COLUMN_JSON[j]['field']=="id") jsonItem[COLUMN_JSON[j]['field']] = id;
                            if(COLUMN_JSON[j]['field']=="Date_Format_Text") jsonItem[COLUMN_JSON[j]['field']] = Date_Format_Text;
                            if(COLUMN_JSON[j]['field']=="name") jsonItem[COLUMN_JSON[j]['field']] = name;
                            if(COLUMN_JSON[j]['field']=="Document_Type_Image") jsonItem[COLUMN_JSON[j]['field']] = Document_Type_Image;
                            if(COLUMN_JSON[j]['field']=="afbeelding_url_txt") jsonItem[COLUMN_JSON[j]['field']] = afbeelding_url_txt;
                        }
                        jsonObj.push(jsonItem);
                    }
                    console.log("---------------------------------------------------------------------");
                    console.log("0: "+$(this).children().eq(0).text());
                    console.log("1: "+$(this).children().eq(1).text());
                    console.log("2: "+$(this).children().eq(2).text());
                    console.log("3: "+$(this).children().eq(3).text());
                    console.log("4: "+$(this).children().eq(4).text());
                    console.log("5: "+$(this).children().eq(5).text());
                    console.log("---------------------------------------------------------------------");
                });
                console.log(jsonObj);
                customKendoGrid(jsonObj);
            });
        });
    }
        
    function customKendoGrid(data) {
        $("#dmreview_mobilecontainer").kendoGrid({
                columns: COLUMN_JSON,
                dataSource: new kendo.data.DataSource({
                    data: data,
                    sort: { field: "Date_Format_Text", dir: "desc" },
                    pageSize: 10
                }),
                selectable: "row",
                sortable: true,
                filterable: true,
                scrollable: true,
                dataBound:function(){
                    var grid = this;
                    $.each(grid.tbody.find('tr'),function(){
                        var model = grid.dataItem(this);
                        $('[data-uid='+model.uid+']').click(function(){
                            console.log("working event");
                            console.log($(this).children().first().text());
                            var docMap = {
                                id: parseInt($(this).children().first().text()),
                                url: $(this).children().eq(2).text()
                            }
                            localStorage.setItem("docid",parseInt($(this).children().first().text()));
                            localStorage.setItem("docname",$(this).children().eq(3).children().last().html());
                            onShow(0,docMap);
                        });
                });
                },
                pageable: {
                                refresh: true,
                                pageSize: 10,
                            },
                columnMenu: {
                    messages: {
                        done: "Klaar",
                        settings: "Kolom opties",
                        columns: "Kies kolom",
                        filter: "Gebruik filter",
                        sortAscending: "Sorteer (boven)",
                        sortDescending: "Sorteer (beneden)"
                    }
                },
                navigatable: true,
                height: $("div[data-page='dm_review']").height(),
                mobile: true
            });
        var gridElement = $("#dmreview_mobilecontainer");
        gridElement.data("kendoGrid").resize();
        $('.km-pane-wrapper .k-pager-wrap').css({
            'position': 'fixed',
            'width': '100%',
            'bottom': '0px'
        });
        var loader = setInterval( function ( ) {
            hide_indicator( );
            clearInterval( loader );
        }, 700 );
    }
    // for inital load
    dm_review( );

}catch(e){
    alert(JSON.stringify(e));
}