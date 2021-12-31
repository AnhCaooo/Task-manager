require('../src/db/mongoose')

const Task = require('../src/models/task')
/*
Task.findByIdAndRemove('61cee888c811b821264f730e').then((task) => {
    console.log(task)
    return Task.countDocuments({completed: false})
}).then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error)
})*/

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed: false})
    return count
}

deleteTaskAndCount('61cf799c3a7bd31a821d8ff6').then((count) => {
    console.log(count)
}).catch((error) => {
    console.log(error)
})