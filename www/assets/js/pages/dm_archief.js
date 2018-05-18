try{
    var COLUMN_JSON3 = [
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
        width: "30%",
        filterable: {
                cell: {
                    enabled: false,
                    delay: 1500,
                    
                }
            }
        },
        {
        field: "afbeelding_url_txt",
        title: "url",
        hidden: true
        },
        {
        // template: "<div class='customer-photo'" +
        // "style='background-image: url(#: Document_Type_Image #);'></div>" +
        // "<div class='customer-name'>#: name #</div>",
        field: "name",
        title: "Document",
        width: "70%",
        hidden:false,
        filterable: {
                cell: {
                    suggestionOperator: "contains",
                    enabled: true,
                    delay: 200
            
                }
            }
        },
        {
        field: "Document_Type_Image",
        title: "Foto url",
        hidden: true
        }
    ];
    function dm_archief( ) {
        forceAppendLoader();
        closeMask();
        $('#pdfviewer_archief').attr('src','');
		initGridArchief();
    }

    function initGridArchief() {
        fetchSessionId(function(sessionId){
            fetchDocsArchief(sessionId,function(result){
                var jsonObj = [];
                $(result).find("resp").children().each(function(index){
                    var id = $(this).children().eq(0).text(),
                        Date_Format_Text = $(this).children().eq(1).text(),
                        name = $(this).children().eq(2).text(),
                        Document_Type_Image = $(this).children().eq(3).text(),
                        Status_Text = $(this).children().eq(5).text(),
                        afbeelding_url_txt = $(this).children().eq(4).text();
                    console.log('Status_Text: '+Status_Text);
                    if(Status_Text=='gearchiveerd'){
                        console.log('PASOK');
                        var jsonItem = {};
                        for (var j = 0; j < COLUMN_JSON3.length; j++) {
                            if(COLUMN_JSON3[j]['field']=="id") jsonItem[COLUMN_JSON3[j]['field']] = id;
                            if(COLUMN_JSON3[j]['field']=="Date_Format_Text") jsonItem[COLUMN_JSON3[j]['field']] = Date_Format_Text;
                            if(COLUMN_JSON3[j]['field']=="name") jsonItem[COLUMN_JSON3[j]['field']] = name;
                            if(COLUMN_JSON3[j]['field']=="Document_Type_Image") jsonItem[COLUMN_JSON3[j]['field']] = Document_Type_Image;
                            if(COLUMN_JSON3[j]['field']=="afbeelding_url_txt") jsonItem[COLUMN_JSON3[j]['field']] = afbeelding_url_txt;
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
                customKendoGridArchief(jsonObj);
            });
        });
    }

    function fetchDocsArchief(sessionId, callback){
        var query = encodeURI("SELECT id, Date_Format_Text, name, Document_Type_Image, afbeelding_url_txt, Status_Text FROM document1 WHERE R6465298 = "+GLOBAL_DOC_PROCESS);
        $.ajax({
            url: "http://cloudapps.services/rest/api/selectQuery?sessionId="+sessionId+"&query="+query+"&startRow=0&maxRows=20000",
            type: "GET",
            error: function(xhr){
                console.log('error');
                console.log(xhr.responseText);
            },
            success: function(xhr){
                if(typeof callback == 'function') callback(xhr);
            }
        });
    }

    function customKendoGridArchief(data) {
        $("#dmarchief_mobilecontainer").kendoGrid({
                columns: COLUMN_JSON3,
                filterable: {
                    mode: "row"
                },
                dataSource: new kendo.data.DataSource({
                    data: data,
                    sort: { field: "Date_Format_Text", dir: "desc" },
                    pageSize: 10
                }),
                selectable: "row",
                sortable: false,
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
                            onShow(1,docMap);
                        });
                    });
                },
                pageable: {
                                refresh: true,
                                pageSize: 10,
                            },
                navigatable: true,
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
                mobile: true
            });
        var gridElement = $("#dmarchief_mobilecontainer");
        gridElement.data("kendoGrid").resize();
        $('.km-pane-wrapper .k-pager-wrap').css({
            'position': 'fixed',
            'width': '100%',
            'bottom': '0px'
        });
        hideLoader();
    }

    function hideLoader(){
        var loader = setInterval( function ( ) {
            hide_indicator( );
            clearInterval( loader );
        }, 700 );
    }
    // for inital load
    dm_archief( );
}catch(e){
    alert(JSON.stringify(e));
}