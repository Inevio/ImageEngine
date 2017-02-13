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

     var tam_view_x = 250; // Tamaño de la cámara
     var tam_view_y = 250; // Tamaño de la cámara

     var canvas_destino_x = tam_view_x;
     var canvas_destino_y = tam_view_y;

     //var proporcion = canvas_destino_x/canvas_destino_y;

     var tam_x_img;
     var tam_y_img;

     var tam_x_false;
     var tam_y_false;

     var profundidad = false;
     //var cuadros; // Cuadros máximos para cargar la ampliación
/*
     var sx = 0;
     var sy = 0;
     var sw;
     var sh;*/
     var proporcion_easy_x;
     var dx;
     var dy;
     var dw;
     var dh;
     /*
     grande = new Image();
     grande.src = "cat/big.jpg";*/
     function divide (){
       tam_X = (reduc.width)/cols;
       tam_Y = (reduc.height)/fil;

       tam_x_false = tam_X*2;
       tam_y_false = tam_Y*2;

       proporcion_easy_x = tam_x_false / tam_X;
     }

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
         eleccion()
       }
       function eleccion (){
         //console.log(proporcion_easy_x);
         if (profundidad){
           position();               // Calcula en qué cuadrante del canvas se encuentra
           calcular_vecinos();       // Calcula las imágenes necesarias para ampliar la zona y las carga
           display();                // Dibujar la imagen final
        }
        else {
          displayEasy();
        }
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
         proporcion_easy_x = tam_x_false / tam_X;
         if (proporcion_easy_x < 1){
           profundidad = false;
           eleccion();
           return;}
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
         //console.log("-----------------------");
         //console.log("pedacitos");

         relacion_x = tam_x_img / tam_X;
         relacion_y = tam_y_img / tam_Y;

         desplazamiento_x = (0.5 * canvas_destino_x) - cursor_x * relacion_x;
         desplazamiento_y = (0.5 * canvas_destino_y) - cursor_y * relacion_y;


         ctx.fillStyle = "#FFFFFF";
         ctx.fillRect(0,0,canvas_destino_x,canvas_destino_y);

         indices.forEach(function(item){
             dx = (((item % cols ) * tam_X  ) * relacion_x ) + desplazamiento_x;
             dy = ((((item - (item % cols )) / cols ) * tam_Y ) * relacion_y) + desplazamiento_y;
             ctx.drawImage(img[item],dx,dy,tam_x_img,tam_y_img);

         })
       }
//var minimo = 0;
//var contador = 3;
       function zoom(alpha){
         //if (alpha > 0  || contador > minimo){
           indices=[];
           //var beta = 50;
         //tam_view_x -= alpha * 100;
         //tam_view_y -= alpha * 100 * proporcion;
         tam_x_false += alpha * 50 * tam_x_img/tam_y_img;
         tam_y_false += alpha * 50;

         tam_x_img = tam_x_false;
         tam_y_img = tam_y_false;

         //contador += alpha;
       //}
         maximo();
         eleccion();
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
        //console.log("easy");
        var c = document.getElementById("muestra");
        var ctx = c.getContext("2d");

        var reduc = new Image();
        reduc.src = "mariposa/reduc.jpeg";

        proporcion_easy_x = tam_x_false / tam_X;
        if (proporcion_easy_x > 1){
          profundidad = true;
          eleccion();
          return;}
        var proporcion_easy_y = tam_y_false / tam_Y;

        desplazamiento_x =  -cursor_x * proporcion_easy_x + (0.5 * canvas_destino_x);
        desplazamiento_y =  -cursor_y * proporcion_easy_y + (0.5 * canvas_destino_y) ;
        //console.log(desplazamiento_x, desplazamiento_y);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0,canvas_destino_x,canvas_destino_y);/*
        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(desplazamiento_x, desplazamiento_y, 4, 0, 3.1415*4);
        ctx.stroke();
        ctx.closePath();*/
        //dx = (((item % cols ) * tam_X  ) * relacion_x ) + desplazamiento_x;
        //dy = ((((item - (item % cols )) / cols ) * tam_Y ) * relacion_y) + desplazamiento_y;
        ctx.drawImage(reduc, desplazamiento_x, desplazamiento_y, tam_x_false*cols, tam_y_false*fil);
      }
