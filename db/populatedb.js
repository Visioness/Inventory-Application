#! /usr/bin/env node

require('dotenv').config();
const { Client } = require('pg');

const SQL = `
  DROP TABLE IF EXISTS game_categories;
  DROP TABLE IF EXISTS games;
  DROP TABLE IF EXISTS categories;

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 50 )
  );

  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 100 ),
    description TEXT,
    price NUMERIC (10, 2)
  );

  CREATE TABLE IF NOT EXISTS game_categories (
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, category_id)
  );

  INSERT INTO categories (name)
  VALUES
    ('Action'),
    ('Adventure'),
    ('Arcade'),
    ('Battle Royal'),
    ('First Person'),
    ('Open World'),
    ('Multi Player'),
    ('Platform'),
    ('Racing'),
    ('Role Play'),
    ('Shooter'),
    ('Simulation'),
    ('Single Player'),
    ('Sports'),
    ('Strategy'),
    ('Third Person');

  INSERT INTO games (name, description, price)
  VALUES 
    ('The Legend of Zelda: Breath of the Wild', 'Step into a world of discovery, exploration, and adventure in this open-air adventure where you travel across vast fields, through forests, and to mountain peaks.', 59.99),
    ('The Witcher 3: Wild Hunt', 'You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will.', 39.99),
    ('Grand Theft Auto V', 'A young street hustler, a retired bank robber and a terrifying psychopath find themselves entangled with some of the most frightening and deranged elements of the criminal underworld.', 29.99),
    ('Elden Ring', 'A fantasy action-RPG adventure set within a world created by Hidetaka Miyazaki and George R.R. Martin.', 59.99),
    ('Red Dead Redemption 2', 'Winner of over 175 Game of the Year Awards and recipient of over 250 perfect scores, RDR2 is the epic tale of outlaw Arthur Morgan and the infamous Van der Linde gang.', 59.99),
    ('Super Mario Odyssey', 'Join Mario on a massive, globe-trotting 3D adventure and use his incredible new abilities to collect Moons so you can power up your airship, the Odyssey.', 49.99),
    ('Minecraft', 'Explore infinite worlds and build everything from the simplest of homes to the grandest of castles.', 29.99),
    ('Portal 2', 'The "Perpetual Testing Initiative" has been expanded to allow you to design co-operative puzzles for you and your friends!', 9.99),
    ('Call of Duty: Modern Warfare II', 'Squad up and fight alongside the iconic operators of Task Force 141 with the return of the modern tactical shooter.', 69.99),
    ('FIFA 23', 'Experience The Worlds Game with HyperMotion2 Technology, bringing more gameplay realism to the pitch.', 59.99),
    ('Stardew Valley', 'You have inherited your grandfather''s old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life.', 14.99),
    ('Hades', 'Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion and Transistor.', 24.99),
    ('The Last of Us Part I', 'Endure and survive. Experience the emotional storytelling and unforgettable characters in a ravaged civilization, where infected and hardened survivors run rampant.', 69.99),
    ('God of War Ragnarök', 'Kratos and Atreus must journey to each of the Nine Realms in search of answers as Asgardian forces prepare for a prophesied battle that will end the world.', 69.99),
    ('Sid Meier''s Civilization VI', 'Civilization VI offers new ways to interact with your world, expand your empire across the map, advance your culture, and compete against history''s greatest leaders.', 59.99),
    ('Street Fighter 6', 'Powered by Capcom''s proprietary RE ENGINE, the Street Fighter 6 experience spans across three distinct game modes featuring World Tour, Fighting Ground and Battle Hub.', 59.99),
    ('Forza Horizon 5', 'Your Ultimate Horizon Adventure awaits! Explore the vibrant and ever-evolving open world landscapes of Mexico with limitless, fun driving action in hundreds of the world''s greatest cars.', 59.99),
    ('Tetris Effect: Connected', 'Tetris Effect: Connected is Tetris like you''ve never seen it, or heard it, or felt it before. An incredibly addictive, unique, and breathtakingly gorgeous reinvention.', 39.99),
    ('Among Us', 'A game of teamwork and betrayal... in space! Play online with 4-15 players as you attempt to prep your spaceship for departure, but beware as one or more random players among the Crew are Impostors bent on killing everyone!', 4.99),
    ('Overwatch 2', 'Overwatch 2 is an always-on and always-free, team-based action game set in an optimistic future, where every match is the ultimate 5v5 battlefield brawl.', 0.00),
    ('Hollow Knight', 'Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes. Explore twisting caverns, battle tainted creatures and befriend bizarre bugs.', 14.99),
    ('Final Fantasy VII Remake', 'The world has fallen under the control of the Shinra Electric Power Company. Cloud Strife, a former member of Shinra''s elite SOLDIER unit now turned mercenary, lends his aid to the resistance group Avalanche.', 69.99),
    ('Cyberpunk 2077', 'Cyberpunk 2077 is an open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a cyberpunk mercenary wrapped up in a do-or-die fight for survival.', 59.99),
    ('Resident Evil 4', 'Survival is just the beginning. Six years have passed since the biological disaster in Raccoon City. Agent Leon S. Kennedy, one of the survivors of the incident, has been sent to rescue the president''s kidnapped daughter.', 59.99),
    ('Rocket League', 'Rocket League is a high-powered hybrid of arcade-style soccer and vehicular mayhem with easy-to-understand controls and fluid, physics-driven competition.', 0.00);

  INSERT INTO game_categories (game_id, category_id)
  VALUES
    (1, 1), (1, 2), (1, 7), (1, 13), (1, 16),
    (2, 10), (2, 2), (2, 7), (2, 1), (2, 16),
    (3, 1), (3, 2), (3, 7), (3, 11), (3, 16), (3, 6),
    (4, 10), (4, 1), (4, 7), (4, 2), (4, 16), (4, 6),
    (5, 1), (5, 2), (5, 7), (5, 11), (5, 16), (5, 6),
    (6, 8), (6, 1), (6, 2), (6, 13),
    (7, 12), (7, 2), (7, 7), (7, 13), (7, 6),
    (8, 8), (8, 2), (8, 5), (8, 13), (8, 6),
    (9, 11), (9, 1), (9, 5), (9, 4), (9, 6),
    (10, 14), (10, 12), (10, 13), (10, 6),
    (11, 12), (11, 10), (11, 13), (11, 6),
    (12, 1), (12, 13),
    (13, 1), (13, 2), (13, 13), (13, 16),
    (14, 1), (14, 2), (14, 13), (14, 16),
    (15, 15), (15, 13), (15, 6),
    (16, 1), (16, 3), (16, 6), (16, 13),
    (17, 9), (17, 7), (17, 6), (17, 13),
    (18, 3), (18, 13),
    (19, 6), (19, 15),
    (20, 11), (20, 5), (20, 6), (20, 1),
    (21, 1), (21, 2), (21, 8), (21, 13),
    (22, 10), (22, 1), (22, 13), (22, 16),
    (23, 10), (23, 7), (23, 5), (23, 1), (23, 13),
    (24, 1), (24, 2), (24, 13), (24, 16),
    (25, 14), (25, 9), (25, 6), (25, 1);
`;

async function main() {
  console.log('Seeding...');

  const { DB, DB_CONNECTION, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD } =
    process.env;

  const dbURL =
    DB_CONNECTION ||
    `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB}`;

  const client = new Client({
    connectionString: dbURL,
  });

  try {
    await client.connect();
    await client.query(SQL);
    console.log('Done');
  } catch (error) {
    console.log('Error seeding database: ', error);
  } finally {
    await client.end();
  }
}

main();
