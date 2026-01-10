console.log("Hi Gever");
const express = require('express')
require('dotenv').config()
const Note = require('./models/note');

const app = express()
app.use(express.json());
app.use(express.static('dist'))
//cors not required any more since in this version the frontend dist folder was coppied here and we're using express.static middleware
//const cors = require('cors')
//app.use(cors());

/*
let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },                     
  {
    id: "2",
    content: "Bbbbbrowser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
] */

app.get('/',(request,response) => {
  response.send('<h1>Hello! Frontend was not connected...</h1>')
})
app.get('/api/notes', (request,response) => {
  Note.find({}).then(resultedNotes => {
    response.json(resultedNotes);
  }) 
})

app.get('/api/notes/:id',(request,response,next) => {
  Note.findById(request.params.id).then(matchedNote => {
    if(matchedNote) {
      response.json(matchedNote)
    } else {
      response.status(404).send({error: 'MAtched id was not found'})
    }
  })
  .catch(error => {
    next(error)
  })
})
app.delete('/api/notes/:id', (request,response,next) => {
  console.log("deleting begins")
  Note.findByIdAndDelete(request.params.id).then(result => {
    console.log(`Deleted id ${request.params.id} - "${result.content}"`)
    response.status(204).end()
  }).catch(error => next(error))
})

app.post('/api/notes', (request,response,next) => {
  const body = request.body
  if(!body.content) {
    return response.status(400).json({ error: "Content missing..." })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  note.save().then(savedNote => {
    response.json(savedNote);
  }).catch(error => next(error))
}) 

app.put('/api/notes/:id', (request,response,next) => {
  const {content,important} = request.body
  Note.findById(request.params.id).then(resultedNote => {
    if(!resultedNote) {
      console.log("Id seems legit, but was not found")
      return response.status(404).end()
    }
    resultedNote.content = content
    resultedNote.important = important

    return resultedNote.save().then(updatedNote => {
      response.json(updatedNote)
    })
  }).catch(error => next(error))
})

const unknownEndpoint = (request,response) => {
  console.log("Unknown Endpoint!")
  const message = `
  <h1>Oppssss.... 404</h1>
  <p>The endpoint: <strong><i>${(request.originalUrl)}</i></strong> is not exist</p>
  `
  response.status(404).send(message)
}

app.use(unknownEndpoint)

const errorHandler = (err,request,response,next) => {
  console.error(err.message)
  console.log("Hereeeeeeeeee1 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  if(err.name === 'CastError') {
    return response.status(500).send({ error: 'Malformed id'})
  } else if (err.name === 'ValidationError') {
    console.log("Hereeeeeeeeee2 !!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    return response.status(400).send({ error:  err.message})
  }
  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT,() => {
  console.log(`Listen nicely on PORT=${PORT}...`)
})


