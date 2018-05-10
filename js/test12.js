
// Clase HashMap auxiliar 
function HashMap(hash) {
  var map = new Map;
  var _set = map.set;
  var _get = map.get;
  var _has = map.has;
  var _delete = map.delete;
  map.set = function (k,v) {
    return _set.call(map, hash(k), v);
  }
  map.get = function (k) {
    return _get.call(map, hash(k));
  }
  map.has = function (k) {
    return _has.call(map, hash(k));
  }
  map.delete = function (k) {
    return _delete.call(map, hash(k));
  }
  return map;
}

imagenes = ['res/img/cascada.jpg','res/img/lago.jpg','res/img/mar.png'];
nivel = 0;
prtganar=75;
velocidad = null;

/* inputStates llevará el estado de las teclas left, right, down, up y space */
inputStates = {left: false, right: false, down: false, up: false, space: false,shift: false,ctrl: false};
keyCodes ={16:'shift',37:'left',38:'up',39:'right',40:'down', 32:'space',17:'ctrl'};


Key = {

       disableAll : function(){
           /* Test 4 */
            /* TU CÓDIGO AQUÍ */

           /* deshabilitar todas las teclas / poner su valor a false */
					  inputStates.left= false;
		  inputStates.right= false;
		  inputStates.down= false;
		  inputStates.up= false;
		  //inputStates.space= false;
		  //inputStates.shift= false;

		},
    onKeydown: function(event){
            Key.disableAll();
        /* Test 4 */
            /* TU CÓDIGO AQUÍ */
           /* en función de la tecla pulsada (viene en event.keyCode) habilitar la variable de inputStates correspondiente */
	

		  
		   
           inputStates[keyCodes[event.keyCode]] = true;
		   if(inputStates.space){
				game.pause = !game.pause;
				if(game.pause){
					game.soundtrack.pause();
				}else{
					game.soundtrack.play();
				}
		   }
		   	if(velocidad !=null && Player.drawing){
		   
			return;
		   }
		   if(inputStates.shift){
			   velocidad = 'shift';
		   }
		   if(inputStates.ctrl){
			   velocidad = 'ctrl';
		   }
		   
	},

    onKeyup: function(event){
        /* Test 4 */
            /* TU CÓDIGO AQUÍ */
           /* en función de la tecla soltada (viene en event.keyCode) deshabilitar la variable de inputStates correspondiente */
		inputStates[keyCodes[event.keyCode]] = false;

    }
}



/* GAME */
game = {

	pause: false,
    ended: false,
    then: Date.now(),
    
    measureFPS: function () {
        let now = Date.now();
        this.frameCount++;
        this.delta = (now - this.then);
        if (this.delta > 1000){
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.then = now;

            Debug.log("FPS:" + game.fps, 1);
        }
    },
	soundtrack: null,

	loadAssets: function() {
		this.soundtrack = new Howl({
			src: ['http://localhost/dawe/practica2/res/soundtrack.m4a'],
			volume: 1,
			onload: () => {
				this.soundtrack.play();
		} });
	},

  start: function(){
	  
		var cosasAcargar = imagenes.concat(['res/img/spyrx.png']);
	  
		resources.load(cosasAcargar);
		Debug.log(nivel, 2);
		nivel +=1;
		// en lugar de crear una función init, podemos crear una función
		// anónima y usar el operador flecha => . Ambas opciones son válidas.

		resources.onReady( () => {
			this.then = Date.now(); // para medir los FPS
		//	this.Player = Player.init(); // este método ya lo tenemos
		//	this.keysSetup(); // inicializar gestores de teclado
			// opcionalmente, inicializar canvas de Debug
			
				document.addEventListener('keydown', Key.onKeydown);
		  document.addEventListener('keyup', Key.onKeyup);
			this.mainLoop(); // comenzar la animación
		});
	  
	  
       // inicialización de variables...
      // Gestión de Eventos de teclado
      // Debes indicar qué función debe responder al keydown y cuál al keyup
      /* TU CÓDIGO AQUí */
        /* Test 4 */
	//document.addEventListener('keydown', Key.onKeydown);
		//  document.addEventListener('keyup', Key.onKeyup);

       //this.mainLoop();
  },


    mainLoop : function(){
           Debug.log(nivel,2);
        
		if(!game.pause){
			if (!game.ended){	
				// draw player
				 //Grid.clear();
				 if(Grid.percent>=prtganar){
					Player.add_score(Math.round((Grid.percent-prtganar)*1000));
					game.ended = true;
				}
				 Player.update();	
				if(Player.drawing && velocidad =='ctrl'){
					Player.update();
				}
				Grid.paint(); /* test 5 */
				Grid.dirty.clear();

				Player.paint();


				/* test9
				 * tu código aquí
				 * Para cada sparx
				 *      sparx.update
				 *      sparx.paint
				 */
				game.measureFPS();
				for(var i=0;i<Grid.sparx.length;i++){
					Grid.sparx[i].update();
					Grid.sparx[i].paint();
				}
				// test 11
				//Qix.update();
				Qix.draw();


				Debug.draw();

				// test 12
		//		Grid.displayScore();


			}
			if(game.ended){
				game.soundtrack.stop();
				if(Grid.percent>=prtganar){
					var confirmar = confirm("Has ganado!! Clica aceptar para pasar al siguiente nivel.");
					if(confirmar){
						nivel +=1;
						Key.disableAll();
						inputStates.shift=false;
						inputStates.ctrl=false;
						Grid.sparx = [];
						  Grid.init();
						  Grid.reset();

						  // test 11
						  Qix._construct_();
						  Qix._init_();

						  
						  Player.init([96,118]);
						  /* test9
						   * tu código aquí
						   * Crea dos Sparx nuevos en el array sparx de Grid, ambos saliendo de la parte superior central del grid, 
						   * uno en dirección horaria y otro en dirección antihoraria */
							Grid.sparx.push(new Sparx([96,2],[-1,0]));
						   Grid.sparx.push(new Sparx([96,2],[1,0])); 
						   game.loadAssets();
						   game.ended=false;
						   
					}else{
						return;
					}
								
				}
			}
		}//game pause
			Grid.displayScore();
        requestAnimationFrame(game.mainLoop);
    }
};

/* DEBUG */

var Debug = {};

Debug.lines= [];

Debug.init = function(documentId) {
    /* test 2 
     * tu código aquí
     * */
	 this.canvas =  document.getElementById(documentId);
	 this.ctx = this.canvas.getContext("2d");
};

Debug.clear = function(){
    /* test 2 
     * tu código aquí
     * */  
	 this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Debug.draw = function(){
    /* test 2 
     * tu código aquí
     * */  
	 this.clear();
	for (var i = 0; i < this.lines.length; i++) {
		if(this.lines[i]){
			this.ctx.fillText(i+": "+this.lines[i],30,  i * 30);
		}
	}

};

Debug.log = function(text, line){
    /* test 2 
     * tu código aquí
     * */  
	 this.lines[line] = text;
};


/* código de test 2*/ 

/* GRID */
Grid = {

dentroGrid: function(x,y){
		return (x>=0&&y>=0&&x<this.w&&y<this.h);
	},
    dirty_region : function(x,y,border) {
    // test5
    // tu código aquí
    // toma como parámetro una posición x,y del grid y un número entero
    // border, que indica cuántas casillas hay que marcar como sucias
    // por arriba, abajo, izquierda y derecha de x,y 
    // Podemos pensar en border como márgenes de seguridad (no marcamos
    // sólo la casilla x,y como sucia sino también las adyacentes
    // OJO, no marques como sucia una casilla que se salga de los límites
    // del grid.
		for(var i=x-border;i<=x+border;i++){
			for(var j=y-border;j<=y+border;j++){
				if(this.dentroGrid(i,j)){
					this.dirty.set([i,j],this.get(i,j));
				}
			}
		}

    },

    offset : [50,50], /* más adelante el grid no empezará justo en la esquina superior izquierda */

    /* test 5 */
    colors : [ [0,0,0] /* 0 empty */ , [0,0,180] /* fill 1 */, [160,0,0] /* fill 2 */, [74,54,94] /* OUT */, 
               [255,192,203] /* 4 pink */, [255,255,255] /*5*/, [255,255,255] /*6*/,
            [192,192,192] /*7 WALL */,  [255,0,0] /*8*/,   [255,0,0] /*9*/,  [255,0,0] /*10*/, 
               [255,0,255] /*11*/ ],

    sparx: [],

    init: function(){
		
		//practica2
		sparx =[];
		
        this.canvas = document.getElementById('grid');
        this.canvas.width = 640;
        this.canvas.height = 480;
        this.ctx = this.canvas.getContext("2d");
        /* test 3 */
        this.w = 194; // ANCHURA
        this.h = 122; // ALTURA
        this.width = this.w;
        this.height = this.h;

        /* test 5 */
        /* tu código aquí */
        /* inicializa el array this._grid con todos sus valores a 0 */
        /* vamos a dejar un borde de dos filas en la altura, por lo que debes definir un array de w*(h+2) */

        /* test 10
         * tu código aquí
         * Crea un array crumbs exactamente igual que _grid */
        this.crumbs = new Array(this.w*(this.h+2));
		this.crumbs.fill(0);
        this._grid = new Array(this.w*(this.h+2));
		this._grid.fill(0);

        // test 12
        this.percent = 0;
        this.filled_area = 0;
        this.total_area = (this.w-6)*(this.h-6)/4;
		
		
		
		this.img = new Image();
		this.img.src = imagenes[nivel % imagenes.length];
        
    },
clear: function(){
        /* test 3 */
        /* tu código aquí */
        /* Borrar el grid */
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
	cell_drawable: function(v){
		return (v>=0&&v<=8);
	},

    set: function(x,y,v){
        /* tu código aquí */
        /* test 5 */
        /* poner el valor v en la posición x,y del array _grid  */ 
		this._grid[y*this.w+x] = v;
		
		//if (this.cell_drawable(v))
			this.dirty.set([x,y],this.get(x,y));
    },

    get : function(x,y){
        /* tu código aquí */
        /* test 5 */
		return this._grid[y*this.w+x];
    },
    reset: function(){
    /* test 5 */
    /* tu código aquí  */
    /* Define el valor Player.OUT = 3 en Player. Este 3 representa un borde del nivel (no se puede pintar dentro) */
    /* Define el valor Player.WALL = 7 en Player. Este 7 representa una pared del nivel (el jugador sólo se podrá  */
    /* mover al estar situado en casillas WALL */
    /* Necesitamos llamar al método set de Grid para pintar un campo así (la celda=3 es borde exterior. celda=7 es pared):
     *
     *
     *        333333333333333
     *        337777777777733
     *        337         733
     *        337         733
     *        337         733
     *        337         733
     *        337         733
     *        337         733
     *        337777777777733
     *        333333333333333
     *
     */
	  this.dirty = new HashMap(JSON.stringify);
		let [w,h] = [this.w, this.h];

		//loop para resetear todo a 0
		for(var i=0; i<this.w;i++){
			for(var j=0; j<this.h;j++){
				this.set(i,j,0);
			}
		}
		
		
		for (var i = 0; i < w; i++){
			this.set(i,0, Player.OUT);
			this.set(i,1, Player.OUT);
			this.set(i,h-1, Player.OUT);
			this.set(i,h-2, Player.OUT);
			this.set(i,h-3, Player.OUT);
		}
		
		var j = 1;
		while(j<h-3){
			this.set(0,j, Player.OUT);
			this.set(1,j, Player.OUT);
			this.set(w-1,j, Player.OUT);
			this.set(w-2,j, Player.OUT);
			this.set(w-3,j, Player.OUT);
			j++;
		}

		for (var i = 2; i < w-3; i++){
			this.set(i,2, Player.WALL);
			this.set(i,h-4, Player.WALL);
		}
		
		var j = 2;
		while(j<h-4){
			this.set(2,j, Player.WALL);
			this.set(w-4,j, Player.WALL);
			j++;
		}




    },

    /* test 5 *
     * tu código aquí */
    blit : function(x,y,v){
    },
	
	img:null,

    paint: function(){
        /* test 5 */
        /* tu código aquí */
        /* Pinta el contenido de la estructura dirty en pantalla */
        /* recuerda que un punto del _grid corresponde a 3x3 pixels reales en pantalla */
        /* observa también que Grid dispone de un atributo colors para cada tipo de celda ... */
    for (var [key, value] of this.dirty) {
			this.ctx.beginPath();	
			
			var x = parseInt(key.substring(1,key.indexOf(",")));
			var y = parseInt(key.substring(key.indexOf(",")+1,key.length-1));
			
			if(this.get(x,y)==2){
				this.ctx.drawImage(this.img,x*3,y*3,3,3,x*3+Grid.offset[0], y*3+Grid.offset[1],3,3);
			}else{
				let [r,g,b] =this.colors[this.get(x,y)];
				this.ctx.fillStyle = "rgb("+r+","+g+","+b+")";
				this.ctx.fillRect( x*3+Grid.offset[0], y*3+Grid.offset[1], 3, 3 );
			}
			this.ctx.stroke();
		}  
	},

    cell_wall : function(x,y){
        /* test 6 
         * tu código aquí 
         * Comprueba que en la posición x,y del grid hay una pared */
		 return (this.get(x,y)==Player.WALL);
    },
    cell_empty : function(x,y){
        /* test 6 
         * tu código aquí 
         * Comprueba que la posición x,y del grid está vacía. Define Player.EMPTY a 0 en Player  */
		 return (this.get(x,y)==Player.EMPTY);
    },
    trace : function(p0, p1, dir, v0, v1){
        // cambia el valor v0 a v1 en el grid, siguiendo el path de p0 a p1 (sin incluirlos),
        // comenzando a probar por la dirección dir. Debe devolver la última dirección dir que se tomó


            let [x,y] = p0;
            let [dx,dy] = dir;

            let turn={
                "0,0":[0,1],
                "1,0":[0,1],
                "0,1":[-1,0],
                "-1,0":[0,-1],
                "0,-1":[1,0],
            };

        /* tu código aquí
         * test 7
         * Algoritmo:
         * 
         * dx,dy = dir
         * iterar 
         *     muévete hacia dir (empezando en p0) hasta encontrar p1
         *          si has encontrado p1, return dx,dy
         *     Comprueba que el valor de la celda a la que llegas es v0. 
         *     Si lo es, cámbialo por v1
         *     Si no lo es, gira dx,dy en sentido horario y vuelve a iterar
         */
		while(x+dx!=p1[0] || y+dy!=p1[1]){
			if(this.get(x+dx,y+dy)==v0){
				[x,y]=[x+dx,y+dy];
				this.set(x,y,v1);
			}else{
				[dx,dy]=turn[dx+","+dy];
			}
		}
		return [dx,dy];

                },

    fill : function(p0, vlist, v, invert){
        // rellena una región, bordeada por vlist y conteniendo el punto p0, con el valor v
        let vf = this.vmap(vlist);
        let y_filling = this.seek(p0, [3,3], vlist);
        if (invert)
            y_filling = ! y_filling;
        let area = 0;

        for (let y = 3; y < this.h-3; y=y+2){  
            filling = y_filling;
            for (let x=3; x < this.w-3; x++){
                if (vf(x,y))
                    filling = ! filling;
                else{
                    if (filling){
                         // test9
                        // tu código aquí
                        this.set(x,y,v);

                        area += (x&1); // sumar sólo impares
                        if (! vf(x,y+1)){
                         // test9
                        // tu código aquí
                         this.set(x,y+1,v);
                        }
                    }
                }
            }
            if (vf(3, y+1))
                y_filling = ! y_filling;

        }
        this.filled_area += area;
        this.percent = 100*this.filled_area/this.total_area;
        return area;
   },

    /* test 8 */
    vmap : function(vset){
        a = []; 
        for(let i=0; i<16; i++) {
        a.push( vset.includes(i) );
        }
     let obj = this;
     function cell_f(x,y){
                if (y === undefined)
                    return a[x];
                else
                    if (y>=0)
                        return a[obj._grid[obj.w*y + x]];
                    else
                        return 0;

        };
       return cell_f;

    },

    // test 10
    cell_traceable : function(x,y) {
        let vf = this.vmap([4,7]);
        return vf(x,y);
    },

    // test 11
    // tu código aquí
    // fíjate en cómo se ha implementado cell_traceable e implementa algo muy similar para
    // devolver una función que determine si los valores x,y que se le pasan como parámetros
    // corresponden a una celda donde el jugador está pintando una raya
    cell_draw : function(x,y) {
		let vf = this.vmap([5]);
        return vf(x,y);
    },

    seek: function(p0,p1,vlist){
    /* tu código aquí 
     * test8
     * parámetros: p0, p1, vlist 
     * devuelve true si los puntos par/par están en la misma región con un borde definido por vlist (lista de tipos de celda) 
     *
     * Algoritmo: 
     *    inicializar contador de cruces --> c=0
     *
     *    obtener la posición x del punto más a la izquierda --> x
     *    para cada posición entre x y el punto más a la derecha 
     *      si hay cruce entre x y una celda de tipo vlist --> c++
     *
     *    obtener la posición y del punto más cercano a la parte superior --> y
     *    para cada posición entre y y el punto más cercano a la parte superior
     *      si hay cruce entre 'y' y una celda de tipo vlist --> c++
     *
     *    si el contador c es impar --> los puntos p0 y p1 NO están en la misma región --> devolver false
     *    si el contador es par --> los puntos p0 y p1 están en la misma región --> devolver true
     *
     *
     * Nota: no es obligatorio usarla, pero la función vmap que encontrarás en Grid te puede ayudar.
     * Fíjate que vmap toma como parámetro una lista como vlist y devuelve una función que nos dice si una celda x,y es de
     * alguno de los tipos de vlist...
     * */
	 let [x0,y0]=p0;
		let [x1,y1]=p1;
		let c=0;
		let xinic=Math.min(x0,x1);
		let xfin=Math.max(x0,x1);
		let y=y0;
		if(x1==xinic) y=y1;
		for(let x=xinic;x<=xfin;x++){
			//if(vlist.includes(this.get(x,y))) c++;
			if(this.vmap(vlist)(x,y)) c++;
		}
		
		let yinic=Math.min(y0,y1);
		let yfin=Math.max(y0,y1);
		for(let y=yinic;y<=yfin;y++){
			//if(vlist.includes(this.get(xfin,y))) c++;
			if(this.vmap(vlist)(xfin,y)) c++;
		}
		return c%2==0;

    },

    
    add_crumb : function(x,y){
        // método usado por los sparx para salir cuando son enterrados 
        // test 10 
        // tu código aquí
        // añade una unidad a la posición correspondiente del array crumbs
		this.crumbs[y*this.w+x] +=1; 
    },

    get_crumbs : function(x,y){
        // contar migas (usado por los sparx para salir cuando son enterrados 
        // test 10
        // tu código aquí
        // devuelve el valor de la posición x,y en el array crumbs
		return this.crumbs[y*this.w+x];
    },


    /*
     * test 11
     * tu código aquí
     * Dibujar una línea roja de p0 a p1
     *
     * */
    drawLine : function(p0, p1) {
		this.ctx.beginPath();	
		this.ctx.strokeStyle = "red";
		this.ctx.moveTo(p0[0],p0[1]);
		this.ctx.lineTo(p1[0],p1[1]);
		this.ctx.stroke();
   },

    displayScore: function(){
        // test 12
        // tu código aquí
        // Debes mostrar la puntuación del usuario en la parte superior
        // del Grid tal y como puedes ver en la figura del enunciado
        // para el test 12
		this.ctx.clearRect(0, 0, this.canvas.width, 50);
		
		this.ctx.font = '20pt Calibri';
      
		
		if(game.pause){
			this.ctx.fillStyle = 'yellow';
			this.ctx.fillText("PAUSE", 300, 20);
		}
		this.ctx.fillStyle = 'white';
		this.ctx.fillText("Nivel:"+nivel, 30, 20);
		this.ctx.fillText(Player.score, 200, 20);
		this.ctx.fillText(Math.floor(Grid.percent)+"% / "+ prtganar+ "%", 500, 20);
       },

};

/* test11 
 *
 * El código de la clase Qix viene dado
 * */
Qix = {

/*
    Es el enemigo principal, un conjunto de líneas que pululan dentro del grid
    Los extremos del Qix siempre se mueven siguiendo el movimiento del caballo de ajedrez
    a una velocidad constante (para obtener un efecto visualmente agradable)
    Los movimientos de caballo se dividen en dos fase (p.ej. abajo-izquierda, abajo) 
*/

    _cmp : function(x, y){
        if (x > y) return 1;
        else if (x < y) return -1;
        else return 0;
    },

    unit_vector: function(p0,p1){
    // returns a king-move vector one space (in one of 8 directions) from p0 to p1'
    let [x0,y0] = p0;
    let [x1,y1] = p1;
    let ux = this._cmp(x1-x0, 0);
    let uy = this._cmp(y1-y0, 0);

    if (Math.abs(x1-x0) > 2*Math.abs(y1-y0))
        return [ux,0];
    
    if (Math.abs(y1-y0) > 2*Math.abs(x1-x0))
        return [0, uy];

    return [ux,uy];
    },

    left_turn : {
        "[0,1]":[1,0],
        "[1,0]":[0,-1],
        "[0,-1]":[-1,0],
        "[-1,0]":[0,1]
    },

    right_turn : {
        "[0,1]":[-1,0],
        "[1,0]":[0,1],
        "[0,-1]":[1,0],
        "[-1,0]":[0,-1]
    },

    _construct_ : function(){
        this.unit_vectors = [ [1,-1], [1,0], [1,1], [0,1], [-1,1], [-1,0], [-1,-1], [0,-1]] ;  // # king moves
        this.uvec_index = new HashMap(JSON.stringify);
        for(let i=0; i < 8; i++)
        this.uvec_index.set( this.unit_vectors[i], i);

        this.directions = [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1], [-1,-2]] ; // # knight moves
        this.dir_index = new HashMap(JSON.stringify);
        for(let i=0; i< 8; i++)
        this.dir_index.set(this.directions[i],i); 

        // # directional knight move operators
        this.dir_reflect_x = new HashMap(JSON.stringify); 
        this.directions.forEach( x => this.dir_reflect_x.set( x, [-x[0],x[1]] )) ;

        this.dir_reflect_y = new HashMap(JSON.stringify);
        this.directions.forEach( x => this.dir_reflect_y.set( x, [x[0],-x[1]] )) ;
        
        this.dir_clockwise = new HashMap(JSON.stringify);
        this.directions.forEach( x => this.dir_clockwise.set ( x, this.directions[ (this.dir_index.get(x)+1)%8 ] ));

        this.dir_cclockwise = new HashMap(JSON.stringify);
        this.directions.forEach( x => this.dir_cclockwise.set ( x, this.directions[ (this.dir_index.get(x)+7)%8 ] ));


        this.dir_approach = new HashMap(JSON.stringify);
        for (let i=0; i < 8; i++){
        for (let j=0; j<4; j++){
            this.dir_approach.set( [ this.directions[i], this.unit_vectors[(i+j)%8]] , this.dir_clockwise.get(this.directions[i]) );
            this.dir_approach.set( [ this.directions[i], this.unit_vectors[(i+j+4)%8]] , this.dir_cclockwise.get(this.directions[i]) );

        }
        }

        this.dir_steps = new HashMap(JSON.stringify); // # knight move as three unit steps


        let dx, dy;
        let ux, uy;
        for (let i=0; i<8; i++){
        [dx,dy] = this.directions[i];
        ux = this._cmp(dx,0); 
        uy = this._cmp(dy,0);
        if (Math.abs(dx) > Math.abs(dy))
            this.dir_steps.set([dx,dy], [[ux,0],[0,uy],[ux,0]]);
        else
            this.dir_steps.set([dx,dy], [[0,uy],[ux,0],[0,uy]]);

        }
    }, // end construct

    _init_ : function(){
        // this.grid = grid
        this.p = [[55,55], [57,59]] ; //  #position
        this.d = [[1,2], [2,1]] ; // #direction (always knights move)
        this.history = [];
        this.dhistory = [];

        this.phase = 0; // # half of knights move (choices made in phase 0, minor axis offset in phase 1)
    },

    pscan : function(p0,p1){
        // 'search for line crossing from odd points p0 to p1; return first crossing point and direction'

        let g = Grid;        let [x,y] = p0;        let [x0,y0] = p0;
        let [x1,y1] = p1;
        let ux=this._cmp(x1,x0); 
        let uy=this._cmp(y1,y0);
        let adx = Math.abs(x1-x0)+1; let ady = Math.abs(y1-y0)+1;

        while  (x!=x1 || y!= y1) {
            if (Math.abs((x1-x)*ady) > Math.abs((y1-y)*adx)){
                if (!g.cell_empty((x+ux),y))
                    return [[x+ux,y], [ux,0]];
                else
                    x += 2*ux;
            }else{
                if (! g.cell_empty(x,(y+uy)))
                    return [[x,y+uy], [0, uy]];
                else
                    y += 2*uy;
            }
        }
        return null;
    },


    trace_race : function(p0,d0, p1,d1){
        // '''Trace from p0 and p1 clockwise (d0 and d1 respectively) and see who finds the other.
        // Return directions from p0 and p1 towards each other.'''
        let g = Grid;
        let [x0,y0]=p0; let [x1,y1]=p1;
        let [dx0,dy0]=d0; let [dx1,dy1]=d1;
        while (true){
            if (! g.cell_wall( x0+dx0, y0+dy0) ){
                if (g.cell_wall( x0+dy0 , y0+dx0))
                    [dx0,dy0] = [dy0,dx0];
                else if (g.cell_wall( x0-dy0, y0-dx0))
                    [dx0,dy0] = [-dy0,-dx0];
                else {
                    throw new Error('trace_race failed 1');
                }
            }
            x0+=dx0; y0+=dy0;
            if (x0 == p1[0] && y0 == p1[1])
                return [d0, [-d1[0], -d1[1]]];

            if (! g.cell_wall( x1+dx1, y1+dy1) ){
                if (g.cell_wall( x1+dy1, y1+dx1))
                    [dx1,dy1] = [dy1,dx1];
                else if (g.cell_wall( x1-dy1, y1-dx1))
                    [dx1,dy1] = [-dy1,-dx1];
                else{
                    throw new Error('trace_race failed 2');
                }
            }
            x1+=dx1; y1+=dy1;
            if (x1 == p0[0] && y1 == p0[1])
                return [ [-d0[0], -d0[1]], d1 ];
        }
    },

    strategy_random : function(i) {
    if ( Math.random() > 0.5 ){
            this.d[i] = this.dir_clockwise.get(this.d[i]);
        } else {
            this.d[i] = this.dir_cclockwise.get(this.d[i]);
        }
    },

    update: function(){
        let g = Grid;
        // Aquí habrá que devolver el control si el Player acaba de pasar de nivel
        //    return

        let pg = [];
        let dg = [];

        let xoff = Grid.offset[0], yoff = Grid.offset[1]; // g.offset;
        let x, y, steps, dx, dy, px, py;
  
        for (let i=0; i<2; i++){ 
            if (this.phase == 0){
                // # phase 0: choose direction, take first two steps and adjust minor axis
                this.strategy_random(i);
                // Habría que crear más estrategias de movimiento y que el juego elija una u otra en cada paso de este bucle)

                [x,y] = this.p[i];
                steps = this.dir_steps.get(this.d[i]);

                // # step 0
                [dx,dy] = steps[0];
                if (g.cell_wall(x+dx, y+dy)){
                    if (dx!=0){
                        this.d[i] = this.dir_reflect_x.get(this.d[i]);
                    } else {
                        this.d[i] = this.dir_reflect_y.get(this.d[i]);
                    }

                }else{
                    x+=2*dx; y+=2*dy;
                }
                // step 1
                [dx,dy] = steps[1];
                if (g.cell_wall(x+dx, y+dy)){
                    if (dx!=0){
                        this.d[i] = this.dir_reflect_x.get(this.d[i]);
                    }else{
                        this.d[i] = this.dir_reflect_y.get(this.d[i]);
                    }
                }else{
                    x+=2*dx; y+=2*dy;
                }

                pg.push([xoff+(x-dx)*3, yoff+(y-dy)*3]);
                this.p[i] = [x,y];
                dg.push([x,y]);
            }else{
                // # phase 1: take last step
                [x,y] = this.p[i];
                steps = this.dir_steps.get(this.d[i]);

                // # step 2
                [dx,dy] = steps[2];
                if (g.cell_wall(x+dx, y+dy)){
                    if (dx!=0){
                        this.d[i] = this.dir_reflect_x.get(this.d[i]);
                    }else{
                        this.d[i] = this.dir_reflect_y.get(this.d[i]);
                    }
                }else{
                    x+=2*dx; y+=2*dy;
                }

                pg.push([xoff+x*3, yoff+y*3]);
                dg.push([x,y]);
                this.p[i] = [x,y];
            }
        }
        
        let hit0 = this.pscan(this.p[0], this.p[1]);
        let hit1 = this.pscan(this.p[1], this.p[0]);

        /* 
         * test11
         * tu código aquí
         *
         *  hit0 es una colisión desde una esquina del Qix 
         *  hit1 es una colisión desde la otra esquina del Qix
         *  hay que comprobar que hit0 o hit1 son colisiones contra el jugador o contra regiones ocupadas del grid
         * 
         * Algoritmo:
         *  si se detecta hit0 
         *     let [p0,u0] = hit0;
         *     si es porque en hit0 se estaba pintando una línea
         *          game over
         *     si no
         *        si se detecta hit1
         *            let [p1,u1] = hit1;
         *            si es porque en hit1 se estaba pintando una línea
         *               game over
         *            si no
         *              (el qix debe "rebotar")
         *              llamar a trace_race con p0, right_turn[u0], p1, right_turn[u1] como parámetros  (correctamente formateados) --> [d0,d1]
         *              y actualizar this.d[0] y this.d[1] con el resultado de obtener del hashmap dir_approach 
         *                 el valor de [this.d[0],d0] y el valor de [this.d[1], d1]
         *              
         *      */

		if(hit0){
			let [p0,u0] = hit0;
			if(g.cell_draw(p0[0],p0[1])){
				game.ended = true;
				//GAME OVER
			}else{
				if(hit1){
					let [p1,u1] = hit1;
					if(g.cell_draw(p1[0],p1[1])){
						game.ended = true;
						//GAME OVER
					}else{//rebotar
						let [d0,d1]=this.trace_race(p0,this.right_turn[JSON.stringify(u0)], p1, this.right_turn[JSON.stringify(u1)] );
						this.d[0]=this.dir_approach.get([this.d[0],d0]);
						this.d[1]=this.dir_approach.get([this.d[1], d1]);
						
					}
				}
			}
		}
        this.dhistory.push(dg);
        this.dhistory = this.dhistory.slice(-8);

        this.history.push(pg);
        this.history = this.history.slice(-8);
        this.phase ^= 1;

    }, // end update

    /* test 11
     * tu código aquí
     * aparte de recorrer el array history y dibujar una línea para cada par de puntos 
     * (viene dado) debes aprovechar el bucle para calcular los vértices [xmin,ymin], [xmax, ymax]
     * del rectángulo que encuadra al Qix. Las posiciones de los 8 vértices del Qix están en dhistory
     * Una vez obtengas esos dos vértices (esquina superior izquierda, esquina inferior derecha)
     * debes marcar como sucias todas las casillas de ese rectángulo
     * */
	draw : function(){
		let [xmin,ymin] =[10000,10000];
		let [xmax,ymax] = [0,0];
        for (let h = this.history, i = 0, dh=this.dhistory; i < h.length; i++){
            Grid.drawLine(h[i][0],h[i][1]);
			xmin=Math.min(xmin,dh[i][0][0],dh[i][1][0]);
			ymin=Math.min(ymin,dh[i][0][1],dh[i][1][1]);
			xmax=Math.max(xmax,dh[i][0][0],dh[i][1][0]);
			ymax=Math.max(ymax,dh[i][0][1],dh[i][1][1]);
        }

		
		for(let x = xmin-5; x<=xmax+5;x++){
			for(let y = ymin-5; y<=ymax+5;y++){
				if(Grid.dentroGrid(x,y))
					Grid.dirty.set([x,y],1);
			}
		}
    },

};  // end qix class




/***************************************/
/* SPARX 
 *
 * ====================================*/

class Sparx {

    /*
     * test9 
     * el constructor toma como parámetros la posición inicla del Sparx y la dirección en
     * la que debe empezar a moverse.
     */
    constructor(position, dir){
        this.dir = dir;
        this.position = position;
        if (dir[0] == 1) // clockwise
            this.turn = [Qix.left_turn, Qix.right_turn];
        else // # counter-clockwise;
            this.turn = [Qix.right_turn, Qix.left_turn];

        let [x0,y0] = [0,0];
        let [x,y] = position;
		this.sprite = new Sprite('res/img/spyrx.png', [0,0], [16,16], 100,
[0,1,2,3,4,5,6,7]);
    };

     update(){
        let [x0,y0] = [0,0];
        let [x,y] = this.position;
        let [dx,dy] = this.dir; // desplazamiento al que quiere ir el sparx
        let g = Grid;
        let c = 0;

     /*
     * test9 
     * tu código aquí 
     * Debes programar el algoritmo que determina cómo debe moverse un sparx:
     *
     *   si la posición en la que está el sparx es una pared 
     *        si la posición a la que quiere ir no es una pared (por ejemplo, está en una esquina )
     *          si la posición girada es una pared (siguiendo con el ejemplo, en la esquina supongamos que puede girar hacia abajo y seguir opr pared)
     *          (ojo, comprueba todos los giros posibles)
     *              actualizar [dx,dy] con el giro posible
     *          si no
     *              invertir dirección (volvemos por donde venimos)
     *          actualizar x,y con la nueva posición
     *   si no (la posición en la que está NO es una pared, seguramente porque hemos encerrado al sparx con un polígono)
     *      si la posición a la que quiere ir es ua pared (justo puede salir si sigue la dirección que llevaba)
     *            actualizar x,y con la nueva posición
     *            [dx,dy] = girar según el valor del atributo turn[0][ [dx,dy] ]  (fíjate en el constructor)
     *      si no (lo hemos hundido y no puede salir fácilmente)
     *         // esta parte la haremos en el test10
     *         // por ahora, el sparx se parará si lo hundimos
     *     
     *
     *  Finalmente
     *
     *  Si la posición del sparx coincide con la del player
     *          GAME OVER
     *
     *  Actualizar el valor de position con el nuevo valor [x,y]
     *  Grid.dirty_region(x,y,4);
     *  Actualizar el valor de dir con el nuevo valor [dx,dy]
     */

                   /* test 10 
                    *
                    * tu código aquí
                    *
                    * ALGORITMO:
                    *
                    * cuando el sparx esté enterrado, debe encontrar un camino para salir
                    * para ello, marcará la posición actual con una miga de pan (llamar al método add_crumb de grid)
                    * inicializar un arrray options con tres opciones de giro: turn[0][dx,dy],  [dx,dy], turn[1][dx,dy]
                    * por cada posible giro, ver si caeríamos en una casilla válida (el método cell_traceable de grid te ayudará)
                    * si así fuera, obtener el número de migas de esa casilla 
                    * obtener el giro que nos devuelve el menor número de migas (casilla menos visitada)
                    * dx,dy = el giro encontrado en el punto anterior
                    * actualizar x,y con dx,dy
                    * */

if(g.get(x,y)==Player.WALL){
			if(g.get(x+dx,y+dy)!=Player.WALL){
				if(dx==0){
					if(g.get(x+1,y)==Player.WALL){
							[dx,dy]=[1,0];
						}else{
							
							if(g.get(x-1,y)==Player.WALL){
								[dx,dy]=[-1,0];
							}else{
								[dx,dy]=[-dx,-dy];
							}
						}
				}else{
					if(g.get(x,y+1)==Player.WALL){
						[dx,dy]=[0,1];
					}else{
						if(g.get(x,y-1)==Player.WALL){
							[dx,dy]=[0,-1];
						}else{
							[dx,dy]=[-dx,-dy];
						}
					}
				}
				
			}
			[x,y] = [x+dx,y+dy];
		}else{
			if(g.get(x+dx,y+dy)==Player.WALL){
				[x,y] = [x+dx,y+dy];
				[dx,dy]=this.turn[0][JSON.stringify([dx,dy])];
			}else{//hundido 
				g.add_crumb(x,y);
				let opcionGiro = [this.turn[0][JSON.stringify([dx,dy])],  [dx,dy], this.turn[1][JSON.stringify([dx,dy])]];
				let min = Number.MAX_SAFE_INTEGER;
				let migas = new Array(opcionGiro.length);
				for(let i = 0;i<opcionGiro.length;i++){
					let [dirX,dirY] = opcionGiro[i];
					if(g.cell_traceable(x+dirX,y+dirY)){
						if(min>g.get_crumbs(x+dirX,y+dirY)){
							min =g.get_crumbs(x+dirX,y+dirY);
							[dx,dy]=[dirX,dirY];
						}
					}
				}
				[x,y] = [x+dx,y+dy];
				
			}
		}
		
		if ( (x==Player.position[0] && y==Player.position[1]) || (this.position[0]==Player.position[0] && 
             this.position[1]==Player.position[1])){
                // GAME OVER
                game.ended = true;
        }
	 this.position = [x,y];
	 Grid.dirty_region(x,y,4);
	 this.dir = [dx,dy];

	 this.sprite.update(game.delta);
	 Debug.log(game.delta,4);


    };


    /* test 9 
     * tu código aquí
     * El método paint se limita a pintar un rectángulo verde de 16x16 en la posición del sparx
     * Como siempre, recuerda que una celda x,y en el Grid debe pintarse en x*3, y*3. Para que el sparx
     * quede centrado, seguramente en x*3-6, y*3-6 */
    paint(){
        /*
         * test 12
         * si no lo has tenido en cuenta antes, recuerda que el Grid tiene un offset
         * (un desplazamiento en pantalla) para que no comience a pintarse en la esquina superior
         * izquierda de la pantalla, si no que tenga un margen (por ejemplo, para que en ese margen
         * se pinte el marcador :)
         * */
		

 /*		let [x,y] = this.position;
		Grid.ctx.beginPath();	
		Grid.ctx.fillStyle = "Lime";
		Grid.ctx.fillRect( x*3-6+Grid.offset[0], y*3-6+Grid.offset[1], 16, 16 );
		Grid.ctx.fillStyle = "Lime";
		Grid.ctx.fill();
		Grid.ctx.stroke();
*/		
		let [x,y] = this.position;
		Grid.ctx.save();
		Grid.ctx.translate(x*3-6+Grid.offset[0], y*3-6+Grid.offset[1]);
		Debug.log(x*3-6+Grid.offset[0],6);
		Debug.log(y*3-6+Grid.offset[1],7);
		this.sprite.render(Grid.ctx);
		Grid.ctx.restore();

		
    };

    
};



/***************************************/
/* PLAYER */

Player = {

    /* test 6 
     */
    EMPTY: 0,
    TRAIL: 5, /* test7 */
    /* test 5 */
    WALL : 7,
    OUT : 3,

    /* test 7 */
    TRAILTRACE: 10,
    WALLTRACE: 11,
    /* test 12 */
    /* atributos y/o métodos para gestionar la puntuación */
    FillScore: [0,5,10],
    add_score: function(n){
        this.score += n;
    },

    
    init: function(pos){
          this.position =  pos;
          this.ctx = Grid.ctx;

        /* test 6 */
          this.drawing = 0;

        /* test 7 */
        this.launch_point = null;

        /* test 12 */
        this.score = 0;
    },
   
  update: function(){
         let [x,y] = this.position; // , dx = Player.dx, dy = Player.dy;
 
        // Test 6

         if ( ((x+y)&1) == 0){ // la suma de x e y es par (punto par) (se puede hacer un giro)
           [dx, dy, draw] = this.calc_dir();

            if (this.drawing){ // estoy pintando 

                if (Grid.cell_empty(x+dx*2, y+dy*2) || Grid.cell_wall(x+dx*2, y+dy*2) &&
					( (x+dx*2) != this.launch_point[0] || (y+dy*2) != this.launch_point[1] )){ /* test7 */
                    this.dir = [dx,dy];
                    x+=dx; y+=dy;
                    Grid.set(x,y, Player.TRAIL);  /* test7 */

                    Player.position = [x,y]; 
                }else{
                    this.dir = [0,0];
                } 


            } else { // pos par y no estoy pintando 
                if (Grid.cell_wall(x+dx, y+dy)){ // la casilla a la que me quiero mover es una pared 
                        this.dir = [dx,dy];
                        x+=dx; y+=dy;
                        this.position = [x,y];
                } else if ( draw && Grid.cell_empty(x+dx, y+dy) &&  /* quiero empezar a pintar, shift pulsado  */
                        Grid.cell_empty(x+dx*2, y+dy*2) || (draw && Grid.cell_wall(x+dx*2, y+dy*2) && Grid.cell_empty(x+dx, y+dy))){
                        
                       // test 7
                        this.launch_point = [x,y];
                        this.dir = [dx,dy];
                        x+=dx; y+=dy;
                        this.position = [x,y];
                        this.drawing = draw;
                        Grid.set(x,y,Player.TRAIL);

                } else { // # dirección bloqueada. parar
                    this.dir = [0,0];
                }
            }
         }else { // posición impar (no se puede girar). Forzar a moverse a la siguiente casilla en la dirección que tengamos establecida
               [dx, dy] = this.dir;
                 
                 if (this.drawing){
                       if (Grid.cell_wall(x+dx, y+dy)){ // pintando me cruzo con una pared

                             x+=dx; y+=dy;
                            // landing
                            //  corner points pa,pb
                            pa = [x-dx-dy, y-dy-dx];
                            pb = [x-dx+dy, y-dy+dx];

                            if (Grid.cell_wall(x-dy, y-dx))
                                da = [-dy,-dx];
                            else
                                da = [dx,dy];

                            if (Grid.cell_wall(x+dy, y+dx))
                                db = [+dy,+dx];
                            else
                                db = [dx,dy];

                            // test 7
                           //  implementa el método Grid.trace tal y como se indica
                           //  en el enunciado
                            Grid.trace([x,y], this.launch_point, [-dx,-dy], Player.TRAIL, Player.TRAILTRACE);
                            Grid.trace([x,y], this.launch_point, da, Player.WALL, Player.WALLTRACE);
   
                           // test 9
                            let test_point = Qix.p[0]; // test 12 . Ojo! ahora ya tenemos Qix!
                            if (Grid.seek(pa, test_point, [10,7])){
                                n = Grid.fill(pb, [10,7], /* this.drawing */ 2);
                                // gestionar puntuación 
                                /* test 12
                                 * Tu código aquí
                                 * La variable n lleva el número de pixels que se han rellenado
                                 * Usa esa variable para actualizar el atributo score en
                                 * Player y muéstrala en pantalla  (add_score ya está implementado...)
                                 * */
								Player.add_score(5*n);
								velocidad=null;
                                Grid.current_filling = n;
                                Grid.trace([x,y], this.launch_point, da, 11, Player.WALL); // # rewall
                                Grid.trace([x,y], this.launch_point, db, Player.WALL, 4); // # bury
                                Grid.trace([x,y], this.launch_point, [-dx,-dy], 10, Player.WALL); // # solidify
                            } else {
                                let [xa,ya] = this.launch_point;
                                Grid.set(xa,ya, 11);
                                Grid.set(x,y, 11);
                                n = Grid.fill(pa, [10,11], /*this.drawing*/ 2);
                                Grid.current_filling = n;
                                // test 12 
                                     // tu código aquí. tal vez también necesites actualizar aquí la puntuación...
								Player.add_score(5*n);
								velocidad=null;
                                Grid.set(xa,ya, 7);
                                Grid.set(x,y, 7);
                                Grid.trace([x,y], this.launch_point, da, 11, 4); // # bury;
                                Grid.trace([x,y], this.launch_point, [-dx,-dy], 10, 7); //  # solidify;
                            }

                            this.drawing = 0;
                            this.launch_point = null;

                         } else { // trazar estela 
                               x+=dx; y+=dy;
                               Grid.set(x,y,Player.TRAIL);
                        }
                 }else{ // not drawing, moviéndonos por pared
                      x += dx; y += dy;
                 }
         }

         this.position = [x,y];
         Grid.dirty_region(x,y,3);
 
    },


    paint : function() {
        /* pintar un círculo rojo de radio 5 en la posición indicada por Player (96,118 inicialmente) */
        /* recuerda que un punto en las coordenadas del juego se desplaza a la posición x*3, y*3 en píxels */
        /* más adelante habrá que tener en cuenta el offset del grid */

        /* test 2 */
	     // Tu código aquí
		 this.ctx.beginPath();	
		this.ctx.arc(this.position[0]*3+Grid.offset[0],this.position[1]*3+Grid.offset[1],5,0,2*Math.PI, false);
		this.ctx.fillStyle = "red";
		this.ctx.fill();
		this.ctx.stroke();
		         
    },

  calc_dir : function() { 
    let dx=0, dy=0, draw = 0; /* draw indica si está pulsada shift */

      /* test 4 */
    /* Tu código aquí */
    /* en función del estado de inputStates, actualizar dx, dy */
    /* Ejemplo:

        if (inputStates.left){
            dx = -1;
            dy = 0;
        }

        Debe devolver un array con dx, dy, draw 
        */
		if (inputStates['shift'] || inputStates['ctrl']){
            draw = 1;
        }
		if (inputStates['left']){
            dx = -1;
            dy = 0;
        }else{
			if (inputStates['right']){
				dx = 1;
				dy = 0;
			}else{
				if (inputStates['up']){
					dx = 0;
					dy = -1;
				}else{
					if (inputStates['down']){
						dx = 0;
						dy = 1;
					}else{
						
					}
				}
			}
		}
        return [dx, dy, draw ];
    },


}

  Grid.init();
  Grid.reset();

  // test 11
  Qix._construct_();
  Qix._init_();

  Debug.init('debug');
  Player.init([96,118]);
  /* test9
   * tu código aquí
   * Crea dos Sparx nuevos en el array sparx de Grid, ambos saliendo de la parte superior central del grid, 
   * uno en dirección horaria y otro en dirección antihoraria */
 // Grid.sparx.push(new Sparx([96,2],[-1,0]));
  // Grid.sparx.push(new Sparx([96,2],[1,0])); 
   game.loadAssets();
  game.start();




