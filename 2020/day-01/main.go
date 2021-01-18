package main

import (
	"fmt"
	"io/ioutil"
	"strconv"
	"strings"
)

/*
--- Day 1: Report Repair ---
After saving Christmas five years in a row, you've decided to take a vacation at a nice resort on a tropical island. Surely, Christmas will go on without you.

The tropical island has its own currency and is entirely cash-only. The gold coins used there have a little picture of a starfish; the locals just call them stars. None of the currency exchanges seem to have heard of them, but somehow, you'll need to find fifty of these coins by the time you arrive so you can pay the deposit on your room.

To save your vacation, you need to get all fifty stars by December 25th.

Collect stars by solving puzzles. Two puzzles will be made available on each day in the Advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!

Before you leave, the Elves in accounting just need you to fix your expense report (your puzzle input); apparently, something isn't quite adding up.

Specifically, they need you to find the two entries that sum to 2020 and then multiply those two numbers together.

For example, suppose your expense report contained the following:

1721
979
366
299
675
1456
In this list, the two entries that sum to 2020 are 1721 and 299. Multiplying them together produces 1721 * 299 = 514579, so the correct answer is 514579.

Of course, your expense report is much larger. Find the two entries that sum to 2020; what do you get if you multiply them together?

Your puzzle answer was 471019.

--- Part Two ---
The Elves in accounting are thankful for your help; one of them even offers you a starfish coin they had left over from a past vacation. They offer you a second one if you can find three numbers in your expense report that meet the same criteria.

Using the above example again, the three entries that sum to 2020 are 979, 366, and 675. Multiplying them together produces the answer, 241861950.

In your expense report, what is the product of the three entries that sum to 2020?

Your puzzle answer was 103927824.


*/

// TARGET value that should be found
const TARGET = 2020

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func readInputAsIntArray(inputFileName string) ([]int, error) {
	dat, err := ioutil.ReadFile("./input.txt")
	if err != nil {
		return nil, err
	}

	result := []int{}

	lines := strings.Split(string(dat), "\n")

	for i := 0; i < len(lines); i++ {
		line := lines[i]
		value, err := strconv.Atoi(line)

		if err != nil {
			return nil, err
		}

		result = append(result, value)
	}

	return result, nil
}

func naiveSearchForTwoValues(values []int, target int) (int, int) {
	numberOfValues := len(values)

	if numberOfValues < 2 {
		return -1, -1
	}

	for i := 0; i < (numberOfValues - 1); i++ {
		firstValue := values[i]

		for j := (i + 1); j < numberOfValues; j++ {
			secondValue := values[j]

			if (firstValue + secondValue) == target {
				return firstValue, secondValue
			}
		}
	}

	return -1, -1
}

func naiveSearchForThreeValues(values []int, target int) (int, int, int) {
	numberOfValues := len(values)

	if numberOfValues < 3 {
		return -1, -1, -1
	}

	for i := 0; i < (numberOfValues - 2); i++ {
		firstValue := values[i]

		for j := (i + 1); j < (numberOfValues - 1); j++ {
			secondValue := values[j]

			for k := (i + 2); k < numberOfValues; k++ {
				thirdValue := values[k]

				if (firstValue + secondValue + thirdValue) == target {
					return firstValue, secondValue, thirdValue
				}
			}
		}
	}

	return -1, -1, -1
}

func partOne(values []int) {
	firstValue, secondValue := naiveSearchForTwoValues(values, TARGET)

	fmt.Println(firstValue * secondValue)
	// should be 471019
}

func partTwo(values []int) {
	firstValue, secondValue, thirdValue := naiveSearchForThreeValues(values, TARGET)

	fmt.Println(firstValue * secondValue * thirdValue)
	// should be 103927824
}

func main() {
	values, err := readInputAsIntArray("./input.txt")
	check(err)

	partTwo(values)
}
