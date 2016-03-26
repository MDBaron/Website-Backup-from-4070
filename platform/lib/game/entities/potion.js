ig.module(
	'game.entities.potion'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPotion = ig.Entity.extend({
        size: {x: 32, y: 32},
        animSheet: new ig.AnimationSheet( 'media/HealthPotion.png', 32, 32 ),
        maxVel: {x: 0, y: 0},
		
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,
        init: function( x, y, settings  ) {
			this.startPosition = {x:240,y:300};
			this.parent( x, y, settings  );
            
            this.addAnim( 'idle', 0.1, [0,1,2,3,4,5,6,7] );
			var x = this.startPosition.x;
        	var y = this.startPosition.y;
        	//ig.game.spawnEntity(EntityPotion, this.pos.x, this.pos.y, {callBack:function(){ig.game.spawnEntity( EntityPotion, x, y)}} );
        },
        handleMovementTrace: function( res ) {
        	this.parent( res );
        	if( res.collision.x || res.collision.y ) {
        		
					
        			ig.game.giveHealth();
        		
        	}
        },
        check: function( other ) {
           
            this.kill();
        }
    });
	
	});