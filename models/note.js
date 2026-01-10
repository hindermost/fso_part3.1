const mongoose = require('mongoose')

//const mongoPass = process.argv[2]
//const url = `mongodb+srv://hindermost_db_user:${mongoPass}@fsopart33.gcpteaz.mongodb.net/testiTest?appName=fsoPart33`
const url = process.env.MONGODB_URI
console.log(url)

mongoose.set('strictQuery',false)

mongoose.connect(url,{family:4}).then(result=>{
  console.log("Connected to MongoDB Atlas")
  })
  .catch(error =>{
    console.log("Error occurred: ",error.message)
})

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean
})

noteSchema.set('toJSON',{
  transform:(document,returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note',noteSchema)