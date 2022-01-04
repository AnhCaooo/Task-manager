const express = require('express')
const router = new express.Router()
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const {sendWelcomeEmail, sendCancelEmail} = require('../emails/account')

// User REST
// Fetch all users (authenticated)
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// User sign up 
// Add new user  
router.post('/users', async (req, res) => {
    const newUser = new User(req.body)

    try {
        await newUser.save()
        sendWelcomeEmail(newUser.email, newUser.name)
        const token = await newUser.generateAuthToken()
        res.status(201).send({newUser, token})
    } catch (error) {
        res.status(400).send(error)
    }

})

// User login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token})
    } catch (e) {
        res.status(400).send()
    }
})

// Logout request (authenticated)
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
}) 

// Logout All request 
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// Update user (authenticated)
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'passoword', 'age']
    const isValidOperation = updates.every((update) =>  allowedUpdates.includes(update))
  
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Delete user (authenticated)
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancelEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (error){
        res.status(500).send(error)
    }
})

// Setup endpoint for avater upload
const upload = multer({
    dest: 'avatar', 
    limits: {
        fileSize: 1000000
    }, 
    fileFilter(req, file, callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error('Please upload an image!'))
        }

        callback(undefined, true)
    }
})

// Add avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

// Delete avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// Fetch all avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error){
        res.status(404).send()
    }
})

module.exports = router