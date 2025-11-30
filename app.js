require('dotenv').config();
const express = require('express');
const path = require('node:path');

const indexRouter = require('./routes/indexRouter');
const gamesRouter = require('./routes/gamesRouter');
const categoriesRouter = require('./routes/categoriesRouter');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/games', gamesRouter);
app.use('/categories', categoriesRouter);

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Server running on port ${PORT}`);
});
