     var easteggs = 0;
    $('#disclaimer').off('click').on('click', function () {
         
         easteggs++
                
                if (!$(this).attr('disabled') && easteggs == 10) {
                  easteggs = 0;
                
                new Keychain().removeForKey(onSuccess, onError, "APP_USER_ID", servicename);
                
                alert("Profiel verwijderd")
                  
                }

    });