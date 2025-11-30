const pool = require('./pool');

async function getAllGames() {
  const { rows } = await pool.query(
    `
      SELECT 
        games.id,
        games.name,
        games.description,
        games.price,
        COALESCE(
          json_agg(
            json_build_object('id', categories.id, 'name', categories.name)
          ) FILTER (WHERE categories.id IS NOT NULL),
          '[]'
        ) as categories
      FROM games
      LEFT JOIN game_categories ON games.id = game_categories.game_id
      LEFT JOIN categories ON categories.id = game_categories.category_id
      GROUP BY games.id
      ORDER BY games.name;
    `
  );

  return rows;
}

async function getGamesByCategories(categories) {
  const categoryChecks = categories
    .map((category, index) => {
      if (index === 0) {
        return `name = $${index + 1}`;
      }

      return `OR name = $${index + 1}`;
    })
    .join(' ');

  const { rows } = await pool.query(
    `
      SELECT 
        games.id,
        games.name,
        games.description,
        games.price,
        COALESCE(
          json_agg(
            json_build_object('id', categories.id, 'name', categories.name)
          ) FILTER (WHERE categories.id IS NOT NULL),
          '[]'
        ) as categories
      FROM games
      LEFT JOIN game_categories ON games.id = game_categories.game_id
      LEFT JOIN categories ON categories.id = game_categories.category_id
      WHERE games.id IN (
        SELECT game_id FROM game_categories
        WHERE category_id IN (
          SELECT id FROM categories
          WHERE ${categoryChecks}
        )
        GROUP BY (game_id)
        HAVING COUNT(category_id) = ${categories.length}
      )
      GROUP BY games.id
      ORDER BY games.name;
    `,
    categories
  );

  return rows;
}

async function getGameById(id) {
  const { rows } = await pool.query(
    `
      SELECT 
        games.id,
        games.name,
        games.description,
        games.price,
        COALESCE(
          json_agg(
            json_build_object('id', categories.id, 'name', categories.name)
          ) FILTER (WHERE categories.id IS NOT NULL),
          '[]'
        ) as categories
      FROM games
      LEFT JOIN game_categories ON games.id = game_categories.game_id
      LEFT JOIN categories ON categories.id = game_categories.category_id
      WHERE games.id = $1
      GROUP BY games.id;
    `,
    [id]
  );

  return rows[0];
}

async function getAllCategories() {
  const { rows } = await pool.query(
    `
      SELECT * FROM categories
      ORDER BY name;  
    `
  );

  return rows;
}

async function getCategoriesByGameId(id) {
  const { rows } = await pool.query(
    `
      SELECT name FROM categories
      JOIN game_categories ON id = category_id
      WHERE game_id = $1;
    `,
    [id]
  );

  return rows;
}

async function getCategory(name) {
  const { rows } = await pool.query(
    `
      SELECT * FROM categories
      WHERE name = $1;
    `,
    [name]
  );

  return rows[0];
}

async function createCategory(name) {
  await pool.query(
    `
      INSERT INTO categories (name)
      VALUES ($1);  
    `,
    [name]
  );
}

async function updateCategory(id, name) {
  await pool.query(
    `
      UPDATE categories
      SET name = $1
      WHERE id = $2;
    `,
    [name, id]
  );
}

async function deleteCategory(id) {
  await pool.query(
    `
      DELETE FROM categories
      WHERE id = $1
    `,
    [id]
  );
}

async function createGame(name, description, price) {
  await pool.query(
    `
      INSERT INTO games (name, description, price)
      VALUES ($1, $2, $3);  
    `,
    [name, description, price]
  );
}

async function updateGame(id, name, description, price) {
  await pool.query(
    `
      UPDATE games
      SET name = $1, description = $2, price = $3
      WHERE id = $4
    `,
    [name, description, price, id]
  );
}

async function deleteGame(id) {
  await pool.query(
    `
      DELETE FROM games
      WHERE id = $1
    `,
    [id]
  );
}

async function addCategoryToGame(gameId, categoryId) {
  await pool.query(
    `
      INSERT INTO game_categories (game_id, category_id)
      VALUES ($1, $2);
    `,
    [gameId, categoryId]
  );
}

async function removeCategoryFromGame(gameId, categoryId) {
  await pool.query(
    `
      DELETE FROM game_categories
      WHERE game_id = $1 AND category_id = $2;
    `,
    [gameId, categoryId]
  );
}

module.exports = {
  getAllGames,
  getGamesByCategories,
  getGameById,
  getAllCategories,
  getCategoriesByGameId,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  createGame,
  updateGame,
  deleteGame,
  addCategoryToGame,
  removeCategoryFromGame,
};
