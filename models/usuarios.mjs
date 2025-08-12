import fs from "fs/promises"
import path from "path"
import { fileURLToPath  } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Usuario {

    static file = path.join(__dirname, '../usuarios.csv');
    static columns = ["ID", "Nombre", "Apellido", "DNI", "Email"]
    constructor (nombre, apellido, dni, email) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.email = email;
    }

    async guardar () {
        let contenido = '';

        try{
            await fs.access(Usuario.file);
            contenido = await fs.readFile(Usuario.file, 'utf-8');
            //Si esta vacío, escribe la cabecera
            
            if(contenido.trim().length === 0){
                await fs.writeFile(Usuario.file, Usuario.columns.join(';') + '\n' );
                contenido = Usuario.columns.join(';') + '\n';
            }
        } catch {
            await fs.writeFile(Usuario.file, Usuario.columns.join(';') + '\n');
            contenido = Usuario.columns.join(';');
        }

        const lineas = contenido.split('\n').filter(line => line.trim() !== '');
        
        let nuevoId = 1;
        if(lineas.length > 1){

            const ultimaLinea = lineas[lineas.length - 1];
            if(ultimaLinea){
            const campos = ultimaLinea.split(';');
            const ultimoId = parseInt(campos[0]);
            if (!isNaN(ultimoId)){
                nuevoId = ultimoId + 1;
            }
        }
    }

        const nuevaLinea = [nuevoId, this.nombre, this.apellido, this.dni, this.email].join(';');
        const agregarSalto = lineas.length > 1 ? '\n' : '';
        await fs.appendFile(Usuario.file, agregarSalto + nuevaLinea);

        console.log(`Usuario guardado con ID ${nuevoId}`);
    }
}