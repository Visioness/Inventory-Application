const pool = require('./pool');

async function getAllInventory() {
  const { rows } = await pool.query(
    `
      SELECT * FROM games;
    `
  );

  return rows;
}

async function getByCategories(categories) {
  const categoryChecks = categories.map((category, index) => {
    if (index === 0) {
      return `category_id = $${index + 1}`;
    }

    return `OR category_id = $${index + 1}`;
  });

  const { rows } = await pool.query(
    `
      SELECT * FROM games
      WHERE id IN (
        SELECT game_id FROM game_categories
        WHERE ${categoryChecks}
        GROUP BY (game_id)
        HAVING COUNT(category_id) = ${categories.length}
      );
    `,
    categories
  );

  return rows;
}

async function getByItemId(id) {
  const { rows } = pool.query(
    `
      SELECT * FROM games
      WHERE id = $1;  
    `,
    [id]
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
