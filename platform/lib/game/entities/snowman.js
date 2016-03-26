ig.module(
	'game.entities.snowman'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntitySnowman = ig.Entity.extend({
    animSheet: new ig.AnimationSheet( 'media/Snowman.png', 32, 32 ),
	
    size: {x: 32, y:32},
    offset: {x: 4, y: 2},
    maxVel: {x: 100, y: 100},
    flip: false,
    friction: {x: 150, y: 0},
    speed: 14,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,
    init: function( x, y, settings ) {
    	this.parent( x, y, settings );
    	this.addAnim('walk', .07, [0,1,2,3,4,5]);
		//this.anims = new ig.Animation( this.animSheet, 0.17, [0,1,2,3,4,5] );
		
    },
	//
	
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
    handleMovementTrace: function( res ) {
    	this.parent( res );
    	// collision with a wall? return!
    	if( res.collision.x ) {
			this.currentAnim = this.anims.left;
    		this.flip = !this.flip;
    	}
    },
    check: function( other ) {
    	other.receiveDamage( 1, this );
    },
    receiveDamage: function(value){
        this.parent(value);
        if(this.health > 0)
    		ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {particles: 2, colorOffset: 1});
    },
    kill: function(){
        this.parent();
        ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {colorOffset: 1});
    }
});
});
