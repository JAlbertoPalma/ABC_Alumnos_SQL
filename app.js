const API_URL = 'http://localhost:3000/api';

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

async function render() {
    try {
        const [resAlu, resCar] = await Promise.all([
            fetch(`${API_URL}/alumnos`),
            fetch(`${API_URL}/carreras`)
        ]);

        const alumnos = await resAlu.json();
        const carreras = await resCar.json();

        renderAlumnos(alumnos, carreras);
        renderCarreras(carreras);
    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
    }
}

function renderAlumnos(alumnos, carreras) {
    const lista = document.getElementById('lista-alumnos');
    lista.innerHTML = '';
    
    if (alumnos.length === 0) {
        lista.innerHTML = '<tr><td colspan="4" class="empty-msg">No hay alumnos registrados</td></tr>';
        return;
    }

    alumnos.forEach(aln => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${aln.nombre}</td>
            <td>${aln.edad}</td>
            <td>
                <select onchange="asignarCarrera(${aln.id}, this.value)">
                    <option value="">Sin asignar</option>
                    ${carreras.map(c => `
                        <option value="${c.id}" ${c.id == aln.carreraId ? 'selected' : ''}>${c.nombre}</option>
                    `).join('')}
                </select>
            </td>
            <td><button class="btn-del" onclick="borrarAlumno(${aln.id})">Borrar</button></td>
        `;
        lista.appendChild(tr);
    });
}

function renderCarreras(carreras) {
    const lista = document.getElementById('lista-carreras');
    lista.innerHTML = '';

    carreras.forEach(car => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${car.id}</td>
            <td>${car.nombre}</td>
            <td><button class="btn-del" onclick="borrarCarrera(${car.id})">Borrar</button></td>
        `;
        lista.appendChild(tr);
    });
}

document.getElementById('add-alumno').onclick = async () => {
    const nombre = document.getElementById('aln-nombre').value;
    const edad = document.getElementById('aln-edad').value;
    if(nombre && edad) {
        await fetch(`${API_URL}/alumnos`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ nombre, edad })
        });
        render();
    }
};

document.getElementById('add-carrera').onclick = async () => {
    const nombre = document.getElementById('car-nombre').value;
    if(nombre) {
        await fetch(`${API_URL}/carreras`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ nombre })
        });
        render();
    }
};

window.borrarAlumno = async (id) => { 
    await fetch(`${API_URL}/alumnos/${id}`, { method: 'DELETE' }); 
    render(); 
};

window.borrarCarrera = async (id) => { 
    await fetch(`${API_URL}/carreras/${id}`, { method: 'DELETE' }); 
    render(); 
};

window.asignarCarrera = async (alnId, carId) => { 
    await fetch(`${API_URL}/alumnos/asignar`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ alumnoId: alnId, carreraId: carId || null })
    });
    render(); 
};

render();