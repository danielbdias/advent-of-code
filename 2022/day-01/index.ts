import * as fs from 'fs/promises'
import * as path from 'path'

class FoodPerElf {
    elfId : number
    maxCalories : number

    constructor(elfId : number, food : Array<number>) {
        this.elfId = elfId
        this.maxCalories = food.reduce((previous, current) => (previous + current), 0)
    }
}

function isNumericString(value : string) : boolean {
    const numericRegex = '^[0-9]+$'
    const matches = value.match(numericRegex)
    return (matches != null)
}

async function readInput(fileName : string) : Promise<Array<FoodPerElf>> {
    const fileFullPath = path.resolve(__dirname, fileName)
    const result = new Array<FoodPerElf>()

    const fileContent = await fs.readFile(fileFullPath, { encoding: 'utf8' })

    const lines = fileContent.split('\n')

    let elfID : number = 1
    let food : Array<number> = new Array<number>()

    for (const line of lines) {
        if (!isNumericString(line)) {
            result.push(new FoodPerElf(elfID, food))

            elfID++
            food = new Array<number>()
            continue
        }

        food.push(parseInt(line, 10))
    }

    return result
}

async function solveProblem01() : Promise<void> {
    const foodPerElves = await readInput('input.txt')

    const result = foodPerElves.reduce((previous, current) => Math.max(previous, current.maxCalories), 0)
    console.log(`Answer: ${result}`)
}

async function solveProblem02() : Promise<void> {
    const foodPerElves = await readInput('input.txt')

    // sort in descending order
    const sortedMaxCalories = foodPerElves.map(item => item.maxCalories).sort((a, b) => b - a)

    let answer = (sortedMaxCalories[0] + sortedMaxCalories[1] + sortedMaxCalories[2])
    console.log(`Answer: ${answer}`)
}

solveProblem01()
    .then(_ => console.log('P1 done!'))

solveProblem02()
    .then(_ => console.log('P2 done!'))