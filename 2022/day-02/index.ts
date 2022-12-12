import * as fs from 'fs/promises'
import * as path from 'path'

enum RockPaperScissor {
    Rock = 1,
    Paper = 2,
    Scissor = 3
}

class RockPaperScissorRound {
    yourPlay : RockPaperScissor
    opponentPlay : RockPaperScissor

    constructor(yourPlay : RockPaperScissor, opponentPlay : RockPaperScissor) {
        this.yourPlay = yourPlay
        this.opponentPlay = opponentPlay
    }

    score() : number {
        const yourPlayPoints = (this.yourPlay as number)
        const opponentPlayPoints = (this.opponentPlay as number)

        if (yourPlayPoints === opponentPlayPoints) {
            return 3 + yourPlayPoints //draw
        } else if ((this.yourPlay === RockPaperScissor.Rock && this.opponentPlay === RockPaperScissor.Scissor) ||
                   (this.yourPlay === RockPaperScissor.Paper && this.opponentPlay === RockPaperScissor.Rock) ||
                   (this.yourPlay === RockPaperScissor.Scissor && this.opponentPlay === RockPaperScissor.Paper)) {
            return 6 + yourPlayPoints //won
        }

        return 0 + yourPlayPoints //lose
    }
}

function convertPlay(value : string) : RockPaperScissor {
    switch (value) {
        case 'A':
        case 'X':
            return RockPaperScissor.Rock
        case 'B':
        case 'Y':
            return RockPaperScissor.Paper
        case 'C':
        case 'Z':
            return RockPaperScissor.Scissor
        default:
            throw new Error(`Invalid value: ${value}`)
    }
}

function inferPlay(opponentPlay : RockPaperScissor, code : string) : RockPaperScissor {
    if (code === 'X') { // lose
        switch (opponentPlay) {
            case RockPaperScissor.Paper:
                return RockPaperScissor.Rock
            case RockPaperScissor.Rock:
                return RockPaperScissor.Scissor
            case RockPaperScissor.Scissor:
                return RockPaperScissor.Paper
            default:
                throw new Error(`Invalid play: ${opponentPlay}`)
        }
    } else if (code === 'Y') { // draw
        return opponentPlay
    }

    switch (opponentPlay) {
        case RockPaperScissor.Paper:
            return RockPaperScissor.Scissor
        case RockPaperScissor.Rock:
            return RockPaperScissor.Paper
        case RockPaperScissor.Scissor:
            return RockPaperScissor.Rock
        default:
            throw new Error(`Invalid play: ${opponentPlay}`)
    }
}

async function readInput(fileName : string, parseRound : (a:string, b:string) => RockPaperScissorRound) : Promise<Array<RockPaperScissorRound>> {
    const fileFullPath = path.resolve(__dirname, fileName)
    const result = new Array<RockPaperScissorRound>()

    const fileContent = await fs.readFile(fileFullPath, { encoding: 'utf8' })

    const lines = fileContent.split('\n')

    for (const line of lines) {
        const plays = line.split(' ')
        result.push(parseRound(plays[0], plays[1]))
    }

    return result
}

function parseRoundForP1(opponentPlay : string, yourPlay : string) : RockPaperScissorRound {
    return new RockPaperScissorRound(
        convertPlay(yourPlay),
        convertPlay(opponentPlay)
    )
}

function parseRoundForP2(opponentPlay : string, yourPlay : string) : RockPaperScissorRound {
    const convertedOpponentPlay = convertPlay(opponentPlay)

    return new RockPaperScissorRound(
        inferPlay(convertedOpponentPlay, yourPlay),
        convertedOpponentPlay
    )
}

async function solveProblem01() : Promise<void> {
    const rounds = await readInput('input.txt', parseRoundForP1)

    const totalScore = rounds.reduce((previous, current) => previous + current.score(), 0)
    console.log(`Answer: ${totalScore}`)
}

async function solveProblem02() : Promise<void> {
    const rounds = await readInput('input.txt', parseRoundForP2)

    const totalScore = rounds.reduce((previous, current) => previous + current.score(), 0)
    console.log(`Answer: ${totalScore}`)
}

solveProblem01()
    .then(_ => console.log('P1 done!'))

solveProblem02()
    .then(_ => console.log('P2 done!'))