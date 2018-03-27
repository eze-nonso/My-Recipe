import faker from 'faker'


// generate users
export const users = [];
export const recipes = [];
export const reviews = [];
export const ingredients = [];
export const quantities = [];

// populate users(5)
// 5
populate({
  table: users,
  count: 5,
  getData: () => (
    {
      username: faker.internet.userName().slice(0, 50),
      password: faker.internet.password(),
      email: faker.internet.email(),
      created_at: faker.date.between(2017, '2018-02-19T19:45:11.890Z'),
      updated_at: faker.date.recent(),
    }
  ),
  fkey_1: 'username',
})

// populate ingredients(30)
// 30
populate({
  table: ingredients,
  count: 30,
  getData: () => (
    {
      name: faker.lorem.word(),
      created_at: faker.date.between(2017, '2018-02-19T19:45:11.890Z'),
      updated_at: faker.date.recent(),
    }
  ),
  fkey_1: 'name',
})

// populate recipes(20)
// 20
populate({
  table: recipes,
  getData: () => (
    {
      name: faker.lorem.words(),
      direction: faker.lorem.text(),
      per_serving: Math.floor(Math.random() * 4) + 1,
      user_id: Math.floor(Math.random() * 5) + 1,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    }
  ),
  fkey_1: 'name',
  fkey_2: 'direction',
})


// populate reviews
// 20
populate({
  table: reviews,
  getData: () => (
    {
      comment: faker.lorem.paragraphs(),
      star: Math.floor(Math.random() * 5) + 1,
      user_id: Math.floor(Math.random() * 5) + 1,
      recipe_id: Math.floor(Math.random() * 20) + 1,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    }
  ),
  fkey_1: 'user_id',
  fkey_2: 'recipe_id',
})
console.log(reviews)
// populate quantities
// 20 * 30
populate({
  table: quantities,
  count: 20 * 30,
  getData: () => (
    {
      qty: faker.fake('{{random.number(4)}}.{{random.number(5)}} {{lorem.word}}'),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
      ingredient_id: Math.floor(Math.random() * 30) + 1,
      recipe_id: Math.floor(Math.random() * 20) + 1,
    }
  ),
  fkey_1: 'ingredient_id',
  fkey_2: 'recipe_id',
})


function populate(
  {
    table, fkey_1, getData, fkey_2, count = 20,
  }
) {
  function recur() {
    let duplicate;
    let data = getData();

    table.forEach((item) => {
      if (
        data[fkey_1] === item[fkey_1] &&
        (
          fkey_2
          ? data[fkey_2] === item[fkey_2]
          : true
        )
      ) {
        duplicate = true;
      }
    });

    if (!duplicate) {
      table.push(data);
    }

    if (table.length < count) {
      return recur();
    }
  };
  return recur();
}
