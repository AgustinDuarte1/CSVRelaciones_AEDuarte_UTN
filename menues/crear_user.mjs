import { input } from "../utils.mjs"
import { Usuario } from "../models/usuarios.mjs"

export async function crearUsuario () {
    while (true) {
        console.clear()
        console.log("Desea crear un usuario nuevo? (y/n)")
        const opcion = await input(": ")
        if (opcion.toLowerCase() === "y") {
            await crear()
            break
        } else if (opcion.toLowerCase() === "n") {
            break
        }
    }
}


async function crear () {
    console.clear()
    const nombre = await input("Nombre: ")
    const apellido = await input("Apellido: ")

    let dni
    while (true){
        dni = await input("DNI: ")
        if(dni.length >= 7 && dni.length <= 8 && /^\d+$/.test(dni)){
            break
        } else {
            console.log("DNI Inválido!");
        }
    }

    let email
    while (true){
        email = await input("Email: ")
        if(email.includes("@")){
            break
        } else {
            console.log("Email inválido!")
        }
    }
    const usuario = new Usuario(nombre, apellido, dni, email)
    await usuario.guardar()
    await input("....")
}