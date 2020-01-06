/* VARIABLES */

//Array de niveles con sus objetos correspondientes.
var stageMaster = [];

//numero de items por nivel
const itemsPerLevel = 6;

//numero de power por tipo en cada nivel
const powerPerLevel = 6;

//valor actual del numero de powers en reserva
var initPowerValue = 1;
var currentPowerFuel = 1;
var currerntPowerTime = 1;

//Tamaño de tablero (siempre cuadrado)
var boardSize = 10;

//Nivel Actual, inicio en 0
var currentPlayerLevel = -1;

//Referencia a la barra de energia en el codigo HTML
var energyBar = document.getElementById("nrgBarID");
//Valor Inicial de energia **no cambiar
var initNrg = 100;
//Valor actual de energia
var currentNrg;
//Valor de restauracion de energia
var nrgValueIncrement = 15;
//valor de consumo de energia
var nrgValueDecrement = 5;

//Timepo de Juego
var initTime = 90;
//Referencia al valor actual de contador
var currentTime;
//Valor de restauracion de tiempo
var timeValueIncrement = 20;

//casillas descubiertas en el nivel
var playerCurrentTilesDiscovered = 0;
//numero de tiles con objeto para este nivel
var currentLevelItemNumber = 0;

//link al modulo de sonido
var musicGame = document.getElementById("music");
var fxGame = document.getElementById("fx");
var clickFx = "../sounds/click.mp3";
var drillFx = "../sounds/drill.mp3";

/* FIN DE VARIABLES */


/* >>FUNCION PRINCIPAL DEL SCRIPT */
document.body.onload = (() => StartGame())

/* SONIDOS DE JUEGO */
function playMusic() {
    musicGame.src = "../sounds/gorillaz.mp3";
    musicGame.autoplay = true;
    musicGame.volume = 0.1;
}

function playFx(currentfx) {
    fxGame.src = currentfx;
    fxGame.autoplay = true;
    fxGame.volume = 0.1;
}


//Inicializamos las funciones principales
function StartGame() {
    SetMapSize();
    SetMatch();
    MakePowerMenu();
    ResetBoard();
    // playMusic();
}

/* <<FUNCION PRINCIPAL DEL SCRIPT */
//funcion para mostrar overlay
function showOverlay() {
    document.getElementById("overlay").style.display = "grid";
}
/* >> FUNCIONES BASICAS PARA CREACION DEL TABLERO */
function ResetBoard() {
    //subimos el contador de nivel y resteamos el numero de objetos descubiertos
    ++currentPlayerLevel;
    playerCurrentTilesDiscovered = 0;
    currentLevelItemNumber = 0;
    //actualizamos el numero de items en tablero
    ItemTilesInLevel();

    //eliminamos los elementos del tablero
    document.getElementById("myBoard").innerHTML = "";
    //creamos las tiles del nivel actual
    MakeTiles();
    //eliminamos los elementos del menu objetos
    document.getElementById("menuObjetos").innerHTML = "";
    //creamos los objetos de menu del nivel actual
    MakeobjectsMenu();
    //reseteamos la energia
    resetcurrentNrg();
    //reseteamos el tiempo
    StartTimer();
}

//funcion para saber el numero de tiles con objeto en el nivel actual
function ItemTilesInLevel() {
    stageMaster[currentPlayerLevel].forEach((item) => {
        if (item.type === "Item") {
            item.piece.forEach(piece => {++currentLevelItemNumber })
        }
    })
    console.log("TCL: ItemTilesInLevel -> currentLevelItemNumber", currentLevelItemNumber)

}
//funcion para comprobar si el nivel se ha completado
function CheckLevelCompleted() {
    ++playerCurrentTilesDiscovered;
    console.log("TCL: CheckLevelCompleted -> playerCurrentTilesDiscovered", playerCurrentTilesDiscovered)

    if (playerCurrentTilesDiscovered === currentLevelItemNumber) {
        console.log("levelCompleted");
        ResetBoard();
    }

}
//Cambiamos en css las propiedades de la grid principal del tablero.
function SetMapSize() {
    document.documentElement.style.setProperty('--boardX', boardSize);
    document.documentElement.style.setProperty('--boardY', boardSize);
}

//Funcion para crear las casillas del tablero
function MakeTiles(myBoard = document.getElementById("myBoard")) {

    //Loop eje X
    for (let x = 0; x < boardSize; x++) {

        //Loop eje Y
        for (let y = 0; y < boardSize; y++) {

            //crear elemento web
            let item = document.createElement('div');

            //añadir data info sobre posicion de la tile
            item.setAttribute('data-row', x);
            item.setAttribute('data-column', y);

            // //añadir clase al elemento
            item.classList.add("tile", "undigged");

            //añadimos eventos del raton
            item.addEventListener("click", this.tileClick);


            //añadir el item al div principal
            myBoard.appendChild(item);
        }
    }
}

//Funcion para crear el menu de los poderes
function MakePowerMenu() {
    powerArray.forEach((power) => {

        //creamos elemento div para personalizar
        let newPower = document.createElement('img');

        //añadimos clase al elemento img
        newPower.classList.add("itemImg");

        //añadimos los parametros de ruta la imagen
        newPower.src = power.imgSrc;

        //creamos elemento para el contador del power
        let newPowerCounter = document.createElement('div');

        //añadimos id
        newPowerCounter.id = power.subelementID;

        //añadimos clase 
        newPowerCounter.classList.add("powerCounter");

        //añadimos el contador inicial
        newPowerCounter.textContent = initPowerValue;

        //añadimos eventos del raton
        document.getElementById(power.elementID).addEventListener("click", this.PlayerItemPlay);

        //añadimos el elemento completo
        document.getElementById(power.elementID).appendChild(newPower);
        document.getElementById(power.elementID).appendChild(newPowerCounter);
    })
}

//Funcion para mostrar los objetos del nivel actual en el menu izquierdo 
function MakeobjectsMenu() {
    stageMaster[currentPlayerLevel].forEach((item) => {
        if (item.type == "Item") {
            //creamos elemento para el contador del power
            let newDivElement = document.createElement('div');
            //añadimos id
            newDivElement.id = item.name;
            //añadimos clase 
            newDivElement.classList.add("mnObjetos-item");

            //creamos elemento de imagen
            let newImgElement = document.createElement('img');
            //añadimos clase al elemento img
            newImgElement.classList.add("mnObjetos-img");
            //añadimos los parametros de ruta la imagen
            newImgElement.src = item.imgSrc;
            newDivElement.appendChild(newImgElement);

            //añadimos el elemento completo
            document.getElementById("menuObjetos").appendChild(newDivElement);
        }
    })
}

/* << FUNCIONES BASICAS PARA CREACION DEL TABLERO */

/** >> FUNCIONES PARA LA CREACION PROCEDURAL DE LOS NIVELES E ITEMS */

//Funcion para generar los datos de la partida
function SetMatch() {

    //randomizamos el catalogo
    let randomMaster = RandomizeArray(masterItem);
    //sacamos objetos y los establecemos en diferentes mapas
    while (randomMaster.length > 0) {
        stageMaster.push(CreateLevel(randomMaster, itemsPerLevel));
    }
}

// Random Fisher-Yates
// https://www.youtube.com/watch?v=tLxBwSL3lPQ
function RandomizeArray(originalItemArray) {
    var currentIndex = originalItemArray.length,
        currentRandom, tempObject;
    while (--currentIndex > 0) {
        currentRandom = Math.floor(Math.random() * (currentIndex + 1));
        tempObject = originalItemArray[currentRandom];
        originalItemArray[currentRandom] = originalItemArray[currentIndex];
        originalItemArray[currentIndex] = tempObject;
    }
    return originalItemArray;
}

//Saca objetos del array random y los coloca en un stage
function CreateLevel(randomMaster, numOfItems) {
    //esta comprobacion hace que el ultimo nivel tenga los objetos restantes
    if (numOfItems > randomMaster.length) { numOfItems = randomMaster.length }
    let currentLevel = [];
    //Por cada objeto comprobamos si se puede colocar, asignamos posicion y rotacion, y finalmente lo añadimos al array de este nivel
    do {
        //añadimos el item aprobado al array de objetos de nivel
        currentLevel.push(FindPlace(randomMaster.pop(), currentLevel))
    } while (--numOfItems > 0)

    //Añadir power a las tiles
    let powerIndex = powerPerLevel;
    let randomPower = [];
    for (i = 0; i < powerIndex; ++i) {
        randomPower[i] = Object.assign({}, powerArray[Math.floor(Math.random() * powerArray.length)]);
    }
    do {
        currentLevel.push(FindPlace(randomPower.pop(), currentLevel))
    }
    while (--powerIndex > 0)

    return currentLevel;
}

//genera posiciones para el objeto y comprueba si el espacio del tablero esta libre para asignarlo
function FindPlace(originalItem, originalLevel) {
    //actualizamos la lista de objetos en el nivel
    let updatePositionList = originalLevel.map(item => item.piece.map(pieceList => pieceList.pos)).flat();
    //reservamos el item original creando una copia del mismo
    let newItem = Object.assign({}, originalItem);
    //Aplicamos ofset de rotacion y posicion al objeto proporcionado
    newItem = AssignRandomPositionToItem(newItem);
    //solo con las posiciones finales
    let finalPosItem = newItem.piece.filter(thispiece => {
        if (typeof thispiece.ID !== "undefined") {
            return thispiece
        }
    });
    //recombinamos el item
    newItem.piece = finalPosItem;
    //Hacemos un array con las posiciones que va a ocupar nuestro item
    let itemPosList = newItem.piece.map(piece => piece.pos);
    //Comprobamos que ningun valor este cogido ya en el tablero
    let isPositionTaken = updatePositionList.some(takenPos => itemPosList.some(itemPos => JSON.stringify(takenPos) === JSON.stringify(itemPos)));
    //con el resultado final mandamos de vuelta las coordenadas y 
    if (isPositionTaken) {
        let hitItem = FindPlace(originalItem, originalLevel);
        return hitItem;
    } else {
        return newItem
    }
}

//genera posicion y rotacion radom basado en arrays de localizaciones basados en rotacion
function AssignRandomPositionToItem(item) {
    //un random para rotacion de 0 a 3
    let rotRandom = Math.floor((Math.random() * 3));
    //Un random para posicion dentro de los limites del tablero
    let posRandom = {
        x: Math.floor((Math.random() * (boardSize - 2)) + 1),
        y: Math.floor((Math.random() * (boardSize - 2)) + 1)
    };
    //creamos array temporal con la posicion y rotacion random aplicada
    let newLocationArray = [];
    let finalLocationArray = [];
    ///creamos un array con todas las posiciones
    defaultLocation[rotRandom].forEach(element => {
        newLocationArray.push({
            pos: { x: (element.pos.x + posRandom.x), y: (element.pos.y + posRandom.y) },
            rot: rotRandom
        });
    });
    //añadimos pos y rot a las piezas del objeto
    item.piece.forEach((thisPiece, i) => {
        let newPiece = {...thisPiece, ...newLocationArray[i] };
        finalLocationArray.push(newPiece);
    });
    //sustituimos las propiedas de pieza por el array que solo contiene ids
    item.piece = finalLocationArray;
    return item
}

/** << FUNCIONES PARA LA CREACION PROCEDURAL DE LOS NIVELES E ITEMS  */

/* >> FUNCIONES RELACIONADAS CON EL TIEMPO DE JUEGO*/

// Iniciar temporizador
function StartTimer(myInterval, timer = document.querySelector(".currentTime")) {
    //reseteamos el contador
    clearInterval(myInterval);
    //resetear valor total de tiempo de juego
    currentTime = initTime;
    //generamos un intervalo
    myInterval = setInterval(() => {
        //Mostrar el valor en pantalla
        timer.innerHTML = (Math.trunc(currentTime / 60)) + " mins " + (currentTime % 60) + " secs";
        //restamos un segundo
        currentTime--;
        //comprobamos si se ha agotado el tiempo
        if (currentTime <= 0) { console.log("Te has quedado sin tiempo"); }
        //Intervalo sobre el cual se va a relanzar la funcion en milisegundos
    }, 1000);
}

/* << FUNCIONES RELACIONADAS CON EL TIEMPO DE JUEGO*/

/* TILE LOGIC */

//Funciones de click on tile
function tileClick() {
    let itHasItem = false;
    let item;
    //le quitamos el eventlistener para no poder hacerle click
    this.removeEventListener("click", tileClick);

    //cambiamos clase para mostar la tile
    this.classList.replace("undigged", "digged")

    //comprobamos si la tile tiene algun item que mostrar
    stageMaster[currentPlayerLevel].forEach((thisItem) => {
        thisItem.piece.forEach(piece => {
            if (piece.pos.x == this.dataset.row && piece.pos.y == this.dataset.column) {

                //creamos el elemento de la imagen       
                var newImg = document.createElement('img');

                //añadimos clase al elemento img
                newImg.classList.add("itemImg");

                //añadimos clase si la imagen tiene que estar girada
                newImg.classList.add("rot-" + piece.rot);

                //añadimos los parametros de ruta la imagen
                newImg.src = piece.img;

                //finalmente añadimos el div a la tile
                this.appendChild(newImg);

                itHasItem = true;
                item = thisItem;
            }
        });
    })

    //reproduce efecto de sonido de la tile dependien do si tiene objeto o ono
    if (itHasItem) {
        itemSolver(item);
        playFx(drillFx)
    } else {
        nrgSubstract();
        console.log("nothing, good luck next time");
        playFx(clickFx);
    }
}

//funcion para resolver items por tipo
function itemSolver(item) {

    //primero comprobamos que tipo de item es
    switch (item.type) {
        case "Power": //si es un power nos fijamos en su id
            switch (item.elementID) {
                case "PowerFuel":
                    //añadimos uno al contador    
                    ++currentPowerFuel;
                    //actualizamos el contador en la web    
                    document.getElementById("PowerFuelID").textContent = currentPowerFuel;
                    return
                case "PowerTime":
                    //añadimos uno al contador    
                    ++currerntPowerTime;
                    //actualizamos el contador en la web    
                    document.getElementById("PowerTimeID").textContent = currerntPowerTime;
                    return
                default:
                    console.log("defaultpower? check item elementID in master");
                    return
            }
        case "Item": //si es un item hacemos lo siguiente
            CheckLevelCompleted();
            return
        default:
            console.log("defaultitem? check item type in master");
    }
}


//funcion para el item del menu izq
function PlayerItemPlay() {
    //comprobamos que tipo de power es
    switch (this.id) {
        case "PowerFuel":
            //comprobamos que haya un poder que usar    
            if (currentPowerFuel >= 1) {
                //comprobamos que la nrg no esta completa
                if ((currentNrg + nrgValueIncrement) >= 101) {
                    console.log("energia maxima alcanzada");
                } else {
                    currentNrg = currentNrg + nrgValueIncrement;
                    energyBar.style.width = (currentNrg) + "%";
                    energyBar.style.backgroundColor = "hsl(" + currentNrg + ", 80%, 50%)";
                    //restamos uno al contador    
                    --currentPowerFuel;
                    //actualizamos el contador en la web    
                    document.getElementById("PowerFuelID").textContent = currentPowerFuel;
                }
            }
        case "PowerTime":
            //comprobamos que haya un poder que usar        
            if (currerntPowerTime >= 1) {
                //Comprobamos si al añadir tiempo nos saldriamos del maximo
                if (currentTime >= initTime - timeValueIncrement) {
                    console.log("Tiempo maximo alcanzado");
                } else {
                    //añadimos tiempo
                    currentTime = currentTime + timeValueIncrement;
                    //restamos uno al contador    
                    --currerntPowerTime;
                    //actualizamos el contador en la web    
                    document.getElementById("PowerTimeID").textContent = currerntPowerTime;
                }
            }
    }
}

/* Funciones de la barra de energia */

//Funcion para resetear la variable de energia al valor inicial
function resetcurrentNrg() {
    currentNrg = initNrg;
    energyBar.style.width = currentNrg + "%";
    energyBar.style.backgroundColor = "hsl(" + (currentNrg - nrgValueDecrement) + ", 80%, 50%)";

}

//funcion para consumir energia
function nrgSubstract() {
    currentNrg = currentNrg - nrgValueDecrement;
    if (currentNrg <= 0) {
        console.log("youloose");
    } else {
        energyBar.style.width = (currentNrg) + "%";
        energyBar.style.backgroundColor = "hsl(" + currentNrg + ", 80%, 50%)";
    }
}


/* ARRAY PRINCIPAL CON TODOS LOS OBJETOS DE JUEGO*/



const masterItem = [{
        imgSrc: "./img/items/bala_0.webp",
        name: "Bala",
        type: "Item",
        piece: [
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Bala1", img: "./img/items/bala_1.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    }, {
        imgSrc: "./img/items/calavera_0.webp",
        name: "Calavera",
        type: "Item",
        piece: [
            { ID: "Calavera1", img: "./img/items/calavera_1.webp" },
            { ID: "Calavera2", img: "./img/items/calavera_2.webp" },
            { ID: "Calavera3", img: "./img/items/calavera_3.webp" },
            { ID: "Calavera4", img: "./img/items/calavera_4.webp" },
            { ID: "Calavera5", img: "./img/items/calavera_5.webp" },
            { ID: "Calavera6", img: "./img/items/calavera_6.webp" },
            { ID: "Calavera7", img: "./img/items/calavera_7.webp" },
            { ID: "Calavera8", img: "./img/items/calavera_8.webp" },
            { ID: "Calavera9", img: "./img/items/calavera_9.webp" }
        ]
    }, {
        imgSrc: "./img/items/camara_0.webp",
        name: "Camara",
        type: "Item",
        piece: [
            { ID: "Camara1", img: "./img/items/camara_1.webp" },
            { ID: "Camara2", img: "./img/items/camara_2.webp" },
            { ID: "Camara3", img: "./img/items/camara_3.webp" },
            { ID: "Camara4", img: "./img/items/camara_4.webp" },
            { ID: "Camara5", img: "./img/items/camara_5.webp" },
            { ID: "Camara6", img: "./img/items/camara_6.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/cartel_0.webp",
        name: "Cartel",
        type: "Item",
        piece: [
            { ID: "Cartel1", img: "./img/items/cartel_1.webp" },
            { ID: "Cartel2", img: "./img/items/cartel_2.webp" },
            { ID: "Cartel3", img: "./img/items/cartel_3.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Cartel4", img: "./img/items/cartel_4.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Cartel5", img: "./img/items/cartel_5.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/chapa_0.webp",
        name: "Chapa",
        type: "Item",
        piece: [
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Chapa1", img: "./img/items/chapa_1.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/cigarrillo_0.webp",
        name: "Cigarrillo",
        type: "Item",
        piece: [
            { img: "./img/items/question_01.webp" },
            { ID: "Cigarrillo1", img: "./img/items/cigarrillo_1.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Cigarrillo2", img: "./img/items/cigarrillo_2.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/cuaderno_0.webp",
        name: "Cuaderno",
        type: "Item",
        piece: [
            { ID: "Cuaderno1", img: "./img/items/cuaderno_1.webp" },
            { ID: "Cuaderno2", img: "./img/items/cuaderno_2.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Cuaderno3", img: "./img/items/cuaderno_3.webp" },
            { ID: "Cuaderno4", img: "./img/items/cuaderno_4.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Cuaderno5", img: "./img/items/cuaderno_5.webp" },
            { ID: "Cuaderno6", img: "./img/items/cuaderno_6.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/escarabajo_0.webp",
        name: "Escarabajo",
        type: "Item",
        piece: [
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Escarabajo1", img: "./img/items/escarabajo_1.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/gopro_0.webp",
        name: "GoPro",
        type: "Item",
        piece: [
            { ID: "Gopro1", img: "./img/items/gopro_1.webp" },
            { ID: "Gopro2", img: "./img/items/gopro_2.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Gopro3", img: "./img/items/gopro_3.webp" },
            { ID: "Gopro4", img: "./img/items/gopro_4.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/gorra_0.webp",
        name: "Gorra",
        type: "Item",
        piece: [
            { img: "./img/items/question_01.webp" },
            { ID: "Gorra1", img: "./img/items/gorra_1.webp" },
            { ID: "Gorra2", img: "./img/items/gorra_2.webp" },
            { ID: "Gorra3", img: "./img/items/gorra_3.webp" },
            { ID: "Gorra4", img: "./img/items/gorra_4.webp" },
            { ID: "Gorra5", img: "./img/items/gorra_5.webp" }, ,
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/herradura_0.webp",
        name: "Herradura",
        type: "Item",
        piece: [
            { ID: "Herradura1", img: "./img/items/herradura_1.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Herradura2", img: "./img/items/herradura_2.webp" },
            { ID: "Herradura3", img: "./img/items/herradura_3.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Herradura4", img: "./img/items/herradura_4.webp" },
            { ID: "Herradura5", img: "./img/items/herradura_5.webp" },
            { ID: "Herradura6", img: "./img/items/herradura_6.webp" },
            { ID: "Herradura7", img: "./img/items/herradura_7.webp" },
        ]
    },
    {
        imgSrc: "./img/items/hueso_0.webp",
        name: "Hueso",
        type: "Item",
        piece: [
            { img: "./img/items/question_01.webp" },
            { ID: "Hueso1", img: "./img/items/hueso_1.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Hueso2", img: "./img/items/hueso_2.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/lapiz_0.webp",
        name: "Lapiz",
        type: "Item",
        piece: [
            { img: "./img/items/question_01.webp" },
            { ID: "Lapiz1", img: "./img/items/lapiz_1.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Lapiz2", img: "./img/items/lapiz_2.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/lata_0.webp",
        name: "Lata",
        type: "Item",
        piece: [
            { img: "./img/items/question_01.webp" },
            { ID: "Lata1", img: "./img/items/lata_1.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Lata2", img: "./img/items/lata_2.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/log_0.webp",
        name: "Tronco",
        type: "Item",
        piece: [
            { ID: "Tronco1", img: "./img/items/log_1.webp" },
            { ID: "Tronco2", img: "./img/items/log_2.webp" },
            { ID: "Tronco3", img: "./img/items/log_3.webp" },
            { ID: "Tronco4", img: "./img/items/log_4.webp" },
            { ID: "Tronco5", img: "./img/items/log_5.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/mapa_0.webp",
        name: "Mapa",
        type: "Item",
        piece: [
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Mapa1", img: "./img/items/mapa_1.webp" },
            { ID: "Mapa2", img: "./img/items/mapa_2.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/moneda_0.webp",
        name: "Moneda",
        type: "Item",
        piece: [
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Moneda1", img: "./img/items/moneda_1.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/oro_0.webp",
        name: "Oro",
        type: "Item",
        piece: [
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Oro1", img: "./img/items/oro_1.webp" },
            { ID: "Oro2", img: "./img/items/oro_2.webp" },
            { ID: "Oro3", img: "./img/items/oro_3.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/oruga_0.webp",
        name: "Oruga",
        type: "Item",
        piece: [
            { ID: "Oruga1", img: "./img/items/oruga_1.webp" },
            { ID: "Oruga2", img: "./img/items/oruga_2.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Oruga3", img: "./img/items/oruga_3.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Oruga4", img: "./img/items/oruga_4.webp" },
            { ID: "Oruga5", img: "./img/items/oruga_5.webp" },
        ]
    },
    {
        imgSrc: "./img/items/pala_0.webp",
        name: "Pala",
        type: "Item",
        piece: [
            { img: "./img/items/question_01.webp" },
            { ID: "Pala1", img: "./img/items/pala_1.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Pala2", img: "./img/items/pala_2.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/platano_0.webp",
        name: "Platano",
        type: "Item",
        piece: [
            { img: "./img/items/question_01.webp" },
            { ID: "Platano1", img: "./img/items/platano_1.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Platano2", img: "./img/items/platano_2.webp" },
            { ID: "Platano3", img: "./img/items/platano_3.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/rex_0.webp",
        name: "Rex",
        type: "Item",
        piece: [
            { ID: "Rex1", img: "./img/items/rex_1.webp" },
            { ID: "Rex2", img: "./img/items/rex_2.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Rex3", img: "./img/items/rex_3.webp" },
            { ID: "Rex4", img: "./img/items/rex_4.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/roca_0.webp",
        name: "Roca",
        type: "Item",
        piece: [
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Roca1", img: "./img/items/roca_1.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/rueda_0.webp",
        name: "Rueda",
        type: "Item",
        piece: [
            { ID: "Rueda1", img: "./img/items/rueda_1.webp" },
            { ID: "Rueda2", img: "./img/items/rueda_2.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Rueda3", img: "./img/items/rueda_3.webp" },
            { ID: "Rueda4", img: "./img/items/rueda_4.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/serpiente_0.webp",
        name: "Serpiente",
        type: "Item",
        piece: [
            { ID: "Serpiente1", img: "./img/items/serpiente_1.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Serpiente2", img: "./img/items/serpiente_2.webp" },
            { ID: "Serpiente3", img: "./img/items/serpiente_3.webp" },
            { ID: "Serpiente4", img: "./img/items/serpiente_4.webp" },
            { ID: "Serpiente5", img: "./img/items/serpiente_5.webp" },
            { ID: "Serpiente6", img: "./img/items/serpiente_6.webp" },
            { ID: "Serpiente7", img: "./img/items/serpiente_7.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/telefono_0.webp",
        name: "Telefono",
        type: "Item",
        piece: [
            { img: "./img/items/question_01.webp" },
            { ID: "Telefono1", img: "./img/items/telefono_1.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Telefono2", img: "./img/items/telefono_2.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/tesoro_0.webp",
        name: "Tesoro",
        type: "Item",
        piece: [
            { ID: "Tesoro1", img: "./img/items/tesoro_1.webp" },
            { ID: "Tesoro2", img: "./img/items/tesoro_2.webp" },
            { ID: "Tesoro3", img: "./img/items/tesoro_3.webp" },
            { ID: "Tesoro4", img: "./img/items/tesoro_4.webp" },
            { ID: "Tesoro5", img: "./img/items/tesoro_5.webp" },
            { ID: "Tesoro6", img: "./img/items/tesoro_6.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ]
    },
    {
        imgSrc: "./img/items/tijeras_0.webp",
        name: "Tijeras",
        type: "Item",
        piece: [
            { ID: "Tijeras1", img: "./img/items/tijeras_1.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "Tijeras2", img: "./img/items/tijeras_2.webp" },
            { ID: "Tijeras3", img: "./img/items/tijeras_3.webp" },
            { ID: "Tijeras4", img: "./img/items/tijeras_4.webp" },
            { ID: "Tijeras5", img: "./img/items/tijeras_5.webp" },
            { ID: "Tijeras6", img: "./img/items/tijeras_6.webp" },
            { ID: "Tijeras7", img: "./img/items/tijeras_7.webp" },
            { ID: "Tijeras8", img: "./img/items/tijeras_8.webp" },
        ]
    }



];


var powerArray = [{
        imgSrc: "./img/power_fuel.webp",
        name: "PowerFuel",
        type: "Power",
        piece: [
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "PowerFuel", img: "./img/power_fuel.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ],
        elementID: "PowerFuel",
        subelementID: "PowerFuelID"
    },
    {
        imgSrc: "./img/power_timer.webp",
        name: "PowerTime",
        type: "Power",
        piece: [
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { ID: "PowerTime", img: "./img/power_timer.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" },
            { img: "./img/items/question_01.webp" }
        ],
        elementID: "PowerTime",
        subelementID: "PowerTimeID",
    }
]

//Matrix de posiciones en las cuatro posibilidades de rotacion

const defaultLocation = [
    [{ pos: { x: -1, y: -1 } }, { pos: { x: -1, y: 0 } }, { pos: { x: -1, y: 1 } },
        { pos: { x: 0, y: -1 } }, { pos: { x: 0, y: 0 } }, { pos: { x: 0, y: 1 } },
        { pos: { x: 1, y: -1 } }, { pos: { x: 1, y: 0 } }, { pos: { x: 1, y: 1 } }
    ],
    [{ pos: { x: -1, y: 1 } }, { pos: { x: 0, y: 1 } }, { pos: { x: 1, y: 1 } },
        { pos: { x: -1, y: 0 } }, { pos: { x: 0, y: 0 } }, { pos: { x: 1, y: 0 } },
        { pos: { x: -1, y: -1 } }, { pos: { x: 0, y: -1 } }, { pos: { x: 1, y: -1 } }
    ],
    [{ pos: { x: 1, y: -1 } }, { pos: { x: 0, y: -1 } }, { pos: { x: -1, y: -1 } },
        { pos: { x: 1, y: 0 } }, { pos: { x: 0, y: 0 } }, { pos: { x: -1, y: 0 } },
        { pos: { x: 1, y: 1 } }, { pos: { x: 0, y: 1 } }, { pos: { x: -1, y: 1 } }
    ],
    [{ pos: { x: 1, y: 1 } }, { pos: { x: 1, y: 0 } }, { pos: { x: 1, y: -1 } },
        { pos: { x: 0, y: 1 } }, { pos: { x: 0, y: 0 } }, { pos: { x: 0, y: -1 } },
        { pos: { x: -1, y: 1 } }, { pos: { x: -1, y: 0 } }, { pos: { x: -1, y: -1 } }
    ]
];