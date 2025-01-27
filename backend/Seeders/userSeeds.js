const {faker} = require('@faker-js/faker');
const User = require('../Models/userModel');

const createUser = async(numUsers) => {
    try{
        const usersPromise = [];
        for(let i = 0; i < numUsers; i++){
            const newUser = new User({
                name: faker.person.fullName(),
                username: faker.internet.username(),
                bio: faker.lorem.sentence(10),
                password: "password",
                avatar : {
                    url : faker.image.avatar(),
                    public_id: faker.string.uuid()
                }
            })
            usersPromise.push(newUser.save())
            console.log("usersCreated", numUsers);
        }
        await Promise.all(usersPromise);
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {createUser}