import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Post{
    static file = path.join(__dirname, '../posts.csv');
    static columns = ['ID', 'UsuarioID', 'Contenido'];

    constructor(usuarioId, contenido){
        this.usuarioId = usuarioId;
        this.contenido = contenido;
    }

    async guardar(){
        let contenidoArchivo = '';

        try{
            await fs.access(Post.file);
            contenidoArchivo = await fs.readFile(Post.file, "utf-8");

            if(contenidoArchivo.trim().length === 0){
                await fs.writeFile(Post.file, Post.columns.join(";") + "\n");
                contenidoArchivo = Post.columns.join(';') + '\n';

            }

        }catch {
            await fs.writeFile(Post.file, Post.columns.join(';') + '\n');
            contenidoArchivo = Post.columns.join(';') + '\n';
            console.log('Error! No existen posts creados');
        }

        const lineas = contenidoArchivo.split('\n').filter(line => line.trim() !== "");
        let nuevoId = 1;

        if(lineas.length > 1){
            const ultimaLinea = lineas[lineas.length - 1];
            if(ultimaLinea){
                const campos = ultimaLinea.split(';');
                const ultimoId = parseInt(campos[0]);
                if(!isNaN(ultimoId)){
                    nuevoId = ultimoId + 1;
                }
            }
        }

        const nuevaLinea = [nuevoId, this.usuarioId, this.contenido].join(";");
        const agregarSalto = lineas.length > 1 ? '\n' : '';
        await fs.appendFile(Post.file, agregarSalto + nuevaLinea);

        console.log(`Post guardado con ID ${nuevoId}`)
    }
}

