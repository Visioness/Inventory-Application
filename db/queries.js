const pool = require('./pool');

async function getAllGames() {
  const { rows } = await pool.query(
    `
      SELECT * FROM games;
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
      SELECT * FROM games
      WHERE id IN (
        SELECT game_id FROM game_categories
        WHERE category_id IN (
          SELECT id FROM categories
          WHERE ${categoryChecks}
        )
        GROUP BY (game_id)
        HAVING COUNT(category_id) = ${categories.length}
      );
    `,
    categories
  );

  return rows;
}

async function getGameById(id) {
  const { rows } = await pool.query(
    `
      SELECT * FROM games
      WHERE id = $1;  
    `,
    [id]
  );

  return rows[0];
}

async function getAllCategories() {
  const { rows } = await pool.query(
    `
      SELECT * FROM categories    
    `
  );

  return rows;
}

async function getCategory(name) {
  const { rows } = await pool.query(
    `
      SELECT * FROM categories
      WHERE name = $1
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

async function createItem(name, description, price) {
  await pool.query(
    `
      INSERT INTO categories (name, description, price)
      VALUES ($1, $2, $3);  
    `,
    [name, description, price]
  );
}

module.exports = {
  getAllGames,
  getGamesByCategories,
  getGameById,
  getAllCategories,
  getCategory,
  createCategory,
  createItem,
};
