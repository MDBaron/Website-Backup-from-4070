ig.module( 
	'game.main' 
)
.requires(
    'impact.game',
    'game.levels.dorm1',
	'game.levels.box'
)

.defines(function(){

MyGame = ig.Game.extend({
    gravity: 300,
	init: function() {
        this.loadLevel( LevelBox );

        // Bind keys
        ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
        ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
        ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
        ig.input.bind( ig.KEY.X, 'jump' );
        ig.input.bind( ig.KEY.C, 'shoot' );
        ig.input.bind( ig.KEY.TAB, 'switch' );
		ig.input.bind( ig.KEY.A, 'speedup' );
		ig.input.bind( ig.KEY.Z, 'slowdown' );
		ig.input.bind( ig.KEY.Q, 'wallgrip' );
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});
