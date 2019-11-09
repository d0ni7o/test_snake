var initializeSnakeCubeSize = 5;
var initializeSnakeFirstLength = 20;    
var initializeSnakeGrowSize = 2;
var initializeSnakeLives = 5;
var snakePattern = 0;

var snakeHead = "brown";
var sp1 = "black";
var sp2 = "yellow";

var initializeFoodCubeSize = initializeSnakeCubeSize*1.5;

var initializeBonusFoodSize = initializeSnakeCubeSize*1.5;
var initializeBonusSpawnChance = 4;
var initializeBonusSpawnInterval = 400;
var initializeBonusLastTime = 200;

var initializeBorderSetting;


var initializeMaxSteni = Math.floor(30*initializeSnakeCubeSize/10);
var initializeMinSteni = Math.floor(25*initializeSnakeCubeSize/10);
var initializeWallBorder = 1;


//scaling sizing canvas
// var w = window.outerWidth;
// var h = window.innerHeight;

var w = initializeSnakeCubeSize*1024/10;
var h = w;

var statsHeight = 0.1*h;

var gameWidth = w;
var gameHeight =  h - statsHeight;
//
//
//
//
var mySnake = [];
var snakeTail;
var snakeCubeSize = initializeSnakeCubeSize;
var snakeFirstLength = initializeSnakeFirstLength;
var snakeGrowSize = initializeSnakeGrowSize;
var snakeLength = snakeFirstLength;
var snakeDead;
var snakeStart = 0;
var snakeLives = initializeSnakeLives;

var frameNo = 0;

var myFood = [];
var foodScore = 0; 
var foodCubeSize = initializeFoodCubeSize;

var myBonus = [];
var bonusUp = 0;
var bonusFoodSize = initializeBonusFoodSize;
var bonusSpawnChance = initializeBonusSpawnChance;
var bonusSpawnInterval = initializeBonusSpawnInterval;
var bonusLastTime = initializeBonusLastTime;


var myLevel = [];
var myScore = [];
var myLives = [];
var textSize = 100;
var textColor = "white";

var level = 1;
var wallLevelFactor = 0;
var maxNLevelFactor = 2;
var minNLevelFactor = 2;
var lengthLevelFactor = 0;
var speedLevelFactor = 1/100;
var startLevelFactor = 1/20;
var snakeSizeLF1 = 1;
var snakeSizeLF2 = snakeSizeLF1/10;
var buildLevelFactor = 1;
var levelUpRequirement = 10;

var maxDif = 5;
var wallSize = initializeSnakeCubeSize*3;

var wallP1 = document.getElementById("wall1png")
wallP1.width = wallSize.toString();
wallP1.height = wallSize.toString();
var pat;

var buildLevelDif = buildLevelFactor;
var maxSteni = initializeMaxSteni;
var minSteni = initializeMinSteni;
var maxSteniLength = 15*wallSize;
var minSteniLength = 5*wallSize;
var mySteni = [];

var gameIncrement = 0.2 + speedLevelFactor;
var initialGameSpeed = 2.5;
var gameSpeed = initialGameSpeed;
var gameRunner;

var borderSetting = initializeBorderSetting;
var wallBorder = initializeWallBorder;
var controls = [];

var snakeOhNo = document.getElementById("snakeRip");
var snakeChomp = document.getElementById("snakeChomp");


document.body.addEventListener("keydown",function(event){
    var x = event.which;
    console.log(x);
    switch(x){
        //P key
        case 80:
            if(snakeDead == 0){
                stopSnake();
                snakeDead = 1;
                break;
            }else if(snakeDead == 1){
                runSnake();
                snakeDead = 0;
                break;
            }
        //L key
        case 76:
            stopSnake();
            levelUp();
            break;
        //ESC key
        case 27:
                backToMenu();
                break;
        //R key
        case 82:
            if(snakeDead == 0){
                break;
            }else{
                resetSnake();   
                break;
            }
        //SPACEBAR
        case 32:
            if(snakeDead == 1){
                break;
            }else if(snakeStart == 1){
                break;
            }else{
                stopSnake();
                startSnake();
                break;
            }
        //LEFT ARROW KEY
        case 37:
            if(controls[1] == 1){
                break;
            }else{
                controls = [1, 0, 0, 0];
                break;
            }
        //UP ARROW KEY
        case 38:
            if(controls[3] == 1){
                break;
            }else{
                controls = [0, 0, 1, 0];
                break;
            }
        //RIGHT ARROW KEY
        case 39:
            if(controls[0] == 1){
                break;
            }else{
                controls = [0, 1, 0, 0];
                break;
            }
        //DOWN ARROW KEY
        case 40:
            if(controls[2] == 1){
                break;
            }else{
                controls = [0, 0, 0, 1];
                break;
            }                   
        default:
            break;
    }
});


function startGame(){
    document.getElementById("startMenu").style.display = "none";
    gameSpace.start();
    myLives = new component(textSize, textSize, textColor, (gameSpace.canvas.borderWidth + 60), (gameSpace.canvas.borderWidth + 18), "text");
    myLevel = new component(textSize, textSize, textColor, (gameSpace.canvas.borderWidth + 10), (gameSpace.canvas.borderWidth + 36), "text");
    myScore = new component(textSize, textSize, textColor, (gameSpace.canvas.borderWidth + 10), (gameSpace.canvas.borderWidth + 18), "text");
    myLives.text ="Lives:" + snakeLives;
    myLives.write();
    myLevel.text ="Level:" + level;
    myLevel.write();
    myScore.text ="Score:" + foodScore;
    myScore.write();
    spawnFood();
    myFood[0].draw();
    initializeSnake();
    buildLevel();
}

var gameSpace = {
    canvas : document.createElement("canvas"),
    stats : document.createElement("canvas"),
    start : function() {
        //CANVAS SECTION
        this.canvas.width = gameWidth;    
        this.canvas.height = gameHeight;
        this.canvas.id = "gameSpace";
        this.context = this.canvas.getContext("2d");

        this.stats.width = this.canvas.width;
        this.stats.height = statsHeight;
        this.stats.id = "stats";
        this.statsCtx = this.stats.getContext("2d");

        // this.context.rotate(10*Math.PI/180);
        document.body.insertBefore(this.canvas,document.body.childNodes[0]);    
        this.canvas.borderWidth = document.getElementsByTagName("canvas")[0].clientLeft;
        this.canvas.style.display = "block";

        document.body.insertBefore(this.stats,document.body.childNodes[1]);
        this.stats.borderWidth = this.canvas.borderWidth;
        this.stats.style.display = this.canvas.style.display;
    },
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.statsCtx.clearRect(0, 0, this.stats.width, this.stats.height);
    }
}

//CANVAS SQUARE MAKER
function component(width, height, color, x, y, type) {
    //SET POSITION AND SIZE
    this.type = type;
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    

    //DRAW THE SQUARE WITH THE GIVEN COLOR
    this.draw = function(){
        ctx = gameSpace.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },

    this.wallDraw = function(){
        ctx = gameSpace.context;
        ctx.fillStyle = pat;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },

    this.write = function(){
        ctx = gameSpace.statsCtx;
        ctx.font = this.width + "" + this.height;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);
    },  

    //REMOVE SQUARE
    this.remove = function(){
        ctx = gameSpace.context;
        ctx.clearRect(this.x, this.y, this.width, this.height);
    },

    //CHECK IF SQUARES CONTACT
    this.contact = function(otherobject){
        var myLeft = this.x;
        var myRight = this.x + this.width;
        var myTop = this.y;
        var myBottom = this.y + this.height;
        var otherLeft = otherobject.x;
        var otherRight = otherobject.x + otherobject.width;
        var otherTop = otherobject.y;
        var otherBottom = otherobject.y + otherobject.height;
        var contact = true;
        if((myBottom < otherTop || (myTop > otherBottom)) || (myRight < otherLeft || myLeft > otherRight)){
            contact = false;
        } else{
            return contact;
        }
    },

    this.contactCenter = function(otherobject){
        var myCenterX = this.x + this.width/2;
        var myCenterY = this.y + this.height/2;
        var otherCenterX = otherobject.x + otherobject.width/2;
        var otherCenterY = otherobject.y + otherobject.height/2;
        var gapCenterX = Math.sqrt((myCenterX - otherCenterX)*(myCenterX - otherCenterX));
        var gapCenterY = Math.sqrt((myCenterY - otherCenterY)*(myCenterY - otherCenterY));
        var gapCenter = (gapCenterX + gapCenterY)*(gapCenterX + gapCenterY);
        if(gapCenter <= this.width/2){
            return true;
        }else{
            return false;
        }
    }

    //CHECK IF SQUARE CONTACTS BORDER
    this.hitBorder = function(){
        var myLeft = this.x;
        var myRight = this.x + this.width;
        var myTop = this.y; 
        var myBottom = this.y + this.height;
        var hitBorder = false;
        var borderLeft = gameSpace.canvas.borderWidth;
        var borderRight = gameSpace.canvas.width - gameSpace.canvas.borderWidth;
        var borderTop = gameSpace.canvas.borderWidth;
        var borderBottom = gameSpace.canvas.height - gameSpace.canvas.borderWidth;
        if((myLeft < borderLeft || myRight > borderRight) || (myTop < borderTop || myBottom > borderBottom)){
            hitBorder = true;
            return hitBorder;
        }else{
            return hitBorder;
        }
    }
}

function buildLevel(){
    var maxS = Math.floor(Math.random()*(maxSteni-minSteni) + minSteni);
    var i = 0;
    var newX = 0;
    var newY = 0;
    var xMax = gameSpace.canvas.width;
    var yMax = gameSpace.canvas.height - wallSize - gameSpace.canvas.borderWidth;
    var tN = 0;
    var tMax = buildLevelDif;
    var fin = 0;

    while(i < maxS){
        var spawn = Math.floor(Math.random()*2);
        fin = i;

        if(tN < tMax && newY > yMax){
            newX = tN*minSteniLength*spawn;
            newY = 0;
            tN += 1;
            continue;
        }else if(tN >= tMax && newY > yMax){
            i = maxS;
            continue;
        }

        if(spawn == 1){
            var k = Math.floor(Math.random()*2);
            var newShirina = wallSize + Math.floor(Math.random()*maxSteniLength + minSteniLength)*k;
            var newUljina = wallSize + Math.floor(Math.random()*maxSteniLength + minSteniLength)*(1 - k);
            var newStena = new component(newShirina, newUljina, "brown", newX, newY);

            var testTouch = wallTouches(newStena);

            if(testTouch){
                newX += maxSteniLength;
                if(newX > xMax){
                    newX = 0;
                    newY += maxSteniLength;
                }
                continue;
            }

            if(snakeLevelCheck(newStena)){
                newX += maxSteniLength;
                if(newX > xMax){
                    newX = 0;
                    newY += maxSteniLength;
                }
                continue;
            }else if(newStena.contact(myFood[myFood.length - 1])){
                newX += maxSteniLength;
                if(newX > xMax){
                    newX = 0;
                    newY += maxSteniLength;
                }
                continue;
            }else if(wallBorder == 1 && newStena.hitBorder()){
                newX += maxSteniLength;
                if(newX > xMax){
                    newX = 0;
                    newY += maxSteniLength;
                }
                continue;
            }else if(i != 0 && newStena.contact(mySteni[i-1])){
                newX += maxSteniLength;
                if(newX > xMax){
                    newX = 0;
                    newY += maxSteniLength;
                }
                continue;
            }else{
                i += 1;
                newStena.wallDraw();
                mySteni.push(newStena);
                continue;  
            }      
        }else{
            newX += maxSteniLength;
            if(newX > xMax){
                newX = 0;
                newY += maxSteniLength;
            }
            continue;
        }
    }
    if(i >= maxS){
        var giveFin = maxS - fin;
        finishBuild(giveFin);
    }   
}

function finishBuild(x){
    var maxS = x;
    console.log("finish:" + x);
    for(i = 0; i < maxS; i += 1){
        var k = Math.floor(Math.random()*2);
        var newShirina = wallSize + Math.floor(Math.random()*maxSteniLength + minSteniLength)*k;
        var newUljina = wallSize + Math.floor(Math.random()*maxSteniLength + minSteniLength)*(1 - k);
        var newX = Math.floor(Math.random()*gameSpace.canvas.width);
        var newY = Math.floor(Math.random()*gameSpace.canvas.height);
        var newStena = new component(newShirina, newUljina, "brown", newX, newY);

        var testTouch = wallTouches(newStena);

        if(testTouch){
            i += -1;
            continue;
        }


        if(snakeLevelCheck(newStena)){
            i += -1;
            continue;
        }else if(newStena.contact(myFood[myFood.length - 1])){
            i += -1;
            continue;
        }else if(wallBorder == 1 && newStena.hitBorder()){
            i += -1;
            continue;
        }else if(i != 0 && newStena.contact(mySteni[i-1])){
            i += -1;
            continue;
        }else{
            newStena.wallDraw();
            mySteni.push(newStena);    
        }
    }
}

function wallTouches(newWall){
    testVal = false;
    for(i = 0; i < mySteni.length; i += 1){
        if(newWall.contact(mySteni[i])){
            testVal = true;
            break;
        }
    }
    return testVal;
}

function rebuildLevel(){
    for(i = 0; i < mySteni.length; i += 1){
        mySteni[0].remove();
    }
    mySteni = [];
    updateGame();
    buildLevel();
}

function snakeLevelCheck(wall){
    var snakeLeft = mySnake[0].x;
    var snakeRight = (mySnake[0].x + mySnake[0].width)*mySnake.length;
    var snakeTop = mySnake[mySnake.length - 1].y;
    var snakeBottom = mySnake[mySnake.length - 1].y + mySnake[mySnake.length - 1].height;
    var wallLeft = wall.x;
    var wallRight = wall.x + wall.width;
    var wallTop = wall.y;
    var wallBottom = wall.y + wall.height;
    var x = true;
    if((snakeLeft > wallRight || snakeRight < wallLeft) || (snakeTop > wallBottom || snakeBottom < wallTop)){
        x = false;
    }
    return x;
}


//OLD BUILER
// function buildLevel(){
//     var maxS = Math.floor(Math.random()*(maxSteni-minSteni) + minSteni);

//     for(i = 0; i < maxS; i += 1){
//         var k = Math.floor(Math.random()*2);
//         var newShirina = wallSize + Math.floor(Math.random()*maxSteniLength + minSteniLength)*k;
//         var newUljina = wallSize + Math.floor(Math.random()*maxSteniLength + minSteniLength)*(1 - k);
//         var newX = Math.floor(Math.random()*gameSpace.canvas.width);
//         var newY = Math.floor(Math.random()*gameSpace.canvas.height);
//         var newStena = new component(newShirina, newUljina, "brown", newX, newY);

//         if(snakeLevelCheck(newStena)){
//             i += -1;
//             continue;
//         }else if(newStena.contact(myFood[myFood.length - 1])){
//             i += -1;
//             continue;
//         }else if(wallBorder == 1 && newStena.hitBorder()){
//             i += -1;
//             continue;
//         }else if(i != 0 && newStena.contact(mySteni[i-1])){
//             i += -1;
//             continue;
//         }else{
//             newStena.draw();
//             mySteni.push(newStena);    
//         }
//     }
// }

function levelUp(){
    level++;

    if(level < maxDif){
        buildLevelDif += buildLevelFactor;
        wallSize += wallLevelFactor;
        maxSteni += maxNLevelFactor;
        minSteni += minNLevelFactor;
        maxSteniLength += lengthLevelFactor;
        bonusSpawnChance++;
    }

    gameIncrement += speedLevelFactor;
    initialGameSpeed += startLevelFactor;

    snakeFirstLength += snakeSizeLF1;
    snakeGrowSize += snakeSizeLF2;

    mySteni = [];
    
    resetSnake();
    rebuildLevel();
}

//SNAKE SECTION**
//FIRST SNAKE + WALLS
function resetSnake(){
    gameSpeed = initialGameSpeed;
    snakeStart = 0;

    frameNo = 0;
    bonusUp = 0;
    myBonus = [];

    foodScore = 0;
    myFood = [];
    mySnake = [];
    spawnFood();
    myFood[0].draw();

    initializeSnake();
    updateGame();
}

function initializeSnake(){
    snakeDead = 0;
    snakePattern = 0;
    snakeTail = new component(snakeCubeSize, snakeCubeSize, "black", 50, 50);
    snakeTail.draw();
    snakeLength = snakeFirstLength;
    mySnake.push(snakeTail);
    controls = [0, 1, 0, 0];
    for(i = 0; i < snakeFirstLength-1; i += 1){
        snakeGrow();
    }
}

//SNAKE MOVEMENT CONTROL
function snakeGrow(){
    var growLeft = controls[0];
    var growRight = controls[1]; 
    var growUp = controls[2]; 
    var growDown = controls[3];
    var oX = mySnake[mySnake.length - 1].x;
    var oY = mySnake[mySnake.length - 1].y;
    var actX = snakeCubeSize*growRight - snakeCubeSize*growLeft;
    var actY = snakeCubeSize*growDown - snakeCubeSize*growUp;
    var aniX = (snakeCubeSize - 1)*(growLeft + growRight);
    var aniY = (snakeCubeSize - 1)*(growUp + growDown);
    var newX = oX + 0.5*actX + 0.2*aniY*(2*(Math.floor((oX + 1)/2) - Math.floor(oX/2)) - 1);
    var newY = oY + 0.5*actY + 0.2*aniX*(2*(Math.floor((oY + 1)/2) - Math.floor(oY/2)) - 1);
    updateSnake(newX, newY);
}

//DRAW SNAKE
function updateSnake(nX, nY){
    //CREATE SNAKE HEAD
    var spColor;
    if(snakePattern == (snakeFirstLength - 1)){
        spColor = snakeHead;
    }else if((snakePattern - 2*Math.floor(snakePattern/2)) == 1){
        spColor = sp1;
    }else if((snakePattern - 2*Math.floor(snakePattern/2)) == 0){
        spColor = sp2;
    }
    snakePattern++;

    var newSnakePiece = new component(snakeCubeSize, snakeCubeSize, spColor, nX, nY);
    newSnakePiece.draw();
    mySnake.push(newSnakePiece);

    //CALL BORDER INTERACTION
    if(newSnakePiece.hitBorder()){
        borderRule();
    }

    //CHECK IF SNAKE EATS ITSELF
    for(i = 0; i < (mySnake.length - 3); i += 1){
        if(mySnake[mySnake.length - 1].contactCenter(mySnake[i])){
            snakeDead = 1;
            snakeLives += -1;
            snakeOhNo.play();
            stopSnake();
            if(snakeLives < 0){
                gameOver();
            }
        }
    }

    //CALL FOOD INTERACTION
    if(myFood[myFood.length - 1].contact(newSnakePiece)){
        // myFood[foodScore].remove();
        snakeChomp.play();
        foodScore++;
        if(foodScore > (levelUpRequirement - 1)){
            stopSnake();
            levelUp();
        }else{
            spawnFood();
            stopSnake();
            gameSpeed += gameIncrement;
            runSnake();
        }
    }

    //CALL BONUS INTERATION
    if(bonusUp == 1){
        if(myBonus[myBonus.length - 1].contact(newSnakePiece)){
            snakeChomp.play();
            snakeLives++;
            bonusUp = 0;
            myBonus[myBonus.length - 1].remove();
            frameNo = 0;
        }
    }



    //REMOVE TAIL IF SNAKE EXCEEDS MAX
    if(mySnake.length > snakeLength){
        var newSnake = mySnake.slice(1,mySnake.length);
        mySnake = newSnake;
    }
}

//FOOD SECTION**
//FOOD CONTROL
function spawnFood(){
    var newFood = new component(foodCubeSize, foodCubeSize, "red", Math.floor(Math.random()*gameSpace.canvas.width), Math.floor(Math.random()*gameSpace.canvas.height));

    for(i = 0; i < Math.max(mySnake.length, mySteni.length); i += 1){
        if(i < (mySnake.length)){
            if(newFood.contact(mySnake[i])){
                newFood = [];
                spawnFoodCallBack();
            }
        }
        if(i < mySteni.length){
            if(newFood.contact(mySteni[i])){
                newFood = [];
                spawnFoodCallBack();
            }
        }
    }

    if(newFood.hitBorder()){
        spawnFoodCallBack();     
    }else{
        myFood.push(newFood);
        snakeLength += snakeGrowSize;
    }   
}

//FOOD BORDER BUG FIX
function spawnFoodCallBack(){
    spawnFood();
}

function spawnBonus(){
    var newFood = new component(bonusFoodSize, bonusFoodSize, "blue", Math.floor(Math.random()*gameSpace.canvas.width), Math.floor(Math.random()*gameSpace.canvas.height));

    for(i = 0; i < Math.max(mySnake.length, mySteni.length); i += 1){
        if(i < (mySnake.length)){
            if(newFood.contact(mySnake[i])){
                newFood = [];
                spawnBonusCallBack();
            }
        }
        if(i < mySteni.length){
            if(newFood.contact(mySteni[i])){
                newFood = [];
                spawnBonusCallBack();
            }
        }
    }

    if(newFood.hitBorder()){
        spawnBonusCallBack();     
    }else{
        bonusUp = 1;
        myBonus.push(newFood);
    }  
}

function spawnBonusCallBack(){
    spawnBonus();
}

//BORDER RULE
function borderRule(){
    if(borderSetting == undefined){
        borderSetting = 0;
    }

    if(borderSetting == 0){
        defaultBorderRule();
    }else if(borderSetting == 1){
        snakeDead = 1;
        snakeLives += -1;
        snakeOhNo.play();
        stopSnake(); 
        if(snakeLives < 0){        
            gameOver();
        }
    }
}

//DEFAULT BORDER INTERACTION
function defaultBorderRule(){
    var oX = mySnake[mySnake.length - 1].x; 
    var oY = mySnake[mySnake.length - 1].y;
    var snakeRight = oX + mySnake[mySnake.length - 1].width;
    var snakeBottom = oY + mySnake[mySnake.length - 1].height;
    
    var borderLeft = gameSpace.canvas.borderWidth;
    var borderRight = gameSpace.canvas.width - gameSpace.canvas.borderWidth;
    var borderTop = gameSpace.canvas.borderWidth;
    var borderBottom = gameSpace.canvas.height - gameSpace.canvas.borderWidth;

    if(oX < borderLeft){
        nX = borderRight - mySnake[mySnake.length - 1].width;
        updateSnake(nX,oY);
    }
    if(snakeRight > borderRight){
        nX = borderLeft;
        updateSnake(nX,oY);
    }
    if(oY < borderTop){
        nY = borderBottom - mySnake[mySnake.length - 1].height;
        updateSnake(oX,nY);
    }
    if(snakeBottom > borderBottom){
        nY = borderTop;
        updateSnake(oX,nY);
    }
}

function updateGame(){
    gameSpace.clear();
    frameNo += 1;

    if((frameNo  == bonusSpawnInterval && bonusUp == 0)){
        frameNo = 0;
        if(0.05*bonusSpawnChance > Math.random()){
            spawnBonus();
            console.log(frameNo);
            myBonus[myBonus.length - 1].draw();
        } 
    }else if(bonusUp == 1){
        myBonus[myBonus.length - 1].draw();
    }
    
    if(bonusUp == 1 && frameNo == bonusLastTime){
        console.log(frameNo);
        myBonus[myBonus.length - 1].remove();
        bonusUp = 0;
        frameNo = 0;
    }

    snakeGrow();

    for(i = 0; i < mySteni.length; i += 1){
        if(mySnake[mySnake.length - 1].contact(mySteni[i])){
            snakeDead = 1;
            snakeLives += -1;
            snakeOhNo.play();
            stopSnake();
            if(snakeLives < 0){
                gameOver();
            }
        }
        mySteni[i].wallDraw();
    }

    for(i = 0; i < mySnake.length; i += 1){
        var spColor;
        if(i == (mySnake.length - 1)){
            spColor = snakeHead;
        }else if((snakePattern - 2*Math.floor(snakePattern/2)) == 1){
            spColor = sp1;
        }else{
            spColor = sp2;
        }
        snakePattern++;

        mySnake[i].color = spColor;
        mySnake[i].draw();
    }
    
    myLives.text ="Lives:" + snakeLives;
    myLevel.text ="Level:" + level;
    myScore.text ="Score:" + foodScore;

    myLives.write();
    myLevel.write();
    myScore.write();

    myFood[myFood.length - 1].draw();
}

//START SNAKE MOVEMENT
function startSnake(){
    controls = [0, 1, 0, 0];
    snakeStart = 1;
    runSnake();
}

function runSnake(){
    gameRunner = setInterval(updateGame,35/gameSpeed);   
}

//KILL SNAKE
function stopSnake(){
    clearInterval(gameRunner);
}

function gameOver(){
    alert("Game Over!");
    backToMenu();
}


// function applySettings(x = document.getElementById("settings").value){
//     borderSetting = x;
// }

function backToMenu(){
    stopSnake();
    mySnake = [];
    snakeTail;
    snakeCubeSize = initializeSnakeCubeSize;
    snakeFirstLength = initializeSnakeFirstLength;
    snakeLength = snakeFirstLength;
    snakeDead;
    snakeStart = 0;
    snakeLives = initializeSnakeLives;
    snakePattern = 0;

    myFood = [];
    foodScore = 0; 
    foodCubeSize = initializeFoodCubeSize;

    myBonus = [];
    bonusUp = 0;
    bonusFoodSize = initializeBonusFoodSize;
    bonusSpawnChance = initializeBonusSpawnChance;
    bonusSpawnInterval = initializeBonusSpawnInterval;
    bonusLastTime = initializeBonusLastTime;

    myLevel = [];
    myScore = [];
    myLives = [];

    level = 1;

    maxSteni = initializeMaxSteni;
    minSteni = initializeMinSteni;
    maxSteniLength = 15*wallSize;
    minSteniLength = 5*wallSize;
    mySteni = [];

    gameIncrement = 0.2;
    initialGameSpeed = 2.5;
    gameSpeed = initialGameSpeed;

    borderSetting = initializeBorderSetting;
    wallBorder = initializeWallBorder;
    controls = [];

    pat = ctx.createPattern(wallP1,'repeat');

    gameSpace.canvas.style.display = "none";
    gameSpace.stats.style.display = "none";
    document.getElementById("startMenu").style.display = "block";
}


startGame();
backToMenu();
