import { ingredient as Ingredient } from '../../models';

// export for create and update
export default function createOrUpdate(recipe, ingredientArray, t) {
  if (!Array.isArray(ingredientArray)) throw new Error('Expected an array for recipe ingredients');

  if (!ingredientArray.length) throw new Error('Recipe ingredients array cannot be empty');
  // remove duplicate ingredients
  const uniqueIngs = [...ingredientArray]
    .reverse()
    .filter((ing, index, arr) =>
      !arr.slice(index + 1)
        .map(obj =>
          Object.keys(obj)[0])
        .includes(Object.keys(ing)[0]));

  return uniqueIngs.reduce((prev, curr) => {
    const ingName = Object.keys(curr)[0];
    const ingQty = curr[ingName];


    return prev.then(() => Ingredient.findOrCreate({
      where: {
        name: ingName,
      },
      transaction: t || null,
    })
      .then(([ing]) => recipe.addIngredient(ing, {
        through: {
          qty: ingQty,
        },
        transaction: t || null,
      })));
  }, Promise.resolve());
}
