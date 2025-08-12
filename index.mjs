import { input } from "./utils.mjs"
import { crearUsuario } from "./menues/crear_user.mjs"
import { listarPosts } from "./menues/listar_posts.mjs"
import { IniciarSesion } from "./menues/inicio_sesion.mjs"

while (true) {
    console.clear()
    console.log("Consola Social")
    console.log(`
        1. Iniciar Sesión
        2. Crear Cuenta
        3. Listar Posts
        4. Salir
        `)

    const opcion = await input(": ")

    if (opcion === "1") {
        await IniciarSesion();
    }
    else if (opcion === "2") {

        await crearUsuario();

    } else if (opcion === "3"){
        await listarPosts();
    }
    else if (opcion === "4") {
      break;
    }else {
        console.log("La opción seleccionada no es válida")
        await input("....")
    }
}

console.clear()
console.log("Bye")