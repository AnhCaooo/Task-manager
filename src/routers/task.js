const express = require('express')
const router = new express.Router()
const Task = require('../models/task')

// Task REST
// Fetch all task 
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch(error) {
        res.status(500).send(error)
    }
})

// Get specific task by id
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id)
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Update task by id 
router.patch('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    const allowedUpdates = ['description', 'completed']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        const task = await Task.findById(_id)

        updates.forEach((update) => task[update] = req.body[update])

        await task.save()
        
        //const task = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})
        
        if (!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Add new task to do 
router.post('/tasks', async (req, res) => {
    const newTask = new Task(req.body)

    try {
        await newTask.save()
        res.status(201).send(newTask)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Delete specific task
router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findByIdAndDelete(_id)
        if(!task) {
            res.status(404).send()
        } 
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router