"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GestorTareas = GestorTareas;
const fs_1 = __importDefault(require("fs"));
const readline_sync_1 = __importDefault(require("readline-sync"));
function GestorTareas() {
    this.tareas = [];
}
/*
 * verporestado
 */
GestorTareas.prototype.verPorEstado = function (estado) {
    const filtradas = this.tareas.filter(tarea => tarea.estado === estado);
    if (filtradas.length === 0) {
        console.log(`No hay tareas con estado ${estado}`);
        return;
    }
    console.log(`\n=== ${estado} ===`);
    filtradas.forEach((tarea, indice) => {
        console.log(`${indice} - ${tarea.titulo}`);
    });
};
/*
 * VALIDACION
 */
GestorTareas.prototype.validarTarea = function (obj) {
    return (typeof obj.titulo === "string" &&
        (typeof obj.descripcion === "string" ||
            obj.descripcion === null) &&
        [
            "PENDING",
            "IN-PROGRESS",
            "FINISHED",
            "CANCELED",
        ].includes(obj.estado) &&
        !isNaN(new Date(obj.creacion).getTime()) &&
        (obj.ultimaEdicion === null ||
            !isNaN(new Date(obj.ultimaEdicion).getTime())) &&
        (obj.vencimiento === null ||
            !isNaN(new Date(obj.vencimiento).getTime())) &&
        [1, 2, 3].includes(obj.dificultad));
};
/*
 * CARGAR JSON
 */
GestorTareas.prototype.cargarDesdeJSON = function () {
    try {
        const contenido = fs_1.default.readFileSync("./tasks.json", "utf8");
        const datos = JSON.parse(contenido);
        let cargadas = 0;
        let descartadas = 0;
        this.tareas = [];
        for (const tarea of datos) {
            if (this.validarTarea(tarea)) {
                this.tareas.push({
                    titulo: tarea.titulo,
                    descripcion: tarea.descripcion,
                    estado: tarea.estado,
                    creacion: new Date(tarea.creacion),
                    ultimaEdicion: tarea.ultimaEdicion
                        ? new Date(tarea.ultimaEdicion)
                        : null,
                    vencimiento: tarea.vencimiento
                        ? new Date(tarea.vencimiento)
                        : null,
                    dificultad: tarea.dificultad,
                });
                cargadas++;
            }
            else {
                descartadas++;
            }
        }
        console.log(`Tareas cargadas: ${cargadas}`);
        console.log(`Tareas inválidas: ${descartadas}`);
    }
    catch (error) {
        console.log("Error al leer tasks.json");
        console.log(error);
        this.tareas = [];
    }
};
/*
 * GUARDAR JSON
 */
GestorTareas.prototype.guardarEnJSON = function () {
    fs_1.default.writeFileSync("./tasks.json", JSON.stringify(this.tareas, null, 2), "utf8");
};
/*
 * AGREGAR
 */
GestorTareas.prototype.agregarTarea = function () {
    const titulo = readline_sync_1.default.question("Titulo: ");
    const descripcion = readline_sync_1.default.question("Descripcion (vacio = null): ");
    const dificultad = Number(readline_sync_1.default.question("Dificultad (1-3): "));
    const nueva = {
        titulo,
        descripcion: descripcion.trim() === ""
            ? null
            : descripcion,
        estado: "PENDING",
        creacion: new Date(),
        ultimaEdicion: null,
        vencimiento: null,
        dificultad,
    };
    this.tareas.push(nueva);
    this.guardarEnJSON();
    console.log("Tarea agregada.");
};
/*
 * LISTAR
 */
GestorTareas.prototype.listarTareas = function () {
    if (this.tareas.length === 0) {
        console.log("No hay tareas.");
        return;
    }
    console.log("\n=== LISTA DE TAREAS ===");
    this.tareas.forEach((tarea, indice) => {
        console.log(`${indice} - ${tarea.titulo} [${tarea.estado}]`);
    });
    const indice = Number(readline_sync_1.default.question("\nIngrese indice o -1 para volver: "));
    if (indice === -1) {
        return;
    }
    if (indice >= 0 &&
        indice < this.tareas.length) {
        this.mostrarDetalles(indice);
    }
    else {
        console.log("Indice invalido.");
    }
};
/*
 * DETALLES
 */
GestorTareas.prototype.mostrarDetalles =
    function (indice) {
        const tarea = this.tareas[indice];
        console.log("\n=== DETALLES ===");
        console.log(`Titulo: ${tarea.titulo}`);
        console.log(`Descripcion: ${tarea.descripcion ??
            "Sin descripcion"}`);
        console.log(`Estado: ${tarea.estado}`);
        console.log(`Dificultad: ${tarea.dificultad}`);
        console.log(`Creacion: ${tarea.creacion.toLocaleString()}`);
        console.log(`Ultima edicion: ${tarea.ultimaEdicion
            ? tarea.ultimaEdicion.toLocaleString()
            : "No registrada"}`);
        console.log(`Vencimiento: ${tarea.vencimiento
            ? tarea.vencimiento.toLocaleDateString()
            : "No definido"}`);
        const opcion = readline_sync_1.default.question("\n[E] Editar | [0] Volver: ");
        if (opcion.toLowerCase() === "e") {
            this.editarTarea(indice);
        }
    };
/*
 * EDITAR
 */
GestorTareas.prototype.editarTarea =
    function (indice) {
        const tarea = this.tareas[indice];
        console.log("\n=== EDITAR ===");
        console.log("1 - Titulo");
        console.log("2 - Descripcion");
        console.log("3 - Estado");
        console.log("4 - Vencimiento");
        const opcion = Number(readline_sync_1.default.question("Opcion: "));
        switch (opcion) {
            case 1:
                tarea.titulo =
                    readline_sync_1.default.question("Nuevo titulo: ");
                break;
            case 2: {
                const descripcion = readline_sync_1.default.question("Nueva descripcion: ");
                tarea.descripcion =
                    descripcion.trim() === ""
                        ? null
                        : descripcion;
                break;
            }
            case 3: {
                console.log("1 - PENDING");
                console.log("2 - IN-PROGRESS");
                console.log("3 - FINISHED");
                console.log("4 - CANCELED");
                const estado = Number(readline_sync_1.default.question("Estado: "));
                switch (estado) {
                    case 1:
                        tarea.estado =
                            "PENDING";
                        break;
                    case 2:
                        tarea.estado =
                            "IN-PROGRESS";
                        break;
                    case 3:
                        tarea.estado =
                            "FINISHED";
                        break;
                    case 4:
                        tarea.estado =
                            "CANCELED";
                        break;
                }
                break;
            }
            case 4: {
                const fecha = readline_sync_1.default.question("YYYY-MM-DD o vacio para null: ");
                tarea.vencimiento =
                    fecha.trim() === ""
                        ? null
                        : new Date(fecha);
                break;
            }
            default:
                console.log("Opcion invalida.");
                return;
        }
        tarea.ultimaEdicion =
            new Date();
        this.guardarEnJSON();
        console.log("Tarea actualizada.");
    };
