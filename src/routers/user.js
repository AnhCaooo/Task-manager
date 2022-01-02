const express = require('express')
const router = new express.Router()
const User = require('../models/user')

// User REST
// Fetch all users
router.get('/users', async (req, res) => {

    try{
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.send(error)
    }
})

// Get specific user by id 
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try{
        const user = await User.findById(_id)

        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    } catch(error){
        res.status(500).send(error)
    }
})

// Add new user
router.post('/users', async (req, res) => {
    const newUser = new User(req.body)

    try {
        await newUser.save()
        res.status(201).send(newUser)
    } catch (error) {
        res.status(400).send(error)
    }

})

// Update user
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'passoword', 'age']
    const isValidOperation = updates.every((update) =>  allowedUpdates.includes(update))
  
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        const user = await User.findById(req.params.id)

        updates.forEach((update) => user[update] = req.body[update])

        await user.save()
        
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        if(!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Delete user 
router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findByIdAndDelete(_id)

        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error){
        res.status(500).send(error)
    }
})


module.exports = router