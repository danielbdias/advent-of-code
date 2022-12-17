import * as fs from 'fs/promises'
import * as path from 'path'

class TerminalCommand {
    executedCommand : string
    argument : string
    output : Array<string>

    constructor(executedCommand : string, argument : string) {
        this.executedCommand = executedCommand
        this.argument = argument
        this.output = new Array<string>()
    }

    addOutputLine(value : string) {
        this.output.push(value)
    }

    static isCommand(value : string) : boolean{
        return value.startsWith('$')
    }
}

class EnvironmentFile {
    name : string
    size : number

    constructor(name : string, size : number) {
        this.name = name
        this.size = size
    }
}

class EnvironmentDirectory {
    name : string
    parentDir : EnvironmentDirectory | null
    files : Array<EnvironmentFile>
    childrenDir : Array<EnvironmentDirectory>

    constructor(name : string, parentDir : EnvironmentDirectory | null) {
        this.name = name
        this.parentDir = parentDir

        this.files = new Array<EnvironmentFile>()
        this.childrenDir = new Array<EnvironmentDirectory>()
    }

    addDir(name: string) {
        this.childrenDir.push(new EnvironmentDirectory(name, this))
    }

    addFile(name: string, size : number) {
        this.files.push(new EnvironmentFile(name, size))
    }

    size() : number {
        const sumOfFileSizes = this.files.reduce((previous, current) => previous + current.size, 0)
        const sumOfChildrenDirSizes = this.childrenDir.reduce((previous, current) => previous + current.size(), 0)

        return sumOfFileSizes + sumOfChildrenDirSizes
    }
}

class TerminalEnvironment {
    fileSystemRoot : EnvironmentDirectory

    constructor() {
        this.fileSystemRoot = new EnvironmentDirectory('/', null)
    }

    executeCommands(commands : Array<TerminalCommand>) {
        // always consider the first command as "cd /"
        let currentDir = this.fileSystemRoot

        for (const command of commands) {
            if (command.executedCommand === 'ls') {
                // process output
                for (const outputLine of command.output) {
                    const [first, second] = outputLine.split(' ')

                    if (first.startsWith('dir')) {
                        currentDir.addDir(second)
                    } else {
                        const fileSize = parseInt(first, 10)
                        currentDir.addFile(second, fileSize)
                    }
                }
            } else if (command.executedCommand === 'cd') {
                const dirName = command.argument

                if (dirName === '..' ) {
                    if (currentDir.parentDir !== null) {
                        currentDir = currentDir.parentDir
                    }
                    // do nothing in case of currentDir === `/` 
                } else {
                    for (const childDir of currentDir.childrenDir) {
                        if (childDir.name === dirName) {
                            currentDir = childDir
                            break
                        }
                    }
                    // do nothing if didn't find dir
                }
            } else {
                throw new Error(`unknown command: ${command.executedCommand}`)
            }
        }
    }

    findDirsByThreshold(size : number) : [Array<EnvironmentDirectory>, Array<EnvironmentDirectory>] {
        const dirsToVisit = new Array<EnvironmentDirectory>()
        
        const dirsBelowThreshold = new Array<EnvironmentDirectory>()
        const dirsAboveThreshold = new Array<EnvironmentDirectory>()

        dirsToVisit.push(this.fileSystemRoot)

        // perform a BFS
        while (dirsToVisit.length !== 0) {
            const dir = dirsToVisit.pop()
            if (!dir) continue

            for (const childDir of dir.childrenDir) {
                dirsToVisit.push(childDir)
            }

            if (dir.size() <= size) {
                dirsBelowThreshold.push(dir)
            } else {
                dirsAboveThreshold.push(dir)
            }
        }

        return [dirsBelowThreshold, dirsAboveThreshold]
    }
}

async function readInput(fileName : string) : Promise<Array<TerminalCommand>> {
    const fileFullPath = path.resolve(__dirname, fileName)
    const result = new Array<TerminalCommand>()

    const fileContent = await fs.readFile(fileFullPath, { encoding: 'utf8' })

    const lines = fileContent.split('\n')

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        
        if (!TerminalCommand.isCommand(line)) {
            throw new Error('Invalid input structure')
        }

        const [_, commandText, argumentText] = line.split(' ')

        const command = new TerminalCommand(commandText, argumentText)

        while (i+1 < lines.length && !TerminalCommand.isCommand(lines[i+1])) {
            command.addOutputLine(lines[i+1])
            i++
        }

        result.push(command)
    }

    return result
}

async function solveProblem01() : Promise<number> {
    const commands = await readInput('input.txt')

    const environment = new TerminalEnvironment()
    environment.executeCommands(commands)

    const [dirsBelowThreshold, _] = environment.findDirsByThreshold(100_000)
    return dirsBelowThreshold.reduce((previous, current) => previous + current.size(), 0)
}

async function solveProblem02() : Promise<number> {
    const commands = await readInput('input.txt')

    const environment = new TerminalEnvironment()
    environment.executeCommands(commands)

    const freeSpace = 70_000_000 - environment.fileSystemRoot.size()
    const spaceToRelease = 30_000_000 - freeSpace

    const [_, dirsAboveThreshold] = environment.findDirsByThreshold(spaceToRelease)
    const sortedDirs = dirsAboveThreshold.sort((a, b) => a.size() - b.size())

    return sortedDirs[0].size()
}

Promise.all([
    solveProblem01(),
    solveProblem02(),    
]).then(([p1Answer, p2Answer]) => {
    console.log(`P1 Answer: ${p1Answer}`)
    console.log(`P2 Answer: ${p2Answer}`)
})
