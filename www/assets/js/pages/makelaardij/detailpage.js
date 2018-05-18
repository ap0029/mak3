function detailpage() {
    hide_indicator( );
    var woningRecords = getWoning(),
        encodedMedia = woningRecords.encodedMedia,
        decodedMedia = decodeURIComponent(encodedMedia).replace(/'/g,'"'),
        imgUrl=null,
        parsedMedia;
    if(decodedMedia!=""&&decodedMedia!=null){
        parsedMedia = JSON.parse(decodedMedia);
        imgUrl=containerUrl+parsedMedia.media[0][0];
        $('#banner-img').attr('src',imgUrl).on('error',function(){
            console.log('image on error!');
            $(this).attr('src','assets/images/no-image.png');
            $('p.pb-popup').attr('data-hasImage','0');
            $('p.pb-loader').hide();
            $('p.pb-indicator').hide();
        });
        $('#banner-img').each(function(){
            var img = new Image();
            img.onload = function() {
                console.log($(this).attr('src') + ' - done!');
                $('p.pb-loader').hide();
                $('p.pb-indicator').show();
                $('p.pb-popup').attr('data-hasImage','1');
            }
            try{
                img.src = imgUrl;
            }catch(e){ alert(e); }
        });
    }
    console.log(`woningRecords`)
    console.log(woningRecords)
    Object.keys(woningRecords).forEach(function(key,index){
        console.log(`${key}: ${woningRecords[key]}`)
        $('#'+key).html( ( key=="woonoppervlakte"?woningRecords[key]+"m²":( woningRecords[key]==""?"None":woningRecords[key] ) ) );
    });
    /*
    $(document).on({
        'DOMNodeInserted': function() {
            console.log('DOMNodeInserted');
            $('a.link.photo-browser-close-link span').html('Terug');
            //$('.photo-browser-of').html('van');
        }
    }, '.photo-browser');*/
}
function gotoStel(){
  main_view.router.loadPage("pages/"+app_name.toLowerCase()+"/stel_een_vraag.html");
}
detailpage();
