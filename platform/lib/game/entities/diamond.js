ig.module(
	'game.entities.diamond'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityDiamond = ig.Entity.extend({
        size: {x: 32, y: 32},
        animSheet: new ig.AnimationSheet( 'media/Diamond.png', 32, 32 ),
        maxVel: {x: 0, y: 0},
		
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,
        init: function( x, y, settings ) {
			this.startPosition = {x:240,y:300};
			this.parent( x, y, settings );
            
            this.addAnim( 'idle', 0.1, [0,1,2,3,4,5,6,7] );
			var x = this.startPosition.x;
        	var y = this.startPosition.y;
        	//ig.game.spawnEntity(EntityDiamond, this.pos.x, this.pos.y, {callBack:function(){ig.game.spawnEntity( EntityDiamond, x, y)}} );
        },
        handleMovementTrace: function( res ) {
        	this.parent( res );
        	if( res.collision.x || res.collision.y ) {
        		
					other.giveDiamonds();
        			ig.game.giveDiamonds();
        		
        	}
        },
		update: function() {
    	// near an edge? return!
    	/*	
		if( !ig.game.collisionMap.getTile(
    		this.pos.x + (this.flip ? +4 : this.size.x -4),
    			this.pos.y + this.size.y+1
    		)
    	) {
		
		if( this.flip = -1 ){
			this.currentAnim = this.anims.left;
			}
		if( this.flip = 1 ){	
			this.currentAnim = this.anims.right;
			}
			this.flip = !this.flip;
    	}
		*/
    	var xdir = this.flip ? -1 : 1;
    	this.vel.x = 0;//this.speed * xdir;
    	this.currentAnim.flip.x = this.flip;
    	this.parent();
    },
        check: function( other ) {
            
            this.kill();
        }
    });
	
	});