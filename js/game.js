// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
    console.log("requestAnimFrame");
    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();


///////////////////

// Get the canvas and then the context
var canvas = document.getElementById("appCanvas");
var ctx = canvas.getContext("2d");

// Variables to hold whether keys are pressed or not
// true means down.
// [Up, Right, Down, Left] 
var dirKeysDown = [false, false, false, false];
// Define the array indexes for dirKeysDown
// for easy reference ltter

// Define our constants (values that never change)
// Formatted in a nice object and we use capitals to make it more obvious
// that we shouldn't modify these at runtime. It is still a normal object
// just like anyother.
var CONST = {  
    GRAVITY: 0.3,
    FRICTION: 0.8,
    NumofTrees: 40,
    tank_SPEED: 5.0,
    NUM_cannonballs: 6,
    NUM_groupOftanks: 6,
    NumofPlatforms :10,
    DEFAULT_GRAVITY: 0
};

CONST.KEY = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
};
var spaceKeyDown = false;
// var cannonBall = null;
var gravity = CONST.DEFAULT_GRAVITY;
// Load assets

var animalSpriteSheet = new Image();
// var cheese = new Image();
var characerSpriteSheet = new Image();
// cheese.onload = function() {
//     // Setup the game    
//     init()
// }
// animalSpriteSheet.onload = function() {
    
// }
characerSpriteSheet.onload = function() {
    init();
}
animalSpriteSheet.onload = function() {
    
}
// animalSpriteSheet.src = 'assets/food_sheet.png';
// cheese.src = 'assets/I_C_Cheese.png';
characerSpriteSheet.src = 'assets/sumoHulk_spriteSheet_x4.png';
animalSpriteSheet.src = 'assets/Baddies-MS2M.gif';

// An object to store all the player's properties.
// Notice, this is just a plain object. Our player isn't a sprite or class
// in this example.
// var player = {
//     x: 0,
//     y: 0,
//     lastX: 0,
//     lastY: 0,
//     width: 50,
//     height:50,
//     color: "red",
//     moveSpeed: 3,
//     jumpSpeed: 15,
//     velocityX: 0,
//     velocityY: 0,
//     jumping: true,
//     grounded: false
// }
// var tree = {
//     x: 80,
//     y: 400,
//     width: 20,
//     height: 150,
//     parallaxSpeed: 0.85
// }
var cannonBalls = [];
var groupOftanks = [];
var tree = [];
var treeTop = [];
var particles = [];


for (var i = 0; i <  CONST.NumofTrees; i++) {
  tree.push(new createTree());
  treeTop.push(new createTreeTop());
};

function createTreeTop() {
    var randomTreeX = 0;
    
    for (var i = 0; i < tree.length; i++) {
        randomTreeX = (i*100) - 10;
    };
    this.x = randomTreeX ;
    this.y = 720 ;
    this.width = 40;
    this.height = 40;
    this.parallaxSpeed = 1.25;
    this.color = "green";
};

function createTree() {
    var randomTreeX = 0;
    
    for (var i = 0; i < tree.length; i++) {
        randomTreeX = i*100;
    };
    this.x = randomTreeX ;
    this.y = 760 ;
    this.width = 20;
    this.height = 120;
    this.parallaxSpeed = 1.25;
    this.color = "#8C6C62";
};

var platforms = [];

for (var i = 0; i <  CONST.NumofPlatforms; i++) {
  platforms.push(new createPlatform());
};



function createPlatform() {
    var randomPlaformX = 0;
    var randomPlaformY = Utils.getRandomInt(100, 650);
    var randomWidth = Utils.getRandomInt(100, 350);
    for (var i = 0; i < platforms.length; i++) {
        randomPlaformX = platforms[i].x + platforms[i].width + 100 ;
    };
    // for (var i = 0; i < platforms.length; i++) {
    //     randomPlaformY = randomPlaformY + platforms[i].y + platforms[i].height ;
    // };
    this.x = randomPlaformX ;
    this.y = randomPlaformY ;
    this.width = randomWidth;
    this.height = 50;
    this.color = "white";
};


// The virtual container for all the objects
// We use this to translate stuff on the canvas
// as the canvas will be a smaller view into this world.
var world = {
    x: 0,
    y: 0,
    width: 2280,
    height: canvas.height
}

// A moon to parallax
// We'll use the parallaxSpeed to move this
// moon at a % of some other movement, such as player velocity.
// So some things will move faster and others will move slower.
// This gives the perception of depth, even though the screen is 2D.
var moon = {
    x: 420,
    y: 100,
    width: 150,
    height: 150,
    parallaxSpeed: 0.25
}


// A gradient for the backdrop
var bgGrad = ctx.createLinearGradient(0,0,0,world.height);
bgGrad.addColorStop(0, '#7777AA');
bgGrad.addColorStop(1, '#AAAACC');

// Called when document is ready
// In the past, we've called init() when the images were loaded.
// In this case, we don't have any images, so just use jQuery document ready, $()
// $(function() {
//     init();
// });

///////////////////

// Setup the game and start the main loop
// This must be called only after the window has finished loading
// Either through jQuery on doc ready or window onload.
function init() {
    
    // Not much to do here
    player = new Player(characerSpriteSheet, 0, 0, 64, 64);
    for(var c=0; c<CONST.NUM_groupOftanks; c++) {
        groupOftanks[c] = new tank(animalSpriteSheet);
        groupOftanks[c].x = 2200; // ------spawn lotankion
        groupOftanks[c].y = 835;
    }
    
    // Define immediately before calling main
    lastTime = Date.now();
    mainLoop(); // Start the game
}

///////////////////

// The main loop, this gets called every anim frame
// No need to touch anything in here. Use the render and draw funcs
// instead.
function mainLoop(currentTime) {
    // Keep track of delta time (dt)
    // dt is the time elapsed between frames
    var currentTime = Date.now();
    var dt = (currentTime - lastTime) / 1000.0;
  
    
    update(dt);

    render();   
   

    // Update the lastTime to the current time
    lastTime = currentTime;
    // Call main again (forever!)
    requestAnimFrame(mainLoop);

}
var counterTank = 0;
var counterThresholdTank = 3;
var counterCannon = 0
var counterThresholdCannon = 1;

// Update values and state changes in here
function update(dt) {
var tankIndex ;
    counterTank += dt;
        if(counterTank >= counterThresholdTank) {
            counterTank = 0;
       
    for(var c=0; c<CONST.NUM_groupOftanks; c++) {
        if (!groupOftanks[c].alive) {
                groupOftanks[c].x = 2200; // ------spawn lotankion
                groupOftanks[c].y = 835;
                groupOftanks[c].alive = true;
                groupOftanks[c].reset()
                tankIndex = c;
                break
            };
        }
    }

     counterCannon += dt;
        if(counterCannon >= counterThresholdCannon) {
            counterCannon = 0;
       
        for(var c=0; c<CONST.NUM_groupOftanks; c++) {
            if (groupOftanks[c].alive && !groupOftanks[c].cannonBall.alive) { 
                    groupOftanks[c].shoot()
            }
        }
    }
    
    // update and draw particles
    
    // Instead of the player moving left or right, we
    // move the entire world -- this gives the impression that
    // the player is moving forward or backward into new territory
    // as the screen scrolls in those direction.
    //var newWorldX = world.x;
     for (var i=0; i<particles.length; i++)
    {        
        particles[i].update(dt);
    }

    if(dirKeysDown[CONST.KEY.LEFT]) {
        // Move left
        player.dir = player.facing.left;
        // We use speed as the maximum velocity the
        // player can move at.
        if(player.velocityX > -player.moveSpeed) {
            player.velocityX--;
            player.dir = player.facing.left;
        }

    } else if(dirKeysDown[CONST.KEY.RIGHT] ) {
        // Move right
        player.dir = player.facing.right;
        // We use speed as the maximum velocity the
        // player can move at.
        if(player.velocityX < player.moveSpeed) {
            player.velocityX++;
            
        }
    } 

    // Up key makes the player jump
    if(dirKeysDown[CONST.KEY.UP]) {
        if(!player.jumping) {
           player.jumping = true;
           player.grounded = false;
           player.dir = player.facing.jump;
           // Give an immediate "impulse" to the player
           // This gets the player moving upward by setting
           // their velocity to a value (at rest, velocity is 0, 
           // so player doesn't move up or down)
           player.velocityY = -player.jumpSpeed;
       }
    }

    // Slow the player's horizontal movement by
    // applying a friction force
    // This gives a smooth slow down to a stop swhen the player stops moving.
    player.velocityX *= CONST.FRICTION;

    // Then we set the player's position to the current velocity;
    var newPlayerX = player.x;
    newPlayerX += player.velocityX;
    
    // Prevent the player from going off the canvas view.
    if (newPlayerX >= canvas.width-player.width) {
       newPlayerX = canvas.width-player.width;
    } else if (newPlayerX <= 0) {
       newPlayerX = 0;
    }

    // Let's see if we nee to move the world instead of the player.
    // This gives the illusion that at a certain point on the screen
    // when the player reaches it the world moves with them.
    // When we reach the edge of the world, the world stops moving and
    // the player continues to move (not centered anymore).
    var newWorldX = world.x;
    
    //////////////////////////////////////
    
    if (player.velocityX < 0) {
        if (newPlayerX < canvas.width * 0.5) {

            newWorldX = world.x - player.velocityX;

            if(newWorldX > 0){
                newWorldX = 0;
            } else {
                newPlayerX = canvas.width * 0.5;

                moon.x = moon.x - player.velocityX * moon.parallaxSpeed;
                for(var p = 0; p < tree.length; p++) {
                    tree[p].x = tree[p].x - player.velocityX * tree[p].parallaxSpeed;
                    treeTop[p].x = treeTop[p].x - player.velocityX * treeTop[p].parallaxSpeed;
                }
            }
        }
    } else if(player.velocityX > 0) {
        if (newPlayerX > canvas.width * 0.5) {
            
            newWorldX = world.x - player.velocityX;

            if(newWorldX + world.width < canvas.width) {
                newWorldX = canvas.width - world.width;
            } else {
                newPlayerX = canvas.width * 0.5;
                moon.x = moon.x - player.velocityX * moon.parallaxSpeed;
                for(var p = 0; p < tree.length; p++) {
                    tree[p].x = tree[p].x - player.velocityX * tree[p].parallaxSpeed;
                    treeTop[p].x = treeTop[p].x - player.velocityX * treeTop[p].parallaxSpeed;
                }
            }
        }
    }

    //////////////////////////////////////

    // Finally we assign the x values for world and player.
    player.x = newPlayerX;
    world.x = newWorldX;


    // Next, we apply gravity force to the player's current y velocity
    // This acts in the opposite direction of the jump so that
    // they won't jump forever.
    player.velocityY += CONST.GRAVITY;

    // Check collision with any of the platforms.
    player.grounded = false;
    for(var p = 0; p < platforms.length; p++) {
        // TODO: Update intersect to take into account the world when handling platforms
        if(Utils.intersects(world.x + platforms[p].x,
                            world.y + platforms[p].y,
                            platforms[p].width,
                            platforms[p].height,
                            player.x,
                            player.y,
                            player.width,
                            player.height)) {
                                // Only concerned about collision when the player is
                                // falling (i.e. a velocity above zero. Remember, in canvas,
                                // the y axis increases downward.)                               
                                if(player.velocityY > 0) {
                                    // If the player is falling and collides with platform,
                                    // then we make the player's position be on top of the
                                    // platform.
                                    player.y = platforms[p].y - player.height;
                                    player.grounded = true;
                                     player.jumping = false;
                                }

                                // No need to check anymore (unless the game is
                                // complex enough that the player could hit multiple
                                // platforms at the same time). "break" will
                                // exit the for loop so we don't iterate through anymore.
                                break;
        } 
    }
    
    // If we are grounded, then the player has no Y velocity (they ain't movin vertically)
    // so make it zero.
    if(player.grounded)
        player.velocityY = 0;

    // Its handy to have a separate variable before actually assigning the y.
    var newPlayerY = player.y + player.velocityY;
    
    // Detect collision with the bottom of the canvas (an imaginary floor)
    if(newPlayerY >= canvas.height - player.height) {
        newPlayerY = canvas.height - player.height;
        player.grounded = true;
        player.jumping = false;        
    }

    // if(player.x == newPlayerX && player.y ==  newPlayerY ) {
    //       player.dir = player.facing.idle;
    // } else {
    //     player.dir = player.facing.right;
    // }
    // Lastly, assign the new y to the player   
    player.y = newPlayerY;
    player.update(dt);

    var newtankX;
    var newtankY;    
    for(var c=0; c<CONST.NUM_groupOftanks; c++) {
        
        // Get the initial position for this updates
        newtankX = groupOftanks[c].x;
        newtankY = groupOftanks[c].y;

        newtankX -= CONST.tank_SPEED;

        groupOftanks[c].x = newtankX;


        // We want to figure out if the tank is 
        // going to move in a new direction first
        groupOftanks[c].updateDirection(dt);
        
        // Then we increment in that direction
         // Down (+y)
        
        
        
        groupOftanks[c].update(dt);

        // If tank and tank are colliding, tank dead.
        if(groupOftanks[c].intersectsWith(player.x, player.y, player.width, player.height)) {
            // Deleted all inside, and removed alive stuff
            if (groupOftanks[c].alive != false) {
                createExplosion(groupOftanks[c].x, groupOftanks[c].y, "#525252");
                createExplosion(groupOftanks[c].x, groupOftanks[c].y, "#FFA318");
            groupOftanks[c].alive = false;
            console.log("dead")
        };

        } 
    }

    if(groupOftanks[c].cannonBalls[c].intersectsWith(player.x, player.y, player.width, player.height)) {
            // Deleted all inside, and removed alive stuff
            if (groupOftanks[c].cannonBalls[c].alive != false) {
                createExplosion(groupOftanks[c].x, groupOftanks[c].y, "#525252");
                createExplosion(groupOftanks[c].x, groupOftanks[c].y, "#FFA318");
            groupOftanks[c].cannonBalls[c].alive = false;
            console.log("shot")
            groupOftanks[c].cannonBalls[c].kill();
        };

        } 
    }
    // if(Utils.intersects(cannonBall.boundingBox.x,
    //                     cannonBall.boundingBox.y,
    //                     cannonBall.boundingBox.width,
    //                     cannonBall.boundingBox.height,
    //                     ground.x,
    //                     ground.y,
    //                     ground.width,
    //                     ground.height)) {

    //     cannonBall.kill();
    // }
           




// Make all draw calls within this func.
// Don't need to pass ctx here because its in scope for this func (global)
function render(dt) {
    // Clear our canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    // Draw the background
    ctx.fillStyle = bgGrad;

    ctx.fillRect(world.x, world.y, world.width, world.height)
    
    for(var p = 0; p < tree.length; p++) {
       // Tree Top
        ctx.fillStyle = treeTop[p].color;
        ctx.fillRect(world.x + treeTop[p].x,world.y +  treeTop[p].y, treeTop[p].width, treeTop[p].height);  
        //Tree 
        ctx.fillStyle = tree[p].color;
        ctx.fillRect(world.x + tree[p].x,world.y +  tree[p].y, tree[p].width, tree[p].height);

        

    }
    
    //////////////////////////////////////
    ctx.fillStyle = "lightblue";
    ctx.fillRect(moon.x, moon.y, moon.width, moon.height)
    //////////////////////////////////////
    // Draw all the platforms
   for(var c=0; c<CONST.NUM_groupOftanks; c++) {
        groupOftanks[c].render(ctx);
    }

    // Draw a checkerboard pattern (a light one)
    // Kinda like some windows!
    // Utils.drawCheckerboard2(ctx, world, false);

    // Draw all the platforms
    for(var p = 0; p < platforms.length; p++) {
        ctx.fillStyle = platforms[p].color;
        // TODO: Update the x and y to relate to world.
        ctx.fillRect(world.x + platforms[p].x,world.y +  platforms[p].y, platforms[p].width, platforms[p].height); 

    }
    
    

    // Draw the player
    player.render(ctx);
    
    for (var i=0; i<particles.length; i++)
        {        
            particles[i].render(ctx);
        }
}

//
// Input stuff has been moved into its own file input.js
//