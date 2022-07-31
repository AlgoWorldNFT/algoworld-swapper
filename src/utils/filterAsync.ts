export default async function filter(arr: any[], callback: (arg0: any) => any) {
  const fail = Symbol();
  return (
    await Promise.all(
      arr.map(async (item: any) => ((await callback(item)) ? item : fail)),
    )
  ).filter((i) => i !== fail);
}
