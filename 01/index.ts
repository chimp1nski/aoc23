const lines = await Deno.readTextFile(
  `./assets/input.txt`,
).then((text) =>
  text
    .split("\n")
    .filter((line) => line.length > 0)
);

const solution = [...lines]
  .map((line) =>
    line
      .split("")
      .filter(
        (char) => !isNaN(Number(char)),
      )
      .filter((_val, i, arr) => (i === 0 || i === arr.length - 1))
      .join("")
  ).map((str) => str.length === 1 ? `${str}${str}` : str)
  .map((char) => Number(char))
  .reduce((
    acc,
    curr,
  ) => acc + curr);
console.log({ solution });

const DICT = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
] as const;

// Rexexp to match all numbers as well as all DICT substrings
const regex = new RegExp(
  `(?=(${DICT.join("|")}|[0-9]))`,
  "gmi",
);
const solution2 = [...lines]
  .map((line) => {
    const matches = [...line.matchAll(regex)]
      .map((match) => {
        const raw = match.at(1) as typeof DICT[number];
        if (DICT.includes(raw)) {
          if (raw !== "zero") raw;
          return DICT.indexOf(raw);
        } else {
          return Number(raw);
        }
      });
    if (matches.length === 1) {
      return Number([...matches, ...matches].join(""));
    } else {
      return Number([matches[0], matches[matches.length - 1]].join(""));
    }
  })
  .reduce((
    acc,
    curr,
  ) => acc + curr);

//

console.log({ solution2 });
