const lines = await Deno.readTextFile(
	`${Deno.cwd()}/assets/input.txt`,
).then((text) =>
	text
		.split("\n")
		.filter((line) => line.length > 0)
);

const games = lines.map((line) =>
	line.split(":")?.at(1)?.split("|").map((card) => card.match(/\d+/g)?.map((num) => Number(num)))
);

const winners = games.map((game) => {
	const cards = game?.at(0);
	const check = game?.at(1);

	return cards?.filter((card) => check?.includes(card));
}).filter((game) => game && game?.length > 0);

const score = (arr: number[]) => arr.reduce((sum, _, i) => i < 1 ? 1 : sum * 2, 1);

const solution = winners.map((winner) => score(winner!)).reduce((sum, score) => sum + score, 0);

console.log({ solution });
