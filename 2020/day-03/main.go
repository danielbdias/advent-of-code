package main

import (
	"fmt"
	"io/ioutil"
	"strings"
)

/*
With the toboggan login problems resolved, you set off toward the airport. While travel by toboggan might be easy, it's certainly not safe: there's very minimal steering and the area is covered in trees. You'll need to see which angles will take you near the fewest trees.

Due to the local geology, trees in this area only grow on exact integer coordinates in a grid. You make a map (your puzzle input) of the open squares (.) and trees (#) you can see. For example:

..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#
These aren't the only trees, though; due to something you read about once involving arboreal genetics and biome stability, the same pattern repeats to the right many times:

..##.........##.........##.........##.........##.........##.......  --->
#...#...#..#...#...#..#...#...#..#...#...#..#...#...#..#...#...#..
.#....#..#..#....#..#..#....#..#..#....#..#..#....#..#..#....#..#.
..#.#...#.#..#.#...#.#..#.#...#.#..#.#...#.#..#.#...#.#..#.#...#.#
.#...##..#..#...##..#..#...##..#..#...##..#..#...##..#..#...##..#.
..#.##.......#.##.......#.##.......#.##.......#.##.......#.##.....  --->
.#.#.#....#.#.#.#....#.#.#.#....#.#.#.#....#.#.#.#....#.#.#.#....#
.#........#.#........#.#........#.#........#.#........#.#........#
#.##...#...#.##...#...#.##...#...#.##...#...#.##...#...#.##...#...
#...##....##...##....##...##....##...##....##...##....##...##....#
.#..#...#.#.#..#...#.#.#..#...#.#.#..#...#.#.#..#...#.#.#..#...#.#  --->
You start on the open square (.) in the top-left corner and need to reach the bottom (below the bottom-most row on your map).

The toboggan can only follow a few specific slopes (you opted for a cheaper model that prefers rational numbers); start by counting all the trees you would encounter for the slope right 3, down 1:

From your starting position at the top-left, check the position that is right 3 and down 1. Then, check the position that is right 3 and down 1 from there, and so on until you go past the bottom of the map.

The locations you'd check in the above example are marked here with O where there was an open square and X where there was a tree:

..##.........##.........##.........##.........##.........##.......  --->
#..O#...#..#...#...#..#...#...#..#...#...#..#...#...#..#...#...#..
.#....X..#..#....#..#..#....#..#..#....#..#..#....#..#..#....#..#.
..#.#...#O#..#.#...#.#..#.#...#.#..#.#...#.#..#.#...#.#..#.#...#.#
.#...##..#..X...##..#..#...##..#..#...##..#..#...##..#..#...##..#.
..#.##.......#.X#.......#.##.......#.##.......#.##.......#.##.....  --->
.#.#.#....#.#.#.#.O..#.#.#.#....#.#.#.#....#.#.#.#....#.#.#.#....#
.#........#.#........X.#........#.#........#.#........#.#........#
#.##...#...#.##...#...#.X#...#...#.##...#...#.##...#...#.##...#...
#...##....##...##....##...#X....##...##....##...##....##...##....#
.#..#...#.#.#..#...#.#.#..#...X.#.#..#...#.#.#..#...#.#.#..#...#.#  --->
In this example, traversing the map using this slope would cause you to encounter 7 trees.

Starting at the top-left corner of your map and following a slope of right 3 and down 1, how many trees would you encounter?

Your puzzle answer was 198.

--- Part Two ---
Time to check the rest of the slopes - you need to minimize the probability of a sudden arboreal stop, after all.

Determine the number of trees you would encounter if, for each of the following slopes, you start at the top-left corner and traverse the map all the way to the bottom:

Right 1, down 1.
Right 3, down 1. (This is the slope you already checked.)
Right 5, down 1.
Right 7, down 1.
Right 1, down 2.
In the above example, these slopes would find 2, 7, 3, 4, and 2 tree(s) respectively; multiplied together, these produce the answer 336.

What do you get if you multiply together the number of trees encountered on each of the listed slopes?

Your puzzle answer was 5140884672.
*/

func check(e error) {
	if e != nil {
		panic(e)
	}
}

type slopeSpec struct {
	right int
	down  int
}

func readInputAsEntryArray(inputFileName string) ([][]bool, error) {
	dat, err := ioutil.ReadFile("./input.txt")
	if err != nil {
		return nil, err
	}

	result := [][]bool{}

	lines := strings.Split(string(dat), "\n")

	for i := 0; i < len(lines); i++ {
		line := lines[i]

		lineAsBoolArray := []bool{}

		for _, letter := range line {
			hasTree := (string(letter) == "#")
			lineAsBoolArray = append(lineAsBoolArray, hasTree)
		}

		result = append(result, lineAsBoolArray)
	}

	return result, nil
}

func countTreesInTobogganRoute(treeMap [][]bool, spec slopeSpec) int {
	pathSize := len(treeMap)
	patternSize := len(treeMap[0])
	treesFound := 0

	// skip the first line
	for i := 1; i < pathSize; i++ {
		// position to analize if treeMap was complete (with redundant data) and considering 0-indexed array
		cellRightPosition := (i * spec.right)

		// position considering the patterns
		cellRightPositionInPattern := (cellRightPosition % patternSize)

		cellDownPosition := (i * spec.down)

		if cellDownPosition > pathSize {
			break
		}

		if treeMap[cellDownPosition][cellRightPositionInPattern] {
			treesFound++
		}
	}

	return treesFound
}

func partOne(treeMap [][]bool) {
	spec := slopeSpec{right: 3, down: 1}

	treesFound := countTreesInTobogganRoute(treeMap, spec)
	fmt.Println(treesFound) // should print 198
}

func partTwo(treeMap [][]bool) {
	specs := []slopeSpec{
		slopeSpec{right: 1, down: 1},
		slopeSpec{right: 3, down: 1},
		slopeSpec{right: 5, down: 1},
		slopeSpec{right: 7, down: 1},
		slopeSpec{right: 1, down: 2},
	}

	result := 1

	for _, spec := range specs {
		treesFound := countTreesInTobogganRoute(treeMap, spec)
		result *= treesFound
	}

	fmt.Println(result) // should print 5140884672
}

func main() {
	treeMap, err := readInputAsEntryArray("./input.txt")
	check(err)

	partTwo(treeMap)
}
