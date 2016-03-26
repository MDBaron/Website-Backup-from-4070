ig.module(
    'game.entities.player'
)
.requires(
    'impact.entity'
)
.defines(function(){
    EntityPlayer = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/player-rotated.png', 16, 16 ),
        size: {x: 8, y:14},
        offset: {x: 4, y: 2},
        flip: false,
        maxVel: {x: 100, y: 150},
        friction: {x: 600, y: 0},
        accelGround: 400,
        accelAir: 200,
        jump: 200,
		gravityFactor: 0,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.PASSIVE,
        weapon: 0,
        totalWeapons: 2,
        activeWeapon: "EntityBullet",
        startPosition: null,
        invincible: true,
        invincibleDelay: 2,
        invincibleTimer:null,
        init: function( x, y, settings ) {
        	this.parent( x, y, settings );
            this.setupAnimation(this.weapon);
            this.startPosition = {x:x,y:y};
            this.invincibleTimer = new ig.Timer();
            this.makeInvincible();
			
			this.addAnim('idle', 1, [18]);
            this.addAnim('run', .07, [18,19,20,21,22,23]);
			this.addAnim('runRight', .07, [12,13,14,15,16,17]);
			this.addAnim('runUp', .07, [6,7,8,9,10,11]);
			this.addAnim('runLeft', .07, [0,1,2,3,4,5]);
        },
        setupAnimation: function(offset){
            
            this.addAnim('idle', 1, [18+offset]);
            this.addAnim('run', .07, [18+offset,19+offset,20+offset,21+offset,22+offset,23+offset]);
			//this.addAnim('runRight', .07, [12,13,14,15,16,17]);
			//this.addAnim('runUp', .07, [6,7,8,9,10,11]);
			//this.addAnim('runLeft', .07, [0,1,2,3,4,5]);
            //this.addAnim('jump', 1, [9+offset]);
            //this.addAnim('fall', 0.4, [6+offset,7+offset]);
        },
        makeInvincible: function(){
            this.invincible = true;
            this.invincibleTimer.reset();
        },
        update: function() {
              // move left or right
        	var accel = 400;//this.standing ? this.accelGround : this.accelAir;
        	if( ig.input.state('left') ) {
        		this.accel.x = -accel;
				this.currentAnim = this.anims.run;
        		this.flip = true;
        	}else if( ig.input.state('right') ) {
        		this.accel.x = accel;
				this.currentAnim = this.anims.run;
        		this.flip = false;
        	}
			else if( ig.input.state('up') ) {
				this.currentAnim = this.anims.run;
				this.accel.y = -accel;
			}//up
			
			else if( ig.input.state('down') ) {
				this.currentAnim = this.anims.run;
				this.accel.y = accel;
				
				
			}//down
				else {
					this.accel.x = 0;
					this.accel.y = 0;
					this.currentAnim = this.anims.idle;
				}
			
			//acceleration
			if( ig.input.pressed('speedup') ) {
					
					this.maxVel.y +=25;
					this.maxVel.x +=25;
					
			}//speedup
			
			if( ig.input.pressed('slowdown') ) {
			
				if(this.maxVel.y > 0){
					this.maxVel.y -=25;
					}
				if(this.maxVel.x > 0){
					this.maxVel.x -=25;
					}
					
			}//slowdown
			
			

        	// jump
        	if( this.standing && ig.input.pressed('jump') ) {
        		//this.vel.y = -this.jump;
        	}
            // shoot
            if( ig.input.pressed('shoot') ) {
            	ig.game.spawnEntity( this.activeWeapon, this.pos.x, this.pos.y, {flip:this.flip} );
            }
            if( ig.input.pressed('switch') ) {
            	this.weapon ++;
            	if(this.weapon >= this.totalWeapons)
            		this.weapon = 0;
                switch(this.weapon){
                	case(0):
                		this.activeWeapon = "EntityBullet";
                		break;
                	case(1):
                		this.activeWeapon = "EntityGrenade";
                	break;
                }
                this.setupAnimation(0);
            }
			
            this.currentAnim.flip.x = this.flip;
            if( this.invincibleTimer.delta() > this.invincibleDelay ) {
                this.invincible = false;
                this.currentAnim.alpha = 1;
            }
        	// move!
        	this.parent();
        },
        kill: function(){
        	this.parent();
        	var x = this.startPosition.x;
        	var y = this.startPosition.y;
        	ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {callBack:function(){ig.game.spawnEntity( EntityPlayer, x, y)}} );
        },
		
		handleMovementTrace: function( res ) {
            this.parent( res );
			
            if( res.collision.x /*&& this.vel.y < 1 */&& this.vel.x < 1){
				this.vel.x = 0;
                this.setupAnimation(-6);
				//this.currentAnim = this.anims.runLeft;
				//this.flip;
            }//Collision X: -x -y -->offset =-6 
			 
			else if( res.collision.x && this.vel.y < -1 && this.vel.x > 1){
				this.vel.x = 0;
                this.setupAnimation(-18);
				//this.currentAnim = this.anims.runRight;
				
            }//Collision X: +x -y -->offset = -18
			
			else if( res.collision.x && this.vel.y > 1 && this.vel.x < 1){
				this.vel.x = 0;
                this.setupAnimation(-6);
				//this.currentAnim = this.anims.runRight;
				
            }//Collision X: -x +y -->offset = -6
			else if( res.collision.x && this.vel.y > 1 && this.vel.x > 1){
				this.vel.x = 0;
                this.setupAnimation(-18);
				//this.currentAnim = this.anims.runRight;
				
            }//Collision X: +x +y -->offset = -18
				else {
					//this.currentAnim = this.anims.idle;
				}
			
			 if( res.collision.y && this.vel.x < 0 && this.vel.y < 1){
				this.vel.x = 0;
                this.setupAnimation(-12);
				this.currentAnim = this.anims.runUp;
				
            }//Collision Y: -x -y -->offset = -12
			else if( res.collision.Y && this.vel.x < 0 && this.vel.y > 1){
				this.vel.y = 0;
                this.setupAnimation(0);
			    this.currentAnim = this.anims.run;
				this.flip = false;
            }//Collision Y: -x +y -->offset = 0
			
			else if( res.collision.y && this.vel.x > 1 && this.vel.y < 1){
				this.vel.y = 0;
                this.setupAnimation(-12);
			    this.currentAnim = this.anims.runUp;
				this.flip = false;
            }//Collision Y: +x -y -->offset = -12
			else if( res.collision.y && this.vel.x > 1 && this.vel.y > 1){
				this.vel.y = 0;
                this.setupAnimation(0);
			    this.currentAnim = this.anims.run;
				
            }//Collision X: +x +y -->offset = 0
			else {
				//this.currentAnim = this.anims.idle;
			}
        },
        receiveDamage: function(amount, from){
            if(this.invincible)
                return;
            this.parent(amount, from);
        },
        draw: function(){
            if(this.invincible)
                this.currentAnim.alpha = this.invincibleTimer.delta()/this.invincibleDelay * 1 ;
            this.parent();
        }


    });
    EntityBullet = ig.Entity.extend({
        size: {x: 5, y: 3},
        animSheet: new ig.AnimationSheet( 'media/bullet.png', 5, 3 ),
        maxVel: {x: 200, y: 0},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        init: function( x, y, settings ) {
            this.parent( x + (settings.flip ? -4 : 8) , y+8, settings );
            this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.addAnim( 'idle', 0.2, [0] );
        },
        handleMovementTrace: function( res ) {
            this.parent( res );
            if( res.collision.x || res.collision.y ){
                this.kill();
            }
        },
        check: function( other ) {
            other.receiveDamage( 3, this );
            this.kill();
        }
    });
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
    EntityDeathExplosion = ig.Entity.extend({
        lifetime: 1,
        callBack: null,
        particles: 25,
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
        size: {x: 2, y: 2},
        maxVel: {x: 160, y: 200},
        lifetime: 2,
        fadetime: 1,
        bounciness: 0,
        vel: {x: 100, y: 30},
        friction: {x:100, y: 0},
        collides: ig.Entity.COLLIDES.LITE,
        colorOffset: 0,
        totalColors: 7,
        animSheet: new ig.AnimationSheet( 'media/blood.png', 2, 2 ),
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
    EntityGrenadeParticle = ig.Entity.extend({
        size: {x: 1, y: 1},
        maxVel: {x: 160, y: 200},
        lifetime: 1,
        fadetime: 1,
        bounciness: 0.3,
        vel: {x: 40, y: 50},
        friction: {x:20, y: 20},
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.LITE,
        animSheet: new ig.AnimationSheet( 'media/explosion.png', 1, 1 ),
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.vel.x = (Math.random() * 4 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 10 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
            var frameID = Math.round(Math.random()*7);
            this.addAnim( 'idle', 0.2, [frameID] );
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


});
