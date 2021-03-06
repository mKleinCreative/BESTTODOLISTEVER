var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/caribou-todo';
var db = pgp(connectionString);

// add query functions

function getAllTodos(request, response, next) {
  return db.many('select * from todos ')
}

function getSingleTodo(request, response, next) {
  var todoID = parseInt(request.params.id);
  db.one('select * from todos where id = $1', todoID)
    .then(function (data) {
      response.status(200)
    });
}


function createTodo(title) {
  return db.one(
    `INSERT INTO
    todos (title, description, completed, priority)
    VALUES
    ( $1, $2, $3, $4 )
    RETURNING id`, [title, '', false, 5]
  )
}

function updateTodo( id, title, description ) {
  return db.any(
  `UPDATE
    todos
   SET
    title=$2,
    description=$3
   WHERE id=$1`, [ id, title, description ]
)}

function completeTodo( id, completed) {
  return db.none(
  `UPDATE
    todos
   SET
    completed=$2
   WHERE id=$1`, [ id, completed ]
  )
}

function updatePriority( id, priority) {
  return db.none(
  `UPDATE
    todos
   SET
    priority=$2
   WHERE id=$1
   `, [ id, priority ]
  )
}

function updateTitle( id, title) {
  return db.none(
  `UPDATE
    todos
   SET
    title=$2
   WHERE id=$1
   `, [ id, title ]
  )
}

function removeTodo( id ) {
  return db.none(
    `DELETE FROM
      todos
     WHERE
      id=$1`, [id]
  )
}

function orderTodo( id ) {
  return db.many(
    `SELECT * FROM
      todos
     ORDER BY
      priority
     ASC`
  )
}

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  removeTodo,
  completeTodo,
  updatePriority,
  orderTodo
};
