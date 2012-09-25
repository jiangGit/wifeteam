
function Tool(){
	this.life = 300;
	this.time = 60;
	this.now = 0;
}

function Heart(){
	this.life = 300;
	this.time = 60;
	this.now = 0;
	this.cxt=null;
	this.img="tool";
	this.imgX=220;
	this.imgY=15;
	this.imgH=105;
	this.imgW=110;
	this.t=0;
}
Heart.prototype = new Tool();

Heart.prototype.init=function(){
	 this.img=Game.Data.ImgCache[this.img]||this.img;
	 var canvas=document.getElementById("heart");
	 this.cxt=canvas.getContext("2d");
	 
}
Heart.prototype.draw=function(){
	this.cxt.clearRect(0, 0, 200, 200);
	var h= this.imgH* this.now / this.time;
	this.cxt.drawImage (this.img , this.imgX , this.imgY+this.imgH-h+0.1, this.imgW, h , 0, 20+this.imgH-h, this.imgW, h);
}

Heart.prototype.isValid=function (){
	return this.now >= this.time;
}

function Skill(){
	this.life = 300;
	this.time = 60;
	this.now = 0;
	this.cxt=null;
	this.img="tool";
	this.imgX=110;
	this.imgY=104;
	this.imgH=104;
	this.imgW=110;
	this.t=0;
}
Skill.prototype = new Tool();

Skill.prototype.init=function(){
	 this.img=Game.Data.ImgCache[this.img]||this.img;
	 var canvas=document.getElementById("skill");
	 this.cxt=canvas.getContext("2d");
}

Skill.prototype.draw=function(){
	this.cxt.clearRect(0, 0, 200, 200);
	var h= this.imgH* this.now / this.time;
	this.cxt.drawImage (this.img , this.imgX , this.imgY+this.imgH-h+0.1, this.imgW, h , 0, this.imgH-h, this.imgW, h);
}

Skill.prototype.isValid=function (){
	return this.now >= this.time;
}

