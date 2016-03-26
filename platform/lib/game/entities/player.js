ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity',
	'impact.sound'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	
	// The players (collision) size is a bit smaller than the animation
	// frames, so we have to move the collision box a bit (offset)
	startPosition: null,
	size: {x: 32, y: 32},
	offset: {x: 0, y: 0},
	maxVel: {x: 400, y: 800},
	friction: {x: 1000, y: 0},
	accelGround: 1200,
	accelAir: 600,
	jump: 500,
	gravityFactor: 3,
	standing: true,
	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,
	weapon: 0,
    
    invincible: true,
    invincibleDelay: 3,
    invincibleTimer:null,
	
	animSheet: new ig.AnimationSheet( 'media/PlayerAnimation.png', 32, 32 ),
	sfxHurt: new ig.Sound( 'media/sounds/hurt.*' ),
	sfxJump: new ig.Sound( 'media/sounds/jump.*' ),	
	flip: false,

	maxHealth: 4,
	health: 4,
	lives: 3,
	diamonds: 1,
	totalWeapons: 3,
    activeWeapon: "EntityArrow",
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'idle', 0.2, [0,1,2] );
		this.addAnim( 'idleBow', 0.1, [17] );
		this.addAnim( 'idleBowFire', 0.1, [26,27,28] );
		this.addAnim( 'idleGun', 0.2, [7] );
		this.addAnim( 'idleGunFire', 0.2, [13] );
		this.addAnim( 'toss', 0.09, [6] );
		this.addAnim( 'run', 0.1, [3,4,5,4] );
		this.addAnim( 'runBow', 0.1, [21,21,22,21] );
		this.addAnim( 'runBowFire', 0.1, [23,24,25,23] );
		this.addAnim( 'runGun', 0.1, [10,11,12,11] );
		this.addAnim( 'runGunFire', 0.1, [14,15,16,15] );
		this.addAnim( 'jump', 0.2, [29,30] );
		this.addAnim( 'fall', 0.2, [29,30] ); // stop at the last frame
		this.addAnim( 'swim', 0.3, [38,39,40,41,42] );
		this.addAnim( 'swing', 0.3, [31,32,33] );
		this.addAnim( 'climb', 0.3, [43,44,45] );

		
		
        this.startPosition = {x:x,y:y};
        this.invincibleTimer = new ig.Timer();
        this.makeInvincible();
		// Set a reference to the player on the game instance
		ig.game.player = this;
	},//init
	
	
	makeInvincible: function(){
            this.invincible = true;
            this.invincibleTimer.reset();
        },//makeInvincible
	
	update: function() {

		// Handle user input; move left or right
		var accel = this.standing ? this.accelGround : this.accelAir;
		if( ig.input.state('left') ) {
			this.accel.x = -accel;
			this.flip = true;
		}//if left
		else if( ig.input.state('right') ) {
			this.accel.x = accel;
			this.flip = false;
		}//if right
		else {
			this.accel.x = 0;
		}//left right functionality

		// jump
		if( this.standing && ig.input.pressed('jump') ) {
			//this.currentAnim = this.flip;
			//this.currentAnim = 'jump',
			this.vel.y = -this.jump;
			this.sfxJump.play();
		}//if jump
		
		
		
		// shoot
		if(ig.input.pressed('invincible')){
				this.makeInvincible();
			}//if invincible
			
        if( ig.input.pressed('shoot') ) {
			this.currentAnim.flip.x = this.flip;
			if( this.vel.x != 0 ) {
			switch(this.activeWeapon){
                	case("EntityArrow"):
                		this.currentAnim = this.anims.runBowFire;
                		break;
                	case("EntityBomb"):
						this.currentAnim = this.anims.toss;
						break;
					case("EntityBullet"):
						 this.currentAnim = this.anims.runGunFire;
						break;
					}//weapon animation case block 1
			}//if moving
			else {
			switch(this.activeWeapon){
                	case("EntityArrow"):
                		this.currentAnim = this.anims.idleBowFire;
                		break;
                	case("EntityBomb"):
						this.currentAnim = this.anims.toss;
						break;
					case("EntityBullet"):
						this.currentAnim = this.anims.idleGunFire;
						break;
					}//weapon animation case block 2	
            }//else idle
			this.currentAnim.flip.x = this.flip;
			ig.game.spawnEntity( this.activeWeapon, this.pos.x, this.pos.y, {flip:this.flip} );
		}//if shoot
		
		/* Switch Projectile to next active weapon */
            if( ig.input.pressed('switch') ) {
            	this.weapon ++;
            	if(this.weapon >= this.totalWeapons)
            		this.weapon = 0;
                switch(this.weapon){
                	case(0):
                		this.activeWeapon = "EntityArrow";
                		break;
                	case(1):
                		this.activeWeapon = "EntityBomb";
						break;
					case(2):
						this.activeWeapon = "EntityBullet";
						break;
                }//active weapon switch case block
                
            }//if switch
		
		if( this.invincibleTimer.delta() > this.invincibleDelay ) {
                this.invincible = false;
                this.currentAnim.alpha = 1;
            }//if invincibility fades
			
		//This needs to be re-done
		if( this.currentAnim == this.anims.pain &&
			this.currentAnim.loopCount < 1) {
		
			if( this.health <= 0 ) {
				
				var dec = (1/this.currentAnim.frameTime) * ig.system.tick;
				this.currentAnim.alpha = (this.currentAnim.alpha - dec).limit(0,1);
			}//fade if health depleted
		}//if in pain
		
		else if( this.health <= 0 ) {
			
			this.kill();
		}//kill if health depleted
		
		else if( this.vel.y < 0 ) {
			this.currentAnim = this.anims.jump;
		}//if moving up
		
		else if( this.vel.y > 0 ) {//removing if for test
			if( this.currentAnim != this.anims.fall ) {
				this.currentAnim = this.anims.fall.rewind();
			}//if falling
			
		}//if moving down
		
		
		else if( this.vel.x != 0 && !ig.input.pressed('shoot')) {
		this.currentAnim.flip.x = this.flip;
			switch(this.activeWeapon){
                	case("EntityArrow"):
                		this.currentAnim = this.anims.runBow;
                		break;
                	case("EntityBomb"):
						this.currentAnim = this.anims.run;
						break;
					case("EntityBullet"):
						 this.currentAnim = this.anims.runGun;
						break;
			}//active weapon case block animation 1
		}//if lateral motion
		else {
			switch(this.activeWeapon){
                	case("EntityArrow"):
					
							this.currentAnim = this.anims.idleBow;
						
                		break;
                	case("EntityBomb"):
						
							this.currentAnim = this.anims.idle;
						
						break;
					case("EntityBullet"):
						
							this.currentAnim = this.anims.idleGun;
						
						break;
					}//active weapon case block animation 2
		
		
		this.currentAnim.flip.x = this.flip;
		
		}//else idle
		// Move!
		this.parent();
	},//update

	kill: function() {
		this.parent();
		var x = this.startPosition.x;
        	var y = this.startPosition.y;
			this.lives -= 1;
        	ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {callBack:function(){ig.game.spawnEntity( EntityPlayer, x, y)}} );
		// Reload this level
		
	},//kill
/*
	giveDiamonds: function( ) {
		// Custom function, called from the EntityDiamond
		this.diamonds += 1;
	},//giveDiamonds

	giveHealth: function(){
		// Custom function, called from the EntityPotion
			if(this.health < this.maxHealth){
				this.health += 1;
			}
	
	},//giveHealth
	
	giveLife: function(){
		// Custom function, called from the EntityOneup
			
				this.lives += 1;
			
	
	},//giveLife
	*/
	receiveDamage: function( amount, from ) {
		if(this.invincible)
                return;

		// We don't call the parent implementation here, because it 
		// would call this.kill() as soon as the health is zero. 
		// We want to play our death (pain) animation first.
		this.health -= amount;
		ig.game.health -= amount;
		this.currentAnim = this.currentAnim.rewind();
		this.sfxHurt.play();
		// Knockback
		this.vel.x = (from.pos.x > this.pos.x) ? -400 : 400;
		this.vel.y = -300;
		
	},//receiveDamage
	draw: function(){
            if(this.invincible)
                this.currentAnim.alpha = 0.5 ;
            this.parent();
        }//draw
});//entityPlayer


EntityBomb = ig.Entity.extend({
        size: {x: 16, y: 16},
        offset: {x: 2, y: 2},
        animSheet: new ig.AnimationSheet( 'media/bomb.png', 16, 16 ),
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        maxVel: {x: 200, y: 200},
        bounciness: 0.6,
        bounceCounter: 0,
        init: function( x, y, settings ) {
            this.parent( x + (settings.flip ? -4 : 7), y, settings );
            this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.vel.y = -(50 + (Math.random()*100));
            this.addAnim( 'idle', 0.2, [0,1,3,4,5,6] );
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
            for(var i = 0; i < 3; i++)
                ig.game.spawnEntity(EntityBombParticle, this.pos.x, this.pos.y);
            this.parent();
        }
    });

EntityBullet = ig.Entity.extend({
        size: {x: 16, y: 16},
        offset: {x: -8, y: -12},
        animSheet: new ig.AnimationSheet( 'media/Bullet.png', 16, 16 ),
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        maxVel: {x: 600, y: 1},
        
        init: function( x, y, settings ) {
            this.parent( x + (settings.flip ? -4 : 7), y, settings );
            this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.vel.y = 200;
            this.addAnim( 'idle', 0.2, [0] );
        },
        handleMovementTrace: function( res ) {
        	this.parent( res );
        	if( res.collision.x || res.collision.y ) {
        		
        			this.kill();
        
        	}
        },
        check: function( other ) {
        	other.receiveDamage( 10, this );
        	this.kill();
        },
       
    });

	EntityDeathExplosion = ig.Entity.extend({
        lifetime: 1,
        callBack: null,
        particles: 45,
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
                for(var i = 0; i < this.particles; i++)
                    ig.game.spawnEntity(EntityDeathExplosionParticle, x, y, {colorOffset: settings.colorOffset ? settings.colorOffset : 0});
                this.idleTimer = new ig.Timer();
            },
            update: function() {
                if( this.idleTimer.delta() > this.lifetime ) {
                    this.kill();
                    if(this.callBack)
                        this.callBack();
                    return;
                }
            }
    });
	
	
	
    EntityDeathExplosionParticle = ig.Entity.extend({
        size: {x: 1, y: 1},
        maxVel: {x: 160, y: 200},
        lifetime: 2,
        fadetime: 1,
        bounciness: 0,
        vel: {x: 100, y: 30},
        friction: {x:100, y: 0},
        collides: ig.Entity.COLLIDES.LITE,
        colorOffset: 0,
        totalColors: 7,
        animSheet: new ig.AnimationSheet( 'media/blood.png', 1, 1 ),
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            var frameID = Math.round(Math.random()*this.totalColors) + (this.colorOffset * (this.totalColors+1));
            this.addAnim( 'idle', 0.2, [frameID] );
            this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
        },
        update: function() {
            if( this.idleTimer.delta() > this.lifetime ) {
                this.kill();
                return;
            }
            this.currentAnim.alpha = this.idleTimer.delta().map(
                this.lifetime - this.fadetime, this.lifetime,
                1, 0
            );
            this.parent();
        }
    });
	
    EntityBombParticle = ig.Entity.extend({
        size: {x: 32, y: 32},
        maxVel: {x: 10, y: 20},
        lifetime: 2,
        fadetime: 2,
        bounciness: 0.5,
        vel: {x: 40, y: 50},
        friction: {x:20, y: 20},
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.LITE,
        animSheet: new ig.AnimationSheet( 'media/Fire.png', 32, 32 ),
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.vel.x = (Math.random() * 4 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 10 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
            //var frameID = Math.round(Math.random()*7);
            this.addAnim( 'idle', 0.2, [0,1,2,3,4,5] );
        },
        update: function() {
            if( this.idleTimer.delta() > this.lifetime ) {
                this.kill();
                return;
            }
            this.currentAnim.alpha = this.idleTimer.delta().map(
                this.lifetime - this.fadetime, this.lifetime,
                1, 0
            );
            this.parent();
        }
    });
	
	
	EntityWeaponModule = ig.Entity.extend({
        size: {x: 32, y: 32},
        animSheet: new ig.AnimationSheet( 'media/bomb.png', 32, 32 ),
        maxVel: {x: 0, y: 0},
		
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        init: function( settings ) {
			this.startPosition = {x:240,y:300};
			this.parent( settings );
            //this.parent( x + (settings.flip ? -4 : 8) , y+8, settings );
            //this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.addAnim( 'idle', 0.4, [0,1,2,3,4,5,6] );
			var x = this.startPosition.x;
        	var y = this.startPosition.y;
        	ig.game.spawnEntity(EntityWeaponModule, this.pos.x, this.pos.y, {callBack:function(){ig.game.spawnEntity( EntityWeaponModule, x, y)}} );
        },
        handleMovementTrace: function( res ) {
        	this.parent( res );
        	if( res.collision.x || res.collision.y ) {
        		
        		
        			this.kill();
        		
        	}
        },
        check: function( other ) {
            other.receiveDamage( 10, this );
            this.kill();
        }
    });
	
	
EntityArrow = ig.Entity.extend({
        size: {x: 16, y: 16},
        offset: {x: -8, y: -12},
        animSheet: new ig.AnimationSheet( 'media/Arrow.png', 16, 16 ),
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        maxVel: {x: 600, y: 200},
        bounciness: 0.0,
        init: function( x, y, settings ) {
            this.parent( x + (settings.flip ? -4 : 7), y, settings );
            this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.vel.y = -(50 + (Math.random()*100));
            this.addAnim( 'idle', 0.2, [0] );
        },
        handleMovementTrace: function( res ) {
        	this.parent( res );
        	if( res.collision.x || res.collision.y ) {
        		
        			this.kill();
        
        	}
        },
        check: function( other ) {
        	other.receiveDamage( 10, this );
        	this.kill();
        },
       
    });

});