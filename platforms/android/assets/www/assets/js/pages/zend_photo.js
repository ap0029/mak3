function populate_pdf_dropdown() {
    if ( isset( get_global_var( global_vars.ZEND_PDF_DATA ) ) && get_global_var( global_vars.ZEND_PDF_DATA ) ) {
	console.log( "populate_pdf_dropdown()" );
	image_to_pdf_listing_data = JSON.parse( get_global_var( global_vars.ZEND_PDF_DATA ) );
	$( 'select[name="image_pdf"]' ).empty();
	var image_to_pdf_listing = prase_select_options( image_to_pdf_listing_data, [ 'email', 'klant' ], [ 'name', 'name' ], false );
	populate_select_options( $( 'select[name="image_pdf"]' ), image_to_pdf_listing, 'leeg', false );

	table_create();
    } else {
	$( '#no_record' ).show();
    }
}

function find_and_remove( rec, naam, mail ) {
    rec.forEach( function ( result, index ) {
	if ( result['name'] === naam ) {
	    rec.splice( index, 1 );
	}
    } );
    return rec;
}

function table_create() {
    $( '#has_record' ).show();
    var tbl = document.getElementById( 'table' );
    tbl.style.width = '100%';
    if ( isset( get_global_var( global_vars.ZEND_PDF_DATA ) ) && get_global_var( global_vars.ZEND_PDF_DATA ) ) {
	list_records = JSON.parse( get_global_var( global_vars.ZEND_PDF_DATA ) );

	$( '#table tr' ).filter( function () {
	    return $( this ).css( 'display' ) !== 'none';
	} ).remove();
    console.log("Table Data: " + JSON.stringify(list_records));
	$.each( list_records, function ( i, record ) {
        console.log("Table Iterator: " + i);
	    var record_section = $( ".repeat-row:first" ).clone();
	    if ( record['portal'] ) {
		$( '.name', record_section ).html( "<b>" + record['name'] + "</b>" );
		$( '.email', record_section ).html( "<b>" + record['username'] + "</b>" );
		$( '.delete', record_section ).off( 'click' ).on( 'click', function () {
		    try {
                console.log("Delete Initiate..");
                if ( isset( get_global_var( global_vars.ZEND_PDF_DATA ) ) && get_global_var( global_vars.ZEND_PDF_DATA ) ) {
                    previous_records = JSON.parse( get_global_var( global_vars.ZEND_PDF_DATA ) );
                    new_records = find_and_remove( previous_records, record['name'], record['klant'] );
                    console.log("previous_records: " + JSON.stringify(previous_records));
                    console.log("new_records: " + JSON.stringify(new_records));
                    
                    deleting_clients_portals( new_records );
                } else {
                    console.log("--else--");
                }
		    } catch ( e ) {
                log( "Update Table Data" );
                log( e )
		    }
		} );
	    }
	    else {
		$( '.name', record_section ).html( record['name'] );
		$( '.email', record_section ).html( record['email'] );
		$( '.delete', record_section ).off( 'click' ).on( 'click', function () {
		    try {
			if ( isset( get_global_var( global_vars.ZEND_PDF_DATA ) ) && get_global_var( global_vars.ZEND_PDF_DATA ) ) {
			    previous_records = JSON.parse( get_global_var( global_vars.ZEND_PDF_DATA ) );
			    new_records = find_and_remove( previous_records, record['name'], record['email'] );

			    set_global_var( global_vars.ZEND_PDF_DATA, JSON.stringify( new_records ) );
                deleting_clients_portals( new_records );
			} else {
			}
		    } catch ( e ) {
			log( "Update Table Data" );
			log( e )
		    }
		} );
	    }
	    record_section.show().appendTo( $( '#table' ) );
	} );
    }
    else {
    fetch_record( db_tables.CLIENT_PORTAL_DATA, { type: 'single', where: [{ type: 'none', clauses: [{ action: '=', clause: { column: 'device_id', value: get_device_id() } },] }] }, '', function ( data ) {
        if(data.count){
            set_global_var( global_vars.ZEND_PDF_DATA, JSON.stringify( data.result[0].client_info ) );
            populate_pdf_dropdown();
        }
	} );
	
    }
}

function zend_foto() {
    var camera_config = {
	destinationType: Camera.DestinationType.DATA_URL,
    correctOrientation: true,
	targetWidth: 2000,
	targetHeight: 3000
    };

    populate_pdf_dropdown();

    $( '#gear' ).off( 'click' ).on( 'click', function () {
	$( '#section1' ).hide();
	$( '#section2' ).show();
    } );

    $( '#close' ).off( 'click' ).on( 'click', function () {
	$( '#section2' ).hide();
	$( '#section1' ).show();
    } );

    $( 'select[name="image_pdf"]' ).change( function () {
	if ( validate_email( $( this ).val() ) ) {
	    $( "#mail_foto" ).text( "Stap 3 Mail uw pdf" );
	}
	else {
	    $( "#mail_foto" ).text( "Stap 3 Upload uw pdf" );
	}
    } );
    fetch_record( db_tables.CLIENT_PORTAL_DATA, { type: 'single', where: [{ type: 'none', clauses: [{ action: '=', clause: { column: 'device_id', value: get_device_id() } },] }] }, '', function ( data ) {
        if(data.count){
            set_global_var( global_vars.ZEND_SELECTION, JSON.stringify( data.result[0] ) );
            records = data.result[0];
            if ( records.enable_pdf ) {
                $( '#enable_pdf' ).attr( "checked", "checked" );
                $( "#pdf_listing" ).show();
            }
            if ( records.send_pdf ) {
                $( '#send_pdf' ).attr( "checked", "checked" );
                $( "#mail_foto" ).text( 'Stap 3 Mail uw pdf' );
            }
            if(data.result[0].client_info){
                set_global_var( global_vars.ZEND_PDF_DATA, JSON.stringify( data.result[0].client_info ) );
                $( '#no_record' ).hide();
                populate_pdf_dropdown();
            }
        }
	} );

    //====================================================
    //=============== Zend PDF Selections ================
    //====================================================

    try {
	if ( isset( get_global_var( global_vars.ZEND_SELECTION ) ) && get_global_var( global_vars.ZEND_SELECTION ) ) {
	    records = JSON.parse( get_global_var( global_vars.ZEND_SELECTION ) );
	    if ( records.enable_pdf ) {
            $( '#enable_pdf' ).attr( "checked", "checked" );
            $( "#pdf_listing" ).show();
	    }
	    if ( records.send_pdf ) {
            $( '#send_pdf' ).attr( "checked", "checked" );
            $( "#mail_foto" ).text( 'Stap 3 Mail uw pdf' );
	    }
	}
	else {
        fetch_record( db_tables.CLIENT_PORTAL_DATA, { type: 'single', where: [{ type: 'none', clauses: [{ action: '=', clause: { column: 'device_id', value: get_device_id() } },] }] }, '', function ( data ) {
            if(data.count){
                set_global_var( global_vars.ZEND_SELECTION, JSON.stringify( data.result[0] ) );
                records = data.result[0];
                if ( records.enable_pdf ) {
                    $( '#enable_pdf' ).attr( "checked", "checked" );
                    $( "#pdf_listing" ).show();
                }
                if ( records.send_pdf ) {
                    $( '#send_pdf' ).attr( "checked", "checked" );
                    $( "#mail_foto" ).text( 'Stap 3 Mail uw pdf' );
                }
            }
	    } );
	}
    }
    catch ( e ) {
	log( e );
    }

    $( '#enable_pdf' ).change( function () {
	if ( $( '#enable_pdf' ).is( ':checked' ) ) {
	    if ( $( '#send_pdf' ).is( ':checked' ) ) {
		update_global_vars( true, true );
	    }
	    else {
		update_global_vars( true, false );
	    }
	    $( "#pdf_listing" ).show();
	} else {
	    if ( $( '#send_pdf' ).is( ':checked' ) ) {
		update_global_vars( false, true );
	    }
	    else {
		update_global_vars( false, false );
	    }
	    $( "#pdf_listing" ).hide();
	}
    } );

    $( '#send_pdf' ).change( function () {
	if ( $( '#send_pdf' ).is( ':checked' ) ) {
	    if ( $( '#enable_pdf' ).is( ':checked' ) ) {
		update_global_vars( true, true );
	    }
	    else {
		update_global_vars( false, true );
	    }
	    $( "#mail_foto" ).text( 'Stap 3 Mail uw pdf' );
	} else {
	    if ( $( '#enable_pdf' ).is( ':checked' ) ) {
		update_global_vars( true, false );
	    }
	    else {
		update_global_vars( false, false );
	    }
	    $( "#mail_foto" ).text( 'Stap 3 Mail uw foto' );
	}
    } );

    //====================================================

    // $( 'img' ).attr( 'src', 'assets/images/home-logo.png' );

    function on_capture_success( image_data ) {
	var record_section = $( ".repeat-image:first" ).clone();
	$( '#home-logo' ).hide();
	$( 'img', record_section ).attr( 'src', "data:image/jpeg;base64," + image_data );
    $( 'img', record_section ).attr( 'id', "captured" );
	record_section.show().appendTo( $( '#image_listing' ) );
	hide_indicator();
	$( '#select_foto' ).css( 'display', 'block !important' );
    }

    function on_capture_error() {
	show_alert( "Unfortunately we were not able to retrieve the image" );
	hide_indicator();
    }

    function get_pdf_from_photo( my_document ) {
	return my_document.attr( 'src' );
    }

    function get_attachment_images() {
	var images = [ ];
	$( '.repeat-image:visible' ).each( function () {
	    images.push( $( 'img', $( this ) ).attr( "src" ) );
	} );

	return images;
    }

    function get_pdf() {
	var doc = new jsPDF();
	try {
        var all_images = document.querySelectorAll("[id='captured']");
        all_images.forEach(function(img, index){
            var width = img.clientWidth;
            var height = img.clientHeight;
            var newheight = (height / width) * 180 ;

            if(height > width){ // Portrait
                doc.addImage($( img ).attr( 'src' ), 'JPEG', 15, 15, 180, 270);
            }
            else{ // Landscape
                doc.addImage($( img ).attr( 'src' ), 'JPEG', 15, 15, 180, newheight);
            }

            if ( (index+1) < all_images.length ) {
                doc.addPage();
            }
        });
	} catch ( e ) {
        log(e);
	    log( 'get_pdf()' );
	}

	return doc.output( 'datauristring', 'testtest.pdf' );
    }

    $( "#select_foto" ).off( 'click' ).on( 'click', function () {
	main_app.showIndicator();
	navigator.camera.getPicture( on_capture_success, on_capture_error, camera_config );
    } );

    $( "#mail_foto" ).off( 'click' ).on( 'click', function () {

	if ( $( this ).text().search( 'Mail' ) > 0 ) {
	    var reciever = get_app_settings()['emailnotification'];
	    var msg = $( "#user_message" ).val();
	    if ( $( 'select[name="image_pdf"]' ).val() ) {
		reciever = $( 'select[name="image_pdf"]' ).val();
	    }
        window.plugins.socialsharing.shareViaEmail(
		    msg,
		    'Afbeelding',
		    [ reciever ], // TO: must be null or an array
		    null, // CC: must be null or an array
		    null, // BCC: must be null or an array
		    ( $( this ).text().search( 'foto' ) > 0 ) ? get_attachment_images() : get_pdf(), // FILES: null, a string, or an array
		    function () {
                console.log( "Success" );
                $( '#home-logo' ).show();
                $( ".repeat-image" ).html( '<img width="100%" height="100%" src="" />' );
                $( ".repeat-image" ).hide();
		    },
		    function ( exception ) {
			log( "Error = " + exception );
		    }
	    );
	}
	else {
        show_indicator();
	    var customer_id = $( 'select[name="image_pdf"]' ).val();
        var username = ""; //"bakkerija";
	    var password = ""; //"123456";

        var all_client_records = JSON.parse( get_global_var( global_vars.ZEND_PDF_DATA ) );
        all_client_records.forEach(function(currentValue, index){
            if(currentValue.klant == customer_id){
                username = currentValue.username;
                password = currentValue.password;
            }
        });

	    // Login to portal & upload file
        app.viewModels.loginViewModel.customerId = customer_id;
	    app.viewModels.loginViewModel.username = username;
	    app.viewModels.loginViewModel.password = password;
	    app.viewModels.loginViewModel.login( uploadFile );
	}
    } );

    var uploadFile = function () {
	// app.viewModels.listViewModel.onBeforeShow();
	app.viewModels.listViewModel.createJSDODataSource();
	var custViewModelJsdo = app.viewModels.listViewModel.getJSDO();
	try {
	    var jsrow = custViewModelJsdo[jsdoSettings.resourceName].add();
//	    var jsrow = custViewModelJsdo.add();

	    var currentdate = new Date();
	    var datetime = currentdate.getDate() + "-"
		    + ( currentdate.getMonth() + 1 ) + "-"
		    + currentdate.getFullYear() + "_"
		    + currentdate.getHours() + ":"
		    + ( currentdate.getMinutes() < 10 ? '0' : '' ) + currentdate.getMinutes();

	    //jsrow.data.description = "A new description";
	    jsrow.data.apikey = db_api_key;
	    jsrow.data.deviceid = get_device_id();
	    jsrow.data.name = 'Foto_' + datetime;
	    jsrow.data.status = 'ontvangen';
	    jsrow.data.Customer = true;
	    jsrow.data.Received = true;
	    jsrow.data.R11404746 = app.viewModels.loginViewModel.customerId; //Klant

	    //Save the row for later
	    app.viewModels.listViewModel.selectedRow = jsrow;
	    app.viewModels.listViewModel.doCreate(custViewModelJsdo, jsdoSettings.resourceName, jsrow, documentCreatedHandler);
	}
	catch ( e ) {
	    alert( e );
	}
    };
    var deleteRecord = function () {
	if ( app.viewModels.listViewModel.selectedRow == undefined )
	    return;

	var custViewModelJsdo = app.viewModels.listViewModel.getJSDO();
	var jsrow = custViewModelJsdo[jsdoSettings.resourceName].findById( app.viewModels.listViewModel.selectedRow.id );
//	var jsrow = custViewModelJsdo.findById( app.viewModels.listViewModel.selectedRow.id );
	jsrow.remove();
	app.viewModels.listViewModel.doDelete( custViewModelJsdo, jsdoSettings.resourceName, jsrow );
    };

    function supportAjaxUploadWithProgress() {
	return supportFileAPI() && supportAjaxUploadProgressEvents() && supportFormData();
	function supportFileAPI() {
	    var fi = document.createElement( 'INPUT' );
	    fi.type = 'file';
	    return 'files' in fi;
	}
	;
	function supportAjaxUploadProgressEvents() {
	    var xhr = new XMLHttpRequest();
	    return !!( xhr && ( 'upload' in xhr ) && ( 'onprogress' in xhr.upload ) );
	}
	;
	function supportFormData() {
	    return !!window.FormData;
	}
    }

    var documentCreatedHandler = function ( data ) {
	if ( data )
	{
	    //alert( 'file: ' + data.Document_File );
	    var fileAsBase64 = get_pdf(); //createPdfData(); 
        
	    multiplePictures = 0;
	    //$t.refreshScreenFormElements( "MailFoto" );

	    var blob = app.util.dataURItoBlob( fileAsBase64 );

	    var currentdate = new Date();
	    var datetime = currentdate.getDate() + "-"
		    + ( currentdate.getMonth() + 1 ) + "-"
		    + currentdate.getFullYear() + "_"
		    + currentdate.getHours() + ":"
		    + ( currentdate.getMinutes() < 10 ? '0' : '' ) + currentdate.getMinutes();

	    if ( supportAjaxUploadWithProgress() == false ) {
            deleteRecord();
            alert( 'FormData not supported' );
		return;
	    }

	    var fd = new FormData();
	    fd.append( "fileContents", blob, datetime + ".pdf" );
	    var file = JSON.parse( data.Document_File ).src;
	    console.log( 'Editing file:' + file );
	    //The saveUrl to POST at
	    var saveUrl = jsdoSettings.serviceURI + file + "?objName=" + jsdoSettings.resourceName;

        try{
            $.ajax({
                url: saveUrl,
                type: 'POST',
                data: fd,
                cache: false,
                dataType: 'xml',
                processData: false, // Don't process the files
                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                beforeSend: function(xhr) { 
                    app.util.setAuthHeader(xhr, 
                        app.viewModels.loginViewModel.username,
                        app.viewModels.loginViewModel.password) 
                },
                success: function(data, textStatus, jqXHR)
                {
                    window.plugins.toast.showWithOptions(
                    {
                        message: "Upload succesvol",
                        duration: "short",
                        position: "center",
                    }, function ( result ) { 
                        $( '#home-logo' ).show();
                        $( ".repeat-image" ).html( '<img width="100%" height="100%" src="" />' );
                        $( ".repeat-image" ).hide();

                        //reset button

                        hide_indicator();
                    } );
                },
                error: function(jqXHR, textStatus, errorThrown)
                {
                    window.plugins.toast.showWithOptions(
                    {
                        message: "Something went wrong. Try again.",
                        duration: "short",
                        position: "center",
                    }, function ( result ) {  });
                    // Handle errors here
                    console.log('ERRORS: ' + textStatus);
                    console.log('ERRORS: ' + errorThrown);
                    
                    deleteRecord();
                    hide_indicator();
                    console.log('Er is een technische fout opgetreden. Neem contact op met uw beheerder.');
                }
            });
        }
        catch(e){
            window.plugins.toast.showWithOptions(
            {
                message: "Er is een technische fout opgetreden. Neem contact op met uw beheerder",
                duration: "short",
                position: "center",
            }, function ( result ) {  });
            console.log(JSON.stringify(e));
        }

	}
    };

    //=============================================================

    $( 'input[name="platform"]' ).change( function () {
	if ( $( this ).is( ':checked' ) ) {
	    $( 'ul.for_plateform' ).show( 200 );
	    $( 'ul.for_pdf' ).hide( 200 );
	} else {
	    $( 'ul.for_pdf' ).show( 200 );
	    $( 'ul.for_plateform' ).hide( 200 );
	}
    } );

    $( '#open_fields' ).off( 'click' ).on( 'click', function () {
	if ( $( 'div.fields' ).css( 'display' ) == 'none' ) {
	    $( '#no_record, #has_record' ).hide();
	    $( 'div.fields' ).show( 200 );
	} else {
	    $( 'div.fields' ).hide( 200 );
	    isset( get_global_var( global_vars.ZEND_PDF_DATA ) ) && get_global_var( global_vars.ZEND_PDF_DATA ) ? $( '#has_record' ).show() : $( '#no_record' ).show();
	}
    } );

    $( "#opslaan" ).off( 'click' ).on( 'click', function () {
	if ( $( 'input[name="platform"]' ).is( ':checked' ) ) {
	    var naam = isset( $( ".for_plateform #name" ).val() ) && $( ".for_plateform #name" ).val() ? $( ".for_plateform #name" ).val() : '';
	    var klaantId = isset( $( "#client_id" ).val() ) && $( "#client_id" ).val() ? $( "#client_id" ).val() : '';
	    var username = isset( $( "#user_name" ).val() ) && $( "#user_name" ).val() ? $( "#user_name" ).val() : '';
	    var pswd = isset( $( "#password" ).val() ) && $( "#password" ).val() ? $( "#password" ).val() : '';
	    var is_portal = true;
	    if ( validate( naam ) && validate( username ) && validate( pswd ) ) {
            try {
                var client_info = { name: naam, klant: klaantId, portal: is_portal, username: username, password: pswd };
                saving_clients_portals( client_info );

                $( 'div.fields' ).hide( 200 );
            } catch ( e ) {
                log( "Zend_photo()" );
                log( e )
            }
	    }else {
		    show_alert( messages.FORMALERT_TEXT );
	    }
	}
	else {
	    var naam = isset( $( "#name" ).val() ) && $( "#name" ).val() ? $( "#name" ).val() : '';
	    var mail = isset( $( "#email" ).val() ) && $( "#email" ).val() ? $( "#email" ).val() : '';
	    var username = "";
	    var pswd = "";
	    var is_portal = false;

	    if ( validate( naam ) && validate_email( mail ) ) {
		try {
		    var client_info = { name: naam, email: mail, portal: is_portal, username: username, password: pswd };
		    console.log( client_info );
		    saving_clients_portals( client_info );

		    $( 'div.fields' ).hide( 200 );
		} catch ( e ) {
		    console.log( "Zend_photo()" );
		    console.log( e )
		}
	    } else {
		show_alert( messages.FORMALERT_TEXT );
	    }
	}

	$( "#name" ).val( "" );
	$( ".for_plateform #name" ).val( "" );
	$( "#email" ).val( "" );
	$( "#client_id" ).val( "" );
	$( "#user_name" ).val( "" );
	$( "#password" ).val( "" );

    } );

    function update_global_vars( opt1, opt2 ) {
	try {
	    data_obj = { 'enable_pdf': opt1, 'send_pdf': opt2, device_id: get_device_id() };
	    saving_clients_data( data_obj );
	} catch ( e ) {
	    log( "ZEND_SELECTION()" );
	    log( e )
	}
    }

    function saving_clients_portals( client_portals ) {
	try {
	    if ( ( isset( get_global_var( global_vars.ZEND_PDF_DATA ) ) && get_global_var( global_vars.ZEND_PDF_DATA ) ) || ( isset( get_global_var( global_vars.ZEND_SELECTION ) ) && get_global_var( global_vars.ZEND_SELECTION ) ) ) {
		if ( ( isset( get_global_var( global_vars.ZEND_PDF_DATA ) ) && get_global_var( global_vars.ZEND_PDF_DATA ) ) ) {
		    var records = JSON.parse( get_global_var( global_vars.ZEND_PDF_DATA ) );
            console.log( "records = " + records );
		    records.push( client_portals ); 
		    var client_info = { client_info: records }; 
		    console.log( "new client_info = " + client_info );

		    var filter = { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'device_id', value: get_device_id() } } ] } ] };
		    update_record( db_tables.CLIENT_PORTAL_DATA, client_info, filter, function ( data ) {
			if ( isset( data.result ) ) {
			    set_global_var( global_vars.ZEND_PDF_DATA, JSON.stringify( records ) );
                populate_pdf_dropdown();
			}
		    } );
		} else {
		    var client_info = { client_info: [ client_portals ] };
		    set_global_var( global_vars.ZEND_PDF_DATA, JSON.stringify( [ client_portals ] ) );
		    var filter = { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'device_id', value: get_device_id() } } ] } ] };
		    update_record( db_tables.CLIENT_PORTAL_DATA, client_info, filter, function ( data ) {
			if ( isset( data.result ) || isset( data.Result ) ) {
			    set_global_var( global_vars.ZEND_PDF_DATA, JSON.stringify( [ client_portals ] ) );
                populate_pdf_dropdown();
			}
		    } );
		}
	    } else {
		console.log( "else" );
		var client_info = { client_info: [ client_portals ] , device_id: get_device_id() };
		console.log( client_info );
		insert_record( db_tables.CLIENT_PORTAL_DATA, client_info, function ( data ) {
		    if ( isset( data.result ) ) {
			    set_global_var( global_vars.ZEND_PDF_DATA, JSON.stringify( [ client_portals ] ) );
                populate_pdf_dropdown();
		    }
		} );
	    }
	}
	catch ( e ) {
	    console.log( e );
	}
    }

    function saving_clients_data( client_portals ) {
        if ( ( isset( get_global_var( global_vars.ZEND_SELECTION ) ) && get_global_var( global_vars.ZEND_SELECTION ) ) || ( isset( get_global_var( global_vars.ZEND_PDF_DATA ) ) && get_global_var( global_vars.ZEND_PDF_DATA ) ) ) {
            var filter = { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'device_id', value: get_device_id() } } ] } ] };
            update_record( db_tables.CLIENT_PORTAL_DATA, client_portals, filter, function ( data ) {
                if ( isset( data.result ) ) {
                    set_global_var( global_vars.ZEND_SELECTION, JSON.stringify( client_portals ) );
                }
            });
        } else {
            insert_record( db_tables.CLIENT_PORTAL_DATA, client_portals, function ( data ) {
                if ( isset( data.result ) ) {
                    set_global_var( global_vars.ZEND_SELECTION, JSON.stringify( client_portals ) );
                }
            });
        }
        populate_pdf_dropdown();
    }
}

function deleting_clients_portals( client_portals ) {
    try {
        console.log("In deleting_clients_portals()");
        var client_info = { client_info: client_portals };
        var filter = { type: 'single', where: [ { type: 'none', clauses: [ { action: '=', clause: { column: 'device_id', value: get_device_id() } } ] } ] };
        update_record( db_tables.CLIENT_PORTAL_DATA, client_info, filter, function ( data ) {
            console.log("DELETED");
            if ( isset( data.result ) ) {
                set_global_var( global_vars.ZEND_PDF_DATA, JSON.stringify( client_portals ) );
                populate_pdf_dropdown();
            }
        } );
    }
    catch ( e ) {
        console.log( e );
    }
}

// for initial load
zend_foto();