(function(obj) {
    
    // Random number between 1 and max
    var _randomNum = function _randomNum(max) {
        return Math.floor((Math.random() * max) + 1);
    }

    var _getRandomInt = function _getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // Check if 2 rectangles intersect
    var _intersects = function _intersects(r1X, r1Y, r1Width, r1Height, r2X, r2Y, r2Width, r2Height) {

        if (r1X < r2X + r2Width && r2X < r1X + r1Width && r1Y < r2Y + r2Height)
            return r2Y < r1Y + r1Height;
        else
            return false;
    }

    var _deg2rad = function _deg2rad(deg) {

        return deg*Math.PI/180;
    }

    // Gets the current time.
    var _timestamp = function _timestamp() {
        if (window.performance && window.performance.now)
            return window.performance.now();
        else
            return new Date().getTime();
    }

    //// EXTRAS ////

    // Simple checkboard pattern
    var _drawCheckerboard = function _drawCheckerboard(ctx, canvas) {
       
        ctx.save();

        var numCheckerCols = 7;
        var numCheckerRows = 6;

        var checkerHeight = canvas.height/numCheckerRows;
        var checkerWidth = canvas.width/numCheckerCols;
        
        for(var r=0; r<numCheckerRows; r++) {
            for(var c=0; c<numCheckerCols; c++) {
                if (r%2 == 0)
                {
                    if (c%2 == 0)
                    {
                        ctx.fillStyle = "#eee";
                    }
                    else
                    {
                        ctx.fillStyle = "white";
                    }
                }
                else
                {
                    if (c%2 == 0)
                    {
                        ctx.fillStyle = "white";
                    }
                    else
                    {
                        ctx.fillStyle = "#eee";
                    }
                }
             
                ctx.fillRect(checkerWidth*c,checkerHeight*r,checkerWidth,checkerHeight);
            }
        }

        ctx.strokeStyle = "#888";
        ctx.strokeRect(0,0,canvas.width,canvas.height)

        ctx.restore();

    }

        // Simple checkboard pattern
    var _drawCheckerboard2 = function _drawCheckerboard2(ctx, rect, alpha) {
       
        ctx.save();

        var numCheckerCols = 100;
        var numCheckerRows = 100;

        var checkerHeight = rect.height/numCheckerRows ;
        var checkerWidth = rect.width/numCheckerCols;
        
        for(var r=0; r<numCheckerRows; r++) {
            for(var c=0; c<numCheckerCols; c++) {
                if (r%2 == 0)
                {
                    if (c%2 == 0)
                    {
                        if(alpha)
                            ctx.fillStyle = 'rgba(0,0,0,0.2)';
                        else
                            ctx.fillStyle = 'gray'
                            ctx.fillRect(rect.x + checkerWidth*c,rect.y + checkerHeight*r,checkerWidth,checkerHeight);
                    }
                }
                else
                {
                    if (c%2 == 0){
                       
                    }
                    else
                    {
                         if(alpha)
                            ctx.fillStyle = 'rgba(0,0,0,0.2)';
                        else
                            ctx.fillStyle = 'gray'
                         ctx.fillRect(rect.x + checkerWidth*c,rect.y + checkerHeight*r,checkerWidth,checkerHeight);
                    }
                }             
                
            }
        }

        ctx.strokeStyle = "#888";        
        ctx.restore();
    }

    obj.getRandomInt = _getRandomInt;
    obj.randomNum = _randomNum;
    obj.intersects = _intersects;
    obj.deg2rad = _deg2rad;
    obj.drawCheckerboard = _drawCheckerboard;
    obj.drawCheckerboard2 = _drawCheckerboard2;

})(window.Utils = window.Utils || {});