package main

import (
	"fmt"
	"io/ioutil"
	"strconv"
	"strings"
)

/*
--- Day 2: Password Philosophy ---
Your flight departs in a few days from the coastal airport; the easiest way down to the coast from here is via toboggan.

The shopkeeper at the North Pole Toboggan Rental Shop is having a bad day. "Something's wrong with our computers; we can't log in!" You ask if you can take a look.

Their password database seems to be a little corrupted: some of the passwords wouldn't have been allowed by the Official Toboggan Corporate Policy that was in effect when they were chosen.

To try to debug the problem, they have created a list (your puzzle input) of passwords (according to the corrupted database) and the corporate policy when that password was set.

For example, suppose you have the following list:

1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc
Each line gives the password policy and then the password. The password policy indicates the lowest and highest number of times a given letter must appear for the password to be valid. For example, 1-3 a means that the password must contain a at least 1 time and at most 3 times.

In the above example, 2 passwords are valid. The middle password, cdefg, is not; it contains no instances of b, but needs at least 1. The first and third passwords are valid: they contain one a or nine c, both within the limits of their respective policies.

How many passwords are valid according to their policies?

Your puzzle answer was 418.

--- Part Two ---
While it appears you validated the passwords correctly, they don't seem to be what the Official Toboggan Corporate Authentication System is expecting.

The shopkeeper suddenly realizes that he just accidentally explained the password policy rules from his old job at the sled rental place down the street! The Official Toboggan Corporate Policy actually works a little differently.

Each policy actually describes two positions in the password, where 1 means the first character, 2 means the second character, and so on. (Be careful; Toboggan Corporate Policies have no concept of "index zero"!) Exactly one of these positions must contain the given letter. Other occurrences of the letter are irrelevant for the purposes of policy enforcement.

Given the same example list from above:

1-3 a: abcde is valid: position 1 contains a and position 3 does not.
1-3 b: cdefg is invalid: neither position 1 nor position 3 contains b.
2-9 c: ccccccccc is invalid: both position 2 and position 9 contain c.
How many passwords are valid according to the new interpretation of the policies?

Your puzzle answer was 616.
*/

func check(e error) {
	if e != nil {
		panic(e)
	}
}

// Entry is a struct that represents an entry on input file
type Entry struct {
	lowerBound int
	upperBound int
	letter     string
	password   string
}

func parseEntry(line string) (*Entry, error) {
	values := strings.Split(line, " ")

	if len(values) != 3 {
		return nil, fmt.Errorf("Line should have 3 components, only %d are found", len(values))
	}

	boundsString := values[0]
	letterWithColon := values[1]
	password := values[2]

	bounds := strings.Split(boundsString, "-")

	if len(bounds) != 2 {
		return nil, fmt.Errorf("Letter repetitions in invalid format. It should be in lowerBound-upperBound format. Format found: %s", boundsString)
	}

	lowerBound, err := strconv.Atoi(bounds[0])

	if err != nil {
		return nil, fmt.Errorf("Lower bound is not an integer. Error: %s", err)
	}

	upperBound, err := strconv.Atoi(bounds[1])

	if err != nil {
		return nil, fmt.Errorf("Upper bound is not an integer. Error: %s", err)
	}

	letter := strings.ReplaceAll(letterWithColon, ":", "")

	return &Entry{
		lowerBound: lowerBound,
		upperBound: upperBound,
		letter:     letter,
		password:   password,
	}, nil
}

func readInputAsEntryArray(inputFileName string) ([]*Entry, error) {
	dat, err := ioutil.ReadFile("./input.txt")
	if err != nil {
		return nil, err
	}

	result := []*Entry{}

	lines := strings.Split(string(dat), "\n")

	for i := 0; i < len(lines); i++ {
		line := lines[i]

		entry, err := parseEntry(line)

		if err != nil {
			return nil, fmt.Errorf("Invalid entry on input file. Entry: %s Error: %s", line, err)
		}

		result = append(result, entry)
	}

	return result, nil
}

func checkValidPasswordByRepetition(entry *Entry) bool {
	repetitions := strings.Count(entry.password, entry.letter)

	return (repetitions >= entry.lowerBound && repetitions <= entry.upperBound)
}

func partOne(entries []*Entry) {
	validPasswords := 0

	for i := 0; i < len(entries); i++ {
		entry := entries[i]

		if checkValidPasswordByRepetition(entry) {
			validPasswords++
		}
	}

	fmt.Println(validPasswords)
	// should print 418
}

func checkValidPasswordByPosition(entry *Entry) bool {
	firstIndex := entry.lowerBound - 1
	secondIndex := entry.upperBound - 1

	firstIndexOk := (string(entry.password[firstIndex]) == entry.letter)
	secondIndexOk := (string(entry.password[secondIndex]) == entry.letter)

	return (firstIndexOk || secondIndexOk) && !(firstIndexOk && secondIndexOk)
}

func partTwo(entries []*Entry) {
	validPasswords := 0

	for i := 0; i < len(entries); i++ {
		entry := entries[i]

		if checkValidPasswordByPosition(entry) {
			validPasswords++
		}
	}

	fmt.Println(validPasswords)
	// should print 616
}

func main() {
	entries, err := readInputAsEntryArray("./input.txt")
	check(err)

	partTwo(entries)
}
