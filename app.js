import { GestionEscolar } from './services/GestionEscolar.js';

const sistema = new GestionEscolar();

const secAlumnos = document.getElementById('section-alumnos');
const secCarreras = document.getElementById('section-carreras');
const btnAlumnos = document.getElementById('btn-alumnos');
const btnCarreras = document.getElementById('btn-carreras');

btnAlumnos.addEventListener('click', () => {
    secAlumnos.classList.remove('hidden');
    secCarreras.classList.add('hidden');
    btnAlumnos.classList.add('active');
    btnCarreras.classList.remove('active');
    render();
});

btnCarreras.addEventListener('click', () => {
    secAlumnos.classList.add('hidden');
    secCarreras.classList.remove('hidden');
    btnAlumnos.classList.remove('active');
    btnCarreras.classList.add('active');
    render();
});

function render() {
    renderAlumnos();
    renderCarreras();
}

function renderAlumnos() {
    const lista = document.getElementById('lista-alumnos');
    lista.innerHTML = '';
    
    if (sistema.alumnos.length === 0) {
        lista.innerHTML = '<tr><td colspan="4" class="empty-msg">No hay alumnos registrados</td></tr>';
        return;
    }

    sistema.alumnos.forEach(aln => {
        const tr = document.createElement('tr');
        const carreraActual = sistema.carreras.find(c => c.id == aln.carreraId);
        
        tr.innerHTML = `
            <td>${aln.nombre}</td>
            <td>${aln.edad}</td>
            <td>
                <select onchange="asignarCarrera(${aln.id}, this.value)">
                    <option value="">Sin asignar</option>
                    ${sistema.carreras.map(c => `
                        <option value="${c.id}" ${c.id == aln.carreraId ? 'selected' : ''}>${c.nombre}</option>
                    `).join('')}
                </select>
            </td>
            <td><button class="btn-del" onclick="borrarAlumno(${aln.id})">Borrar</button></td>
        `;
        lista.appendChild(tr);
    });
}

function renderCarreras() {
    const lista = document.getElementById('lista-carreras');
    lista.innerHTML = '';

    sistema.carreras.forEach(car => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${car.id}</td>
            <td>${car.nombre}</td>
            <td><button class="btn-del" onclick="borrarCarrera(${car.id})">Borrar</button></td>
        `;
        lista.appendChild(tr);
    });
}

document.getElementById('add-alumno').onclick = () => {
    const nombre = document.getElementById('aln-nombre').value;
    const edad = document.getElementById('aln-edad').value;
    if(nombre && edad) {
        sistema.agregarAlumno(Date.now(), nombre, edad);
        render();
    }
};

document.getElementById('add-carrera').onclick = () => {
    const nombre = document.getElementById('car-nombre').value;
    if(nombre) {
        sistema.agregarCarrera(Date.now(), nombre);
        render();
    }
};

window.borrarAlumno = (id) => { sistema.borrarAlumno(id); render(); };
window.borrarCarrera = (id) => { sistema.borrarCarrera(id); render(); };
window.asignarCarrera = (alnId, carId) => { sistema.asignar(alnId, carId); render(); };

render();