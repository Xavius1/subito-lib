/**
 * Suffle the items of an array
 * @param items - The items to shuffle
 * @returns
 *
 * @public
 */
function shuffle(items: unknown[]) {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export default shuffle;
