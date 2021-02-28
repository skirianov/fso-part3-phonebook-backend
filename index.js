const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');


morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());
app.use(express.json());


let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    },
    {
      "name": "ser",
      "number": "123",
      "id": 5
    }
  ]

app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);

    const person = persons.find( person => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }

})

app.get('/info', (request, response) => {
    const length = persons.length;
    response.send(
        `<p>Phonebook has info for ${length} people.</p>
         <p>${new Date()}</p>`
    )
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
        const index = persons.indexOf(person);
        persons.splice(index,1);
    }

    response.status(204).end();
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.floor(Math.random(30000000)*10000000)
        : 0
    return maxId + 1;
}

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        response.status(400).json({
            error: "Missing content"
        })
    }

    if (persons.find( person => person.name === body.name)) {
        response.status(400).json({
            error: "Must be unque name"
        });
    } else {
        const person = {
            name: body.name,
            number: body.number,
            id: generateId()
        }
    
        persons = persons.concat(person);
        response.json(person);
    }
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})