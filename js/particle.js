
(function() {
	function Particle ()
		{
		    this.scale = 1.0;
		    this.x = 0;
		    this.y = 0;
		    this.radius = 20;
		    this.color = "#000";
		    this.velocityX = 0;
		    this.velocityY = 0;
		    this.scaleSpeed = 0.5;
		};

	    Particle.prototype.update = function(deltaTime)
	    {
	        // shrinking
	        this.scale -= this.scaleSpeed * deltaTime;

	        if (this.scale <= 0)
	        {
	            this.scale = 0;
	        }
	        // moving away from explosion center
	        this.x += this.velocityX * deltaTime;
	        this.y += this.velocityY * deltaTime;

	    };

	    Particle.prototype.render = function(context)
	    {
	        // translating the 2D context to the particle coordinates
	        context.save();
	        context.translate(this.x, this.y);
	        context.scale(this.scale, this.scale);

	        // drawing a filled circle in the particle's local space
	        context.beginPath();
	        context.arc(0, 0, this.radius, 0, Math.PI*2, true);
	        context.closePath();

	        context.fillStyle = this.color;
	        context.fill();

	        context.restore();
	    };
		
	window.Particle = Particle;
})();