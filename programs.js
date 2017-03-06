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
  point_y = canvas_destination_y/2;
  ////console.log("First: ", point_x, point_y);

  last_mouse[0] = point_x;
  last_mouse[1] = point_y;
  ////console.log("First last_mouse: ", last_mouse)

  last_point[0] = point_x;
  last_point[1] = point_y;

  desplazamiento_x = (0.5 * canvas_destination_x) - point_x * relacion_x ;
  desplazamiento_y = (0.5 * canvas_destination_y) - point_y * relacion_y ;
  ////console.log("Desplazamiento: ", desplazamiento_x, desplazamiento_y );
  position();
  calculate_neighbour();
  display();
  one = false;
  //////console.log(move_x);
}

function save(){
  last_mouse[0] = cursor_x;
  last_mouse[1] = cursor_y;

  last_point[0] = point_x;
  last_point[1] = point_y;
}

function rest(){
  move_x = cursor_x - last_mouse[0];
  ////console.log("Rest :", cursor_x, last_mouse[0])
  move_y = cursor_y - last_mouse[1];
  ////console.log("Rest :", cursor_y, last_mouse[1])
  if (move_x > 10 || move_x < -10)
    move_x=move_x%10;
  if (move_y > 10 || move_y < -10)
    move_y=move_y%10;
  ////console.log("Rest: ", move_x, move_y);
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
    ////console.log("Mouse X: ", cursor_x);
  }

  function getMouseLocationY(event){
    var coordenadas = visor.getBoundingClientRect();
    cursor_y = event.pageY - coordenadas.top;
    ////console.log("Mouse Y: ", cursor_y);
  }
/*
  function calculate_coord(){
    coordenadas[0] = cursor_x - desplazamiento_x;
    coordenadas[1] = cursor_y - desplazamiento_y;
  }
  function update_coord(alpha){
    coordenadas[0] += alpha * 10 * size_x_img/size_y_img + despla;
    coordenadas[1] += alpha * 10;
  }*/
  function zoom(alpha){

    //calculate_coord();
    size_x_false += alpha * 10 * size_x_img/size_y_img;
    size_y_false += alpha * 10;
    //update_coord(alpha);

    point_x = cursor_x;
    point_y = cursor_y;

    index=[];

    relacion_x = size_x_img / size_x;
    relacion_y = size_y_img / size_y;

    if(alpha){
      desplazamiento_x = desplazamiento_x*size_x_false/size_x_img;
      desplazamiento_y = desplazamiento_y*size_y_false/size_y_img;
    }
    else{
      desplazamiento_x = desplazamiento_x*size_x_false/size_x_img - move_x*size_x_false/size_x_img;
      desplazamiento_y = desplazamiento_y*size_y_false/size_y_img - move_y*size_y_false/size_y_img;
    }

    save();

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

   proportion_easy_x = size_x_false / size_x;
   //console.log("Soy easy y fallo :D")
   if (proportion_easy_x > 1){
     depth = true;
     election();
     return;}

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0,0,size_x * column, size_y * row);


   //console.log("Especial: ",size_x_false*column, canvas_destination_x);
   if(size_x_false*column < canvas_destination_x){
    ctx.drawImage(reduc, canvas_destination_x/2-size_x_false*column/2, canvas_destination_y/2-size_y_false*row/2, size_x_false*column, size_y_false*row);
    //console.log("SOY ESPECIAL :D")
    }
   else {
     rest();
     update();
     desplazamiento_x += move_x;
     desplazamiento_y += move_y;
     save();
     ////console.log("Desplazamientos: ", desplazamiento_x, desplazamiento_y);
     if (desplazamiento_x > 0){
        desplazamiento_x = 0;
        point_x = last_point[0];
        //console.log("Limit left");
      }

    if(desplazamiento_y > 0){
      desplazamiento_y = 0;
      point_y = last_point[1];
      //console.log("Limit top");
    }

    //console.log("Limit right :", size_x_false*column, desplazamiento_x, size_x_false*column + desplazamiento_x, canvas_destination_x);
    if ( size_x_false*column + desplazamiento_x < canvas_destination_x){
      point_x = last_point[0];
      desplazamiento_x -= move_x;
      //console.log("Limit right");
    }

    //console.log("Limit bot :", size_y_false*row, desplazamiento_y,size_y_false*row + desplazamiento_y, canvas_destination_y);
    if ( size_y_false*row + desplazamiento_y < canvas_destination_y){
      point_y = last_point[1];
      desplazamiento_y -= move_y;
      //console.log("Limit bot");
    }
     ctx.drawImage(reduc, desplazamiento_x, desplazamiento_y, size_x_false*column, size_y_false*row)
  }
 }

 function mousepress(event){
   if(flag){
   getMouseLocationX(event);
   getMouseLocationY(event);

   last_mouse_x = cursor_x;
   last_mouse_y = cursor_y;
  }
   if(!flag){
     getMouseLocationX(event);
     getMouseLocationY(event);
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
       //////console.log("Index: ",index[index.length-1]);
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
      ////console.log("Limit left");
    }

  if(((((index[0] - (index[0] % column )) / column ) * size_y ) * relacion_y) + desplazamiento_y > 0){
    desplazamiento_y = 0;
    point_y = last_point[1];
    ////console.log("Limit top");
  }

  if ( size_x_img*column + desplazamiento_x < canvas_destination_x){
    point_x = last_point[0];
    desplazamiento_x -= move_x;
    ////console.log("Limit right");
  }

  if ( size_y_img*row + desplazamiento_y < canvas_destination_y){
    point_y = last_point[1];
    desplazamiento_y -= move_y;
    ////console.log("Limit bot");
  }
  //////console.log(point_x, point_y, move_x, move_y, desplazamiento_x, desplazamiento_y, last_point)
 }

 function display(){
   var c = document.getElementById("visor");
   var ctx = c.getContext("2d");

   ctx.fillStyle = "#FFFFFF";
   ctx.fillRect(0, 0, size_x * column, size_y * row);

   index.forEach(function(item){
       dx = (((item % column ) * size_x  ) * relacion_x ) + desplazamiento_x;
       dy = ((((item - (item % column )) / column ) * size_y ) * relacion_y) + desplazamiento_y;
       //////console.log("Display: ", dx, dy);
       ctx.drawImage(img[item],dx,dy,size_x_img,size_y_img);
   })
 }

 function mousemove (event){
   if(flag){
     index = [];
     getMouseLocationX(event);
     getMouseLocationY(event);

     election();
     ////console.log("Mousemove ~")
   }
 }

 function election (){
   if (depth){
     if (one)
      first();

     else{
       rest();
       update();
       position();
       calculate_neighbour();
       calculate_display();
       display();
       save();
     }
  }
  else {
    //calculate_display();
    displayEasy();
  }
 }
