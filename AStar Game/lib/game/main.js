ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'impact.sound',

	//'plugins.camera',

	'game.entities.player',
	'game.entities.evileye',
	'game.entities.diamond',
	'game.levels.floor'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	diamonds: 0,
	lives: 3,
	gravity: 0,
	// Load a font
	font: new ig.Font( 'media/comicsans.png' ),
	
	// HUD icons
	//LifeSprite: new ig.Image( 'media/LivesIcon.png' ),
	Diamond: new ig.Image( 'media/DiamondIcon.png' ),
	//: new ig.Image( 'media/' ),
	
	init: function() {
		// Initialize your game here; bind keys etc.
		// Bind keys
		
        ig.input.bind( ig.KEY.A, 'left' );
        ig.input.bind( ig.KEY.D, 'right' );
		ig.input.bind( ig.KEY.W, 'up' );
       // ig.input.bind( ig.KEY.X, 'jump' );
       // ig.input.bind( ig.KEY.C, 'shoot' );
       // ig.input.bind( ig.KEY.TAB, 'switch' );
		
		//ig.input.bind( ig.KEY.V, 'invincible' );
		// Load the LevelJungle as required above ('game.level.jungle')
		this.loadLevel( LevelFloor );
		
		ig.music.add( 'media/music/');
		ig.music.volume = 0.5;
		ig.music.play();
	},
	
	loadLevel: function( data ) {
		// Remember the currently loaded level, so we can reload when
		// the player dies.
		this.currentLevel = data;

		// Call the parent implementation; this creates the background
		// maps and entities.
		this.parent( data );
		
		this.setupCamera();
	},
	
	setupCamera: function() {
		// Set up the camera. The camera's center is at a third of the screen
		// size, i.e. somewhat shift left and up. Damping is set to 3px.		
		this.camera = new ig.Camera( ig.system.width/3, ig.system.height/3, 3 );
		
		// The camera's trap (the deadzone in which the player can move with the
		// camera staying fixed) is set to according to the screen size as well.
    	this.camera.trap.size.x = ig.system.width/10;
    	this.camera.trap.size.y = ig.system.height/8;
		
		// The lookahead always shifts the camera in walking position; you can 
		// set it to 0 to disable.
    	this.camera.lookAhead.x = ig.system.width/6;
		
		// Set camera's screen bounds and reposition the trap on the player
    	this.camera.max.x = this.collisionMap.pxWidth - ig.system.width;
    	this.camera.max.y = this.collisionMap.pxHeight - ig.system.height;
    	this.camera.set( this.player );
	},
	
	//player modifiers
	giveDiamonds: function( ) {
		// Custom function, called from the EntityDiamond
		ig.Game.diamonds += 1;
	},

	giveHealth: function(){
		
				ig.Game.health += 1;
			//}
	
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		// Add your own, additional update code here
		this.camera.follow( this.player );
	},
	
	draw: function() {
		/* Call the parent implementation to draw all Entities and BackgroundMaps */
		this.parent();
		

		/* Draw the hearts and number of diamonds in the upper left corner.
		 'this.player' is set by the player's init method */
		if( this.player ) {
			var x = 2, 
				y = 2;

			
			
			this.Diamond.drawTile( x, y, 0, 50 );
			
			this.font.draw( 'x ' + ig.game.diamonds , x+60, y+25 );
			y += 75;
			
			y -= 25;
			x = -15;
			/* Redraw HUD icons for hearts */		
			for( var i = 0; i < ig.game.health; i++ ) {
				
					this.HealthBar.draw( x-25, y );
					x += 25;
			}
		}
			
			
	
		
		/* Draw touch buttons, if any */
		if( window.myTouchButtons ) {
			window.myTouchButtons.draw(); 
		}
		
	},
	

});


StartScreen = ig.Game.extend({
    instructText: new ig.Font( 'media/standard.png' ),
    background: new ig.Image('media/sky'),
    mainCharacter: new ig.Font('media/comicsans.png'),
    title: new ig.Font('media/comicsans.png'),
    init: function() {
        ig.input.bind( ig.KEY.SPACE, 'start');
    },
    update: function() {
        if(ig.input.pressed ('start')){
            ig.system.setGame(MyGame)
        }
        this.parent();
    },
	
	
    draw: function() {

	/* Get the system height and width and use it to draw Splash text */
	var x = ig.system.width/2,
	y = ig.system.height/2;
        this.parent();
        this.background.draw(x-320,y-175);
        this.mainCharacter.draw("Oh Noes!",x-285,y-200);
        this.title.draw("A Star Examples", x+60,y+10);
		//this.title.height = 30;
	
        var x = ig.system.width/2,
        y = ig.system.height - 10;
		if(this.instructText){
            var x = ig.system.width/2,
            y = ig.system.height - 10;
            this.instructText.draw( 'ASWD Moves The Player', x, y, ig.Font.ALIGN.CENTER );
        }
        this.instructText.draw( 'Press Spacebar To Start', x, y-15, ig.Font.ALIGN.CENTER );
    }
});


/* Start the Game with 60fps (mostly ignored by browsers' getFrame()), a resolution of 720x540 */
ig.main( '#canvas', StartScreen, 60, 720, 540, 1 );

});
