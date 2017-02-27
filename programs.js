var column = 6;
var row = 4;
var k = 0;
var urls = [];
var img = [];
var index = [];
var where_you_are = 0;
//var cursor_x;
//var cursor_y;
var last_point= [];
var right;
var left;
var up;
var down;

var flag = false;

var size_view_x = 250;
var size_view_y = 250;

var last_mouse=[];

var canvas_destination_x;
var canvas_destination_y;

var one = true;

var size_x_img;
var size_y_img;

var size_x_false;
var size_y_false;

var depth = false;
var proportion_easy_x;
var dx;
var dy;
var dw;
var dh;
var point_x = 0;
var point_y = 0;

var desplazamiento_x;
var desplazamiento_y;

function first(){
  point_x = canvas_destination_x/2;
  ////console.log(point_x);
  point_y = canvas_destination_y/2;
  ////console.log(point_y);
  last_mouse[0] = point_x;
  last_mouse[1] = point_y;

  desplazamiento_x = (0.5 * canvas_destination_x) - point_x * relacion_x ;
  desplazamiento_y = (0.5 * canvas_destination_y) - point_y * relacion_y ;

  position();
  calculate_neighbour();
  display();
  one = false;
  //console.log(move_x);
}

function save(){
  last_mouse[0] = cursor_x;
  last_mouse[1] = cursor_y;

  last_point[0] = point_x;
  last_point[1] = point_y;
}

function rest(){
  move_x = cursor_x - last_mouse[0];
  move_y = cursor_y - last_mouse[1];
  if (move_x > 10 || move_x < -10)
    move_x=move_x%10;
  if (move_y > 10 || move_y < -10)
    move_y=move_y%10;

  //console.log(move_x);
  }

function divide (){
  size_x = (reduc.width)/column;
  size_y = (reduc.height)/row;

  size_view_x = size_x * column;
  size_view_y = size_y * row;

  size_x_false = size_x*2;
  size_y_false = size_y*2;

  proportion_easy_x = size_x_false / size_x;
}

function maximum (){
  max_carga_ancho = column;
  max_carga_alto  = row;
  if (size_x_img < canvas_destination_x)
   max_carga_ancho = column + 1;
  if (size_y_img < canvas_destination_y)
   max_carga_alto = row + 1;

   relacion_x = size_x_img/size_x;
   relacion_y = size_y_img/size_y;
}

function table (){
  divide();
 for ( j = 0; j < column*row; j++)
   urls[j] = "mariposa/" + j + ".jpeg";
  }

  function getMouseLocationX(event) {
    var coordenadas = visor.getBoundingClientRect();
    cursor_x = event.pageX - coordenadas.left;
  }

  function getMouseLocationY(event){
    var coordenadas = visor.getBoundingClientRect();
    cursor_y = event.pageY - coordenadas.top;
  }

  function invento(){
    point_x += last_mouse[0] - cursor_x;
    point_y += last_mouse[0] - cursor_y;
  }

  function zoom(alpha){
    point_x = cursor_x;
    point_y = cursor_y;
    index=[];
    size_x_false += alpha * 20 * size_x_img/size_y_img;
    size_y_false += alpha * 20;

    size_x_img = size_x_false;
    size_y_img = size_y_false;

    maximum();
    election();
  }

 function Scroll(){
 var situacion = document.getElementById("visor");
 if (situacion.addEventListener){
   //IE9, Chrome, Safari, Opera
   situacion.addEventListener("mousewheel", MouseWheelHandler, false);
   //Firefox
   situacion.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
 }
 //IE 6/7/8
 else situacion.attachEvent("onmousewheel", MouseWheelHandler);
}

 function MouseWheelHandler(e){
   var e = window.event || e; //IE
   var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
   zoom(delta);
   return false;
 }

 function displayEasy(){
   var c = document.getElementById("visor");
   var ctx = c.getContext("2d");

   var reduc = new Image();
   reduc.src = "mariposa/reduc.jpeg";

   if (proportion_easy_x > 1){
     depth = true;
     election();
     return;}

   var proporcion_easy_y = size_y_false / size_y;

   ctx.fillStyle = "#FFFFFF";
   ctx.fillRect(0,0,size_x * column, size_y * row);

   ctx.drawImage(reduc, point_x-size_x_false*column/2, point_y-size_y_false*row/2);
 }

 function mousepress(event){
   if(flag){
   getMouseLocationX(event);
   getMouseLocationY(event);

   last_mouse_x = cursor_x;
   last_mouse_y = cursor_y;
   //console.log("BYE!!  " + move_x );
  }
   if(!flag){
     getMouseLocationX(event);
     getMouseLocationY(event);
     // console.log("-----------------------------------------------------")
     //console.log("CLICK!!!");
     //console.log(move_x);
     last_mouse_x = cursor_x;
     last_mouse_y = cursor_y;
   }
   flag = !flag;
 }

 function problem(){
   if(flag)
    flag = !flag;
 }

 function update(){
   point_x -= move_x;
   point_y -= move_y;
 }
 function position (){
   where_you_are = (parseInt(point_x / size_x ) + parseInt(point_y / size_y ) * column);
   proportion_easy_x = size_x_false / size_x;
   if (proportion_easy_x < 1){
     depth = false;
     election();
     return;}
 }

 function calculate_neighbour(){
   right   = parseInt (((point_x + ((max_carga_ancho/2) * size_x))/ size_x)+1) + parseInt(point_y / size_y ) * column;
   left = parseInt ((point_x - ((max_carga_ancho/2) * size_x))/ size_x) + parseInt(point_y / size_y ) * column ;

   up   = parseInt (point_x / size_x ) + parseInt((point_y - ((max_carga_alto/2) * size_y)) / size_y ) * column;
   down = parseInt (point_x / size_x ) + parseInt(((point_y + ((max_carga_alto/2) * size_y)) / size_y )+1) * column;

   while((((right % column * size_x) > reduc.width) || ((right % column) <= (where_you_are % column))) && (right != where_you_are))
     right -= 1;

   while (((left < 0) || ((left % column) >= (where_you_are % column))) && (left != where_you_are))
     left += 1;

   while ((down >= urls.length) && (down != where_you_are))
     down -= column;

   while ((up  < 0) && (up != where_you_are))
     up += column;

   for ( i = 0; i < urls.length; i++){
     if ((left % column <= i % column) && ((right % column) >= (i % column)) && ( i >= (up - (where_you_are - left))) && ( i <= (down + (right - where_you_are)))){
       index[index.length] = i;
       if (img[i] == undefined){
         img[i] = new Image();
         img[i].src = urls[i];
       }
     }
   }
 }
 function calculate_display(){
   relacion_x = size_x_img/size_x;
   relacion_y = size_y_img/size_y;

   desplazamiento_x += move_x;
   desplazamiento_y += move_y;
   if (((index[0] % column ) * size_x  ) + desplazamiento_x > 0){
      desplazamiento_x = 0;
      point_x = last_point[0];
    }

  if(((((index[0] - (index[0] % column )) / column ) * size_y ) * relacion_y) + desplazamiento_y > 0){
    desplazamiento_y = 0;
    point_y = last_point[1];
  }/*
  console.log(row, size_x, desplazamiento_x,(row * size_x + desplazamiento_x ), canvas_destination_x, size_x == size_x_img)
  if ((row * size_x_img + desplazamiento_x ) < (canvas_destination_x)){
    //desplazamiento_x += +canvas_destination_x - (row * size_x_img + desplazamiento_x );
    point_x = last_point[0];
    console.log("jejeje");*/
  }

 }

 function display(){
   var c = document.getElementById("visor");
   var ctx = c.getContext("2d");

   ctx.fillStyle = "#FFFFFF";
   ctx.fillRect(0, 0, size_x * column, size_y * row);

   index.forEach(function(item){
       dx = (((item % column ) * size_x  ) * relacion_x ) + desplazamiento_x;
       dy = ((((item - (item % column )) / column ) * size_y ) * relacion_y) + desplazamiento_y;
       ctx.drawImage(img[item],dx,dy,size_x_img,size_y_img);
   })
 }

 function mousemove (event){
   if(flag){
     index = [];
     getMouseLocationX(event);
     getMouseLocationY(event);
     rest();
     update();
     election();
   }
 }

 function election (){
   if (depth){
     if (one)
      first();

     else{
       //rest();
       //console.log("move:" + move_x + "  " + move_y);
       //update();
       //console.log("desplazado:" + point_x + "  " + point_y);
       position();
       calculate_neighbour();
       calculate_display();
       display();
       save();
       /*
       if(move_x > 5 || move_y > 5 || move_y < -5 || move_x < -5)
        console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRR")*/
     }
  }
  else {
    calculate_display();
    displayEasy();
  }
 }
