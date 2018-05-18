try{
    function recordvoice( ) {
        //forceAppendLoader();
        hideLoader();
    }

    var isRecording = false, 
        media_src = "", mediaRec, newSrc="";
    function startRecording(){
        if(media_src==""){
            media_src = (device.platform == 'Android'?"sound.wav":"cdvfile://localhost/temporary/sound.wav");
            mediaRec = new Media(media_src,
                function() {
                    showModal();
                },
                function(err) {
                    alert("recordAudio():Audio Error: "+ JSON.stringify(err));
                    alert("ios path: "+ media_src);
                }
            );
        }
        if(!isRecording){
            isRecording=true;
            $('#btrecord').attr('class','active-btn button button-big button-raised button-fill col-100').html('Stop voicebericht');
            mediaRec.startRecord();
        }else{
            newSrc=media_src;
            media_src="";
            isRecording=false;
            $('#btrecord').attr('class','inactive-btn button button-big button-raised button-fill col-100').html('Stuur ons een voicebericht');
            mediaRec.stopRecord();
        }
    }
    function sendMail(){
        if(!isAudioPlaying){
            if (device.platform == 'Android'){
                newSrc = "file:///sdcard/"+newSrc;
                sendActionMail(newSrc)
            }else{
                newSrc = newSrc.replace('cdvfile://','file:///');
                testFile();
            }
        }
    }
    function sendActionMail(newSrc){
        window.plugins.socialsharing.shareViaEmail(     
            '',
            'U heeft een onbeluisterd voicebericht ontvangen via uw App',
            localStorage.getItem("emailNotification"), // TO: must be null or an array
            null, // CC: must be null or an array
            null, // BCC: must be null or an array
            newSrc, // FILES: null, a string, or an array
            function(result){
                $('.notify-popup-recorder').removeClass('show');
                //alert(result);
                //hideModal();
            }, // called when email was sent or canceled, no way to differentiate
            function(result){
                $('.notify-popup-recorder').removeClass('show');
                //alert(result);
                //hideModal();
            } // called when something unexpected happened
        );
    }
    function testFile(){
        var grantedBytes = 0;
        window.requestFileSystem(LocalFileSystem.TEMPORARY, grantedBytes, function(fileSystem) {
            fileSystem.root.getFile("sound.wav", {create: true}, function(entry) {
                var fileEntry = entry;
                //alert(JSON.stringify(entry));
                sendActionMail(entry.nativeURL)
            }, function(error){
                alert('Unexpected error has occured');
            });
        },
        function(error){
            // console.log( event.target.error.code );
            alert('Unexpected error has occured: ' + error.code);
        });
    }
    function getPhoneGapPath() {
        var path = window.location.pathname;
        var phoneGapPath = path.substring(0, path.lastIndexOf('/') + 1);
        return phoneGapPath;
    }
    function showModal(){
        $('.notify-popup-recorder').addClass('show');
    }
    function hideModal(){
        if(!isAudioPlaying){$('.notify-popup-recorder').removeClass('show');}
    }
    var isAudioPlaying=false;
    function playAudio() {
        disableModalButtons();
        isAudioPlaying=true;
        var media = new Media(newSrc, function(){
            enableModalButtons();
            isAudioPlaying=false;
            //alert("success");
        }, function(error){
            enableModalButtons();
            isAudioPlaying=false;
            //alert("error playing media: "+JSON.stringify(error));
        });
        media.play({numberOfLoops: 1});
    }
    function disableModalButtons(){
        $('body .btrecorder-mail').each(function(){ $(this).removeClass('enabled-link-btn').addClass('disabled-link-btn'); });
    }
    function enableModalButtons(){
        $('body .btrecorder-mail').each(function(){ $(this).removeClass('disabled-link-btn').addClass('enabled-link-btn'); });
    }
    // for initial load
    recordvoice( );
}
catch(e){
    log(e);
}