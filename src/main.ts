import readlineSync from "readline-sync";
import { GestorTareas } from "./tarea";

const gestor = new (GestorTareas as any)();

// Cargar tareas al iniciar
gestor.cargarDesdeJSON();

let opcion: number;

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

  opcion = Number(
    readlineSync.question(
      "Seleccione una opcion: "
    )
  );

  switch (opcion) {

    case 1:

      gestor.listarTareas();

      break;

    case 2:

      gestor.agregarTarea();

      break;

    case 3: {

      if (gestor.tareas.length === 0) {

        console.log(
          "No hay tareas cargadas."
        );

        break;
      }

      gestor.tareas.forEach(
        (tarea: any, indice: number) => {

          console.log(
            `${indice} - ${tarea.titulo}`
          );

        }
      );

      const indice = Number(
        readlineSync.question(
          "Ingrese el indice de la tarea: "
        )
      );

      if (
        isNaN(indice) ||
        indice < 0 ||
        indice >= gestor.tareas.length
      ) {

        console.log(
          "Indice invalido."
        );

        break;
      }

      gestor.editarTarea(indice);

      break;
    }

    case 4: {

      console.log(
        "\n FILTRAR POR ESTADO "
      );

      console.log(
        "1. PENDING"
      );

      console.log(
        "2. IN-PROGRESS"
      );

      console.log(
        "3. FINISHED"
      );

      console.log(
        "4. CANCELED"
      );

      console.log(
        "0. Volver"
      );

      const opcionEstado = Number(
        readlineSync.question(
          "Seleccione una opcion: "
        )
      );

      switch (opcionEstado) {

        case 1:

          gestor.verPorEstado(
            "PENDING"
          );

          break;

        case 2:

          gestor.verPorEstado(
            "IN-PROGRESS"
          );

          break;

        case 3:

          gestor.verPorEstado(
            "FINISHED"
          );

          break;

        case 4:

          gestor.verPorEstado(
            "CANCELED"
          );

          break;

        case 0:

          break;

        default:

          console.log(
            "Opcion invalida."
          );
      }

      break;
    }

    case 5:

      gestor.cargarDesdeJSON();

      break;

    case 6:

      gestor.guardarEnJSON();

      console.log(
        "Cambios guardados correctamente."
      );

      break;

    case 0:

      gestor.guardarEnJSON();

      console.log(
        "\nTareas guardadas."
      );

      console.log(
        "Hasta luego."
      );

      break;

    default:

      console.log(
        "Opcion invalida."
      );
  }

} while (opcion !== 0);