ig.module(
	'game.entities.paddle-player-upper'
)
.requires(
	
	'game.entities.paddle'
)
.defines(function(){

EntityPaddlePlayerUpper = EntityPaddle.extend({
	
	animSheet: new ig.AnimationSheet( 'media/paddle-blue2.png', 128, 64 ),
	size: {x:128, y:64},
	update: function() {
		
		if( ig.input.state('left') ) {
			this.vel.x = -100;
		}
		else if( ig.input.state('up') ) {
			this.vel.y = 0;
		}
		else if( ig.input.state('down') ) {
			this.vel.y = 0;
		}
		else if( ig.input.state('right') ) {
			this.vel.x = 100;
		}
		else {
			this.vel.x = 0
		}
		
		this.parent();
	}
});

});