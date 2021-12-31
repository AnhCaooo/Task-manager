const express = require('express')
require('./db/mongoose')
const Task = require('./models/task')
const User = require('./models/user')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

// User REST
// Fetch all users
app.get('/users', async (req, res) => {

    try{
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.send(error)
    }
})

// Get specific user by id 
app.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try{
        const user = await User.findById(_id)

        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    } catch(e){
        res.status(500).send(error)
    }
})

// Add new user
app.post('/users', async (req, res) => {
    const newUser = new User(req.body)

    try {
        await newUser.save()
        res.status(201).send(newUser)
    } catch (e) {
        res.status(400).send(error)
    }

})

// Task REST
// Fetch all task 
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch(e) {
        res.status(500).send(error)
    }
})

// Get specific task by id
app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id)
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(error)
    }
})

// Add new task to do 
app.post('/tasks', async (req, res) => {
    const newTask = new Task(req.body)

    try {
        await newTask.save()
        res.status(201).send(newTask)
    } catch (e) {
        res.status(400).send(error)
    }
})

app.listen(port, () => {
    console.log('Server is on port ' + port)
})