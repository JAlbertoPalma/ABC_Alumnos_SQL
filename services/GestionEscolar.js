export class GestionEscolar {
    constructor() {
        this.alumnos = [];
        this.carreras = [];
    }

    agregarAlumno(id, nombre, edad) {
        this.alumnos.push({ id, nombre, edad, carreraId: null });
    }

    agregarCarrera(id, nombre) {
        this.carreras.push({ id, nombre });
    }

    borrarAlumno(id) {
        this.alumnos = this.alumnos.filter(a => a.id != id);
    }

    borrarCarrera(id) {
        this.carreras = this.carreras.filter(c => c.id != id);
        this.alumnos.forEach(a => { if(a.carreraId == id) a.carreraId = null; });
    }

    asignar(alumnoId, carreraId) {
        const alumno = this.alumnos.find(a => a.id == alumnoId);
        if (alumno) {
            alumno.carreraId = carreraId;
        }
    }
}