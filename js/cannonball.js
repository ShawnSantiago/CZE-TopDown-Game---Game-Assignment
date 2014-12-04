// Cannon ball class
(function() {


    function CannonBall(startX, startY, radius) {
        // Initial values
        // For our purposes, the cannon ball always starts from
        // the same position (i.e. the player's base)
        this.startX     = startX || 0;
        this.startY     = startY || 0;
        this.x          = this.startX;
        this.y          = this.startY;
        this.radius     = radius || 1;
        // These will be updated as the cannon ball moves
        this.angle      = 0;
        this.velocity   = 1;
        this.t          = 0;

        // Give it a classic cannonball look.
        this.style      = "black";

        this.alive      = false;


        this.lastPath   = [];
        this.pathTimeCounter = 0;
        // Its a circle so we'll make a square by getting
        // the upper-left corner by minusing the radius
        // and then double to get the width and height.
        this.boundingBox = {
            x: this.x - this.radius,
            y: this.y - this.radius,
            width: this.radius*2, 
            height: this.radius*2 
        }

        this.showBoundingBox = false;

    }

    // Call this everytime you want to fire this cannon ball
    CannonBall.prototype.shoot = function(velocity, angle, startX, startY) {
        this.startX     = startX
        this.startY     = startY
        this.x          = this.startX;
        this.y          = this.startY;
        this.angle      = angle;
        this.velocity   = velocity;
        this.t          = 0;

        this.alive      = true;

        this.pathTimeCounter = 0;
        this.lastPath   = [];
        // console.log(this.startX)
        // console.log(this.startY)
    }

    CannonBall.prototype.update = function(deltaTime, gravity) {
        if(this.alive) {
            var vx, vy;

            this.t += deltaTime;

            // Calculate the velocity for x and y at time t:
            // Vx = V0 * time * cos(angle)
            vx = this.velocity * this.t * Math.cos(Utils.deg2rad(this.angle));
            // Vy = V0 * time * sin(angle) - (gravity * time^2) / 2            
            // Note: instead of dividing by 2, CPU calculations are faster if you use multiplication 
            // so use 0.5 instead because 1/2 == 0.5            
            vy = this.velocity * this.t * Math.sin(Utils.deg2rad(this.angle)) - gravity * this.t * this.t * 0.5;

            this.x = this.startX + vx;
            this.y = this.startY + vy;


            // Then update our bounding box so it has the proper coordinates
            this.boundingBox.x = this.x - this.radius;
            this.boundingBox.y = this.y - this.radius;


            this.pathTimeCounter += deltaTime;
            if(this.pathTimeCounter > 0.25) {
                this.lastPath.push({x:this.x, y:this.y});
                this.pathTimeCounter = 0;
               
            }

        } 
    }

    CannonBall.prototype.render = function(context) {

        //if(this.alive) {
            // Render the visual representation of the player
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            context.fillStyle = this.style;
            context.fill();   

            var len = this.lastPath.length;
            // for(var i=0; i<len; i++) {
            //     context.beginPath();
            //     context.arc(this.lastPath[i].x, this.lastPath[i].y, 2, 0, 2 * Math.PI, false);
            //     context.fillStyle = "#fff";
            //     context.fill();  
            // }

            // Show the bounding box by uncommenting these lines

            if(this.showBoundingBox) {
                context.save();
                context.strokeStyle = "red";
                context.lineWidth = 1;
                context.strokeRect(this.boundingBox.x+0.5, this.boundingBox.y+0.5, this.boundingBox.width-1, this.boundingBox.height-1);
                context.restore();   
            }
        //}
    }

    // Even though we can set alive outside of cannonball, its
    // always better to modify class variables internally.
    CannonBall.prototype.kill = function() {
        this.alive = false;
        
        // If dead, just place at start location
        this.x = this.startX;
        this.y = this.startY;

    }

    CannonBall.prototype.intersectsWith = function(rectX, rectY, rectWidth, rectHeight) {

        if (rectX < this.boundingBox.x + this.boundingBox.width && this.boundingBox.x < rectX + rectWidth && rectY < this.boundingBox.y + this.boundingBox.height)
            return this.boundingBox.y < rectY + rectHeight;
        else
            return false;
    }


    window.CannonBall = CannonBall;
})();
