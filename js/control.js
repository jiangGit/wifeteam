
/**
 *控制
 */
var Control={
	tmp:function(e){
		
	
	},

	/**
	 * 舞台事件
	 */	
	mapBegan:function(e){
		this.currentRoom=this.roomOne;
		this.currentRoom.role=this.role;
		this.currentRoom.addObj(this.role);
		this.role.x=300;
		this.role.y=300;
		Game.EventManager.triggerMyEvent(this,"intoFirstRoom");
	},
	mapWin:function(){
		Game.Pause();
		if(Game.isMusicOn)
		{
			Game.Data.AudioCache['bgMusic'].pause();
			Game.Data.AudioCache['win'].play();
		}
		var game_happyending=document.getElementById("game_happyending");
		game_happyending.style.display="block";
	},
	mapFail:function(){
		Game.Pause();
		if(Game.isMusicOn)
		{
			Game.Data.AudioCache['bgMusic'].pause();
			Game.Data.AudioCache['fail'].play();
		}
		var game_badending=document.getElementById("game_badending");
		game_badending.style.display="block";
	},
	mapClear:function(){
		this.state=0;
		this.roomOne.clear();
		this.roomTwo.clear();
		this.role.state=1;
		this.role.life=this.role.blood;
		this.heart.now=0;
		this.heart.t=0;
		this.heart.draw();
		this.skill.now=0;
		this.skill.t=0;
		this.skill.draw();
	},
	addEnemyA:function(){
		var en=new EnemyA();
		en.x=1000;
		en.y=300+Math.random()*250;
		en.init();
		if(this.state==2) en.updateState(1);
		this.currentRoom.addEnemy(en);
		
	},
	addEnemyB:function(){
		var en=new EnemyB();
		en.x=1000;
		en.y=300+Math.random()*250;
		en.init();
		if(this.state==2) en.updateState(1);
		this.currentRoom.addEnemy(en);
	},
	addBoss:function(){
		var en=new Boss();
		en.x=1000;
		en.y=350+Math.random()*200;
		en.init();
		this.currentRoom.addEnemy(en);
	},
	intoFirstRoom:function(){
		if(this.state==0){
			this.state=1;
			//this.addGuard();
		}else{
			if(Game.Enemy.length!=0){
				Game.Pause();
				toOne("backToOne");       //参数是div层的id
			}
			this.role.x=300;
			this.role.y=300;
			var w=this.roomTwo.weapons;
			for(var i=0; i< w.length;i++){
				Game.EventManager.unregisterMyEvent(w[i],["touchdown","update","death"]);
			}
			this.currentRoom=this.roomOne;
			this.currentRoom.role=this.role;
			this.currentRoom.clear(); 
			this.currentRoom.addObj(this.role);
			//this.addGuard();
			this.state=1;
		}
	},
	intoSecondRoom:function(){
		toSecond("oneChangeTwo");      //参数是div层的id
		Game.Pause();
		this.state=2;
		this.role.x=275;
		this.role.y=475;
		this.role.updateState(1);
		this.currentRoom=this.roomTwo;
		this.currentRoom.clear(); 
		this.currentRoom.role=this.role;
		this.currentRoom.addObj(this.role);
		var en=this.roomOne.enemys;
		for(var i = 0; i < en.length; i++)
		{
			en[i].x+=500;
			en[i].vx=1.2;
			if(en[i] instanceof EnemyA || en[i] instanceof EnemyB)
				en[i].updateState(1);
			this.currentRoom.addEnemy(en[i]);
		}
		var w=this.roomOne.weapons;
		for(var i=0; i< w.length;i++){
			Game.EventManager.unregisterMyEvent(w[i],["touchdown","update","death"]);
		}
		this.heart.draw();
		clearLine();
	},
	addBlood:function(){
		if(Game.Map.heart.isValid()){
			Game.Map.role.life+=Game.Map.heart.life;
			if(Game.Map.role.life>Game.Map.role.blood)
				Game.Map.role.life=Game.Map.role.blood;
			Game.Map.heart.now=0;
			Game.Map.heart.draw();
		}
	},
	addSkill:function(){
		if(Game.Map.skill.isValid()){
			var x1,x2;
			if(Game.Map.state == 1){
				x1=400;
				x2=900;
				var w,x,vy;
				for(var i =0; i<50; i++){
					x=x1+Math.random()*(x2-x1);
					vy=-5-Math.random()*35;
					w=new Ax();
					w.scale=0.4;
					w.power=20;
					w.init();
					w.updateState(2);
					w.x=x;
					w.y=-20;	
					w.vx=0;
					w.vy=vy;
					Game.Map.currentRoom.addWeapon(w);
				}
			
			}else{
				x1=550;
				x2=950;
				var w,x,vy;
				for(var i =0; i<45; i++){
					x=x1+Math.random()*(x2-x1);
					vy=-5-Math.random()*40;
					w=new Ax();
					w.scale=0.4;
					w.power=20;
					w.init();
					w.updateState(2);
					w.x=x;
					w.y=-20;	
					w.vx=0;
					w.vy=vy;
					Game.Map.currentRoom.addWeapon(w);
				}
			}
			Game.Map.skill.now=0;
			Game.Map.skill.draw();
		}
	},
	mapUpdate:function(){
		if( !this.heart.isValid()){
			this.heart.t+=0.05;
			if(this.heart.t>5){
				this.heart.now+=5;
				this.heart.draw();
				this.heart.t=0;
			}
			
		}
		if( !this.skill.isValid()){
			this.skill.t+=0.05;
			if(this.skill.t>5){
				this.skill.now+=5;
				this.skill.draw();
				this.skill.t=0;
			}
			
		}
		
	},
	/**
	 * 房间事件
	 */
	firstRoomUpdate:function(){
		var wp=this.weapons,
		en=this.enemys;
		var w,e;
		for(var i=0;i<wp.length;i++)
		{	
			if(wp[i].hit) 
				continue;
			w=wp[i];
			if(!w.isEnemy){
			for(var j=0;j<en.length;j++){
				if(en[j]){			
					e=en[j];	
					if(checkHit(e,w)){	
						e.life-=w.power;
						Game.EventManager.triggerMyEvent(w,"touchdown");	
						Game.EventManager.triggerMyEvent(e,"hit");
						break;
					}
				}
			}
			}else{
				if(checkHit(w,Game.Map.role)){
					Game.Map.role.life-=w.power;
					Game.EventManager.triggerMyEvent(w,"touchdown");
					if(Game.Map.role.state !=1 ) return;
					Game.EventManager.triggerMyEvent(Game.Map.role,"hit");
					
				}
			}
			
	    }
	},
	secondRoomUpdate:function(e){
		
		var wp=this.weapons,
		en=this.enemys;
		var w,e;
		for(var i=0;i<wp.length;i++)
		{	
			if(wp[i].hit) 
				continue;
			w=wp[i];
			if(!w.isEnemy){
				for(var j=0;j<en.length;j++){
					if(en[j]){			
						e=en[j];
						if(checkHit(e,w)){	
							e.life-=w.power;
							Game.EventManager.triggerMyEvent(w,"touchdown");	
							Game.EventManager.triggerMyEvent(e,"hit");
							break;
						}
					}
				}
			}else{
				if(checkHit(w,Game.Map.role)){
					Game.Map.role.life-=w.power;
					Game.EventManager.triggerMyEvent(w,"touchdown");
					if(Game.Map.role.state !=1 ) return;
					Game.EventManager.triggerMyEvent(Game.Map.role,"hit");
					
				}
			}
	    }
	},
	
	/**
	 * 主角事件
	 */
	heroUpdate:function(){
		this.showBlood(Game.Container.context);
		if(this.life<0){
			Game.EventManager.triggerMyEvent(Game.Map,"fail");
			return;
		}
	},
	heroOn:function(e){
		this.updateState(0);
		this.record=[];
		var zleft=Game.Container.zoffsetLeft;
		var ztop=Game.Container.zoffsetTop;
		var dis=e.pageX-zleft;
		this.record.push({x:dis,y:e.pageY});
		Game.EventManager.target.style.cursor='pointer';
	},
	heroMove:function(e){
		if(this.state==0){
			var zleft=Game.Container.zoffsetLeft;
			var ztop=Game.Container.zoffsetTop;
			var dis=e.pageX-zleft;
			this.record.push({x:dis,y:e.pageY});
			var l=this.record.length;
			var vx=(this.record[l-1].x-this.record[0].x)/5;
			var vy=(this.record[l-1].y-this.record[0].y)/5;
			if(vx<0){
				clearLine();
			}else{
				drawLine(this.record[0].x,this.record[0].y,vx,vy,0.9);
			}
		}else{
			Game.EventManager.target.style.cursor='default';
		}	
	},
	heroOut:function(e){
		if(this.state==0){
			var container=document.getElementById("container");
			var dis=e.pageX-container.offsetLeft;
			this.record.push({x:dis,y:e.pageY});
			Control.throwWeapon(this);
			
		}else{
			
		}
		this.updateState(1);
	},
	throwWeapon:function(hero){
		var l=hero.record.length;
		var vx=(hero.record[l-1].x-hero.record[0].x)/5;
		var vy=(hero.record[l-1].y-hero.record[0].y)/5;
		if(vx<0){
			clearLine();
			return;
		}
		var w=new Ax();
		w.init();		
		w.x=hero.record[0].x;
		w.y=hero.record[0].y;	
		w.vx=vx;
		w.vy=vy;
		Game.Map.currentRoom.addWeapon(w);
		clearLine();
	},
	heroHit:function(){
		if(this.state == 0) return;
		this.updateState(2);
		var me=this;
		setTimeout(function(){
			if(me.state == 2)
				me.updateState(1);
		},500);
	},
	heroFocus:function(e){
		if(checkPointInObj(this,e) && this.state!=0){
			Game.EventManager.target.style.cursor='pointer';
			this.updateState(3);
		}else if(this.state!=0){
			this.updateState(1);
		}
	},
	/**
	 * 敌人事件
	 */
	enemyAUpdate:function(){
		this.showBlood(Game.Container.context);
		if(this.life<0){
			Game.EventManager.triggerMyEvent(this,"death");
			return;
		}
		if(Game.Map.state==1){	
			/* 房间1中的情况 */
			this.x-=this.vx;
			var r=Math.random()*600;
			var max,min;
			if(this.x<800){
				min=100;
				max=180;
			}else{
				min=100;
				max=120;
			}
	
			if(this.y>520&&r>min&&r<max){		
				this.y-=this.vy;
			}else if(this.y<400&&r>min&&r<max){
				this.y+=this.vy;
			}
			if(this.x<400){
				this.vx=0;
				Game.EventManager.triggerMyEvent(Game.Map,"intoSecondRoom");
			}
		}else{
			/* 房间2中的情况 */		
			var r=Math.random()*600;
			var max,min;
			if(this.x<800){
				min=100;
				max=180;
			}else{
				min=100;
				max=120;
			}	
			/*放箭*/
			if(405<r&&r<415){
				Game.EventManager.triggerMyEvent(this,"archer")
			}
			
			if(this.x<this.marginal) return;
			this.x-=this.vx;
			if(this.y>520&&r>min&&r<max){		
				this.y-=this.vy;
			}else if(this.y<400&&r>min&&r<max){
				this.y+=this.vy;
			}
			
		
		}
	},
	enemyBUpdate:function(){
		this.showBlood(Game.Container.context);
		if(this.life<0){
			Game.EventManager.triggerMyEvent(this,"death");
			return;
		}
		if(Game.Map.state==1){	
			/* 房间1中的情况 */
			this.x-=this.vx;
			var r=Math.random()*600;
			var max,min;
			if(this.x<800){
				min=100;
				max=180;
			}else{
				min=100;
				max=120;
			}
	
			if(this.y>520&&r>min&&r<max){		
				this.y-=this.vy;
			}else if(this.y<400&&r>min&&r<max){
				this.y+=this.vy;
			}
			if(this.x<400){
				this.vx=0;
				Game.EventManager.triggerMyEvent(Game.Map,"intoSecondRoom");
			}
		}else{
			/* 房间2中的情况 */
			var r=Math.random()*600;
			var max,min;
			if(this.x<800){
				min=100;
				max=180;
			}else{
				min=100;
				max=120;
			}	
			
			/*放箭*/
			if(405<r&&r<415){
				Game.EventManager.triggerMyEvent(this,"archer")
			}
			
			if(this.x<this.marginal) return;
			this.x-=this.vx;
			if(this.y>520&&r>min&&r<max){		
				this.y-=this.vy;
			}else if(this.y<400&&r>min&&r<max){
				this.y+=this.vy;
			}
			
			
		}
	},
	bossUpdate:function(){
		
		
		this.showBlood(Game.Container.context);
		if(this.life<0){
			Game.EventManager.triggerMyEvent(this,"death");
			return;
		}
		
		if(this.life<600&&this.life>300){
			Game.EventManager.triggerMyEvent(this,"changeSecond");
		}else if(this.life <300){
			Game.EventManager.triggerMyEvent(this,"changeThree");
		}
	
		if(Game.Map.state==1){	
			/* 房间1中的情况 */
			this.x-=this.vx;
			var r=Math.random()*600;
			var max,min;
			if(this.x<800){
				min=100;
				max=180;
			}else{
				min=100;
				max=120;
			}
	
			if(this.y>520&&r>min&&r<max){		
				this.y-=this.vy;
			}else if(this.y<400&&r>min&&r<max){
				this.y+=this.vy;
			}
			if(405<r&&r<410||105<r&&r<108){		
				Game.EventManager.triggerMyEvent(this,"throwFireBall")
			}
			if(this.x<400){
				this.vx=0;
				Game.EventManager.triggerMyEvent(Game.Map,"intoSecondRoom");
			}
			
		}else{
			/* 房间2中的情况 */
			var r=Math.random()*600;
			var max,min;
			if(this.x<800){
				min=100;
				max=180;
			}else{
				min=100;
				max=120;
			}	

			if(405<r&&r<415||105<r&&r<110){		
				Game.EventManager.triggerMyEvent(this,"throwFireBall")
			}

			if(this.x<680) return;
			this.x-=this.vx;
			if(this.y>520&&r>min&&r<max){		
				this.y-=this.vy;
			}else if(this.y<400&&r>min&&r<max){
				this.y+=this.vy;
			}			
		}
	},
	throwFireBall:function(){
		this.updateState(3);
		var w=new FireBall();
		w.init();
		w.x=this.x;
		w.y=this.y;
		w.isEnemy=true;
		var r=Math.random()*8;
		w.vy=-18-r;
		w.vx=getVelocityX(w.x,w.y,Game.Map.role.x,Game.Map.role.y,w.g,w.vy);
		Game.Map.currentRoom.addWeapon(w);
		var me=this;
		setTimeout(function(){me.backState();},400);
	},
	bossChangeSecond:function(){
		this.currentState=1;
		this.updateState(1);
		Game.EventManager.unregisterMyEvent(this,["changeSecond"]);
	},
	bossChangeThree:function(){
		this.currentState=2;
		this.updateState(2);
		Game.EventManager.unregisterMyEvent(this,["changeThree"]);
	},
	enemyArcher:function(){
		var w=new Arrow();
		w.init();
		w.x=this.x;
		w.y=this.y;
		w.isEnemy=true;
		var r=Math.random()*8;
		w.vy=-18-r;
		w.vx=getVelocityX(w.x,w.y,Game.Map.role.x,Game.Map.role.y,w.g,w.vy);
		Game.Map.currentRoom.addWeapon(w);
	},
	enemyHit:function(){
		
	},
	enemyDeath:function(){
		try{
		Game.Map.currentRoom.delEnemy(this);
		Game.EventManager.unregisterMyEvent(this,["update","death"]);
		}catch(e){
			console.log(e);
		}
	},
	
	/**
	 * 武器事件
	 */
	
	weaponDeath:function(){
		try{
		Game.Map.currentRoom.delWeapon(this);
		Game.EventManager.unregisterMyEvent(this,["update","death"]);
		}catch(e){
			console.log(e);
		}
		
	},
	weaponTouchdown:function(){
		//setTimeout
		this.vx=this.vy=0;
		this.updateState(1);
		Game.EventManager.unregisterMyEvent(this,["touchdown"],Control.weaponTouchdown);
		var me=this;
		setTimeout(function(){Game.EventManager.triggerMyEvent(me,"death")},200);
	}
	
}
