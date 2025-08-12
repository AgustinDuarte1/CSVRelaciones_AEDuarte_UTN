import readline from 'readline'

export function input (texto) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    return new Promise(resolve => {
        rl.question(texto, (res) => {
            resolve(res)
            rl.close()
        })
    })
}