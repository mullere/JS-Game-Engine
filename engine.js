var fps = 50, mouseClickX = 0, mouseClickY = 0, mousePosX = 0, mousePosY = 0, selected=null, oldSelected=null;
var entities = []; var selectedEvents = []; var mouseEvents = [];
function gamespace(){
	this.canvas = document.getElementById('gamespace');
	this.initialize = function(){
		this.canvas.width = 500;
		this.canvas.height = 500;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas,document.body.childNodes[0]);
	};
}
function gamestate(){
	this.updatestate = function(){
		moveEntities();
		emptySelectedEventQueue();
	};
	this.renderstate = function(){
		gamespace.context.clearRect(0,0,gamespace.canvas.width,gamespace.canvas.height);
		drawEntities();
	};
	this.run = function(){
		//console.log('loop is running');
		gamestate.updatestate();
		gamestate.renderstate();
	};
	this.start = function(){
		gamespace = new gamespace();
		gamespace.initialize();
		this.interval = setInterval(this.run,1000/fps);	
	};
	this.stop = function(){
		clearInterval(this.interval);
	};
}
function selectedEvent(target,actiona,actionb){
	selectedEvents.push(function(){
		if(target.selected==true){
			actiona();
		} else {
			actionb();
		}
	});
}
function emptySelectedEventQueue(){
	//console.log('emptying event queue');
	for(i=0;i<selectedEvents.length;i++){
		selectedEvents[i]();
	}
}
function makeOnlySelected(target){
	for(i=0;i<entities.length;i++){
		entities[i].selected = false;
	}
	entities[target].selected = true;
}
function moveEntities(){
	for(i=0;i<entities.length;i++){
		entities[i].speedX = 3*(entities[i].targetX - entities[i].posX)/gamespace.canvas.width;
		entities[i].posX += entities[i].speedX;
		entities[i].speedY = 3*(entities[i].targetY - entities[i].posY)/gamespace.canvas.height;
		entities[i].posY += entities[i].speedY;
	}
}

function drawEntities(){
	var ctx = gamespace.context;
	for(i=0;i<entities.length;i++){
		ctx.fillStyle = entities[i].color;
		switch(entities[i].shape){
			case 'circle':
				var radius = entities[i].width/2;
				ctx.beginPath();
				ctx.arc(entities[i].posX,entities[i].posY,radius,0,2*Math.PI);
				ctx.fill();
				break;
			default:
				ctx.fillRect(entities[i].posX-(entities[i].width/2),entities[i].posY-(entities[i].height/2),entities[i].width,entities[i].height);
		}
	}
}
function entity(name,shape,height,width,color,posX,posY,speedX,speedY,targetX,targetY,collision){
	var newEntity = {
		'name':name,
		'shape':shape,
		'height':height,
		'width':width,
		'color':color,
		'posX':posX,
		'posY':posY,
		'speedX':speedX,
		'speedY':speedY,
		'targetX':targetX,
		'targetY':targetY,
		'collision':collision,
	};
	entities.push(newEntity);
}
function log_info(info){
	console.log(info);
}
function whatIsSelected(){
	for(i=0;i<entities.length;i++){
		var radius = Math.sqrt(Math.pow(entities[i].width/2,2)+Math.pow(entities[i].height/2,2));
		var mouseClickDistance = Math.sqrt(Math.pow(mouseClickX-entities[i].posX,2)+Math.pow(mouseClickY-entities[i].posY,2));
		if((mouseClickDistance<radius)){
			console.log(entities[i].name+" has been selected");
			return i;
		}
	}
	console.log('nothing selected');
	return null;
}
function mouseEvent(event){
	mouseEvents.push(event);
}
function mouseListener(){
	gamespace.canvas.addEventListener('mousedown',function(e){
		mouseClickX = e.x;
		mouseClickY = e.y;
		mouseClickX -= gamespace.canvas.offsetLeft;
		mouseClickY -= gamespace.canvas.offsetTop;
		//console.log(mouseClickX+','+mouseClickY);
		oldSelected = selected;
		selected = whatIsSelected();
		for(i=0;i<mouseEvents.length;i++){
			mouseEvents[i]();
		}
	},false);
}
function keyPressListener(action){

}
gamestate = new gamestate();
gamestate.start();




// this is where the game engine ends and the components that make up the game are added.
var playableColor = 'rgba(0,110,110,1)';
var playableHighlighted = 'rgba(0,150,150,1)';
var cloudColor = 'rgba(130,130,130,0.5)';
new mouseListener();
new entity('playable1','circle',50,50,playableColor,400,400,0,0,400,400,true);
new entity('playable2','circle',50,50,playableColor,350,350,0,0,350,350,true);
new entity('enemy1','circle',50,50,'purple',100,100,0,0,100,100,true);
new entity('enemy2','circle',50,50,'purple',150,150,0,0,150,150,true);
new entity('cloud','circle',100,100,cloudColor,250,250,0,0,250,250,true);
new entity('cloud','circle',100,100,cloudColor,200,300,0,0,200,300,true);
new entity('cloud','circle',100,100,cloudColor,300,200,0,0,300,200,true);
new mouseEvent(function(){
	if((selected==0)&&(oldSelected!=0)){
		entities[0].color=playableHighlighted;
	}
});
new mouseEvent(function(){
	if((selected!=0)&&(oldSelected==0)){
		entities[0].color = playableColor;
		entities[0].targetX = mouseClickX;
		entities[0].targetY = mouseClickY;
	}
});
new mouseEvent(function(){
	if((selected==1)&&(oldSelected!=1)){
		entities[1].color=playableHighlighted;
	}
});
new mouseEvent(function(){
	if((selected!=1)&&(oldSelected==1)){
		entities[1].color = playableColor;
		entities[1].targetX = mouseClickX;
		entities[1].targetY = mouseClickY;
	}
});
//new MouseEvent();
/*new leftMouseClickListener(entities[1],function(){
	makeOnlySelected(1);
});*/	
/*new leftMouseClickListener(entities[0],function(){
	entities[1].targetX = mouseClickX;
	entities[1].targetY = mouseClickY;
});*/
/*new selectedEvent(entities[0],function(){
		entities[0].color='red'
	},function(){
		entities[0].color='blue';
	});*/
/*entities[1].targetX = mouseClickX;
	entities[1].targetY = mouseClickY;*/
/*new leftMouseClickListener(entities[0],function(){
	makeOnlySelected(1);
	new eventQueueItem(entities[1],function(){
		entities[1].color='red';
	});
	
});*/

/*switch(target.shape){
	case 'circle':
		var radius = target.width/2;
		var mouseClickDistance = Math.sqrt(Math.pow(mouseClickX-target.posX,2)+Math.pow(mouseClickY-target.posY,2));
		break;
	default:
		var radius = Math.sqrt(Math.pow(target.width/2)+Math.pow(target.height/2));
		var mouseClickDistance = Math.sqrt(Math.pow(mouseClickX-target.posX,2)+Math.pow(mouseClickY-target.posY,2));
		break;
}
if((mouseClickDistance<radius)&&(target.clickable==true)){
	console.log(target.name+" has been selected");
	action();
}*/
