ig.module(
	'game.entities.gunmodule'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityGunmodule = ig.Entity.extend({
        size: {x: 16, y: 16},
        animSheet: new ig.AnimationSheet( 'media/Bullet.png', 16, 16 ),
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
        	//ig.game.spawnEntity(EntityGunmodule, this.pos.x, this.pos.y, {callBack:function(){ig.game.spawnEntity( EntityGunmodule, x, y)}} );
        },
        handleMovementTrace: function( res ) {
        	this.parent( res );
        	if( res.collision.x || res.collision.y ) {
        		
        		
        			this.kill();
        		
        	}
        },
        check: function( other ) {
            
            this.kill();
        }
    });
	
	});