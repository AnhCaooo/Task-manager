require('../src/db/mongoose')

const User = require('../src/models/user')

/*
User.findByIdAndUpdate('61cdf41d5b67f60fec71431c', { age: 1 }).then((user) => {
    console.log(user)
    return User.countDocuments({ age: 1 })
}).then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error)
})*/


const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age: 0})
    const count = await User.countDocuments({age})

    return count
}

updateAgeAndCount('61cdf41d5b67f60fec71431c', 2).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})