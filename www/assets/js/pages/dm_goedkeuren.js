try{
    var COLUMN_JSON2 = [
        {
        field: "id",
        title: "ID",
        hidden: true,
        width: "100px"
        },
        {
        field: "Date_Time_Text",
        title: "Datum",
        format: "{0:dd-MM-yyyy}",
        width: "30%"
        },
        {
        template: "<div class='customer-photo'" +
        "style='background-image: url(#: Document_Type_Image #);'></div>" +
        "<div class='customer-name'>#: Document_name #</div>",
        field: "Document_name",
        title: "Document",
        width: "40%",
        hidden:false
        },
        {
        field: "signatoryName",
        title: "Ondertekenaar",
        width: "30%",
        hidden: false
        },
        {
        field: "Signing_Status_Text",
        title: "status",
        hidden: true
        },
        {
        field: "Document_Type_Image",
        title: "Foto url",
        hidden: true
        },
        {
        field: "url",
        title: "url",
        hidden: true
        }
    ];
    function dm_goedkeuren( ) {
		closeMask();
		$('#main_goedkeuren').css('height',$('#dmgoedkeuren_mobilecontainer').height()-50+'px');
		$('#view-grid').css('height',$('#dmgoedkeuren_mobilecontainer').height()-50+'px');
        forceAppendLoader();
        initGridGoedkeuren();
    }
    
    function initGridGoedkeuren() {
        fetchSessionId(function(sessionId){
            fetchDocsGoedkeuren(sessionId,function(result){
                var jsonObj = [];////id, Date_Time_Text, Document_name, signatoryName, Signing_Status_Text, Document_Type_Image, url
                $(result).find("resp").children().each(function(index){
                    var id = $(this).children().eq(0).text(),
                        Date_Time_Text = $(this).children().eq(1).text(),
                        Document_name = $(this).children().eq(2).text(),
                        signatoryName = $(this).children().eq(3).text(),
                        Signing_Status_Text = $(this).children().eq(4).text(),
                        Document_Type_Image = $(this).children().eq(5).text(),
                        url = $(this).children().eq(6).text();
                    console.log('Document_Type_Image: '+Document_Type_Image);
                    if(Signing_Status_Text=='INVITED'||Signing_Status_Text=='VISITED'||Signing_Status_Text=='VIEWED_DOCUMENT'){
                        console.log('PASOK');
                        var jsonItem = {};
                        for (var j = 0; j < COLUMN_JSON2.length; j++) {
                            if(COLUMN_JSON2[j]['field']=="id") jsonItem[COLUMN_JSON2[j]['field']] = id;
                            if(COLUMN_JSON2[j]['field']=="Date_Time_Text") jsonItem[COLUMN_JSON2[j]['field']] = Date_Time_Text;
                            if(COLUMN_JSON2[j]['field']=="Document_name") jsonItem[COLUMN_JSON2[j]['field']] = Document_name;
                            if(COLUMN_JSON2[j]['field']=="signatoryName") jsonItem[COLUMN_JSON2[j]['field']] = signatoryName;
                            if(COLUMN_JSON2[j]['field']=="Signing_Status_Text") jsonItem[COLUMN_JSON2[j]['field']] = Signing_Status_Text;
                            if(COLUMN_JSON2[j]['field']=="Document_Type_Image") jsonItem[COLUMN_JSON2[j]['field']] = Document_Type_Image;
                            if(COLUMN_JSON2[j]['field']=="url") jsonItem[COLUMN_JSON2[j]['field']] = url;
                        }
                        jsonObj.push(jsonItem);
                    }
                    console.log("---------------------------------------------------------------------");
                    console.log("0: "+$(this).children().eq(0).text());
                    console.log("1: "+$(this).children().eq(1).text());
                    console.log("2: "+$(this).children().eq(2).text());
                    console.log("3: "+$(this).children().eq(3).text());
                    console.log("4: "+$(this).children().eq(4).text());
                    console.log("---------------------------------------------------------------------");
                });
                console.log(jsonObj);
                customKendoGridGoedkeuren(jsonObj);
            });
        });
    }
    
    function customKendoGridGoedkeuren(data) { 
        $("#dmgoedkeuren_mobilecontainer").kendoGrid({
                columns: COLUMN_JSON2,
                dataSource: new kendo.data.DataSource({
                    data: data,
                    sort: { field: "Date_Time_Text", dir: "desc" },
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
                                url: $(this).children().last().text()
                            }
                            var externalurl = $(this).children().last().text();
                            var titel = $(this).text();
                            titel= titel.replace(",", " &");
                            function rgb2hex(rgb) {
                                rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
                                return (rgb && rgb.length === 4) ? "#" + ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
                            }
                            var headerColor = $('.navbar .navbar-inner').css("color");
                            var headerBgColor = $('.navbar').css("background-color");
                            var hexheaderColor = rgb2hex(headerColor);
                            var hexheaderBgColor = rgb2hex(headerBgColor);
                            var parameters = "EnableViewPortScale=yes,fj_navigationbar=yes,fj_title=Document Manager,fj_titlecolor=" + hexheaderColor + ",fj_barcolor=" + hexheaderBgColor;
                            if (device.platform == 'iOS') { window.open(externalurl, '_system', parameters);} else {window.open(externalurl, '_system', parameters); }
                        });
                });
                },
                pageable: {
                                refresh: true,
                                pageSize: 10,
                            },
                navigatable: true,
                height: window.screen.height - 90,
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
        var gridElement = $("#dmgoedkeuren_mobilecontainer");
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
    dm_goedkeuren( );

}catch(e){
    alert(JSON.stringify(e));
}