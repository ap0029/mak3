var imagePicker = window.imagePicker;
console.log("imagePicker: "+window.imagePicker);
function schademelder() {
    var columns = [];
        var rows = [];
        var geoloc = [];
        var pics = 0;
        updateUserData( function() {
				console.log('updateUserData');
				console.log( (String( get_global_var( global_vars.USER_DATA ) )!=="") );
				console.log( (String( get_global_var( global_vars.USER_DATA ) )!=="") );
				if( String( get_global_var( global_vars.USER_DATA ) )!=="" && String( get_global_var( global_vars.USER_DATA ) )!=="" ) {
					var current_user_data = JSON.parse( get_global_var( global_vars.USER_DATA ) );
					console.log("current_user_data: " + current_user_data);
					$( "#name" ).val( decode_data( current_user_data.contact ) );
					$( "#email" ).val( decode_data( current_user_data.email ) );
					$( "#house_number" ).val( decode_data( current_user_data.huisnummer ) );
					$( "#postcode" ).val( decode_data( current_user_data.postcode ) );
					$( "#phone" ).val( decode_data( current_user_data.phone ) );
					$( "#company" ).val( decode_data( current_user_data.company ) );
				}
			} );

        $('#cell').on('click', function () {
            var contacts = [
                { text: 'Soort schade', label: true },
                { text: 'Aansprakelijkeid', bold: true , onClick: function(){
                    $('#cell').text("Aansprakelijkeid");
                    $("#kenteken").hide();
                }},
                { text: 'Auto', bold: true , onClick: function(){
                    $('#cell').text("Auto");
                    $("#kenteken").show();
                }},
                { text: 'Inboedel', bold: true , onClick: function(){
                    $('#cell').text("Inboedel");
                    $("#kenteken").hide();
                }},
                { text: 'Rechtsbijstand', bold: true , onClick: function(){
                    $('#cell').text("Rechtsbijstand");
                    $("#kenteken").hide();
                }},
                { text: 'Woonhuis', bold: true , onClick: function(){
                    $('#cell').text("Woonhuis");
                    $("#kenteken").hide();
                }},
            ];
            var cancel = [ { text: 'Cancel', color: 'red' }];
            main_app.actions([contacts, cancel]);
        });

        var calendarDefault = main_app.calendar({
            input: '#calendar-default',
            dateFormat: 'dd-mm-yyyy',
            closeOnSelect: true,
        });

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10)
            dd = '0' + dd;
        if (mm < 10)
            mm = '0' + mm;
        today = yyyy + '-' + mm + '-' + dd;
        $("#calendar-default").val(today);

        function get_location(callback){
            try{
                navigator.geolocation.getCurrentPosition(
                function (position) {
                    geoloc[0] = position.coords.latitude;
                    geoloc[1] = position.coords.longitude;
                    callback();
                },
                function (error) {
                    geoloc[0] = null;
                    callback();
                    //alert('code: ' + error.code + message: ' + error.message + '\n');
                },
                { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
            }
            catch(e){
                alert(e);
            }
        }

        hide_indicator();
        $( "#step3" ).off( 'click' ).on( 'click', function () {
            $("#canvas").removeClass("no").addClass("yes");
            $("#drawingMode").addClass("active_button_notes");
            $("#eraseMode").removeClass("active_button_notes");
            $("#main-content").hide();
            $("#canvas").show();
            initDrawing();
            $(".preloader-indicator-overlay, .preloader-indicator-modal").show();
            $('.navbar').hide();
            $('.mnavbar').show();
            $('#schademelder-link').click(function(){
                $("#canvas").addClass("no").removeClass("yes");
                $("#drawingMode").removeClass("active_button_notes");
                $("#eraseMode").addClass("active_button_notes");
                $("#main-content").show();
                $("#canvas").hide();
                $('.navbar').show();
                $('.mnavbar').hide();
                draw.exportImage(group, { width: "300px", height: "450px" }).done(function (data) {
                    $("#canvas").removeClass("yes").addClass("no");
                    $('#main-content').show();
                    $('#view-surface').focus();
                    $('#canvas').hide();
                    localStorage.setItem("canvasData",data);
                    if(data){
                        $('#view-surface').html("<img src='"+data+"' />");
                    }
                });
            });
            //var canvas_height = parseInt( $('body').css('height').replace('px', '') ) - ( parseInt( $('.navbar').css('height').replace('px', '') ) + parseInt( $('#toolbar').css('height').replace('px', '') ) );
                var canvas_height = parseInt( $('body').css('height').replace('px', '') );
                if ( is_numeric( canvas_height ) && canvas_height > 0 ) {
                    $('.create_notes').css({
                        'height': canvas_height + 'px',
                        'z-index':'999999999999'
                    });
                }
                $(".preloader-indicator-overlay, .preloader-indicator-modal").hide();
        });
        //=========================================================================================
        //================================ Event Listeners ========================================
        //=========================================================================================

        var galary_config = {
            maximumImagesCount: 3,
            quality: 20,
            outputType: imagePicker.OutputType.BASE64_STRING
        }

        function on_galary_success( image_data ) {
            $('#initialImage').remove();
            for (var i = 0; i < image_data.length; i++) {
                pics++;
                var record_section = $(".repeat-image:first").clone();
                $('a', record_section).off('click').on('click', function(){
                    pics--;
                    $(this).closest('.posRelative').remove();
                    if( pics == 0 ){ //$("#image_listing  > div").length
                        $('#image_listing').html('<div class="col-100" id="home-logo"><img width="100%" height="100%" src="assets/images/logo-AssuFree.png" /></div><br>' +
                        '<div id="initialImage" class="col-100 repeat-image"> '+
                        '<div style="" class="pRelative">'+
                            '<img width="100%" height="100%" src="assets/images/logo.png" />'+
                        '</div>'+
                        '<div style="display:none" class="col-100 repeat-image"><div class="posRelative">' +
                        '<a href="javascript:void(0)" class="closeIconTop"><i class="fa fa-2x fa-times-circle-o"></i></a><img width="100%" height="100%" src="assets/images/logo-AssuFree.png" /></div></div>');
                    }
                });
                $('#home-logo').hide();
                $('img', record_section).attr('src', "data:image/jpeg;base64," + image_data[i]);
                record_section.show().appendTo($('#image_listing'));
            }
            hide_indicator();
            $('#select_foto').css('display', 'block !important');
        }

        var camera_config = {
            destinationType: Camera.DestinationType.DATA_URL,
            targetWidth: 400,
            targetHeight: 300
        };

        function on_capture_success( image_data ) {
            $('#initialImage').remove();
            pics++;
            var record_section = $(".repeat-image:first").clone();
            $('a', record_section).off('click').on('click', function(){
                pics--;
                $(this).closest('.posRelative').remove();
                if( pics == 0 ){ //$("#image_listing  > div").length
                    $('#image_listing').html('<div class="col-100" id="home-logo"><img width="100%" height="100%" src="assets/images/logo-AssuFree.png" /></div><br>' +
                    '<div id="initialImage" class="col-100 repeat-image"> '+
                        '<div style="" class="pRelative">'+
                            '<img width="100%" height="100%" src="assets/images/logo.png" />'+
                        '</div>'+
                    '</div><div style="display:none" class="col-100 repeat-image"><div class="posRelative">' +
                    '<a href="javascript:void(0)" class="closeIconTop"><i class="fa fa-2x fa-times-circle-o"></i></a><img width="100%" height="100%" src="assets/images/logo-AssuFree.png" /></div></div>');
                }
            });
            $('#home-logo').hide();
            $('img', record_section).attr('src', "data:image/jpeg;base64," + image_data);
            record_section.show().appendTo($('#image_listing'));
            hide_indicator();
            //$('#select_foto').css('display', 'block !important');
        }

        function on_capture_error() {
            show_alert("Unfortunately we were not able to retrieve the image");
            hide_indicator();
        }

        function get_pdf_from_photo(my_document) {
            return my_document.attr('src');
        }

        function get_attachment_images() {
            var images = [];
            $('.repeat-image:visible').each(function () {
                images.push($('img', $(this)).attr("src"));
            });

            return images;
        }

        function get_every_pdf() {
            var all_attached_images = [];
            try {
                
                var count = 1;
                $('.repeat-image:visible').each(function () {
                    var doc = new jsPDF();
                    doc.addImage($('img', $(this)).attr('src').replace(/[\s"\\]/gm,""), 'JPEG', 25, 6.5, 160, 284);
                    if (count < $('.repeat-image:visible img').length) {
                        all_attached_images.push(doc.output('datauristring', 'testtest.pdf'));
                    }
                    count++;
                });
                if(count == 1) 
                    return null;
                else
                    return all_attached_images;
            } catch (e) {
                log(e);
                return null;
            }
        }

        function get_pdf() {
            try {
                var doc = new jsPDF();
                var count = 1;
                $('.repeat-image:visible').each(function () {
                    doc.addImage($('img', $(this)).attr('src').replace(/[\s"\\]/gm,""), 'JPEG', 25, 6.5, 160, 284);
                    if (count < $('.repeat-image:visible img').length) {
                        doc.addPage();
                    }
                    count++;
                });
                if(count == 1) 
                    return null;
                else
                    return doc.output('datauristring', 'testtest.pdf');
            } catch (e) {
                alert("get_pdf");
                alert(e);
                return null;
            }
        }
        function get_canvas_pdf() {
            try {
                var doc = new jsPDF('p', 'pt');
                doc.autoTable(columns, rows, {
                    styles: { },
                    columnStyles: { },
                    margin: {top: 60},
                    addPageContent: function(data) {
                        doc.addImage($('img', $("#view-surface")).attr('src'), 'PNG', 275, 300);
                    }
                });
                return doc.output('datauristring', 'testtest.pdf');
            } catch (e) {
                log(e);
                return null;
            }
        }

        $( "#step2" ).off( 'click' ).on( 'click', function () {
            
            try{
                var testPictureSheetOptions = {
                'androidTheme': window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT,
                'title': 'Schade foto',
                'buttonLabels': ['Maak foto', 'Kies uit bibliotheek'],
                'androidEnableCancelButton': true,
                'winphoneEnableCancelButton': true,
                'addCancelButtonWithLabel': 'Annuleren',
                'position': [20, 40] // for iPad pass in the [x, y] position of the popover
            };
            var actionListPictureResult = function (buttonIndex) {
                switch (buttonIndex - 1) {
                    case 0://Maak foto
                        main_app.showIndicator();
                        navigator.camera.getPicture( on_capture_success, on_capture_error, camera_config );
                        break;
                    case 1://Kies uit bib
                        main_app.showIndicator();
                        imagePicker.getPictures( on_galary_success, on_capture_error, galary_config );
                        break;
                    default:
                        return;
                }
            }
            window.plugins.actionsheet.show(testPictureSheetOptions, actionListPictureResult);
            }catch(e){alert(e);}
        } );

        $( "#step4" ).off( 'click' ).on( 'click', function () {
            if( $( "#name" ).val() == "" ||
				$( "#email" ).val() == "" ||
				$( "#house_number" ).val() == "" ||
				$( "#postcode" ).val() == "" ||
				$( "#phone" ).val() == "" ){
				show_alert( messages.REQUIRED_FIELDS );
			}else{
                show_indicator();
                var name = isset( $( "#name" ).val() ) && $( "#name" ).val() ? $( "#name" ).val() : '';
                var email = isset( $( "#email" ).val() ) && $( "#email" ).val() ? $( "#email" ).val() : '';
                var phone = isset( $( "#phone" ).val() ) && $( "#phone" ).val() ? $( "#phone" ).val() : '';
                var house_number = isset( $( "#house_number" ).val() ) && $( "#house_number" ).val() ? $( "#house_number" ).val() : '';
                var postcode = isset( $( "#postcode" ).val() ) && $( "#postcode" ).val() ? $( "#postcode" ).val() : '';
                var police_number = isset( $( "#police_number" ).val() ) && $( "#police_number" ).val() ? $( "#police_number" ).val() : '';
                var damage_type = isset( $( "#cell" ).text() ) && $( "#cell" ).text() ? $( "#cell" ).text() : '';
                var damage_report = isset( $( "#damage_report" ).val() ) && $( "#damage_report" ).val() ? $( "#damage_report" ).val() : '';
                var date = isset( $( "#calendar-default" ).val() ) && $( "#calendar-default" ).val() ? $( "#calendar-default" ).val() : '';
                var explaination = isset( $( "#explaination" ).val() ) && $( "#explaination" ).val() ? $( "#explaination" ).val() : '';
                var license_plate = isset( $( "#license_plate" ).val() ) && $( "#license_plate" ).val() ? $( "#license_plate" ).val() : '';
                var geoTd = '';

                if ( $( 'input[name="geolocation"]' ).is( ':checked' ) ) {
                    get_location(function(){
                        if(geoloc[0] == null){
                            hide_indicator();
                            show_alert("Graag locatievoorzieningen inschakelen");
                        } else {
                            geoTd = 'http://maps.google.com/maps?t=h&q=loc:' + geoloc[0] + ',' + geoloc[1] + '&z=17';
                            sending_email();
                        }
                    });
                }
                else{
                    geoTd = '';
                    sending_email();
                }

                function sending_email(){
                    hide_indicator();
                    if ( validate( name ) && validate_email( email ) ) {
                        createPdfTable(function(message, pdf_attachments){
                            var subject = "Schade";
                            var reciever = get_app_settings()['emailnotification'];
                            
                            if( $("#drawing-foto").children().length > 0 ){
                                get_canvas_pdf() == null ? pdf_attachments = pdf_attachments : pdf_attachments.push(get_canvas_pdf()); 
                            }
                            
                            //Email with attachments
                            window.plugins.socialsharing.shareViaEmail(
                                message, subject, [ reciever ], null, null, pdf_attachments,
                                function () {
                                    //$( '#home-logo' ).show();
                                    $('#image_listing').html('<div class="col-100" id="home-logo"><img width="100%" height="100%" src="assets/images/logo-AssuFree.png" /></div><br>' +
                                        '<div id="initialImage" class="col-100 repeat-image"> '+
                                        '<div style="" class="pRelative">'+
                                            '<img width="100%" height="100%" src="assets/images/logo.png" />'+
                                        '</div>'+
                                        '<div style="display:none" class="col-100 repeat-image"><div class="posRelative">' +
                                        '<a href="javascript:void(0)" class="closeIconTop"><i class="fa fa-2x fa-times-circle-o"></i></a><img width="100%" height="100%" src="assets/images/logo-AssuFree.png" /></div></div>');
                                    $( ".repeat-image" ).html( '<img width="100%" height="100%" src="" />' );
                                    $( ".repeat-image" ).hide();
                                    localStorage.setItem("canvasData","");
                                    $("#view-surface").html("");
                                },
                                function ( exception ) {
                                    alert( "Error = " + exception );
                                }
                            );
                        });

                    }else {
                        show_alert( messages.FORMALERT_TEXT );
                    }
                }

                function getSignatureData(){
                    if( $('img', $("#view-surface")).attr('src') != "" ){
                        return $('img', $("#view-surface")).attr('src');
                    }
                }

                function createPdfTable(callback){
                    var attachments = [];
                    var msg = '<b>Naam:</b> ' + name +
                        '<br/><b>Huisnummer:</b> ' + house_number +
                        '<br/><b>Postcode:</b> ' + postcode +
                        '<br/><b>Email:</b> ' + email +
                        '<br/><b>Telefoon:</b> ' + phone +
                        '<br/><b>Soort schade:</b> ' + damage_type +
                        '<br/><b>Polisnummer:</b> ' + police_number +
                        '<br/><b>Kenteken:</b> ' + license_plate +
                        '<br/><b>Schadedatum:</b> ' + date +
                        '<br/><b>Schademelding:</b> ' + damage_report +
                        '<br/><b>Toelichting:</b> ' + explaination + '<br/>' + geoTd;
                    columns = [
                        {title: "Name", dataKey: "col1"}, 
                        {title: name , dataKey: "col2"}
                    ];
                    rows = [
                        {"col1": "Huisnummer", "col2": house_number },
                        {"col1": "Postcode", "col2": postcode },
                        {"col1": "Email", "col2": email },
                        {"col1": "Telefoon", "col2": phone },
                        {"col1": "Soort schade", "col2": damage_type },
                        {"col1": "Polisnummer", "col2": police_number },
                        {"col1": "Schadedatum", "col2": date },
                        {"col1": "Kenteken", "col2": license_plate },
                        {"col1": "Schademelding", "col2": damage_report },
                        {"col1": "Toelichting", "col2": explaination },
                        {"col1": "Plaats", "col2": geoTd },
                    ];
                    try{
                        var containerForPdf = '<div class="pdf-container"></div>';
                        var tableToCreate = '<table id="basic-table" style="display: none;">' +
                            '<tbody>' +
                            '<tr>' +
                            '<td>Naam</td>' +
                            '<td>' + name + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Huisnummer</td>' +
                            '<td><p style="color:#000">' + house_number + '</p></td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Postcode</td>' +
                            '<td>' + postcode + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Email</td>' +
                            '<td>' + email + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Telefoon</td>' +
                            '<td>' + phone + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Soort schade</td>' +
                            '<td>' + damage_type + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Polisnummer</td>' +
                            '<td>' + police_number + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Schadedatum</td>' +
                            '<td>' + date + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Schademelding</td>' +
                            '<td>' + damage_report + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Kenteken</td>' +
                            '<td>' + license_plate + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Toelichting</td>' +
                            '<td>' + explaination + '</td>' +
                            '</tr>'+geoTd +
                            '<tr>' +
                            '<td>Handtekening</td>' +
                            '<td></td>' +
                            '</tr>'
                            '</tbody>' +
                            '</table>';
                        var signatureData = localStorage.getItem("canvasData");
                        $('#MailFoto_mobilegridcell_8').append(containerForPdf);
                        $('.pdf-container').append(tableToCreate);
                        var doc = new jsPDF('p', 'pt');
                        var res = doc.autoTableHtmlToJson( document.getElementById("basic-table") );
                        if(signatureData!="") doc.addImage(signatureData, 'PNG', 275, 300);
                        var options = {
                            margin: {
                                top: 15
                            }
                            //startY: doc.autoTableEndPosY() + 5
                        };
                        doc.autoTable(res.columns, res.data, options);
                        var data = doc.output('datauristring', 'testtest.pdf');
                        if( $(".repeat-image").children().length > 0 ){
                            get_pdf() == null ? attachments = attachments : attachments.push(get_pdf());
                        }
                    }catch(e){
                        alert('attachment error');
                        alert(e);
                    }
                    //attachments.push(data);
                    callback(msg, attachments);
                }

            }
        });

        //========================================================
        //================== CREATE NOTES ========================
        //========================================================

        var surface, pathCollection = [], path,
        erasedPath = [], eraserMode = false,
        geom = kendo.geometry, draw = kendo.drawing,
        group = new draw.Group(), heightTimer;

        function initDrawing() {
            $("#surface").kendoTouch({
                dragstart: function (e) {
                    var touch = e.touch;
                    var xAxis = touch.x;
                    var yAxis = touch.y;
                    var path = new draw.Path({
                        stroke: {
                            color: (eraserMode ? "#ffffff" : "#000000"),
                            width: (eraserMode ? 6 : 2)
                        }
                    });
                    pathCollection.push(path);
                    console.log(xAxis.location);
                    console.log(yAxis.location);
                    pathCollection[pathCollection.length - 1].moveTo(xAxis.location - 25, yAxis.location - 125);
                },
                drag: function (e) {
                    var touch = e.touch;
                    var xAxis = touch.x;
                    var yAxis = touch.y;
                    console.log(xAxis.location);
                    console.log(yAxis.location);
                    pathCollection[pathCollection.length - 1].lineTo(xAxis.location - 25, yAxis.location - 125);
                    surface.draw(pathCollection[pathCollection.length - 1]);
                },
                dragend: function (e) {
                    group.append(pathCollection[pathCollection.length - 1]);
                }
            });
            surface = draw.Surface.create($("#surface"));
            // Create the square border by drawing a straight path
            /*
            setTimeout(function () {
                $("#surface svg").css('height', (($('#canvas').height() - $('.navbar').height()) - 42) + 'px');
            }, 1000);
            */
        }

        $("#clearMode").on('click', function(){
            // $(this).addClass("active_button_notes");
            show_indicator();
            setTimeout(function() {
                surface.clear();
                pathCollection = [];
                erasedPath = [];
                group = new draw.Group();
                hide_indicator();
            }, 1000);
        });
        $("#eraseMode").on('click', function(){
            $("#drawingMode").removeClass("active_button_notes");
            $(this).addClass("active_button_notes");
            $('.tlb-btn.active').removeClass('active');
            $('#bteraser').addClass('active');
            eraserMode = true;
        });
        $("#drawingMode").on('click', function(){
            $("#eraseMode").removeClass("active_button_notes");
            $(this).addClass("active_button_notes");
            $('.tlb-btn.active').removeClass('active');
            $('#btpencil').addClass('active');
            eraserMode = false;
        });
        $("#saveMode").on('click', function(){
            $('#main-content').show(); 
            $('#canvas').hide(); 
            $('#view-surface').html($('#surface').html());
        });
        
        $("#emailCanvas").on('click', function(){
            $("#canvas").addClass("no").removeClass("yes");
                $("#drawingMode").removeClass("active_button_notes");
                $("#eraseMode").addClass("active_button_notes");
                $("#main-content").show();
                $("#canvas").hide();
                $('.navbar').show();
                $('.mnavbar').hide();
            draw.exportImage(group, { width: "300px", height: "450px" }).done(function (data) {
                $("#canvas").removeClass("yes").addClass("no");
                $('#main-content').show();
                $('#view-surface').focus();
                $('#canvas').hide();
                localStorage.setItem("canvasData",data);
                if(data){
                    $('#view-surface').html("<img src='"+data+"' />");
                }
            });
        });

}

// for inital load
schademelder();