import { input } from "../utils.mjs"
import { Usuario } from "../models/usuarios.mjs"
import fs from 'fs/promises';
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pathUsuarios = path.join(__dirname, "../usuarios.csv");

async function obtenerUsuarios() {
       try{
        const contenido = await fs.readFile(pathUsuarios, 'utf-8')
        const usuarios = contenido
            .split('\n')
            .filter(l => l.trim() !== '' && !l.startsWith('ID;'))
            .map(linea =>{
                const [id,nombre,apellido, dni, email] = linea.split(';');
                return {id, nombre, apellido, dni, email};
            });

            if (usuarios.length === 0){
                console.log('No hay usuarios creados por el momento')
            }

            return usuarios;
        } catch {
            console.log("El archivo no existe")
            return [];
        }
}

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

    const usuarios = await obtenerUsuarios();

    let dni
    while (true){
        dni = await input("DNI: ")

        const dniValido = /^\d{7,8}$/.test(dni);
        const dniExiste = usuarios.some(u => u.dni === dni);

        if(!dniValido){
            console.log("DNI inválido!")
        } else if (dniExiste){
            console.log("El DNI ya esta registrado!");
        } else {
            break;
        }
    }

    const exprEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let email
    while (true){
        email = await input("Email: ")
        const emailValido = exprEmail.test(email);

        const emailExiste = usuarios.some(u => u.email.toLowerCase() === email.toLowerCase());

        if(!emailValido){
            console.log("Email inválido!");
        } else if (emailExiste){
            console.log("El email ya esta registrado!");
        } else {
            break;
        }
    }
    const usuario = new Usuario(nombre, apellido, dni, email)
    await usuario.guardar()
    await input("....")
}