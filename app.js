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

        if (!resAlu.ok || !resCar.ok) throw new Error('Error al obtener datos del servidor');

        const alumnos = await resAlu.json();
        const carreras = await resCar.json();

        renderAlumnos(alumnos, carreras);
        renderCarreras(carreras);
    } catch (error) {
        console.error("Error en el render:", error);
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
                        <option value="${c.id}" ${c.id == aln.idCarrera ? 'selected' : ''}>
                            ${c.nombre}
                        </option>
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

    if (carreras.length === 0) {
        lista.innerHTML = '<tr><td colspan="3" class="empty-msg">No hay carreras registradas</td></tr>';
        return;
    }

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
    
    if (nombre && edad) {
        await fetch(`${API_URL}/alumnos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, edad })
        });
        document.getElementById('aln-nombre').value = '';
        document.getElementById('aln-edad').value = '';
        render();
    }
};

document.getElementById('add-carrera').onclick = async () => {
    const nombre = document.getElementById('car-nombre').value;
    
    if (nombre) {
        await fetch(`${API_URL}/carreras`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
        });
        document.getElementById('car-nombre').value = '';
        render();
    }
};

window.borrarAlumno = async (id) => {
    if (confirm('¿Estás seguro de borrar este alumno?')) {
        await fetch(`${API_URL}/alumnos/${id}`, { method: 'DELETE' });
        render();
    }
};

window.borrarCarrera = async (id) => {
    if (confirm('¿Estás seguro de borrar esta carrera? Los alumnos quedarán sin asignar.')) {
        const res = await fetch(`${API_URL}/carreras/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            alert("Error: Revisa que tu base de datos tenga correctamente el ON DELETE SET NULL");
        }
        render();
    }
};

window.asignarCarrera = async (alumnoId, idCarrera) => {
    const res = await fetch(`${API_URL}/alumnos/asignar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            alumnoId: alumnoId, 
            idCarrera: idCarrera === "" ? null : idCarrera 
        })
    });
    if (!res.ok) {
        alert("Error al intentar asignar la carrera en el servidor.");
    }
    render();
};

render();