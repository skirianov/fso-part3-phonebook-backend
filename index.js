const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const Person = require('./models/persons');


morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());
app.use(express.static('build'));
app.use(express.json());

app.get('/api/persons', (request, response) => {
    Person.find({}).then( foundPersons => {
        response.json(foundPersons);
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then( person => {
        response.json(person);
    })
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

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        response.status(400).json({
            error: "Missing content"
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })
        
    person.save().then( savedPerson => {
        response.json(savedPerson);
    })
    }
)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})