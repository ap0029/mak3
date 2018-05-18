function woninglist() {
    console.log('woninglist');
    $('div.card-content').html("");
    $('div[data-page="woninglist"] div.navbar').hide();
    forceAppendLoader();
    fetch_record( db_tables.WONING_TABLE, {}, 'identificatie', function ( data ) {
            console.log("data");
            // console.log(data);
            var woning_records = [ ], listTemplate='<div class="list-block media-list mlist"><ul>';
            if ( isset( data.result ) && isset( data.result.length ) ){
                var filterData = get_global_var(global_vars.FILTER_DATA), parsedFilterData;
                if( filterData=="" ){
                    for ( var i = 0; i < data.result.length; i++ ) {
                        var encodedMedia = data.result[i].media,
                            decodedMedia = decodeURIComponent(encodedMedia).replace(/'/g,'"'),
                            imgUrl=null, parsedMedia;
                        if(decodedMedia!=""&&decodedMedia!=null){
                            woning_records.push({
                                prijs:data.result[i].prijs,
                                identificatie:data.result[i].identificatie,
                                kamers:data.result[i].kamers,
                                woonoppervlakte:data.result[i].woonoppervlakte,
                                straat:data.result[i].straat,
                                encodedMedia:data.result[i].media,
                                tuin:data.result[i].tuin,
                                lat:data.result[i].coordinates_1,
                                lng:data.result[i].coordinates_2,
                                bouwjaar:data.result[i].bouwjaar,
                                perceeloppervlakte:data.result[i].perceeloppervlakte,
                                woonruimte:data.result[i].woonruimte,
                                typesoort:data.result[i].type_soort,
                                stad:data.result[i].stad,
                                omschrijving:data.result[i].omschrijving,
                                koop:data.result[i].koop,
                                huur:data.result[i].huur,
                                ligging:data.result[i].ligging,
                                status:data.result[i].status,
                                energielabel:data.result[i].energielabel,
                                garage:data.result[i].garage
                            });
                            parsedMedia = JSON.parse(decodedMedia);
                            imgUrl=containerUrl+parsedMedia.media[0][0];
                            listTemplate+='<li>'+
                                '<a href="javascript:gotoDetailPage('+data.result[i].identificatie+')" class="item-link item-content">'+
                                        //'<div class="item-media"><img src="'+imgUrl+'" width="44"/></div>'+
                                        '<div class="item-media"><img id="img-'+data.result[i].identificatie+'" class="list-img" data-img="'+imgUrl+'" src="assets/images/loading_spinner.gif" width="44"/></div>'+
                                        '<div class="item-inner">'+
                                            '<div class="item-title-row">'+
                                                '<div class="item-title">'+data.result[i].straat+'<div class="item-header list-sub">'+data.result[i].stad+'</div></div>'+
                                            '</div>'+
                                            '<div class="item-subtitle">'+data.result[i].stad+'</div>'+
                                            '<div class="item-subtitle">€'+data.result[i].prijs+' '+data.result[i].woonoppervlakte+'m² '+data.result[i].kamers+' kamers</div>'+
                                        '</div>'+
                                '</a>'+
                            '</li>';
                        }
                    }
                    listTemplate+="</ul></div>";
                    $('div.card-content').html(listTemplate);
                    loadImages();
                    set_global_var("WONING_RECORDS", JSON.stringify( woning_records ));
                }else{
                    filterResults(data.result);
                }
            }else{
                console.log('Something went wrong');
            }
            var fromLogin = get_global_var( "fromLogin");
            if(fromLogin=="true"){
                set_global_var( "fromLogin", "false" );
                main_view.router.loadPage("pages/"+app_name.toLowerCase()+"/filter.html");
                $('div.navbar').show();
            }else{
                var loader = setInterval( function ( ) {
                    $('div.navbar').show();
                    hide_indicator( );
                    clearInterval( loader );
                }, 700 );
            }
        }
    );
}
function gotoFilter(){
    main_view.router.loadPage("pages/"+app_name.toLowerCase()+"/filter.html");
}
function gotoDetailPage(id){
    forceAppendLoader();
    set_global_var("CURRENT_WONING_ID", id);
    main_view.router.loadPage("pages/"+app_name.toLowerCase()+"/detailpage.html");
}
function filterResults(data){
    console.log(data)
    $('div.card-content').html("");
    var filterData = get_global_var(global_vars.FILTER_DATA),
        parsedFilterData = JSON.parse(filterData), woning_records = [ ],
        listTemplate='<div class="list-block media-list mlist"><ul>',
		straal = parsedFilterData.straal==""?0:+parsedFilterData.straal,
		prijs_van = parsedFilterData.prijs_van==""?0:+parsedFilterData.prijs_van,
		prijs_tot = parsedFilterData.prijs_tot==""?0:+parsedFilterData.prijs_tot,
		woning = parsedFilterData.woning==""?"":parsedFilterData.woning,
		koophuur = parsedFilterData.koophuur==""?"":parsedFilterData.koophuur,
		ligging = parsedFilterData.ligging==""?"":parsedFilterData.ligging,
		energielabel = parsedFilterData.energielabel==""?"":parsedFilterData.energielabel,
		woonoppervlakte = parsedFilterData.woonoppervlakte==""?0:+parsedFilterData.woonoppervlakte,
		aantalkamers = parsedFilterData.aantalkamers==""?0:+parsedFilterData.aantalkamers,
        lat = parsedFilterData.lat==""?"":parsedFilterData.lat,
        lng = parsedFilterData.lat==""?"":parsedFilterData.lng,
		place = parsedFilterData.place==""?"":parsedFilterData.place;
    for ( var i = 0; i < data.length; i++ ) {
        var encodedMedia = data[i].media,
            decodedMedia = decodeURIComponent(encodedMedia).replace(/'/g,'"'),
            imgUrl=null, parsedMedia, validPrice=true,validWoning=true,validKoop=false,validHuur=false,
			validWoonoppervlakte=true,validAantalkamers=true,validPlace=true, validEnergielabel=true, validLigging=true;
		if(( prijs_van>0||prijs_tot>0 )&&prijs_tot>prijs_van){
			if( parseInt( data[i].prijs )>=prijs_van&&parseInt( data[i].prijs )<=prijs_tot )
				validPrice=true;
			else
				validPrice=false;
		}
    if(energielabel!="") validEnergielabel=( data[i].energielabel!=""?energielabel.indexOf(data[i].energielabel)>-1:false )
    if(ligging!=""){
      validLigging=false
      if(data[i].ligging!=""){
        var liggingData = data[i].ligging.indexOf(",")>-1?data[i].ligging.split(","):data[i].ligging
        validLigging = (typeof ligging == 'string' ?
          liggingData.indexOf(ligging)>-1:
          ligging.filter( (item) => liggingData.indexOf(item)>-1).length > 0)
      }
    }
    if(koophuur!=""){
      if(koophuur.indexOf('koop')>-1) validKoop=true;
      if(koophuur.indexOf('huur')>-1) validHuur=true;
    }
		if(woning!=""){
			if(typeof woning=='object'){
				var hasMatch=false;
				for(var x = 0; x < woning.length; x++)
					if(woning[x]==data[i].type_soort) hasMatch=true;
				if(!hasMatch) validWoning=false;
			}else{
				validWoning=( woning==data[i].type_soort );
			}
		}
		if(woonoppervlakte>0) validWoonoppervlakte=(parseInt(data[i].woonoppervlakte)>=woonoppervlakte);
		if(aantalkamers>0) validAantalkamers=(parseInt(data[i].kamers)>=aantalkamers);

		if(data[i].coordinates_1!=""&&data[i].coordinates_2!=""){
			//apply radius logic here
            var checkPoint = { lat: parseFloat(data[i].coordinates_1), lng: parseFloat(data[i].coordinates_2) },
                centerPoint = { lat: lat, lng: lng };
            if(straal>0) validPlace=arePointsNear(checkPoint, centerPoint, straal);
		}else{
			if(place!="") validPlace=(data[i].straat==place||data[i].straat==place);
		}

        if(validPrice&&validWoning&&validWoonoppervlakte&&validLigging&&validAantalkamers&&validEnergielabel&&validPlace&&decodedMedia!=""&&decodedMedia!=null){
            var allowRecord = true;
            if(( !validKoop&&!validHuur ) || ( validKoop&&validHuur )){
              allowRecord = true;
            }else{
              if(validKoop) allowRecord = data[i].koop&&(!data[i].huur);
              if(validHuur) allowRecord = data[i].huur&&(!data[i].koop);
            }
            if(allowRecord){
              woning_records.push({
                  prijs:data[i].prijs,
                  identificatie:data[i].identificatie,
                  kamers:data[i].kamers,
                  woonoppervlakte:data[i].woonoppervlakte,
                  straat:data[i].straat,
                  encodedMedia:data[i].media,
                  tuin:data[i].tuin,
                  lat:data[i].coordinates_1,
                  lng:data[i].coordinates_2,
                  bouwjaar:data[i].bouwjaar,
                  perceeloppervlakte:data[i].perceeloppervlakte,
                  woonruimte:data[i].woonruimte,
                  typesoort:data[i].type_soort,
                  stad:data[i].stad,
                  omschrijving:data[i].omschrijving,
                  koop:data[i].koop,
                  huur:data[i].huur,
                  status:data[i].status,
                  ligging:data[i].ligging,
                  energielabel:data[i].energielabel,
                  garage:data[i].garage
              });
              parsedMedia = JSON.parse(decodedMedia);
              imgUrl=containerUrl+parsedMedia.media[0][0];
              listTemplate+='<li>'+
                  '<a href="javascript:gotoDetailPage('+data[i].identificatie+')" class="item-link item-content">'+
                          //'<div class="item-media"><img src="'+imgUrl+'" width="44"/></div>'+
                          '<div class="item-media"><img id="img-'+data[i].identificatie+'" class="list-img" data-img="'+imgUrl+'" src="assets/images/loading_spinner.gif" width="44"/></div>'+
                          '<div class="item-inner">'+
                              '<div class="item-title-row">'+
                                  '<div class="item-title">'+data[i].straat+'<div class="item-header list-sub">'+data[i].stad+'</div></div>'+
                              '</div>'+
                              '<div class="item-subtitle">€'+data[i].prijs+' '+data[i].woonoppervlakte+'m² '+data[i].kamers+' kamers</div>'+
                          '</div>'+
                  '</a>'+
              '</li>';
            }
		    }
    }
    listTemplate+="</ul></div>";
    $('div.card-content').html(listTemplate);
    loadImages();
    set_global_var("WONING_RECORDS", JSON.stringify( woning_records ));
}
function gotoHome(){
    main_view.router.loadPage("pages/"+app_name.toLowerCase()+"/home.html");
}
function loadImages(){
    $('.list-img').each(function(){
        var img = new Image(),
            imgUrl = $(this).attr("data-img")+"/128x128",
            resizedImageUrl = imgUrl.replace("original","resample"),
            cid = $(this).attr("id");
        img.onload = function() {
            document.getElementById(cid).src=img.src;
        };
        img.onerror = function() {
            document.getElementById(cid).src="assets/images/no-image.png";
        };
        img.src = resizedImageUrl;
    });
}
function arePointsNear(checkPoint, centerPoint, km) {
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
}
// for inital load
try{
    woninglist();
}catch(e){
    console.log(e);
    //main_view.router.loadPage("pages/"+app_name.toLowerCase()+"/login.html");
}
