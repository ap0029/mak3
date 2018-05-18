function createnotes( ) {
    forceAppendLoader();
    initDrawing();
}
var surface, pathCollection = [], 
    erasedPath=[], eraserMode=false, 
    geom = kendo.geometry, draw = kendo.drawing, 
    group = new draw.Group(), heightTimer;
function initDrawing(){
    $("#surface").kendoTouch({ 
        dragstart: function(e){
            var touch = e.touch;
            var xAxis = touch.x;
            var yAxis = touch.y;
            var path = new draw.Path({
                stroke: {
                    color: ( eraserMode?"#ffffff":"#000000" ),
                    width: ( eraserMode?6:2 )
                }
            });
            pathCollection.push(path);
            console.log(xAxis.location);
            console.log(yAxis.location);
            pathCollection[pathCollection.length-1].moveTo(xAxis.location-25, yAxis.location-125);
        },
        drag: function (e) {
            var touch = e.touch;
            var xAxis = touch.x;
            var yAxis = touch.y;
            console.log(xAxis.location);
            console.log(yAxis.location);
            pathCollection[pathCollection.length-1].lineTo(xAxis.location-25, yAxis.location-125);
            surface.draw(pathCollection[pathCollection.length-1]);
        },
        dragend: function (e) {
            group.append(pathCollection[pathCollection.length-1]);
        }
    });
    surface = draw.Surface.create($("#surface"));
    // Create the square border by drawing a straight path
    setTimeout(function(){
        console.log('height: '+String( $('#createnotes .page-content').height()-$('#createnotes .navbar').height() ));
        $("#surface svg").css('height',( ($('#createnotes .page-content').height()-$('#createnotes .navbar').height())+5 )+'px');
        $("#surface svg").css('width', String($('#createnotes .page-content').width()-2) );
    },1000);
    hideLoader();
}	
function emailCanvas(){
    main_view.router.loadPage("pages/assufree/mijn_schademelder.html");
    group.options.set("pdf", {
        paperSize: "A4",
        margin: {
            left   : "10mm",
            top    : "10mm",
            right  : "10mm",
            bottom : "10mm"
        }
    });
    draw.pdf.toDataURL(group, function(dataURL){
        console.log(dataURL);
        window.plugins.socialsharing.shareViaEmail(
            '',
            'Handgeschreven notitie',
            null, // TO: must be null or an array
            null, // CC: must be null or an array
            null, // BCC: must be null or an array
            dataURL, // FILES: null, a string, or an array
            function(result){
            }, // called when email was sent or canceled, no way to differentiate
            function(result){
            } // called when something unexpected happened
        );
    });
}
function clearAll(){
    surface.clear();
    pathCollection=[]; 
    erasedPath=[];
    group = new draw.Group();
}
function eraseMode(){
    $('.tlb-btn.active').removeClass('active');
    $('#bteraser').addClass('active');
    eraserMode=true;
}
function drawingMode(){
    $('.tlb-btn.active').removeClass('active');
    $('#btpencil').addClass('active');
    eraserMode=false;
}
// for initial load
createnotes( );
