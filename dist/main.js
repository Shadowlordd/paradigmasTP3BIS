"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_sync_1 = __importDefault(require("readline-sync"));
const tarea_1 = require("./tarea");
const gestor = new tarea_1.GestorTareas();
// Cargar tareas al iniciar
gestor.cargarDesdeJSON();
let opcion;
do {
    console.log("\n=================================");
    console.log(" SISTEMA DE GESTIÓN DE TAREAS");
    console.log("=================================");
    console.log("1. Listar tareas");
    console.log("2. Agregar tarea");
    console.log("3. Editar tarea");
    console.log("4. Ver tareas por estado");
    console.log("5. Recargar tasks.json");
    console.log("6. Guardar cambios");
    console.log("0. Salir");
    console.log("=================================");
    opcion = Number(readline_sync_1.default.question("Seleccione una opcion: "));
    switch (opcion) {
        case 1:
            gestor.listarTareas();
            break;
        case 2:
            gestor.agregarTarea();
            break;
        case 3: {
            if (gestor.tareas.length === 0) {
                console.log("No hay tareas cargadas.");
                break;
            }
            gestor.tareas.forEach((tarea, indice) => {
                console.log(`${indice} - ${tarea.titulo}`);
            });
            const indice = Number(readline_sync_1.default.question("Ingrese el indice de la tarea: "));
            if (isNaN(indice) ||
                indice < 0 ||
                indice >= gestor.tareas.length) {
                console.log("Indice invalido.");
                break;
            }
            gestor.editarTarea(indice);
            break;
        }
        case 4: {
            console.log("\n FILTRAR POR ESTADO ");
            console.log("1. PENDING");
            console.log("2. IN-PROGRESS");
            console.log("3. FINISHED");
            console.log("4. CANCELED");
            console.log("0. Volver");
            const opcionEstado = Number(readline_sync_1.default.question("Seleccione una opcion: "));
            switch (opcionEstado) {
                case 1:
                    gestor.verPorEstado("PENDING");
                    break;
                case 2:
                    gestor.verPorEstado("IN-PROGRESS");
                    break;
                case 3:
                    gestor.verPorEstado("FINISHED");
                    break;
                case 4:
                    gestor.verPorEstado("CANCELED");
                    break;
                case 0:
                    break;
                default:
                    console.log("Opcion invalida.");
            }
            break;
        }
        case 5:
            gestor.cargarDesdeJSON();
            break;
        case 6:
            gestor.guardarEnJSON();
            console.log("Cambios guardados correctamente.");
            break;
        case 0:
            gestor.guardarEnJSON();
            console.log("\nTareas guardadas.");
            console.log("Hasta luego.");
            break;
        default:
            console.log("Opcion invalida.");
    }
} while (opcion !== 0);
