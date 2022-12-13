import * as fs from 'fs/promises'
import * as path from 'path'

class Range {
    start : number
    end : number

    constructor(start : number, end : number) {
        this.start = start
        this.end = end
    }

    contains(anotherRange : Range) : boolean {
        return anotherRange.start >= this.start &&
               anotherRange.end <= this.end
    }

    overlaps(anotherRange : Range) : boolean {
        const thisRangeAsArray = this.arrayRange()
        const anotherRangeAsSet = new Set<number>(anotherRange.arrayRange()) 

        const intersection = thisRangeAsArray.filter(item => anotherRangeAsSet.has(item))
        return (intersection.length > 0)
        // return (anotherRange.start <= this.start && this.start <= anotherRange.end) ||
        //        (anotherRange.start <= this.end && this.end <= anotherRange.end)
    }

    arrayRange() : Array<number> {
        const result = new Array<number>()

        for (let i = this.start; i <= this.end; i++) {
            result.push(i)
        }

        return result
    }

    toString() : string {
        return `${this.start}-${this.end}`
    }
}

class RangePair {
    first : Range
    second : Range

    constructor(first : Range, second : Range) {
        this.first = first
        this.second = second
    }
}

function parseRange(value : string) : Range {
    const rangeValues = value.split('-')

    const start = parseInt(rangeValues[0], 10)
    const end = parseInt(rangeValues[1], 10)

    return new Range(start, end)
}

async function readInput(fileName : string) : Promise<Array<RangePair>> {
    const fileFullPath = path.resolve(__dirname, fileName)
    const result = new Array<RangePair>()

    const fileContent = await fs.readFile(fileFullPath, { encoding: 'utf8' })

    const lines = fileContent.split('\n')

    for (const line of lines) {
        const ranges = line.split(',')

        const firstRange = parseRange(ranges[0])
        const secondRange = parseRange(ranges[1])

        result.push(new RangePair(firstRange, secondRange))
    }

    return result
}

async function solveProblem01() : Promise<void> {
    const rangePairs = await readInput('input.txt')

    let result = 0

    for (let i = 0; i < rangePairs.length; i++) {
        const rangePair = rangePairs[i]
        
        if (rangePair.first.contains(rangePair.second) ||
            rangePair.second.contains(rangePair.first)) {
            result++
        }
    }

    console.log(`Answer: ${result}`)
}

async function solveProblem02() : Promise<void> {
    const rangePairs = await readInput('input.txt')

    let result = 0

    for (let i = 0; i < rangePairs.length; i++) {
        const rangePair = rangePairs[i]
        const hasOverlap = rangePair.first.overlaps(rangePair.second)

        if (hasOverlap) {
            result++
        }
    }

    console.log(`Answer: ${result}`)
}

solveProblem01()
    .then(_ => console.log('P1 done!'))

solveProblem02()
    .then(_ => console.log('P2 done!'))