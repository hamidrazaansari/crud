const express = require('express');
const mongoose = require('mongoose')
const port = 8000
const cors = require('cors')
const app = express()
const multer = require('multer')
app.use(express.json())
app.use(cors())

const upload = multer({dest: 'images/'})


// Meaking Connectiont to the mongodb
mongoose.connect('mongodb://127.0.0.1:27017/crud').then(console.log('connecterd')).catch(err => console.log(err))


// Meaking Post Requet  CREATE
app.post('/', upload.single('image'), async (req, res) => {
    const { name, email  } = req.body
    // const imageBuffer = req.file.buffer;
    // console.log(imageBuffer)
    console.log(req.file)
    console.log(req.body)


    try {
        const user = new Mymodel({ name, email })
        await user.save()
        res.status(200).send({ message: "user added succesfully" })
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ message: "internal server error " })
    }
});

// Meaking GET Requet  READ
app.get('/', async (req, res) => {
    try {
        const userData = await Mymodel.find()
        res.json(userData).status(200)
    } catch (error) {
        res.status(400).send({ message: "data Not find invalid url" })
        console.log(error)
    }
})

// Meaking PUT Requet  UPDATE

app.put('/:id', async (req, res) => {
    const id = req.params.id
   const UpdatedData =  await Mymodel.findByIdAndUpdate({ _id: id }, { name: req.body.name, email: req.body.email })
   res.status(200).send({ message: "user User Updated succesfully" , UpdatedData})
    
})

app.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const userData = await Mymodel.findById({ _id: id })
        res.json(userData).status(200)
    } catch (error) {
        res.status(400).send({ message: "data Not find invalid url" })
        console.log(error)
    }
})

// Meaking DELETE Requet  DELETE

app.delete('/:id', async (req, res) => {
    const id = req.params.id
    const userData = await Mymodel.findByIdAndDelete({ _id: id })
    console.log(userData)
})


// creatig server
app.listen(port, () => {
    console.log(`Server started on ${port}`);
});



//  Schema and Model

const schema = mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
})

const Mymodel = mongoose.model('Mymodel', schema)