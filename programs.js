     var cols = 6;
     var fil = 4;
     var k = 0;
     var urls = [];
     var img = [];
     var indices = [];
     var numero_actual = 0;

     //var cursor_x;
     //var cursor_y;

     var derecha;
     var izquierda;
     var up;
     var down;

     var tam_view_x = 350; // Tamaño de la cámara
     var tam_view_y = 350; // Tamaño de la cámara

     var canvas_destino_x = tam_view_x;
     var canvas_destino_y = tam_view_y;

     //var proporcion = canvas_destino_x/canvas_destino_y;

     var tam_x_img;
     var tam_y_img;

     //var cuadros; // Cuadros máximos para cargar la ampliación
/*
     var sx = 0;
     var sy = 0;
     var sw;
     var sh;*/

     var dx;
     var dy;
     var dw;
     var dh;
     /*
     grande = new Image();
     grande.src = "cat/big.jpg";*/
     function divide (){
       tam_X = (reduc.width)/cols;
       tam_Y = (reduc.height)/fil;}

     /* Calcular el numero de cols y filas que son necesarias
     para cargar la imagen */
     function maximo (){
       max_carga_ancho = Math.ceil(canvas_destino_x / tam_x_img)+1;
       max_carga_alto  = Math.ceil(canvas_destino_y / tam_y_img)+1;
       if (tam_x_img < canvas_destino_x)
        max_carga_ancho = cols + 1;
       if (tam_y_img < canvas_destino_y)
        max_carga_alto = fil + 1;
     }

     /*Genera un "tabla" con las url de las imágenes en las
     que se descompone la imagen, el orden es de izquierda
     a derecha y de arriba a abajo */
     function tabla (){
       divide();
       //aux = new Array(cols);
      for ( j = 0; j < cols*fil; j++)
        urls[j] = "mariposa/" + j + ".jpeg";
         //console.log(aux[j]);
       }

       /* Función general de llamada */
       function mousemove (event){
         indices = [];
         getMouseLocationX(event); // Coordenadas en el canvas del ratón en x
         getMouseLocationY(event); // Coordenadas en el canvas del ratón en y
         position();               // Calcula en qué cuadrante del canvas se encuentra
         calcular_vecinos();       // Calcula las imágenes necesarias para ampliar la zona y las carga
         display();              // Dibujar la imagen final
       }

       /*Devuelve la coordenada X del ratón */
       function getMouseLocationX(event) {
         var coordenadas = visor.getBoundingClientRect();
         cursor_x = event.pageX - coordenadas.left;
       }


       /* Devuelve la coordenada Y del ratón */
       function getMouseLocationY(event){
         var coordenadas = visor.getBoundingClientRect();
         cursor_y = event.pageY - coordenadas.top;
       }

       /* Calcular posición actual */
       function position (){
         numero_actual = (parseInt(cursor_x / tam_X ) + parseInt(cursor_y / tam_Y ) * cols);
         //console.log(numero_actual, cursor_x,tam_X,cursor_y,tam_Y,parseInt(cursor_x / tam_X ) ,parseInt(cursor_y / tam_Y ));
         console.log(numero_actual);/*
         if ( numero_actual >= cols * fil ){
           numero_actual = 0;
           cursor_x = 0;
           cursor_y = 0;
           //console.log("Error al seleccionar cuadro");
         }*/
       }

       function calcular_vecinos(){
         /* Lio  de paréntesis */ /* Solucionado */
         derecha   = parseInt ((cursor_x + ((max_carga_ancho/2) * tam_X))/ tam_X) + parseInt(cursor_y / tam_Y ) * cols;
         izquierda = parseInt ((cursor_x - ((max_carga_ancho/2) * tam_X))/ tam_X) + parseInt(cursor_y / tam_Y ) * cols ;

         up   = parseInt (cursor_x / tam_X ) + parseInt((cursor_y - ((max_carga_alto/2) * tam_Y)) / tam_Y ) * cols;
         down = parseInt (cursor_x / tam_X ) + parseInt((cursor_y + ((max_carga_alto/2) * tam_Y)) / tam_Y ) * cols;

         /* Solucionar: No siempre hay que entrar en el bucle */ /* Solucionado */
         /* Solucionar: Problemas si derecha o izquierda no está en la primera fila */
         /* Solucionar: Las imágemes diagonales */
         while((((derecha % cols * tam_X) > reduc.width) || ((derecha % cols) <= (numero_actual % cols))) && (derecha != numero_actual))
           derecha -= 1;

         while (((izquierda < 0) || ((izquierda % cols) >= (numero_actual % cols))) && (izquierda != numero_actual))
           izquierda += 1;

         while ((down >= urls.length) && (down != numero_actual))
           down -= cols;

         while ((up  < 0) && (up != numero_actual))
           up += cols;

         //Carga de imágenes
         for ( i = 0; i < urls.length; i++){
           if ((izquierda % cols <= i % cols) && ((derecha % cols) >= (i % cols)) && ( i >= (up - (numero_actual - izquierda))) && ( i <= (down + (derecha - numero_actual)))){
             indices[indices.length] = i;
             if (img[i] == undefined){
               img[i] = new Image();
               img[i].src = urls[i];
             }
           }
         }
         //console.log(indices);
       }       /* Fin function */

       function display(){
         var c = document.getElementById("muestra");
         var ctx = c.getContext("2d");


         relacion_x = (cols * tam_x_img) / (cols * tam_X);
         relacion_y = (fil * tam_y_img) / (fil * tam_Y);

         desplazamiento_x =  (0.5 * canvas_destino_x) - cursor_x*relacion_x ;
         desplazamiento_y = (0.5 * canvas_destino_y) - cursor_y*relacion_y ;

         ctx.fillStyle = "#FFFFFF";
         ctx.fillRect(0,0,canvas_destino_x,canvas_destino_y);

         indices.forEach(function(item){
             dx = (((item % cols ) * tam_X  ) * relacion_x ) + desplazamiento_x;
             dy = ((((item - (item % cols )) / cols ) * tam_Y ) * relacion_y) + desplazamiento_y;
             ctx.drawImage(img[item],dx,dy,tam_x_img,tam_y_img);

         })
       }
var minimo = 0;
var contador = 3;
       function zoom(alpha){
         if (alpha > 0  || contador > minimo){
           maximo();
           indices=[];
           calcular_vecinos();

         //tam_view_x -= alpha * 100;
         //tam_view_y -= alpha * 100 * proporcion;
         tam_y_img += alpha * 100 * tam_y_img/tam_x_img;
         tam_x_img += alpha * 100;
         contador += alpha;
       }

         display();
       }
/*       function zoom_out(){
         tam_view_x += 100;
         tam_view_y += 100 * proporcion;
         tam_y_img -= 100 * tam_y_img/tam_x_img;
         tam_x_img -= 100
       }

       $function(){
         $('#visor').html(navigator.visor);
         function (event, delta){
           if (delta > 0)
            zoom_in();
           else
            zoom_out();
        }
      }
      */
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
