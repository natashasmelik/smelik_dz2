var rows = 12; //строки
var cols = 12; //колонки
var x = 0; //координата мыши x
var y = 0; //координата мыши y
var tickTime=0.5;//время одного тика
var stop = 1;
var empty = 1;
var c = document.getElementById("1");
var ctx = c.getContext("2d");
drawGrid();//рисуем сетку

var field = []; //создаем двумерный массив
fillField(); //заполняем поле клетками

function fillField(){ //заполняем поле клетками
  for (var r = 0; r < rows; r++)
    field.push([]);

  for (var r = 0; r < rows; r++)
    for (var c = 0; c < cols; c++)
      field[r][c] = 0;
  drawTick();
}

function drawGrid(){//рисуем сетку
  ctx.fillStyle="pink";
  
  for(var r = 0; r < rows; r++)
    ctx.fillRect(r * (300 / rows), 0, 1, 300);
  
  for(var c = 0; c < cols; c++)
    ctx.fillRect(0, c * (300 / cols), 300, 1);
  
  ctx.fillStyle="#CC99FF";
}

function read(){
  document.getElementById("1");
  x=Math.floor(event.offsetX / (300 / rows));
  y=Math.floor(event.offsetY / (300 / cols));
}

function putCell() {
  if(field[x][y] == 0)
    field[x][y] = 1;
  else
    field[x][y] = 0;
  drawTick();

  var sum = 0;
  for(var r = 0;r < rows; r++)
    for(var c = 0; c < cols; c++)
      sum += field[r][c];

  if(sum == 0)
    empty = 1;
  else
    empty = 0;
}

function clr() {
  document.getElementById("b").textContent = "BEGIN";
  stop = 1;
  for(var r = 0; r < rows; r++) //заполняем поле мертвыми клетками
    for(var c = 0; c < cols; c++)
      field[r][c] = 0;
  drawTick();
}

function drawSquare(r, c){ //отрисовка клетки в соответствии с массивом
  if(field[r][c] == 1)
    ctx.fillRect(r * (300 / rows),c * (300 / cols), 300 / rows, 300 / cols);
}

function drawTick() {//отрисовать один тик
  ctx.clearRect(0, 0 ,300, 300); //очистить поле от предыдущего тика
  drawGrid();
  for(var r = 0; r < rows; r++)
    for(var c = 0; c < cols; c++)
      drawSquare(r, c); //отрисовать все клетки в соответсвии с массивом
}

function neighbors(r, c) {//кол-во соседей рядом
  var count = 0; //обнуляем счетчик

  if(r >= 1 & c >= 1) count  += field[r-1][c-1];
  if(r >= 1) count  += field[r-1][c];
  if(r >= 1 & c < cols - 1) count  += field[r-1][c+1];

  if(c >= 1) count  += field[r][c - 1];
  if(c < cols-1) count  += field[r][c + 1];

  if(r < rows - 1 & c >= 1) count  += field[r + 1][c - 1];
  if(r < rows - 1) count  += field[r + 1][c];
  if(r < rows - 1 & c < cols - 1) count  += field[r + 1][c + 1];

  return count ; 
}

function tick(){ //один тик
  var newField = []; //создаем новый двумерный массив 
  for(var r = 0; r < rows; r++)
    newField.push([]);

  for(var r = 0; r < rows; r++) //заполняем поле мертвыми клетками
    for(var c = 0; c < cols; c++)
      newField[r][c] = 0;

  var cellSum = 0;
  for(var r = 0; r < rows; r++) //проход по полю и расставление клеток
    for(var c = 0; c < cols; c++){
      var count = neighbors(r, c) //кол-во соседей у текущей клетки в прошлом поколении

      if(field[r][c] == 0){ //если у прошлого поколения эта клетка была мертва но у нее было достаточно cоседей
        if(count == 3) 
            newField[r][c] = 1; //оживляем ее
      }
      else { //если у прошлого поколения эта клетка была жива но у нее было слишком мало или слишком много соседей
        if(count < 2 || count > 3) 
          newField[r][c] = 0; //убиваем 
        else
          newField[r][c] = true; //если все ок, оставляем клетку
      }
      cellSum += field[r][c];
    }

  field = newField; //обновляем поле

  drawTick(); //отрисовываем поле на холсте в соответствии с массивом

  if(cellSum == 0) {
    empty=1;
    stop=1;
    document.getElementById("b").textContent="BEGIN";
  }
  if(stop == 0)
    setTimeout(tick,tickTime*250) //рекурсивно запускаем новый тик
}

function run(){
  if(stop == 1 & empty == 0){
    document.getElementById("b").textContent = "PAUSE";
    stop = 0;
    tick();
  }  
  else{
    document.getElementById("b").textContent = "PLAY";
    stop = 1;
  }
}

function fillRand(){//функция рандомного заполнения поля
  empty=0;
  clr();
  for(var i = 0; i < rows * cols * 0.3; i++) {
    var r=Math.floor(Math.random() * rows);
    var c=Math.floor(Math.random() * cols);
    field[r][c] = 1;
  }
  drawTick();
}

 