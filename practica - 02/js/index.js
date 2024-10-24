// elementos html
const txtNom = document.querySelector('#txt-nom');
const btnAccion = document.querySelector('#btn-accion');
const sUserAgent = document.getElementById('s-user-agent');
const txtItem = document.querySelector('#txt-item');
const btnAgregarItem = document.querySelector('#btn-agregar-item');
const ulLista = document.querySelector('#ul-lista');

sUserAgent.textContent = navigator.userAgent;

if (!localStorage.getItem('listaElementos')) {
    let lista = [];
    let listaJSON = JSON.stringify(lista);
    localStorage.setItem('listaElementos', listaJSON);
}

const lista = JSON.parse(localStorage.getItem('listaElementos'));
for (let i of lista) {
    let li = document.createElement('li');
    li.textContent = i;
    li.addEventListener('click', li_click);
    ulLista.appendChild(li);
}


function btnAccion_click(e) {
    
    const nombre = txtNom.value.trim();

    if (!nombre) {
        txtNom.focus();
        return;
    }

    const mensaje = `Hola ${nombre}, bienvenido a JS`;
    alert(mensaje);

    txtNom.value = '';
    txtNom.focus();

}

btnAccion.addEventListener('click', btnAccion_click);

// obtener info sobre el evento SHIFT + F5
txtNom.addEventListener('keypress', function(e) {
    console.log(e.key);
    if (e.key == 'Enter') {
        btnAccion.click();
    }
});

btnAgregarItem.addEventListener('click', e=> {
    const itemNombre = txtItem.value.trim();
    if (!itemNombre) {
        txtItem.focus();
        return;
    }
    const li = document.createElement('li');
    li.textContent = itemNombre;
    li.addEventListener('click', li_click);
    ulLista.appendChild(li);
    txtItem.value = '';
    txtItem.focus();
    lista.push(itemNombre);
    localStorage.setItem('listaElementos', JSON.stringify(lista));
});

function li_click(e) {
    const li = this;
    alert('Elemento clicked => ' + li.textContent);
}

function Persona (nombre, apellido, edad) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;

    this.saludar = function() {
        alert(`hola, soy ${this.nombre} ${this.apellidos}`);
    }
}

const persona1 = new Persona('ana', 'ramos', 4);
persona1.saludar();
persona1.otraPropiedad = 'otra';
console.log(persona1.otraPropiedad);
const persona2 = new Persona('marina', 'diamandis', 8);
persona1.decirEdad =  function() {
    console.log(`mi edad es ${this.nombre} anios`);
}


console.log(persona1);
console.log(persona2);

const array = [];
array.push(persona1);

const arr02 = [1,2,3,4,5,6,7,8,9,10];
let arrT = arr02.filter(function(num, ix, arr) {return num % 2 == 0;});
console.log('pares');
