require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/person');

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(cors());
app.use(express.static('build'));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Phonebook App</h1>');
});

app.get('/info', (req, res) => {
  Person.countDocuments({}, (err, count) => {
    res.send(
      `<div>
      Phonebook has info for ${count} people
      </div> 
      <div><br>${new Date()}</br></div>`
    );
  });
});

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then((persons) => {
      res.json(persons.map((person) => person.toJSON()));
    })
    .catch((error) => console.log(error.message));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson.toJSON());
    })
    .catch((err) => next(err));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { number: body.number },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((updatedPerson) => {
      res.json(updatedPerson.toJSON());
    })
    .catch((err) => next(err));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unkown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
  console.log(err.message);

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message });
  }

  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
