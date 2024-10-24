if (!window.localStorage) {
    alert('localStorage no disponible en el nav');
    location.assign('index.html');
}

const sFechaHora = document.querySelector('#fecha');
const txtLlave = document.querySelector('#txt-llave');
const txtValor = document.querySelector('#txt-valor');
const btnAdd = document.querySelector('#btn-add');

setInterval ( e => { 
    const d = new Date();
    sFechaHora.textContent = d.toString();
}, 500);

function listarElementosLocalStorage() {

    console.log('elementos en el LocalStorage: ');
    for (let ix = 0; ix < localStorage.length; ix++) {
        let k = localStorage.key(ix);
        let v = localStorage.getItem(k);
        console.log(`- [${k}] -> ${v}`);
    }

}

btnAdd.addEventListener('click', e => {
    if (!txtLlave.value.trim()) {
        txtLlave.focus();
        return;
    }

    localStorage.setItem(txtLlave.value.trim(), txtValor.value);
    txtLlave.value = '';
    txtValor.value = '';
    txtLlave.focus();
    listarElementosLocalStorage();


})