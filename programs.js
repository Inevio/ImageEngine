     var column = 6;
     var row = 4;
     var k = 0;
     var urls = [];
     var img = [];
     var index = [];
     var where_you_are = 0;

     //var cursor_x;
     //var cursor_y;

     var right;
     var left;
     var up;
     var down;

     var flag = false;

     var size_view_x = 250; // Tamaño de la cámara
     var size_view_y = 250; // Tamaño de la cámara

     var canvas_destination_x = size_view_x;
     var canvas_destination_y = size_view_y;

     //var proporcion = canvas_destination_x/canvas_destination_y;

     var size_x_img;
     var size_y_img;

     var size_x_false;
     var size_y_false;

     var depth = false;
     //var cuadros; // Cuadros máximos para cargar la ampliación
/*
     var sx = 0;
     var sy = 0;
     var sw;
     var sh;*/
     var proportion_easy_x;
     var dx;
     var dy;
     var dw;
     var dh;
     /*
     grande = new Image();
     grande.src = "mariposa/big.jpeg";*/
     function divide (){
       size_x = (reduc.width)/column;
       size_y = (reduc.height)/row;

       size_view_x = size_x * column;
       size_view_y = size_y * row;

       size_x_false = size_x*2;
       size_y_false = size_y*2;

       proportion_easy_x = size_x_false / size_x;
     }

     /* Calcular el numero de column y filas que son necesarias
     para cargar la imagen */
     function maximum (){
       max_carga_ancho = column;
       max_carga_alto  = row;
       if (size_x_img < canvas_destination_x)
        max_carga_ancho = column + 1;
       if (size_y_img < canvas_destination_y)
        max_carga_alto = row + 1;
     }

     /*Genera un "table" con las url de las imágenes en las
     que se descompone la imagen, el orden es de left
     a right y de arriba a abajo */
     function table (){
       divide();
       //aux = new Array(column);
      for ( j = 0; j < column*row; j++)
        urls[j] = "mariposa/" + j + ".jpeg";
       }

       /* Función general de llamada */
       function mousepress(){
         flag = !flag;
       }
       function mousemove (event){
         if(flag){
         index = [];
         getMouseLomariposaionX(event); // Coordenadas en el canvas del ratón en x
         getMouseLomariposaionY(event); // Coordenadas en el canvas del ratón en y
         election();}
       }
       function election (){
         if (depth){
           position();               // Calcula en qué cuadrante del canvas se encuentra
           calculate_neighbour();       // Calcula las imágenes necesarias para ampliar la zona y las carga
           display();                // Dibujar la imagen final
        }
        else {
          displayEasy();
        }
       }

       /*Devuelve la coordenada X del ratón */
       function getMouseLomariposaionX(event) {
         var coordenadas = visor.getBoundingClientRect();
         cursor_x = event.pageX - coordenadas.left;
       }


       /* Devuelve la coordenada Y del ratón */
       function getMouseLomariposaionY(event){
         var coordenadas = visor.getBoundingClientRect();
         cursor_y = event.pageY - coordenadas.top;
       }

       /* Calcular posición actual */
       function position (){
         where_you_are = (parseInt(cursor_x / size_x ) + parseInt(cursor_y / size_y ) * column);
         proportion_easy_x = size_x_false / size_x;
         if (proportion_easy_x < 1){
           depth = false;
           election();
           return;}
       }

       function calculate_neighbour(){
         /* Lio  de paréntesis */ /* Solucionado */
         right   = parseInt (((cursor_x + ((max_carga_ancho/2) * size_x))/ size_x)+1) + parseInt(cursor_y / size_y ) * column;
         left = parseInt ((cursor_x - ((max_carga_ancho/2) * size_x))/ size_x) + parseInt(cursor_y / size_y ) * column ;

         up   = parseInt (cursor_x / size_x ) + parseInt((cursor_y - ((max_carga_alto/2) * size_y)) / size_y ) * column;
         down = parseInt (cursor_x / size_x ) + parseInt(((cursor_y + ((max_carga_alto/2) * size_y)) / size_y )+1) * column;

         /* Solucionar: No siempre hay que entrar en el bucle */ /* Solucionado */
         /* Solucionar: Problemas si right o left no está en la primera fila */
         /* Solucionar: Las imágemes diagonales */

         while((((right % column * size_x) > reduc.width) || ((right % column) <= (where_you_are % column))) && (right != where_you_are))
           right -= 1;

         while (((left < 0) || ((left % column) >= (where_you_are % column))) && (left != where_you_are))
           left += 1;

         while ((down >= urls.length) && (down != where_you_are))
           down -= column;

         while ((up  < 0) && (up != where_you_are))
           up += column;


         //Carga de imágenes
         for ( i = 0; i < urls.length; i++){
           if ((left % column <= i % column) && ((right % column) >= (i % column)) && ( i >= (up - (where_you_are - left))) && ( i <= (down + (right - where_you_are)))){
             index[index.length] = i;
             if (img[i] == undefined){
               img[i] = new Image();
               img[i].src = urls[i];
             }
           }
         }
       }       /* Fin function */

       function display(){
         var c = document.getElementById("visor");
         var ctx = c.getContext("2d");

         relacion_x = size_x_img / size_x;
         relacion_y = size_y_img / size_y;

         desplazamiento_x = (0.5 * canvas_destination_x) - cursor_x * relacion_x;
         desplazamiento_y = (0.5 * canvas_destination_y) - cursor_y * relacion_y;


         ctx.fillStyle = "#FFFFFF";
         ctx.fillRect(0,0,size_x * column, size_y * row);

         index.forEach(function(item){
             dx = (((item % column ) * size_x  ) * relacion_x ) + desplazamiento_x;
             dy = ((((item - (item % column )) / column ) * size_y ) * relacion_y) + desplazamiento_y;
             ctx.drawImage(img[item],dx,dy,size_x_img,size_y_img);

         })
       }
//var minimo = 0;
//var contador = 3;
       function zoom(alpha){
         //if (alpha > 0  || contador > minimo){
           index=[];
           //var beta = 50;
         //size_view_x -= alpha * 100;
         //size_view_y -= alpha * 100 * proporcion;
         size_x_false += alpha * 50 * size_x_img/size_y_img;
         size_y_false += alpha * 50;

         size_x_img = size_x_false;
         size_y_img = size_y_false;

         //contador += alpha;
       //}
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

        proportion_easy_x = size_x_false / size_x;
        if (proportion_easy_x > 1){
          depth = true;
          election();
          return;}
        var proporcion_easy_y = size_y_false / size_y;

        desplazamiento_x =  -cursor_x * proportion_easy_x + (0.5 * canvas_destination_x);
        desplazamiento_y =  -cursor_y * proporcion_easy_y + (0.5 * canvas_destination_y) ;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0,size_x * column, size_y * row);

        ctx.drawImage(reduc, cursor_x-size_x_false*column/2, cursor_y-size_y_false*row/2, size_x_false*column, size_y_false*row);
      }
