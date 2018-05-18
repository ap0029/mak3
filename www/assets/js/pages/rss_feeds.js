function populate_rss_feeds( container, url, max_length, link_type ) {
    $.get( url, function ( data ) {
	var $XML = $( data );
	log( $XML );
	$XML.find( "item" ).each( function () {
	    var item = $( '.rss-item:first', container ).clone();
	    var details = {
		link: $( this ).find( "link" ).text(),
		title: $( this ).find( "title" ).text(),
		description: $( this ).find( "description" ).text(),
		date: $( this ).find( "date" ).text(), //(new Date($(this).find("date").text())).toLocaleString(),
	    };
	    $( '.title', item )
		    .attr( 'data-link', details.link )
		    .attr( 'data-link-type', link_type )
		    .html( details.title );
	    if ( container == '.rss-container' ) {
		$( '.description', item )
			.attr( 'data-description', details.description )
			.html( elipses( details.description, max_length ) );
	    } else {
		$( '.description', item )
			.attr( 'data-description', details.description )
			.html( details.description );
	    }
	    $( '.date', item ).html( details.date );
	    $( '.title', item ).on( 'click', function () {
		var par = $( this ).closest( '.rss-item' );
		switch ( $( this ).data( 'link-type' ) ) {
		    case 'external':
			app_browser( $( this ).data( 'link' ), 'Belastingfeeds' );
			break;
		    case 'details':
			var popupHTML = '<div class="popup with-top-margin">' +
				'<div class="top-sec theme-white"><a href="#" class="close-popup"> <i class="icon icon-back"></i> Terug naar het overzicht</a></div>' +
				'<div class="content-block">' +
				'<h3>' + $( ".title", par ).html() + '</h3>' +
				'<p>' + $( ".date", par ).html() + '</p>' +
				'<p>' + $( ".description", par ).data( 'description' ) + '</p>' +
				'</div>' +
				'</div>';
			main_app.popup( popupHTML );
			break;
		}
        setTimeout(function(){
        hide_indicator();
        }, 500);
	    } );
	    item.show().appendTo( $( container ) );
	} );

	hide_indicator();
    } );
}

function elipses( str, maxLen, separator ) {
    separator = typeof separator === 'undefined' ? ' ' : separator;
    if ( str.length <= maxLen )
	return str;
    return str.substr( 0, str.lastIndexOf( separator, maxLen ) ) + "...";
}

function nieuwsflitsen_rss() {
    var news_type = $( '#news_flashes' ).data( 'news-type' );
    var container = "";
    var url = "";
    var link_type = "details";

    if ( news_type == "nieuwsflitsen_rss" ) {
	container = '.rss-container';
	url = "http://nl.informanagement.com/rss/customfeed.aspx?command=rss&forwp=1&sjabloon=accountantz&nr=25";
    } else if ( news_type == "belastingfeeds_particulier" ) {
	container = '.bel-part-container';
	url = "http://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/berichten/nieuws/rss/nieuwsfeed_actueel_particulier.xml";
	link_type = "external";
    } else if ( news_type == "belastingfeeds_zakelijk" ) {
	container = '.bel-zak-container';
	url = "http://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/berichten/nieuws/rss/nieuwsfeed_actueel_zakelijk.xml";
	link_type = "external";
    }

    try {
	populate_rss_feeds( container, url, 100, link_type );
    } catch ( e ) {
	log( "nieuwsflitsen_rss()" );
	log( e );
    }
}

// for initial load
nieuwsflitsen_rss();