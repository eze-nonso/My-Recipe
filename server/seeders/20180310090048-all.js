export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert('users', [{
      username: 'johnbulky',
      password: 'a4155',
      email: 'hippy@saed.com',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      username: 'maryjane',
      password: '1432ab',
      email: 'bantywanty@cool.com',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      username: 'dennypanny',
      password: '1616',
      email: 'merryweds@wed.co',
      created_at: new Date(),
      updated_at: new Date()
    }])
    .then(() =>
    queryInterface.bulkInsert('recipes', [{
      name: 'Rice and salad turnings',
      direction: 'Cook until done properly',
      per_serving: 1.5,
      user_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'Fried chippings with almond',
      direction: 'simmer and fry to taste',
      per_serving: 2,
      user_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'Banana toppings and kwili',
      direction: 'Peel, rip and destroy',
      per_serving: 1.0,
      user_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'Tomato sauce',
      direction: 'cook and enjoy',
      per_serving: 1,
      user_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'Cuban pot roast shakings',
      direction: 'the only place in Havana',
      per_serving: 2.2,
      user_id: 3,
      created_at: new Date(),
      updated_at: new Date()
    }])
  )
  .then(() =>
    queryInterface.bulkInsert('reviews', [{
      comment: 'Ride on Cuba',
      star: 4,
      user_id: 1,
      recipe_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      comment: 'Tastes great',
      star: 5,
      user_id: 1,
      recipe_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      comment: 'Hmm, from the sewers',
      star: 1,
      user_id: 2,
      recipe_id: 3,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      comment: 'Something for the road',
      star: 3,
      user_id: 3,
      recipe_id: 3,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      comment: 'When is your next recipe',
      star: 5,
      user_id: 3,
      recipe_id: 5,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      comment: 'Can you even cook this',
      user_id: 2,
      recipe_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      comment: 'This sells',
      star: 5,
      user_id: 1,
      recipe_id: 3,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      comment: 'Could do better',
      star: 3,
      user_id: 2,
      recipe_id: 5,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      comment: 'tastes awesome',
      star: 4,
      user_id: 1,
      recipe_id: 5,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      comment: 'Something to try someday',
      star: 3,
      user_id: 2,
      recipe_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      comment: "I'll puke",
      star: 1,
      user_id: 2,
      recipe_id: 4,
      created_at: new Date(),
      updated_at: new Date()
    }])
  ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('users')
    .then(() =>
      queryInterface.bulkDelete('recipes')
    )
    .then(() =>
      queryInterface.bulkDelete('reviews')
    )

}
