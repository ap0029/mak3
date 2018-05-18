var app = {
    data: { },
    jsdoSession: { },
    views: { },
    viewModels: { },
    util: { }
};

var init_jsdo = function () {
    try {
	progress.util.jsdoSettingsProcessor( jsdoSettings );
	if ( !jsdoSettings.authenticationModel ) {
	    alert( "Warning: jsdoSettings.authenticationModel not specified. Default is ANONYMOUS" );
        hide_indicator();
	}

	if ( jsdoSettings.serviceURI ) {
	    app.jsdosession = new progress.data.JSDOSession( jsdoSettings );
	} else {
	    alert( "Error: jsdoSettings.serviceURI must be specified." );
        hide_indicator();
	}

	if ( app.jsdosession && app.isAnonymous() ) {
	    alert( 'Logged in as anonymous' );
        hide_indicator();
	    app.viewModels.loginViewModel.login();
	}

	window.app = app;
    } catch ( ex ) {
	alert( "Error creating JSDOSession: " + ex );
    hide_indicator();
    }
};

app.isOnline = function () {
    if ( !navigator || !navigator.connection ) {
	return true;
    } else {
	return navigator.connection.type !== 'none';
    }
};

app.isAnonymous = function () {
    // authenticationModel defaults to "ANONYMOUS"
    if ( !jsdoSettings.authenticationModel ||
	    jsdoSettings.authenticationModel.toUpperCase() === "ANONYMOUS" ) {
	return true;
    }

    return false;
};

app.showError = function ( message ) {
    if ( navigator && navigator.notification ) {
	navigator.notification.alert( message );
    hide_indicator();
    } else {
	alert( message );
    hide_indicator();
    }
};

app.util = ( function () {
    var dataURItoBlob = function ( dataURI ) {
	// convert base64/URLEncoded data component to raw binary data held in a string
	var byteString;
	if ( dataURI.split( ',' )[0].indexOf( 'base64' ) >= 0 )
	    byteString = atob( dataURI.split( ',' )[1] );
	else
	    byteString = unescape( dataURI.split( ',' )[1] );

	// separate out the mime component
	var mimeString = dataURI.split( ',' )[0].split( ':' )[1].split( ';' )[0];

	// write the bytes of the string to a typed array
	var ia = new Uint8Array( byteString.length );
	for ( var i = 0; i < byteString.length; i++ ) {
	    ia[i] = byteString.charCodeAt( i );
	}

	return new Blob( [ ia ], { type: mimeString } );
    };


    // Set Request header for authorization separately
    function setAuthHeader( xhr, username, password ) {
	//Credential includes username@customerId:password
	//var creds = username + '@' + jsdoSettings.customerId + ':' + password; 
	var creds = username + '@' + jsdoSettings.tenantId + ':' + password;
	//alert( 'UPLOAD CREDS : ' + creds );
	var basicScheme = btoa( creds );
	var hashStr = "Basic " + basicScheme;
	xhr.setRequestHeader( 'Authorization', hashStr );
    }

    return {
	dataURItoBlob: dataURItoBlob,
	setAuthHeader: setAuthHeader
    };

} )();

( function ( parent ) {

    // Variable to store your files
    var files;
    var reader = new FileReader();
    var fileAsBase64;
    var fd;

    function dataURItoBlob( dataURI ) {
	// convert base64/URLEncoded data component to raw binary data held in a string
	var byteString;
	if ( dataURI.split( ',' )[0].indexOf( 'base64' ) >= 0 )
	    byteString = atob( dataURI.split( ',' )[1] );
	else
	    byteString = unescape( dataURI.split( ',' )[1] );

	// separate out the mime component
	var mimeString = dataURI.split( ',' )[0].split( ':' )[1].split( ';' )[0];

	// write the bytes of the string to a typed array
	var ia = new Uint8Array( byteString.length );
	for ( var i = 0; i < byteString.length; i++ ) {
	    ia[i] = byteString.charCodeAt( i );
	}
	return new Blob( [ ia ], { type: mimeString } );
    }

    reader.onload = function ( e ) {
	alert( e.target.result );
    hide_indicator();

	fileAsBase64 = e.target.result;
	var test = reader.result;

	var blob = dataURItoBlob( fileAsBase64 );
	//blob.name = "test.txt";
	fd = new FormData();
	fd.append( "fileContents", blob, "test.txt" );

	var file = JSON.parse( app.viewModels.listViewModel.get( 'selectedRow' ).file ).src;
	alert( 'Editing file:' + file );
    hide_indicator();

	//The saveUrl to POST at
	var saveUrl = "https://web-sandbox-prod.rlb-test.progress.com/rest/jsdo" + file + "?objName=document1";

	$.ajax( {
	    url: saveUrl,
	    type: 'POST',
	    data: fd,
	    cache: false,
	    dataType: 'xml',
	    processData: false, // Don't process the files
	    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
	    beforeSend: setAuthHeader,
	    success: function ( data, textStatus, jqXHR )
	    {
		alert( 'upload successful' );
        hide_indicator();
	    },
	    error: function ( jqXHR, textStatus, errorThrown )
	    {
		alert( 'ERRORS: ' + textStatus );
        hide_indicator();
	    }
	} );

	var data = reader.result,
		base64 = data.replace( /^[^,]*,/, '' ),
		info = {
		    fileName: "test1.txt",
		    size: 11,
		    resume: base64 //either leave this `basae64` or make it `data` if you want to leave the `data:application/pdf;base64,` at the start
		};
    };

    // Grab the files and set them to our variable
    function prepareUpload( event ) {
	files = event.target.files;
    }

    function setAuthHeader( xhr, customerId, username, password ) {
	alert( 'upload creds:' );
	alert( 'custId: ' + customerId + ', username: ' + username + ', password: ' + password );
    hide_indicator();

	var creds = debug ? app.viewModels.loginViewModel.username + '@' + jsdoSettings.customerId + ':Testing3' : username + '@' + customerId + ':' + password;
	var basicScheme = btoa( creds );
	var hashStr = "Basic " + basicScheme;
	xhr.setRequestHeader( 'Authorization', hashStr );
    }

    function uploadFiles( event ) {
	if ( files == undefined || files.length == 0 )
	    return;

	$.each( files, function ( key, value ) {
	    reader.readAsDataURL( value );
	} );
    }

    /*
     * LoginViewModel
     * @type @exp;kendo@call;observable
     */
    var loginViewModel = kendo.observable( {
	username: null,
	password: null,
	customerId: null,
	isLoggedIn: false,
	login: function ( callback ) {
	    var that = this,
		    details,
		    promise;
	    try {
		promise = app.jsdosession.login( this.username, this.password );
		promise.done( function ( jsdosession, result, info ) {
		    try {
			//alert( "Success on login()" );
			that.set( "isLoggedIn", true );

			var catPromise = jsdosession.addCatalog( jsdoSettings.catalogURIs );
			catPromise.done( function ( jsdosession, result, details ) {
			    //alert( "Success on addCatalog()" );
			    callback();
			} );

			catPromise.fail( function ( jsdosession, result, details ) {
			    app.viewModels.loginViewModel.addCatalogErrorFn( app.jsdosession, progress.data.Session.GENERAL_FAILURE, details );
			} );
		    } catch ( ex ) {
			details = [ { "catalogURI": jsdoSettings.catalogURIs, errorObject: ex } ];
			app.viewModels.loginViewModel.addCatalogErrorFn( app.jsdosession, progress.data.Session.GENERAL_FAILURE, details );
		    }

		} );

		promise.fail( function ( jsdosession, result, info ) {
		    app.viewModels.loginViewModel.loginErrorFn( app.jsdosession, result, info );
		} ); // end promise.fail
	    } catch ( ex ) {
		app.viewModels.loginViewModel.loginErrorFn( app.jsdosession, progress.data.Session.GENERAL_FAILURE, { errorObject: ex } );
	    }
	},
	logout: function ( e, callback ) {
	    var that = this,
		    promise,
		    clistView;

	    if ( e ) {
		e.preventDefault();
	    }

	    try {
		promise = app.jsdosession.logout();
		promise.done( function ( jsdosession, result, info ) {
		    alert( "Success on logout()" );
            hide_indicator();
		    that.set( "isLoggedIn", false );

		    if ( app.viewModels.listViewModel )
			app.viewModels.listViewModel.clearData();

		    callback();
		} );

		promise.fail( function ( jsdosession, result, info ) {
		    app.viewModels.loginViewModel.logoutErrorFn( jsdosession, result, info );
		} );
	    } catch ( ex ) {
		app.viewModels.loginViewModel.logoutErrorFn( app.jsdosession, progress.data.Session.GENERAL_FAILURE, { errorObject: ex } );
	    }
	},
	checkEnter: function ( e ) {
	    var that = this;
	    if ( e.keyCode === 13 ) {
		$( e.target ).blur();
		that.login();
	    }
	},
	addCatalogErrorFn: function ( jsdosession, result, details ) {
	    alert( "Error on addCatalogErrorFn()" );
        hide_indicator();

	    var msg = "", i;
	    if ( details !== undefined && Array.isArray( details ) ) {
		for ( i = 0; i < details.length; i += 1 ) {
		    msg = msg + "\nresult for " + details[i].catalogURI + ": " + details[i].result + "\n    " + details[i].errorObject;
		}
	    }

	    app.showError( msg );
	    if ( app.viewModels.loginViewModel.isLoggedIn ) {
		app.viewModels.loginViewModel.logout();
	    }

	    alert( msg );
        hide_indicator();
	},
	logoutErrorFn: function ( jsdosession, result, info ) {
	    alert( "Error on logoutErrorFn()" );
        hide_indicator();

	    var msg = "Error on logout";
	    app.showError( msg );
	    if ( info.errorObject !== undefined )
		msg = msg + "\n" + info.errorObject;

	    if ( info.xhr ) {
		msg = msg + "\n" + "status (from jqXHT):" + info.xhr.status;
		msg = msg + " statusText (from jqXHT):" + info.xhr.statusText;
	    }

	    alert( msg );
        hide_indicator();
	},
	loginErrorFn: function ( jsdosession, result, info ) {
	    var msg = "Error on login";
	    switch ( result ) {
		case progress.data.Session.LOGIN_AUTHENTICATION_FAILURE:
		    msg = msg + " Invalid userid or password";
		    break;
		case progress.data.Session.LOGIN_GENERAL_FAILURE:
		default:
		    msg = msg + " Service " + jsdoSettings.serviceURI + " is unavailable";
		    break;
	    }
	    app.showError( msg );
	    if ( info.xhr ) {
		msg = msg + " status (from jqXHT):" + info.xhr.status;
		msg = msg + " statusText (from jqXHT):" + info.xhr.statusText;
		if ( info.xhr.status === 200 ) {
		    //something is likely wrong with the catalog, so dump it out     
		    msg = msg + "\nresponseText (from jqXHT):" + info.xhr.responseText;
		}
	    }
	    if ( info.errorObject ) {
		msg = msg + "\n" + info.errorObject;
	    }
	    log( msg );
	}
    } );

    /*
     * ListViewModel
     * @type @exp;kendo@call;observable
     */
    var listViewModel = kendo.observable( {
	jsdoDataSource: undefined,
	jsdoModel: undefined,
	selectedRow: { },
	origRow: { },
	resourceName: undefined,
	onBeforeShow: function ( e ) {
	    app.viewModels.listViewModel.onInit( this );
	},
	onInit: function ( e ) {
	    try {
		var idx;
		app.viewModels.listViewModel.createJSDODataSource();
	    } catch ( ex ) {
		alert( "Error in creating JSDO DataSource: " + ex );
        hide_indicator();
	    }
	},
	createJSDODataSource: function ( ) {
	    try {
		if ( jsdoSettings && jsdoSettings.resourceName ) {
		    this.jsdoModel = new progress.data.JSDO( {
			name: jsdoSettings.resourceName
		    } );
		    this.jsdoDataSource = new kendo.data.DataSource( {
			type: "jsdo",
			transport: {
			    jsdo: this.jsdoModel, // jsdoSettings.resourceName
			},
			error: function ( e ) {
			    alert( "Error: " + e );
                hide_indicator();
			}
		    } );
		    this.resourceName = jsdoSettings.resourceName;
		    console.log( this.jsdoDataSource );
		    console.log( this.jsdoDataSource.transport );
		} else {
		    alert( "Warning: jsdoSettings.resourceName not specified" );
            hide_indicator();
		}
	    } catch ( ex ) {
		alert( "Error in createJSDODataSource()" );
        hide_indicator();
		app.viewModels.listViewModel.createDataSourceErrorFn( { errorObject: ex } );
	    }
	},
	createDataSourceErrorFn: function ( info ) {
	    var msg = "Error on create DataSource";
	    app.showError( msg );
	    if ( info.errorObject !== undefined ) {
		msg = msg + "\n" + info.errorObject;
	    }
	    alert( msg );
        hide_indicator();
	},
	clearData: function () {
	    var that = this;
	    if ( that.jsdoModel ) {
		that.jsdoModel.addRecords( [ ], progress.data.JSDO.MODE_EMPTY );
	    }
	},
	// Called for editDetail view's data-show event
	createNewRecord: function ( e ) {
	    var jsrow,
		    //jsdo = this.model.getJSDO(),
		    custViewModel = app.viewModels.listViewModel,
		    custViewModelJsdo = app.viewModels.listViewModel.getJSDO();

	    // Add row to JSDO
	    jsrow = custViewModelJsdo[jsdoSettings.resourceName].add();
	    custViewModel.selectedRow = { };
	    if ( jsrow ) {
		//this.model.copyRow(jsrow.data, this.model.selectedRow);
		this.copyRow( jsrow.data, custViewModel.selectedRow );

		if ( jsdoSettings.useSubmit === false ) {
		    // Perform create on backend now
		    this.doCreate( custViewModelJsdo, jsdoSettings.resourceName, jsrow );
		}
	    }
	    else {
		alert( "Error adding new record" );
		app.showError( "Error adding new record" );
        hide_indicator();

		custViewModel.selectedRow = { };
		//$("#editDetailDoneButton").data("kendoMobileButton").enable(false);
	    }
	},
	// Called for editDetail view's data-init event
	onInitEditDetailView: function ( e ) {
	    var jsdo = this.model.getJSDO(),
		    isValid = true;

	    if ( jsdoSettings.resourceName === undefined ) {
		if ( jsdo._defaultTableRef )
		    jsdoSettings.resourceName = jsdo._defaultTableRef._name;
		else
		    jsdoSettings.resourceName = jsdo._dataProperty;
	    } else if ( jsdo._buffers[jsdoSettings.resourceName] === undefined ) { // Validate the specified resourceName
		isValid = false;
	    }

	    if ( jsdoSettings.resourceName === undefined || isValid === false ) {
		if ( isValid )
		    app.showError( "To use Edit View, set jsdoSettings.resourceName" );
		else
		    app.showError( "Invalid tableName specified in jsdoSettings.resourceName" );

		// $("#editDetailDoneButton").data("kendoMobileButton").enable(false);
	    }

	    var selectedRow = app.viewModels.listViewModel.get( 'selectedRow' );
	    if ( selectedRow.id != undefined )
	    {
		// Add events
		$( "#editDetailList" ).append( "<li><input type=\"button\" value=\"upload\" id=\"btnUpload\" \/></li>" );
		$( 'input[type=file]' ).on( 'change', prepareUpload );
		$( '#btnUpload' ).on( 'click', uploadFiles );

	    }
	},
	// Called when user selects "Delete" button in Delete modal view
	// Also called when user selects "Cancel" button after selecting add button
	deleteRow: function ( e ) {
	    var jsrow,
		    custViewModel = app.viewModels.listViewModel,
		    jsdo = custViewModel.getJSDO(),
		    success = true;

	    jsrow = jsdo[jsdoSettings.resourceName].findById( custViewModel.selectedRow.id );

	    if ( jsrow ) {
		jsrow.remove();

		if ( jsdoSettings.useSubmit === false ) {
		    custViewModel.doDelete( jsdo, jsdoSettings.resourceName, jsrow );
		}
		else {
		    custViewModel.setReadLocal( true );
		    app.mobileApp.navigate( "#listlist" );
		}
	    }
	    else {
		app.showError( "Row not found" );
	    }
	},
	// Called when user selects "Done" button in editDetail view
	doneEditDetail: function ( e ) {
	    var jsrow,
		    custViewModel = app.viewModels.listViewModel,
		    jsdo = custViewModel.getJSDO();

	    custViewModel.selectedRow.name = "testMC";
	    jsrow = jsdo[jsdoSettings.resourceName].findById( custViewModel.selectedRow._id );

	    if ( jsrow ) {
		jsrow.assign( custViewModel.selectedRow );

		if ( jsdoSettings.useSubmit === false ) {
		    custViewModel.doUpdate( jsdo, jsdoSettings.resourceName, jsrow );
		}
		else {
		    // Use sends update to backend when Submit button is selected
		    custViewModel.backToListView( false );
		}
	    }
	    else {
		app.showError( "Row not found" );
	    }
	},
	// Called to create new row on backend
	doCreate: function ( jsdo, resourceName, jsrow, callback ) {
	    var afterCreateFn,
		    custViewModel = app.viewModels.listViewModel,
		    cError;

	    afterCreateFn = function ( jsdo, record, success, request ) {
            /* unsubscribe so this fn doesn't execute for some other event */
            jsdo[resourceName].unsubscribe( 'afterCreate', afterCreateFn );

            if ( success === true ) {
                custViewModel.copyRow( record.data, custViewModel.selectedRow );
                callback( record.data );
                // TO_DO: Don't understand why I have to do bind() again
                //kendo.bind($("#editDetailList"),  app.viewModels.listViewModel);
            } else {
                cError = "Create Error: " + custViewModel.normalizeError( request, record );
                app.showError( cError );
                alert( cError );
                hide_indicator();
                //custViewModel.backToListView(true);
            }
	    };

	    jsdo[resourceName].subscribe( 'afterCreate', afterCreateFn );
	    jsdo.saveChanges();
	},
	// Called to update row on backend
	doUpdate: function ( jsdo, resourceName, jsrow ) {
	    var afterUpdateFn,
		    custViewModel = app.viewModels.listViewModel,
		    cError;

	    afterUpdateFn = function ( jsdo, record, success, request ) {
		/* unsubscribe so this fn doesn't execute for some other event */
		jsdo[resourceName].unsubscribe( 'afterUpdate', afterUpdateFn );

		if ( success === true ) {
		    //custViewModel.backToListView(true);
		} else {
		    cError = "Update Error: " + custViewModel.normalizeError( request, record );
		    app.showError( cError );
		    console.alert( cError );
            hide_indicator();
		}
	    };

	    jsdo[resourceName].subscribe( 'afterUpdate', afterUpdateFn );
	    jsdo.saveChanges();
	},
	// Called to delete row on backend
	doDelete: function ( jsdo, resourceName, jsrow ) {
	    var afterDeleteFn,
		    custViewModel = app.viewModels.listViewModel,
		    cError;

	    afterDeleteFn = function ( jsdo, record, success, request ) {
		/* unsubscribe so this fn doesn't execute for some other event */
		jsdo[resourceName].unsubscribe( 'afterDelete', afterDeleteFn );

		if ( success === true ) {
		    //custViewModel.backToListView(true);
		} else {
		    cError = "Delete Error: " + custViewModel.normalizeError( request, record );
		    app.showError( cError );
		    console.alert( cError );
            hide_indicator();
		}
	    };

	    jsdo[resourceName].subscribe( 'afterDelete', afterDeleteFn );
	    jsdo.saveChanges();
	},
	refresh: function ( e ) {
	    var custViewModel = app.viewModels.listViewModel;

	    console.alert( "GOT refresh" );
        hide_indicator();

	    try {
		custViewModel.setReadLocal( false );
	    }
	    catch ( ex ) {

	    }
	},
	getJSDO: function () {
	    var jsdo;
	    if ( this.jsdoDataSource && this.jsdoDataSource.transport ) {
		jsdo = this.jsdoDataSource.transport.options.jsdo;
	    }
	    return jsdo;
	},
	// Utility Functions
	copyRow: function ( source, target ) {
	    for ( var field in source ) {

		if ( source[field] === undefined || source[field] === null ) {
		    target[field] = source[field];
		}
		else if ( source[field] instanceof Date ) {
		    target[field] = source[field];
		}
		else if ( typeof source[field] === 'object' ) {
		    var newObject = source[field] instanceof Array ? [ ] : { };
		    app.viewModels.listViewModel.copyRow( source[field], newObject );
		    target[field] = newObject;
		}
		else
		    target[field] = source[field];
	    }
	},
	backToListView: function ( readLocal ) {
	    var custViewModel = app.viewModels.listViewModel;
	    custViewModel.refresh();
	    custViewModel.setReadLocal( readLocal );
	},
	setReadLocal: function ( readLocal ) {
	    if ( this.jsdoDataSource && this.jsdoDataSource.transport ) {
		this.jsdoDataSource.transport.readLocal = readLocal;
	    }
	},
	getReadLocal: function () {
	    var readLocal;
	    if ( this.jsdoDataSource && this.jsdoDataSource.transport ) {
		readLocal = this.jsdoDataSource.transport.readLocal;
	    }
	    return readLocal;
	},
	normalizeError: function ( request, record ) {
	    var cError = "",
		    response;

	    // First check if there was error on current record
	    if ( record && record.getErrorString() ) {
		return record.getErrorString();
	    }

	    /* Next try to get the error string from _error object, otherwise see
	     * if the error came as a string in the body. If nothing is set, then     
	     * just get the native statusTest */
	    response = request.response;

	    if ( response && response._errors && response._errors.length > 0 )
		cError = response._errors[0]._errorMsg;
	    if ( cError == "" && request.xhr.responseText.substring( 0, 6 ) != "<html>" )
		cError = request.xhr.responseText;
	    if ( cError == "" )
		cError = request.xhr.statusText;

	    return cError;
	},
    } );

    parent.loginViewModel = loginViewModel;
    parent.listViewModel = listViewModel;
} )( app.viewModels );