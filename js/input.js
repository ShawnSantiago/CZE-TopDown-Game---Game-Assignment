
// Setup input



document.addEventListener('keydown', function(e) {
    var code = e.keyCode;
   
    switch(code) {   
        case 32: // Space
            spaceKeyDown = true;
            break;

        case 37: // Left
            dirKeysDown[CONST.KEY.LEFT] = true;           
            break;
        case 38: // Up
            dirKeysDown[CONST.KEY.UP] = true;
            break;
        case 39: // Right
             dirKeysDown[CONST.KEY.RIGHT] = true;            
            break;
        case 40: // Down
            dirKeysDown[CONST.KEY.DOWN] = true;          
            break;
        case 66:
            bKeyDown = true;
            break;

        default: // Do nothing

        // NOTE: To track keyboard letters, you can use
        // the following and check the letters...
        // convert ASCII codes to letters:
        // var letter = String.fromCharCode(code);
           
    }
});

document.addEventListener('keyup', function(e) {
    var code = e.keyCode;
   
    switch(code) {   
        case 32: // Space
            spaceKeyDown = false;
            break;

        case 37: // Left
            dirKeysDown[CONST.KEY.LEFT] = false;           
            break;
        case 38: // Up
            dirKeysDown[CONST.KEY.UP] = false;
            break;
        case 39: // Right
             dirKeysDown[CONST.KEY.RIGHT] = false;            
            break;
        case 40: // Down
            dirKeysDown[CONST.KEY.DOWN] = false;          
            break;
        case 66:
            bKeyDown = false;
            break;

        default: // Do nothing.
    }
});