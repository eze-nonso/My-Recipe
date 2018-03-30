import faker from 'faker';

/**
 * function for generating unique data arrays
 *
 * @param {object} param1
 * @param {function} param1.getData
 * @param {string} param1.fKey1
 * @param {string} param1.fkey2
 * @param {number | 20} param1.count
 *
 * @return {array} unique(fKey1 & fKey2) data array
 */
function populate({
  fKey1, getData, fKey2, count = 20,
}) {
  const table = [];
  /**
   *
   * @return {array} recursively populate outer scope array
   */
  function recur() {
    let duplicate;
    const data = getData();

    table.forEach((item) => {
      if (
        data[fKey1] === item[fKey1] &&
        (
          fKey2
            ? data[fKey2] === item[fKey2]
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

    return table;
  }
  return recur();
}


// populate users(5)
// 5
export const users = populate({
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
  fKey1: 'username',
});

// populate ingredients(30)
// 30
export const ingredients = populate({
  count: 30,
  getData: () => (
    {
      name: faker.lorem.word(),
      created_at: faker.date.between(2017, '2018-02-19T19:45:11.890Z'),
      updated_at: faker.date.recent(),
    }
  ),
  fKey1: 'name',
});

// populate recipes(20)
// 20
export const recipes = populate({
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
  fKey1: 'name',
  fKey2: 'direction',
});


// populate reviews
// 35
export const reviews = populate({
  count: 35,
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
  fKey1: 'user_id',
  fKey2: 'recipe_id',
});

// populate quantities
// 20 * 30
export const quantities = populate({
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
  fKey1: 'ingredient_id',
  fKey2: 'recipe_id',
});
