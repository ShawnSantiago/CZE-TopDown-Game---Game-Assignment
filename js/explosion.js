/*
 * Advanced Explosion effect
 * Each particle has a different size, move speed and scale speed.
 * 
 * Parameters:
 * 	x, y - explosion center
 * 	color - particles' color
 */
(function() {
	function createExplosion(x, y, color)
	{
		var minSize = 10;
		var maxSize = 30;
		var count = 10;
		var minSpeed = 60.0;
		var maxSpeed = 200.0;
		var minScaleSpeed = 1.0;
		var maxScaleSpeed = 4.0;
		
		for (var angle=0; angle<360; angle += Math.round(360/count))
		{
			var particle = new Particle();
			
			particle.x = x;
			particle.y = y;

			particle.radius = Utils.getRandomInt(minSize, maxSize);

			particle.color = color;

			particle.scaleSpeed = Utils.getRandomInt(minScaleSpeed, maxScaleSpeed);

			var speed = Utils.getRandomInt(minSpeed, maxSpeed);

			particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
			particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);

			particles.push(particle);
		}
		
	}
	window.createExplosion = createExplosion;
})();