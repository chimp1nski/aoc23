const lines = await Deno.readTextFile(
	`${Deno.cwd()}/assets/input.txt`,
).then((text) =>
	text
		.split("\n")
		.filter((line) => line.length > 0)
);

const parseLine = (line?: string) =>
	line?.match(/\.|[0-9]{1,3}|./igm)
		?.map((char) => !isNaN(Number(char)) ? new Array(char.length).fill(Number(char)) : char)
		.flat() as Array<string | number>;

// Get Current, Previous and Next line.
const parsedLines = lines.map((line, i, arr) => {
	const prev = arr[i - 1] ? parseLine(arr[i - 1]) : undefined;
	const next = arr[i + 1] ? parseLine(arr[i + 1]) : undefined;
	const curr = parseLine(line);

	return ({
		prev,
		curr,
		next,
	});
});

const parsedSymbols = new Set(
	parsedLines.flatMap(({ curr }) => curr.filter((char) => isNaN(Number(char)) && char !== ".")),
);

const checkAdjacency = (
	line: Array<string | number>,
	index: number,
	symbols: Set<string | number>,
) =>
	symbols.has(line.at(index - 1) ?? 0) ||
	symbols.has(line.at(index) ?? 0) ||
	symbols.has(line.at(index + 1) ?? 0);

const solution = parsedLines.flatMap(({ prev, curr, next }) => {
	let lastNumber: number | undefined = undefined;
	return curr.filter((char, i, arr) => {
		const currentNumber = Number(char);
		// Filter the current character if it is NaN
		if (!isNaN(currentNumber)) {
			if (currentNumber === lastNumber) return false;
			const check = checkAdjacency(arr, i, parsedSymbols) || // Check if the current character is adjacent to a symbol
				(prev && checkAdjacency(prev, i, parsedSymbols)) ||
				(next && checkAdjacency(next, i, parsedSymbols));
			if (check) lastNumber = currentNumber;
			return check;
		} else {
			lastNumber = undefined;
			return false;
		}
	}) as Array<number>;
}).reduce((acc, curr) => acc + curr, 0);

console.log({ solution });

const findGears = (i: number, line?: Array<string | number>) => {
	if (!line) return new Set([]);
	const prev = Number(line.at(i - 1));
	const curr = Number(line.at(i));
	const next = Number(line.at(i + 1));
	return new Set([prev, curr, next].filter((val) => !isNaN(val)) ?? []);
};

const gearSymbols = new Set(["*"]);
const gearsets = parsedLines.map(({ prev, curr, next }) =>
	curr.flatMap((char, i) => {
		if (gearSymbols.has(char.toString())) {
			// Check if gear is adjacent to a number on prev or next line
			const gears = new Set([
				...findGears(i, prev)?.values(),
				...findGears(i, curr)?.values(),
				...findGears(i, next)?.values(),
			]);
			return gears.size < 2 ? [] : gears;
		}
		return [];
	}).map((set) => [...set].reduce((acc, curr) => acc * curr, 1))
);

const solution2 = gearsets.flat().reduce((acc, curr) => acc + curr, 0);
console.log({ solution2 });
