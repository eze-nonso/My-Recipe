import faker from 'faker'


// generate users
export const users = [];
export const recipes = [];
export const reviews = [];
export const ingredients = [];
export const quantities = [];

// populate users(5)
for (let i = 0; i <= 4; i ++) {

  users.push({
    username: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    created_at: faker.date.between(2017, '2018-02-19T19:45:11.890Z'),
    updated_at: faker.date.recent(),
  });

}

// populate ingredients(30)
for (let i = 0; i <= 29; i ++) {
  ingredients.push(faker.lorem.word());
}

// populate recipes(20)
for (let j = 0; j <= 19; j ++) {
  recipes.push({
    name: faker.lorem.words(),
    direction: faker.lorem.text(),
    per_serving: faker.random.number(4),
    user_id: Math.floor(Math.random() * 5) + 1,
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),

  })
}

// populate reviews
populate({
  table: reviews,
  getData: () => (
    {
      comment: faker.lorem.paragraphs(),
      star: faker.random.number(5),
      user_id: faker.random.number(5),
      recipe_id: faker.random.number(20),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    }
  ),
  fkey_1: 'user_id',
  fkey_2: 'recipe_id',
})

// populate quantities
populate({
  table: quantities,
  getData: () => (
    {
      qty: faker.fake('{{random.number(4)}}.{{random.number(5)}} {{lorem.word}}'),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
      ingredient_id: faker.random.number(30),
      recipe_id: faker.random.number(20),
    }
  ),
  fkey_1: 'ingredient_id',
  fkey_2: 'recipe_id',
})


function populate(
  {
    table, count = 20, fkey_1, fkey_2, getData,
  }
) {
  const recur = () => {
    let duplicate;
    let data = getData();

    table.forEach((item) => {
      if (data[fkey_1] === item[fkey_1] && data[fkey_2] === item[fkey_2]) duplicate = true;
    });

    if (duplicate) return recur();
    table.push(data);
    if (table.length >= count) return;
  };
  recur();
}
