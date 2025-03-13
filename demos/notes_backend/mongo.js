require('dotenv').config(); // Load environment variables

const mongoose = require('mongoose')

const password = process.env.MONGO_PASSWORD; // Get password from .env

// if (process.argv.length < 3) {
//   console.log('give password as argument')
//   process.exit(1)
// }
// const password = process.argv[2]

const url = `mongodb+srv://potapovaes:${password}@cluster0.8yaog.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error:', err));

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'CSS ia hard',
  important: true,
})

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

// to print all the notes stored in the database
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})