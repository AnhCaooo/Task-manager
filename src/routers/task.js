const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

// Task REST
// Fetch all task (authenticated)
router.get('/tasks', auth, async (req, res) => {
    try {
        await req.user.populate('tasks').execPopulate()
        res.send(req.user.tasks)
    } catch(error) {
        res.status(500).send(error)
    }
})

// Get specific task by id (authenticated)
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({_id, owner: req.user._id})

        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Update task by id (authenticated)
router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    const allowedUpdates = ['description', 'completed']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        const task = await Task.findOne({_id: _id, owner: req.body._id })
        
        if (!task){
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Add new task to do (authenticated)
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body, 
        owner: req.user._id
    })
    try {
        await newTask.save()
        res.status(201).send(newTask)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Delete specific task (authenticated)
router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOneAndDelete({_id: _id, owner: req.params.user} )
        if(!task) {
            res.status(404).send()
        } 
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router