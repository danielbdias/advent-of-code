import * as fs from 'fs/promises'
import * as path from 'path'

function readInput(fileName : string) : Promise<string> {
    const fileFullPath = path.resolve(__dirname, fileName)

    return fs.readFile(fileFullPath, { encoding: 'utf8' })
}

function isStartMarkerPosition(signal : string, position : number, size : number) : boolean {

    for (let i = position - size; i < position; i++) {
        const item = signal[i]
        
        for (let j = i+1; j < position; j++) {
            const anotherItem = signal[j]
            
            if (item == anotherItem) {
                return false
            }
        }
    }

    return true
}

function findStartMarker(signal : string, size : number) : number {
    if (signal.length <= size) return signal.length

    for (let i = size; i < signal.length; i++) {
        if (isStartMarkerPosition(signal, i, size)) {
            return i
        }
    }

    return signal.length
}

function findStartOfPacketMarker(signal : string) : number {
    if (signal.length <= 4) return signal.length

    let first = signal[0]
    let second = signal[1]
    let third = signal[2]
    let fourth = signal[3]
    
    for (let i = 4; i < signal.length; i++) {
        if (first != second && first != third && first != fourth &&
            second != third && second != fourth &&
            third != fourth) {
            return i
        }

        first = second
        second = third
        third = fourth
        fourth = signal[i]
    }

    return signal.length
}

async function solveProblem01() : Promise<void> {
    const signal = await readInput('input.txt')

    // const result = findStartOfPacketMarker(signal)
    const result = findStartMarker(signal, 4)

    console.log(`Answer: ${result}`)
}

async function solveProblem02() : Promise<void> {
    const signal = await readInput('input.txt')

    const result = findStartMarker(signal, 14)

    console.log(`Answer: ${result}`)
}

solveProblem01()
    .then(_ => console.log('P1 done!'))

solveProblem02()
    .then(_ => console.log('P2 done!'))