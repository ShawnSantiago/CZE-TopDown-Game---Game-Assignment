(function() {

    // spriteSheetImg - the image containing all the frames
    // xFrameRef - the column position starting at 0 in spritesheet where sprite frames start
    // yFrameRef - the row position starting at 0 in spritesheet where sprite frames start
    // tankSpeed - how fast the tank moves
    function tank(spriteSheetImg, xFrameRef, yFrameRef, tankSpeed) {

        // tank's position
        this.x = 0;
        this.y = 0;

        this.xFrameRef = xFrameRef || 0; // tank 9,0
        this.yFrameRef = yFrameRef || 5.3; // The starting position of the y sprite frame
        this.width = 59.3; // width, height - same as sprite
        this.height = 47;

        // A tank "has a" sprite
        this.sprite = new Sprite(spriteSheetImg, this.xFrameRef, this.yFrameRef, this.width, this.height, 10, 5, false); 

        // Change the row position in the sprite sheet
        // do show different walk states
        this.dir = 1; // 0-3 random facing value to start
        this.facing = {
            left: 1
           
        };

        this.cannonBall = new CannonBall(this.x , this.y , 10);


        this.tankSpeed = tankSpeed || 2.0;

        // Change direction counter:
        this.counter = 0;
        this.counterThreshold = Utils.randomNum(3); // 1-3 sec.

        // Property of tank
        this.alive = false; // Alive to start
    };

    // Call this before update()
    tank.prototype.updateDirection = function(deltaTime) {
        this.counter += deltaTime;
        if(this.counter >= this.counterThreshold) {
            this.counter = 0;

            // Change direction
            this.dir = 1; // 0-3
        }
    }

    tank.prototype.shoot = function() {
       
        this.cannonBall.shoot(1000, 180, this.x ,this.y)
    }

    tank.prototype.reset = function() {
       
        this.cannonBall.alive = false;
    }


    tank.prototype.update = function(deltaTime) {
        if(this.alive) {

            
            // We transfer the coordinates of the player
            // to it's visual representation (i.e. the sprite)
            this.sprite.x = this.x;
            this.sprite.y = this.y;

            // Include the starting reference along with the row
            // (this sprite sheet has 4 rows, with 3 frames for each direction)
            this.sprite.frameYOffset = this.yFrameRef + this.dir;
 
            // Now make sure the sprite updates
            this.sprite.update(deltaTime);
            this.cannonBall.update(deltaTime,0);

        }
    }

    tank.prototype.render = function(context) {
        if(this.alive) {
            
            this.sprite.render(context); 
            this.cannonBall.render(context)  
        }      
    }

    // Provide the position and dimensions of a rectangle to compare with player rect
    // Returns true if player intersecting with the given rectangle
    tank.prototype.intersectsWith = function(rectX, rectY, rectWidth, rectHeight) {

        if (rectX < this.x + this.width && this.x < rectX + rectWidth && rectY < this.y + this.height)
            return this.y < rectY + rectHeight;
        else
            return false;
    }

    window.tank = tank;

})();