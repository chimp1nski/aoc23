const lines = await Deno.readTextFile(
  `./assets/subset.txt`,
).then((text) =>
  text
    .split("\n")
    .filter((line) => line.length > 0)
);

const games = lines.map((line) => {
  const id = Number(line.match(/(?<=[gG]ame\s)[0-9]*/gmi)?.at(0));
  const values = line.split(";").map((set) => {
    const r = Number(set.match(/(?=([0-9]*\sred))[0-9]*/gmi)?.at(0) ?? 0);
    const g = Number(set.match(/(?=([0-9]*\sgreen))[0-9]*/gmi)?.at(0) ?? 0);
    const b = Number(set.match(/(?=([0-9]*\sblue))[0-9]*/gmi)?.at(0) ?? 0);

    return [r, g, b];
  });

  return {
    id,
    values,
  };
});

const highest = games.map(({ id, values }) => ({
  id,
  values: values.reduce((acc, curr) => {
    return acc.map((val, i) => Math.max(val, curr[i]));
  }, [0, 0, 0]),
}));

const target = [12, 13, 14];
const valid = highest.filter(({ values }) =>
  values.every((val, i) => val <= target.at(i)!)
);

const solution = valid.reduce((acc, curr) => acc + curr.id, 0);

console.log({ solution });

const solution2 = highest.map(({ values }) =>
  values.reduce((acc, curr) => {
    if (acc === 0) return 1;
    if (curr === 0) return acc;
    return acc * curr;
  })
).reduce((acc, curr) => acc + curr);

console.log({ solution2 });
