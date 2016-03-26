/*
The EntityDebris will randomly spawn a certain count of EntityDebrisParticle 
entities for a certain duration.

The spawn position of the EntityDebrisParticle is inside the area occupied
by the EntityDebris entity. I.e. make the EntityDebris larger in Weltmeister
to increase the area in which particles will spawn.

Keys for Weltmeister:

duration
	Duration in seconds over which to spawn EntityDebrisParticle entities.
	Default: 5
	
count
	Total count of particles to spawn during the #duration# time span.
	Default: 5
*/

ig.module(
	'game.entities.debris'
)
.requires(
	'impact.entity',
	'game.entities.grenade'
)
.defines(function(){

EntityDebris = ig.Entity.extend({
	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(255, 170, 66, 0.7)',
	
	size: {x: 8, y: 8},
	duration: 5,
	count: 5,
	
	durationTimer: null,
	nextEmit: null,
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.durationTimer = new ig.Timer();
		this.nextEmit = new ig.Timer();
	},
	
	
	triggeredBy: function( entity, trigger ) {
		this.durationTimer.set( this.duration );
		this.nextEmit.set( 0 );
	},
	
	
	update: function(){		
		if( this.durationTimer.delta() < 0 && this.nextEmit.delta() >= 0 ) {
			this.nextEmit.set( this.duration / this.count );
			
			var x = Math.random().map( 0,1, this.pos.x, this.pos.x+this.size.x );
			var y = Math.random().map( 0,1, this.pos.y, this.pos.y+this.size.y );
			ig.game.spawnEntity( EntityGrenade, x, y );
		}
	}
});



/*
The particles to spawn by the EntityDebris. See particle.js for more details.
*/

EntityGrenade = ig.Entity.extend({
        size: {x: 4, y: 4},
        offset: {x: 2, y: 2},
        animSheet: new ig.AnimationSheet( 'media/grenade.png', 8, 8 ),
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.PASSIVE,
        maxVel: {x: 200, y: 200},
        bounciness: 0.6,
        bounceCounter: 0,
        init: function( x, y, settings ) {
            this.parent( x + (settings.flip ? -4 : 7), y, settings );
            this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.vel.y = -(50 + (Math.random()*100));
            this.addAnim( 'idle', 0.2, [0,1] );
        },
        handleMovementTrace: function( res ) {
        	this.parent( res );
        	if( res.collision.x || res.collision.y ) {
        		// only bounce 3 times
        		this.bounceCounter++;
        		if( this.bounceCounter > 3 ) {
        			this.kill();
        		}
        	}
        },
        check: function( other ) {
        	other.receiveDamage( 10, this );
        	this.kill();
        },
        kill: function(){
            for(var i = 0; i < 20; i++)
                ig.game.spawnEntity(EntityGrenadeParticle, this.pos.x, this.pos.y);
            this.parent();
        }
    });

});