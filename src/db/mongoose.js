const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://anhcao:0409@cluster0.ibisi.mongodb.net/task-manager-api?retryWrites=true&w=majority', {
    useNewUrlParser: true , useUnifiedTopology: true
})



