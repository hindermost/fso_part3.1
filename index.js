console.log("Hi Gever");
const express = require('express')

const app = express()
app.use(express.json());

const cors = require('cors')
app.use(cors());

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
]

app.get('/',(request,response) => {
  response.send('<h1>Hello!</h1>')
})
app.get('/api/notes', (request,response) => {
  response.json(notes);
})
app.get('/api/notes/:idInUrl',(request,response) => {
  const id = request.params.idInUrl
  const note = notes.find( note => note.id === id)
  note ? response.json(note) : response.status(404).end() ;
})
app.delete('/api/notes/:idInUrl', (request,response) => {
  const id = request.params.idInUrl;
  notes = notes.filter( note => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request,response) => {
  const note = request.body
  console.log(note)
  response.json(note)
})


const PORT = process.env.PORT || 3001
app.listen(PORT,() => {
  console.log("Listen nicely...")
})