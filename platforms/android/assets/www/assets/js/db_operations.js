// init DB object
var db_obj = { };
var query_obj = { };
var where = { };

// Tables
var db_tables = {
    MESSAGE_ARCHIVE_TABLE: 'berichtenarchief',
    MORE_SORTING_TABLE: 'meersortering',
    OVER_ONS_SORTING_TABLE : 'overons_sortering',
    PAGE_TABLE: 'Pagina',
    WEBPAGE_TABLE: 'webpage',
    // Tables for reading values
    APP_SETTINGS_TABLE: 'AppSettings',
    BROCHURES_TABLE: 'brochures',
    EMPLOYEE_TABLE: 'employee',
    FAVOURITE_EMPLOYEE_TABLE: 'favourites',
    OFFICE_TABLE: 'kantoor',
    PHOTO_GALLERY_TABLE: 'photogallery',
    SECTOR_TABLE: 'sector',
    SETTINGS_TABLE: 'Settings',
    TARGETGROUP_TABLE: 'targetgroup',
    TOPICS_TABLE: 'topics',
    TOTAL_EMPLOYEES_TABLE: 'totalemployees',
    // Tables for storing values
    APP_USER_TABLE: 'app_user',
    APPOINTMENTS_TABLE: 'appointments',
    SURVEY_TABLE: 'enquete',
    FAVOURITES_TABLE: 'favourites',
    QUESTIONS_TABLE: 'questions',
    QUOTATIONS_TABLE: 'quotations',
    SELECT_OPTIONS: 'select_options',
    CLIENT_PORTAL_DATA: 'client_portal_data',
    // new Tables
    RECOMMENDATIONS_SORTING_TABLE: 'recommendations',
    LOGINS_SORTING_TABLE: 'logins',
    VIDEOS_SORTING_TABLE: 'videos',
    SOCIALS_SORTING_TABLE: 'social_media',
    WONING_TABLE: 'woning',
};

/*
 * Init DB
 * @returns {none}
 */
function init_db( obj ) {
    db_obj = obj; // new Everlive(db_api_key);
}

/*
 * Create record
 * @param {string} table
 * @param {object} data
 * @param {function} callback
 * @param {object} auth_header
 */
function insert_record( table, data, callback ) {
    console.log( 'insert_record()' );
    try {

	db_obj.data( table )
		.withHeaders( { Authorization: 'Bearer ' + localStorage.token } )
		.create( data,
			function ( data ) {
			    console.log( 'success' );
			    callback( data );
			},
			function ( data ) {
			    console.log( 'error' );
			    callback( data );
			} );
    } catch ( e ) {
	console.log( e );
    }
}

/*
 * Fetch record
 * @param {string} table
 * @param {object} where
 * @param {function} callback
 */
function fetch_record( table, where, order, callback ) {
    log( 'fetch_record()' );

    try {
	var filters = get_query_obj( where, order );
	db_obj.data( table )
		.withHeaders( { Authorization: 'Bearer ' + localStorage.token } )
		.get( filters ).then(
		function ( data ) {
		    log( 'success' );
		    callback( data );
		},
		function ( data ) {
		    log( 'fail' );
		    callback( data );
		} );
    } catch ( e ) {
	log( e );
    }
}

/*
 * Update record
 * @param {string} table
 * @param {string} data
 * @param {object} where
 * @param {function} callback
 */
function update_record( table, data, where, callback ) {
    log( 'update_record()' );
    try {
	var filters = get_query_obj( where, "" );
	db_obj.data( table )
		.withHeaders( { Authorization: 'Bearer ' + localStorage.token } )
		.update( data, filters,
			function ( data ) {
			    log( 'success' );
			    callback( data );
			},
			function ( data ) {
			    log( 'fail' );
			    callback( data );
			} );
    } catch ( e ) {
	log( e );
    }
}

/*
 * Delete record
 * @param {string} table
 * @param {object} where
 * @returns {object}
 */
function delete_record( table, where, callback ) {
    log( 'delete_record()' );

    try {
	var result = { };
	var filters = get_query_obj( where );
	db_obj.data( table )
		.withHeaders( { Authorization: 'Bearer ' + localStorage.token } )
		.destroy( filters,
			function ( data ) {
			    log( 'success' );
			    result = data;

			    if ( isset( callback ) )
				callback( data );
			},
			function ( data ) {
			    log( 'fail' );
			    result = data;

			    if ( isset( callback ) )
				callback( data );
			} );
    } catch ( e ) {
	log( e );
    }

    return result;
}

/*
 * Register user on telerik
 * @param {string} username
 * @param {string} password
 * @param {function} callback
 */
function register_portal_user( username, password, callback ) {
    log( 'register_portal_user()' );

    try {
	if ( !secure_mode && isset( callback ) )
	    callback();
	else
	    db_obj.Users
		    .register( username, password, null, function ( data ) {
			log( 'success' );
			log( data );

			set_global_var( global_vars.PORTAL_USER_ID, data.result.Id );
			set_global_var( global_vars.APP_USER_ID, localStorage.appUserId );

			invoke_cloud_function( 'SetOwnerForApp', {
			    queryStringParams: {
				user_id: get_global_var( global_vars.PORTAL_USER_ID ),
				app_user_id: get_global_var( global_vars.APP_USER_ID ),
			    }
			} );
			portal_login( callback );
		    }, function ( data ) {
			log( 'success' );
			log( data );
			portal_login( callback );
		    } );
    } catch ( e ) {
	log( e );
    }
}

/*
 * Function for logging into the portal
 * @param {function} callback
 */
function portal_login( callback ) {
    log( 'portal_login()' );

    try {
	db_obj.authentication
		.login( get_device_id(), get_device_id() )
		.then( function ( data ) {
		    console.log( 'success' );
		    log( data );

		    set_auth_token( data.result.access_token );
		    if ( isset( callback ) )
			callback();
		}, function ( error ) {
		    log( 'error' );
		    log( error );
		    if ( isset( callback ) )
			callback();
		} );
    } catch ( e ) {
	log( e );
    }
}


/*
 * Common cloud functions
 * @param {string} function_name
 * @param {object} params
 * @param {function} callback
 */
function invoke_cloud_function( function_name, params, callback ) {
    log( 'invoke_cloud_function()' );

    try {
	db_obj.businessLogic
		.invokeCloudFunction( function_name, params )
		.then( function ( data ) {
		    log( 'success' );
		    if ( isset( callback ) )
			callback( data );
		}, function ( data ) {
		    log( 'error' );
		    if ( isset( callback ) )
			callback( data );
		} );
    } catch ( e ) {
	log( e );
    }
}

/*
 * Common DB functions
 * @param {object} filters
 * @returns {object}
 */

function get_query_obj( filters, order ) {
    log( 'get_query_obj()' );

    try {
	query_obj = new Everlive.Query();
	if ( order.length )
	    query_obj.order( order );

	if ( isset( filters ) ) {
	    where = query_obj.where();
	    switch ( filters.type ) {
		case 'single':
		    get_filters( filters.where[0].clauses );
		    break;
		case 'multiple':
		    $.each( filters.where, function ( i, data ) {
			if ( data.type == 'and' )
			    where.and();
			else if ( data.type == 'or' )
			    where.or();

			get_filters( data.clauses );
			where.done();
		    } );
		    break;
	    }
	    log( where );
	    where.done();
	}
    } catch ( e ) {
	log( e );
    }

    return query_obj;
}

/*
 * Common DB functions
 * @param {array} clauses
 * @returns {none}
 */
function get_filters( clauses ) {
    log( 'get_filters()' );
    log( clauses );

    try {
	if ( isset( clauses ) ) {
	    $.each( clauses, function ( i, data ) {
		log( data );
		switch ( data.action ) {
		    case '=':
			where.eq( data.clause.column, data.clause.value );
			break;
		    case '!=':
		    case '<>':
			where.ne( data.clause.column, data.clause.value );
			break;
		    case '>':
			where.gt( data.clause.column, data.clause.value );
			break;
		    case '<':
			where.lt( data.clause.column, data.clause.value );
			break;
		    case '>=':
			where.gte( data.clause.column, data.clause.value );
			break;
		    case '<=':
			where.lte( data.clause.column, data.clause.value );
			break;
		    case 'in':
			where.isin( data.clause.column, data.clause.value );
			break;
		    case 'like':
			where.regex( data.clause.column, data.clause.value, 'i' );
			break;
		}
	    } );
	}
    } catch ( e ) {
	log( e );
    }
}

/*
 // Sample JSON
 var single = {
 type: 'single',
 where: [
 {
 type: 'none',
 clauses: [
 {
 action: '=',
 clause: {
 column: 'name',
 value: 'Dummy'
 }
 },
 ]
 }
 ]
 };
 var multiple = {
 type: 'multiple',
 where: [
 {
 type: 'and',
 clauses: [
 {
 action: '=',
 clause: {
 column: 'name',
 value: 'Dummy'
 }
 },
 {
 action: '>=',
 clause: {
 column: 'name',
 value: 'Dummy'
 }
 },
 {
 action: '<=',
 clause: {
 column: 'name',
 value: 'Dummy'
 }
 },
 ]
 },
 {
 type: 'and',
 clauses: [
 {
 type: '>',
 clause: {
 column: 'name',
 value: 'Dummy'
 }
 }
 ]
 },
 ]
 };
 */
