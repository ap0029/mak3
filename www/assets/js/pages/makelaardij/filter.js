var filterData=null;
function filter() {
	console.log('filter')
	forceAppendLoader();
	filterData=null;
	if(get_global_var(global_vars.FILTER_DATA)!=""){
      filterData=JSON.parse(get_global_var(global_vars.FILTER_DATA));
      $("#autocomplete").val(filterData.place);
      $("#prijs_van").val(filterData.prijs_van);
      $("#prijs_tot").val(filterData.prijs_tot);
      lat = filterData.lat;
    	lng = filterData.lng;
      placeSearch=filterData.place;
  }
	initPicklists();
	initAutocomplete();
  $( document ).off( 'click', '#filter-btn' ).on( 'click', '#filter-btn', function () {
      setFilter();
  });
  $( document ).off( 'click', '#reset-btn' ).on( 'click', '#reset-btn', function () {
      resetToDefault();
  });

}
function getSelectedValue(key,isMultiple){
	if(isMultiple){
		if(typeof key == 'string') key = [key];
	}

	return key!=""?key:"leeg"
}
function populateOptions(data,selectedValue,dom,isMultiple){
    //var straal
    $( 'select[name="'+dom+'"]' ).empty();
    var options = parse_select_options( data, 'database_name', 'name', isMultiple );
		// console.log(`${dom} - ${selectedValue} - ${isMultiple}`)
    populate_select_options( $( 'select[name="'+dom+'"]' ), options, selectedValue, isMultiple );
}
function setFilter(){
    forceAppendLoader();
    var form_data = $( 'form#filter_form' ).serializeObject(),
        filter_data = {
                straal: sanitize_value( form_data.straal, "" ),
                prijs_van: sanitize_value( form_data.prijs_van, "" ),
                prijs_tot: sanitize_value( form_data.prijs_tot, "" ),
                woning: sanitize_value( form_data.woning, "" ),//multiple
                woonoppervlakte: sanitize_value( form_data.woonoppervlakte, "" ),
                //ligging: sanitize_value( form_data.ligging, "" ),//multiple
                aantalkamers: sanitize_value( form_data.aantalkamers, "" ),
                koophuur: sanitize_value( form_data.koophuur, "" ),//multiple
                ligging: sanitize_value( form_data.ligging, "" ),//multiple
                energielabel: sanitize_value( form_data.energielabel, "" ),//multiple
                place: placeSearch,
                lat:lat,
                lng:lng
            };
    console.log(JSON.stringify(filter_data));
    set_global_var(global_vars.FILTER_DATA,JSON.stringify(filter_data))
    var fromLogin = get_global_var( "fromLogin" );
    if(fromLogin=='true'){
        set_global_var( "fromLogin", "false" );
        main_view.router.loadPage("pages/"+app_name.toLowerCase()+"/home.html");
    }else{
        set_global_var( "fromLogin", "false" );
        //window.history.back();
        main_view.router.loadPage("pages/"+app_name.toLowerCase()+"/woninglist.html");
    }
}
function initPicklists(){
    var aantalkamersData = [
        { name:"1+ kamer",database_name:"1" },
        { name:"2+ kamers",database_name:"2" },
        { name:"3+ kamers",database_name:"3" },
        { name:"4+ kamers",database_name:"4" },
        { name:"5+ kamers",database_name:"5" },
        { name:"6+ kamers",database_name:"6" }
    ];

    populateOptions(aantalkamersData,( filterData==null?"leeg":getSelectedValue(filterData.aantalkamers,false) ),"aantalkamers",false);
    var woonoppervlakteData = [
        { name:"50+",database_name:"50" },
        { name:"75+",database_name:"75" },
        { name:"100+",database_name:"100" },
        { name:"150+",database_name:"150" }
    ];
    populateOptions(woonoppervlakteData,( filterData==null?"leeg":getSelectedValue(filterData.woonoppervlakte,false) ),"woonoppervlakte",false);
    var woningData = [
        { name:"Appartement",database_name:"appartement" },
        { name:"Woonhuis",database_name:"woonhuis" },
        { name:"Berging",database_name:"berging" },
        { name:"Bouwgrond",database_name:"bouwgrond" },
        { name:"Garage",database_name:"garage" },
        { name:"Ligplaats",database_name:"ligplaats" },
        { name:"Parkeerkelder",database_name:"parkeerkelder" },
        { name:"Stacaravanstandplaats",database_name:"stacaravanstandplaats" },
        { name:"Woonwagenstandplaats",database_name:"woonwagenstandplaats" }
    ];
		// console.log(`woningData: ${getSelectedValue(filterData.woning,true)}`)
    // populateOptions(woningData,["appartement","woonhuis","berging"],"woning",true);
    populateOptions(woningData,( filterData==null?"leeg":getSelectedValue(filterData.woning,true) ),"woning",true);
    var straalData = [
        { name:"10 km",database_name:"10" },
        { name:"20 km",database_name:"20" },
        { name:"30 km",database_name:"30" }
    ];
    populateOptions(straalData,( filterData==null?"leeg":getSelectedValue(filterData.straal,false) ),"straal",false);
    var koopHuurData = [
        { name:"Te Koop",database_name:"koop" },
        { name:"Te Huur",database_name:"huur" }//d0edd0d0-17c6-11e8-a006-8f11f45efb6f
    ];
    populateOptions(koopHuurData,( filterData==null?"leeg":getSelectedValue(filterData.koophuur,true) ),"koophuur",true);
    var liggingData = [
        { name:"aan bosrand",database_name:"aan bosrand" },
        { name:"aan drukke weg",database_name:"aan drukke weg" },
        { name:"aan park",database_name:"aan park" },
        { name:"aan rustige weg",database_name:"aan rustige weg" },
        { name:"aan water",database_name:"aan water" },
        { name:"beschutte ligging",database_name:"beschutte ligging" },
        { name:"buiten bebouwde kom",database_name:"buiten bebouwde kom" },
        { name:"in centrum",database_name:"in centrum" },
        { name:"in woonwijk",database_name:"in woonwijk" },
        { name:"vrij uitzicht",database_name:"vrij uitzicht" },
        { name:"open ligging",database_name:"open ligging" },
        { name:"aan vaarwater",database_name:"aan vaarwater" },
        { name:"in bosrijke omgeving",database_name:"in bosrijke omgeving" },
        { name:"landelijk gelegen",database_name:"landelijk gelegen" }
    ];
    populateOptions(liggingData,( filterData==null?"leeg":getSelectedValue(filterData.ligging,true) ),"ligging",true);
    var energielabelData = [
        { name:"A+++++",database_name:"A+++++" },
        { name:"A++++",database_name:"A++++" },
        { name:"A+++",database_name:"A+++" },
        { name:"A++",database_name:"A++" },
        { name:"A+",database_name:"A+" },
        { name:"A",database_name:"A" },
        { name:"B",database_name:"B" },
        { name:"C",database_name:"C" },
        { name:"D",database_name:"D" },
        { name:"E",database_name:"E" },
        { name:"F",database_name:"F" },
        { name:"G",database_name:"G" }
    ];
    populateOptions(energielabelData,( filterData==null?"leeg":getSelectedValue(filterData.energielabel,true) ),"energielabel",true);
}
function resetPicklistDom(el){
    $( 'select[name="'+el+'"]' ).empty();
    $( 'select[name="'+el+'"]' ).parent().children().find('.item-content').children()
		.last().children().last().html(`<div class="item-title">Woonoppervlakte</div>
		<div class="item-after">Maak uw keuze</div>`);
		console.log($( 'select[name="'+el+'"]' ).parent().children().find('.item-content').children()
		.last().children().last().html())
}
function resetToDefault(){
        $("#autocomplete").val("");
        $("#prijs_van").val("");
        $("#prijs_tot").val("");//
        resetPicklistDom("straal");
        resetPicklistDom("woning");
        resetPicklistDom("woonoppervlakte");
        resetPicklistDom("aantalkamers");
        resetPicklistDom("koophuur");
        resetPicklistDom("ligging");
        resetPicklistDom("energielabel");
        placeSearch="";
        lat="";
        lng="";
        filterData=null;
        set_global_var(global_vars.FILTER_DATA,"");
        initPicklists();
}
var placeSearch="", autocomplete, lat="", lng="";
var componentForm = {
	street_number: 'short_name',
	route: 'long_name',
	locality: 'long_name',
	administrative_area_level_1: 'short_name',
	country: 'long_name',
	postal_code: 'short_name'
};

function initAutocomplete() {
	// Create the autocomplete object, restricting the search to geographical
	// location types.
	autocomplete = new google.maps.places.Autocomplete(
		/** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
		{types: ['geocode']});

	// When the user selects an address from the dropdown, populate the address
	// fields in the form.
	autocomplete.addListener('place_changed', fillInAddress);
    $(document).on({
        'DOMNodeInserted': function() {
            $('.pac-item, .pac-item span', this).addClass('no-fastclick');
        }
    }, '.pac-container');
    $("#autocomplete").on("focus",function(){
        $(this).css('padding-bottom','5px');
        $('.pac-container').css('top','5px');
    });
    $("#autocomplete").on("blur",function(){
        if($(this).val()==""){
          lat = "";
        	lng = "";
          placeSearch="";
        }
    });
    targetNeedsFastClick( $('.pac-container') );
    var loader = setInterval( function ( ) {
        hide_indicator( );
        clearInterval( loader );
    }, 700 );
}
function targetNeedsFastClick(el) {
   var $el = $(el);
   if ($el.hasClass('no-fastclick') || $el.parents('.no-fastclick').length > 0) return false;
   return true;
 }
function fillInAddress() {
	// Get the place details from the autocomplete object.
	var place = autocomplete.getPlace();
	lat = String( place.geometry.location.lat() );
	lng = String( place.geometry.location.lng() );
    placeSearch=place.name;
	for (var i = 0; i < place.address_components.length; i++) {
		var addressType = place.address_components[i].types[0];
		if (componentForm[addressType]) {
			var val = place.address_components[i][componentForm[addressType]];
		}
	}
}

function geolocate() {
    if (navigator.geolocation) {
        var mlatitude = 52.370216, mlongitude = 4.895168,
            geolocation = {
                lat: mlatitude,
                lng: mlongitude
            };
        var circle = new google.maps.Circle({
            center: geolocation,
            radius: Math.sqrt(10) * 100000
        });
        autocomplete.setBounds(circle.getBounds());
    }
}
filter();
