import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { input } from "../utils.mjs";
import { Post } from "../models/posts.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pathUsuarios = path.join(__dirname, "../usuarios.csv");
const pathPosts = path.join(__dirname, "../posts.csv");

export async function IniciarSesion() {
    console.clear();
    console.log('Iniciar sesión: ');

    const nombre = (await input("Nombre: ")).trim();
    const apellido = (await input("Apellido: ")).trim();

    let usuario;

    try{
        const data = await fs.readFile(pathUsuarios, 'utf-8');
        const lineas = data.split("\n").filter(line=>line.trim() !== "" && !line.startsWith("ID;"));

        for(const linea of lineas){
            const[id, nom, ape] = linea.split(";");
            if(nom === nombre && ape === apellido){
                usuario = {id, nombre: nom, apellido: ape};
                break;
            }
        }

        if(!usuario){
            console.log("Usuario no encontrado");
            await input("Presione ENTER para continuar...");
            return;
        }

        while(true){
            console.clear();
            console.log(`Sesión iniciada: ${usuario.nombre} ${usuario.apellido}`);
            console.log(`
            1. Crear Post
            2. Ver Mis Posts
            3. Eliminar Post
            4. Cerrar Sesión`);
        

        const opcion = await input(": ");

        if(opcion === "1"){
            await crearPost(usuario.id);
        }
        else if(opcion === "2"){
            await verPosts(usuario.id);
        } else if(opcion === "3"){
            await eliminarPost(usuario.id);
        } else if(opcion === "4"){
            console.log("Cerrando sesión...");
            await input ("Presione ENTER");
            break;
        } else {
            console.log("Opción inválida.");
            await input("Presione ENTER...");
        }
        
    }

    } catch {
        console.log("Error al iniciar sesión.")
        await input("Presione ENTER para continuar...")
    }
}

async function crearPost(usuarioId) {
    console.clear();
    console.log("Crear un nuevo post");

    const contenido = await input("Contenido del post: ");

    const post = new Post(usuarioId, contenido);
    await post.guardar();

    await input("Presione ENTER para continuar... ");
}

async function verPosts(userId) {
    try{
        const data = await fs.readFile(pathPosts, 'utf-8');
        const lineas = data.split('\n').filter(line => line.trim() !== "" && !line.startsWith("ID;"));
        const posts = lineas
            .map(line => line.split(";"))
            .filter(p => p[1] === userId);
        
        if (posts.length === 0){
            console.log("No tenes posts todavía.");
        } else {
            console.log("Tus posts: ");
            posts.forEach(([id, , contenido]) => {
                console.log(`ID ${id}: ${contenido}`)
            });
        }
    }catch {
        console.log("Error al leer los posts.")
    }
    await input("Presione ENTER para continuar...");
}


async function eliminarPost(userId) {
    const idEliminar = await input("ID del post a eliminar: ");
    try{
        const data = await fs.readFile(pathPosts, 'utf-8');
        const lineas = data.split("\n");

        const encabezado = lineas[0];
        const cuerpoOriginal = lineas.slice(1);

        const cuerpoFiltrado = cuerpoOriginal.filter(line => {
            const [id, uid] = line.split(";");
            return !(id === idEliminar && uid === userId);
        });

        if(cuerpoOriginal.length === cuerpoFiltrado.length){
            console.log("El ID no existe o no pertenece a este usuario.")
        } else {
        const nuevoContenido = [encabezado, ...cuerpoFiltrado].join("\n");
        await fs.writeFile(pathPosts, nuevoContenido);

        console.log("Post eliminado con éxito");
        }

    }catch (error){
        console.log("Error al eliminar el post");
    }
    await input("Presione ENTER para continuar...");
}