import * as fs from 'fs/promises'
import * as path from 'path'

function isNumericString(value : string) : boolean {
    const numericRegex = '^[0-9]+$'
    const matches = value.match(numericRegex)
    return (matches != null)
}

class CraneEnvironment {
    private environment : Map<number, Array<string>>
    private stackIds : Array<number>

    constructor(environment : Map<number, Array<string>>) {
        this.environment = environment

        this.stackIds = new Array<number>()
        for (const stack of environment.keys()) {
            this.stackIds.push(stack)
        }
    }

    executeCrateMover9000Command(command : CraneCommand) {
        if (!this.environment.has(command.origin)) {
            throw new Error(`stack ${command.origin} not found`)
        } else if (!this.environment.has(command.destination)) {
            throw new Error(`stack ${command.destination} not found`)
        }

        const originBoxes = this.environment.get(command.origin)
        const destinationBoxes = this.environment.get(command.destination)

        for (let i = 0; i < command.quantity; i++) {
            const box = originBoxes?.pop()
            if (!box) break

            destinationBoxes?.push(box)
        }
    }

    executeCrateMover9001Command(command : CraneCommand) {
        if (!this.environment.has(command.origin)) {
            throw new Error(`stack ${command.origin} not found`)
        } else if (!this.environment.has(command.destination)) {
            throw new Error(`stack ${command.destination} not found`)
        }

        const originBoxes = this.environment.get(command.origin)
        const destinationBoxes = this.environment.get(command.destination)

        const batch = originBoxes?.splice(-command.quantity)
        if (!batch) return

        destinationBoxes?.push(...batch)
    }

    stacks() : Array<number> {
        return this.stackIds
    }

    cranesInStack(stack : number) : Array<string> {
        if (!this.environment.has(stack)) {
            throw new Error(`stack ${stack} not found`)
        }

        return this.environment.get(stack) as Array<string>
    }

    topOfstack(stack : number) : string {
        if (!this.environment.has(stack)) {
            throw new Error(`stack ${stack} not found`)
        }

        const stackBoxes = this.environment.get(stack) as Array<string>
        return stackBoxes[stackBoxes.length-1]
    }

    message() : string {
        let result = ""

        for (const stack of this.stackIds) {
            result += this.topOfstack(stack)
        }

        return result
    }

    static parse(environmentLines : Array<string>) : CraneEnvironment {
        const environment = new Map<number, Array<string>>()
    
        const lastLine = environmentLines[environmentLines.length - 1]
        for (let i = 0; i < lastLine.length; i++) {
            const character = lastLine[i]
            
            if (!isNumericString(character)) continue
    
            const craneId = parseInt(character, 10)
            const boxes = new Array<string>()
    
            for (let j = environmentLines.length - 2; j >= 0; j--) {
                const boxId = environmentLines[j][i]
    
                if (boxId === ' ') break
                boxes.push(boxId)
            }
    
            environment.set(craneId, boxes)
        }
    
        return new CraneEnvironment(environment)
    }
}

class CraneCommand {
    quantity : number
    origin : number
    destination : number

    constructor(quantity : number, origin : number, destination : number) {
        this.quantity = quantity
        this.origin = origin
        this.destination = destination
    }

    static parse(value : string) : CraneCommand {
        const matches = value.match(/move (?<quantity>\d+) from (?<origin>\d+) to (?<destination>\d+)/i)

        if (matches?.length !== 4) { //the entire string plus each match
            throw new Error(`invalid value "${value}" to parse`)
        }

        const quantity = parseInt(matches[1], 10)
        const origin = parseInt(matches[2], 10)
        const destination = parseInt(matches[3], 10)

        return new CraneCommand(quantity, origin, destination)
    }
}

async function readInput(fileName : string) : Promise<[CraneEnvironment, Array<CraneCommand>]> {
    const fileFullPath = path.resolve(__dirname, fileName)
    const fileContent = await fs.readFile(fileFullPath, { encoding: 'utf8' })

    const lines = fileContent.split('\n')

    const environmentLines = new Array<string>()
    const commandLines = new Array<string>()
    let foundSplit = false

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        
        if (line === '') {
            foundSplit = true
            continue
        }

        if (!foundSplit) {
            environmentLines.push(line)
        } else {
            commandLines.push(line)
        }
    }

    const environment = CraneEnvironment.parse(environmentLines)
    const commands = commandLines.map(line => CraneCommand.parse(line))

    return [environment, commands]
}

async function solveProblem01() : Promise<void> {
    const [environment, commands] = await readInput('input.txt')

    for (const command of commands) {
        environment.executeCrateMover9000Command(command)
    }

    console.log(`Answer: ${environment.message()}`)
}

async function solveProblem02() : Promise<void> {
    const [environment, commands] = await readInput('input.txt')

    for (const command of commands) {
        environment.executeCrateMover9001Command(command)
    }

    console.log(`Answer: ${environment.message()}`)
}

solveProblem01()
    .then(_ => console.log('P1 done!'))

solveProblem02()
    .then(_ => console.log('P2 done!'))