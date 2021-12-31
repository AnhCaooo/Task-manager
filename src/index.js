const express = require('express')
require('./db/mongoose')
const Task = require('./models/task')
const User = require('./models/user')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

// User REST
// Fetch all users
app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users)
    }).catch((error) => {
        res.send(error)
    })
})

// Get specific user by id 
app.get('/users/:id', (req, res) => {
    const _id = req.params.id

    User.findById(_id).then((user) => {
        if(!user){
            return res.status(404).send()
        }

        res.send(user)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

// Add new user
app.post('/users', (req, res) => {
    const newUser = new User(req.body)

    newUser.save().then(() => {
        res.status(201).send(newUser)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

// Task REST
// Fetch all task 
app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

// Get specific task by id
app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id

    Task.findById(_id).then((task) => {
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

// Add new task to do 
app.post('/tasks', (req, res) => {
    const newTask = new Task(req.body)

    newTask.save().then(() => {
        res.status(201).send(newTask)
    }).catch((error) => {
        res.status(400).send(error)
    })

})
app.listen(port, () => {
    console.log('Server is on port ' + port)
})