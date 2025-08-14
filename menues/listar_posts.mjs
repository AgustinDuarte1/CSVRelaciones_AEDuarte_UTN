import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { input } from "../utils.mjs";
import ora from 'ora';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pathUsuarios = path.join(__dirname, "../usuarios.csv");
const pathPosts = path.join(__dirname, "../posts.csv");

export async function listarPosts() {
    console.clear();
    const spinner = ora('Cargando los posts...').start();
   
    try{
        const newUsers = await fs.readFile(pathUsuarios, 'utf-8');
        const newPosts = await fs.readFile(pathPosts, 'utf-8');

        spinner.succeed("Lista de Posts:");
        
        const usuarios = newUsers
            .split('\n')
            .filter(l => l.trim() !== '' && !l.startsWith('ID;'))
            .map(linea =>{
                const [id,nombre,apellido] = linea.split(';');
                return {id, nombre, apellido};
            });

            const posts = newPosts
            .split('\n')
            .filter(l => l.trim() !== '' && !l.startsWith('ID;'))
            .map(linea =>{
                const [id,usuarioId,contenido] = linea.split(';');
                return {id, usuarioId, contenido};
            });

            if(posts.length === 0){
                console.log('No hay posts creados por el momento. ');
            } else {
            for (const post of posts){
                const usuario = usuarios.find(u => u.id === post.usuarioId);
                const nombreCompleto = usuario
                    ? `${usuario.nombre} ${usuario.apellido}`
                    : 'Usuario no encontrado';
                console.log(` "${post.contenido}" - por ${nombreCompleto}`);
            }
            }
    } catch {
        console.log('Error al listar los posts.');
    }
    console.log('\n');
    await input('Presione ENTER para continuar...')
}