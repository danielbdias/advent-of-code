import * as fs from 'fs/promises'
import * as path from 'path'

const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const lowerCaseLettersSet = new Set('abcdefghijklmnopqrstuvwxyz')

class Rucksack {
    firstCompartmentItems : Set<string>
    secondCompartmentItems : Set<string>
    totalItems : Set<string>

    constructor(firstCompartment : string, secondCompartment : string) {
        this.firstCompartmentItems = new Set(firstCompartment)
        this.secondCompartmentItems = new Set(secondCompartment)

        this.totalItems = new Set(`${firstCompartment}${secondCompartment}`)
    }

    typeInBothCompartments() : string {
        const intersection = [...this.firstCompartmentItems].filter(item => this.secondCompartmentItems.has(item))
        return intersection[0]
    }
}

function priority(item : string) : number {
    if (lowerCaseLettersSet.has(item)) {
        return lowerCaseLetters.indexOf(item) + 1
    }

    return upperCaseLetters.indexOf(item) + 27
}

async function readInput(fileName : string) : Promise<Array<Rucksack>> {
    const fileFullPath = path.resolve(__dirname, fileName)
    const result = new Array<Rucksack>()

    const fileContent = await fs.readFile(fileFullPath, { encoding: 'utf8' })

    const lines = fileContent.split('\n')

    for (const line of lines) {
        const compartmentSize = line.length / 2

        const firstCompartment = line.substring(0, compartmentSize)
        const secondCompartment = line.substring(compartmentSize)

        result.push(new Rucksack(firstCompartment, secondCompartment))
    }

    return result
}

async function solveProblem01() : Promise<void> {
    const rucksacks = await readInput('input.txt')

    const result = rucksacks.reduce((previous, current) => previous + priority(current.typeInBothCompartments()), 0)
    console.log(`Answer: ${result}`)
}

function findCommonBadgeInRucksacks(first : Rucksack, second : Rucksack, third : Rucksack) : string {
    const intersection = [...first.totalItems]
                            .filter(item => second.totalItems.has(item))
                            .filter(item => third.totalItems.has(item))

    return intersection[0]
}

async function solveProblem02() : Promise<void> {
    const rucksacks = await readInput('input.txt')

    let result = 0

    for (let i = 0; i < rucksacks.length; i+=3) {
        const first = rucksacks[i]
        const second = rucksacks[i+1]
        const third = rucksacks[i+2]
     
        const badge = findCommonBadgeInRucksacks(first, second, third)
        result += priority(badge)
    }
    
    console.log(`Answer: ${result}`)
}

solveProblem01()
    .then(_ => console.log('P1 done!'))
solveProblem02()
    .then(_ => console.log('P1 done!'))