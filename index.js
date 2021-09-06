/* esta parte es la funcion que hace que se despliegue el menu de perfil*/

function menuToggle(){
  const toggleMenu = document.querySelector(" .menu");
  toggleMenu.classList.toggle("active");
}
/*Esta primera parte del código tiene dos bloques de código:
    -La primera parte está destinada a limpiar el elemento del bloque te texto que acoje el contenido de la tarea a subir.
    -La segunda parte contiene tanto el guardar el contenido de la tarea a subir en la bariable contenidoListaTag como en borrado en la parte final.
*/
document.getElementById('formTask').addEventListener('submit', saveTask);

function saveTask(e) {
  let title = document.getElementById('title').value;
  let description = document.getElementById('description').value;
  console.log(description)

  let task = {
    title,
    description
  };

  if(localStorage.getItem('tasks') === null) {
    let tasks = [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } else {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  getTasks();
  document.getElementById('formTask').reset();
  e.preventDefault();
}

function deleteTask(title) {

  let tasks = JSON.parse(localStorage.getItem('tasks'));
  for(let i = 0; i < tasks.length; i++) {
    if(tasks[i].title == title) {
      tasks.splice(i, 1);
    }
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  getTasks();
}


function getTasks() {
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  let tasksView = document.getElementById('tasks');
  tasksView.innerHTML = '';
  for(let i = 0; i < tasks.length; i++) {
    let title = tasks[i].title;
    let description = tasks[i].description;

    tasksView.innerHTML +=
    `<div class="container">
      <div class="accordion">
      <div class="shadow">
          <div class="SectionCheck">
            <input type="checkbox" name="checTask" id="Check">
            <label class="LabelTask" for="Check">.</label>
            <button type="button" class="trash" onclick="deleteTask('${title}')"><i class="fas fa-trash"></i></button>
          </div>
          <div class="accordion-item" id="question1">
            <a class="accordion-link" href="#question1">
              ${title}
              <p class="ion-md-add">+</p>
              <p class="ion-md-remove">-</p>
            </a>
            <div class="answer">
              <p>${description}</p>
            </div>
          </div>
      </div>
      </div>
    </div>`;

  }
  /*Esta es la function que nos permite togglear el texto de la task
  document.querySelector(" .accordion-item").addEventListener("click", ()=>{
    document.querySelector(" .answer").classList.toggle("answerOn");
  });*/
  var taskSons = document.querySelectorAll(" .accordion-item");

  for (oneSon of taskSons) {
      oneSon.addEventListener("click", function(evt){
          var son = evt.target;
          /*
          console.log("Se hizo click en", son);
          console.log("Texto del enlace:", son.innerText);
          console.log($(son).attr('class')); */
          var x = son.parentElement;
          var y = x.lastElementChild;
          y.classList.toggle("answerOn");
          //console.log("lo que busco es ", y);
      });
  }


}

/*codigo referente a burgernav*/
const navSlide = ()=>{
  const burger = document.querySelector(" .burger");
  const nav = document.querySelector(" .midle-section-header");
  const navbuttons = document.querySelectorAll(" .midle-section-header button");

  burger.addEventListener("click", ()=>{
    //toggle
    nav.classList.toggle("burgerNavActive");
    //animations
    navbuttons.forEach((button, index)=>{
      if(button.style.animation){
        button.style.animation = "";
      }else{
        button.style.animation = `navbarFade 0.5s ease forwards ${index/ 7 + 0.3}s`
      }
    });
    //animate the burger
    burger.classList.toggle("toggle");
  });

}
navSlide();
/*Aqui comenzaremos con el bloque de código referente a el calendario, dandole funcionalidad y conectandolo con la lista de tareas
desarrollada anteriormente*/
class Calendar{
  constructor(id){
    this.cells = [];
    this.selectedDate = null;
    this.currtentMonth = moment();
    this.elCalendar = document.getElementById(id);
    this.showTemplate();
    this.elGridBody = this.elCalendar.querySelector(" .grid__body");
    this.elMonthName = this.elCalendar.querySelector(" .month-name");
    this.showCells();
  }
  showTemplate(){
    this.elCalendar.innerHTML = this.getTemplate();
    this.addEventListenerToControls();
  }
  getTemplate(){
    let template =  `
        <div class="calendar__header">
          <button type="button" name="button-izquierda" class= "control control--prev"><</button>
          <samp class= "month-name">Febrero 2021</samp>
          <button type="button" name="button-derecha" class= "control control--next">></button>
        </div>
        <div class="calendar_body">
          <div class="grid">
            <div class="grid__header">
              <span class = "grid__cell grid__cell--gh">LUN</span>
              <span class = "grid__cell grid__cell--gh">MAR</span>
              <span class = "grid__cell grid__cell--gh">MIE</span>
              <span class = "grid__cell grid__cell--gh">JUE</span>
              <span class = "grid__cell grid__cell--gh">VIE</span>
              <span class = "grid__cell grid__cell--gh">SAB</span>
              <span class = "grid__cell grid__cell--gh">DOM</span>
            </div>
            <div class="grid__body">

            </div>
          </div>
        </div>
    `;
    return template;
  }
  addEventListenerToControls(){
    let elControls = this.elCalendar.querySelectorAll(" .control");
    elControls.forEach(elControls =>{
      elControls.addEventListener("click", e =>{
        let elTarget =e.target;
        if(elTarget.classList.contains("control--next")){
          this.changeMonth(true);
        }
        else{
          this.changeMonth(false);
        }
        this.showCells();
      });
    });
  }
  changeMonth(next = true){
    if(next){
      this.currtentMonth.add(1, "months");
    }
    else{
      this.currtentMonth.subtract(1,"months");
    }
  }
  showCells(){
    this.cells = this.dateGenerator(this.currtentMonth);
    if(this.cells === null){
      console.error("No fue posible generar fechas");
      return;
    }
    this.elGridBody.innerHTML = "";
    let templateCells = "";
    let disabledClass = "";
    for (var i = 0; i < this.cells.length; i++) {
      disabledClass = "";
      if (!this.cells[i].isInCurrentMonth){
        disabledClass = "grid__cell--disabled";
      }
      //<span class="grid__cell grid__cell--gd grid__cell--selected">1</span>

     templateCells += `
        <span class="grid__cell grid__cell--gd ${disabledClass}" data-cell-id= "${i}">
          ${this.cells[i].date.date()}
        </span>
      `;
    }
    this.elMonthName.innerHTML = this.currtentMonth.format("MMM YYYY");
    this.elGridBody.innerHTML =templateCells;
    this.addEventListenerToCells();
  }
  dateGenerator(monthToShow = moment()){
    if(!moment.isMoment(monthToShow)){
        return null;
    }
    let startDate = moment(monthToShow).startOf("month");
    let endDate = moment(monthToShow).endOf("month");
    let cells = [];
    //encontrando la primera fecha a mostrar en el calendario
    while(startDate.day()!==1){
      startDate.subtract(1,"days");
    }
    //encontrar la ultima fecha que se muestra en el calendario
    while(endDate.day()!==0){
      endDate.add(1,"days");
    }
    //generando las fechas del gird.
    do{
      cells.push({
        date: moment(startDate), isInCurrentMonth: startDate.month() === monthToShow.month()
      });
      startDate.add(1,"days");
    }while(startDate.isSameOrBefore(endDate));
    return cells;
  }
  //Seleccionando las celdas
  addEventListenerToCells(){
    let elCells = this.elCalendar.querySelectorAll(" .grid__cell--gd");
    elCells.forEach(elCell =>{
      elCell.addEventListener("click", e=>{
        let elTarget= e.target;
        if(elTarget.classList.contains("grid__cell--disabled")||elTarget.classList.contains("grid__cell--selected")){
          return;
        }
        // Desseleccionar la celda anterior
        let selectedCell = this.elGridBody.querySelector(" .grid__cell--selected");
        if(selectedCell){
          selectedCell.classList.remove("grid__cell--selected");
        }
        //Seleccionar la nueva celda
        elTarget.classList.add("grid__cell--selected");
        //lanzando el evento
        this.selectedDate = this.cells[parseInt(elTarget.dataset.cellId)].date;
        this.elCalendar.dispatchEvent(new Event("change"));
      });
    });
  }
  getElement(){
    return this.elCalendar;
  }
  value(){
    return this.selectedDate;
  }
}
/*Aqui comenzasmos con el codigo de las StikyNotes*/

  var stikyNoteContainer = document.getElementsByClassName("stiky-note-container")[0];
  var stikyNoteTemplate = document.getElementsByClassName("stiky-note-template")[0];
  var checkIcon = document.getElementById("Check-icon");
  var xIcon = document.getElementById("X-icon");
  var i = 0;

  xIcon.addEventListener("click", function(){
    typeNote();

  });
  checkIcon.addEventListener("click", function(){
    createNote();
  });
  function typeNote(){
    if(stikyNoteTemplate.style.display == "none"){
      stikyNoteTemplate.style.display = "block";
    }
    else{
      stikyNoteTemplate.style.display = "none";
    }
  }
  function createNote(){
    var noteText = document.getElementById("StikyNote").value;
    var node0 = document.createElement("div");
    var node1 = document.createElement("h1");

    node1.innerHTML = noteText;
    node1.setAttribute("style", "width: 120px; height:120px; font-size:18px; padding: 25px; margin-top:10px; overflow:hidden; box-shadow: 0px 10px 24px 0px rgba(0,0,0,0.75)");

    node1.style.margin = margin();
    node1.style.transform = rotate();
    node1.style.background = color();

    node0.appendChild(node1);
    stikyNoteContainer.insertAdjacentElement("beforeend", node0);

/*eliminando los elementos stikyNotes con un doube click*/
    node0.addEventListener("mouseenter", function(){
      node0.style.transform = "scale(1.1)";
    });
    node0.addEventListener("mouseleave", function(){
      node0.style.transform = "scale(1)";
    });
    node0.addEventListener("dblclick", function(){
      node0.remove();
    });
    /*quitando el añadir elementos despues de seleccionar la stikinote*/
    document.getElementById("StikyNote").value = "";
  }
  function margin(){
    var random_margin = ["-5px", "1px", "5px", "10px", "15px", "20px"];
    return random_margin[Math.floor(Math.random() * random_margin.length)];
  }
  function rotate(){
    var random_rotate = ["rotate(3deg)", "rotate(1deg)", "rotate(-1deg)", "rotate(-3deg)", "rotate(-5deg)", "rotate(-10deg)"];
    return random_rotate[Math.floor(Math.random() * random_rotate.length)];
  }
  function color(){
    var random_color = ["#c2ff3d", "#ff3de8", "#3dc2ff", "#04e022", "#bc83e6", "#ebb328"];
    if(i > random_color.length -1){
      i = 0;
    }
    return random_color[i++];
  }

/*Quote ramdon denerator*/
var bodyQuote = document.getElementById("body-quote");
var autorQuote = document.getElementById("autor-quote");
var numeroRandom = Math.floor(Math.random() * 5);

function randomQuote(){
  var random_Quote = [
    "“Be yourself; everyone else is already taken.”",
    "“I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best.”",
    "“Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.”",
    "“So many books, so little time.”",
    "“A room without books is like a body without a soul.”",
  ]
  return random_Quote[numeroRandom];
}

function randomAutor(){
  var random_Autor = [
    "Oscar Wilde",
    "Marilyn Monroe",
    "Albert Einstein",
    "Frank Zappa",
    "Marcus Tullius Cicero",
  ]
  return random_Autor[numeroRandom]
}

var quoteToShow = randomQuote();
var autorToShow = randomAutor();
bodyQuote.innerHTML = quoteToShow.toString();
autorQuote.innerHTML = autorToShow.toString();
