const faker = require('@faker-js/faker');

const createUser = async(numUsers) => {
    try{
        const usersPromise = [];
        for(let i = 0; i < numUsers; i++){
            const newUser = new User({
                name: faker.person.fullName(),
                username: faker.internet.userName(),
                bio: faker.lorem.sentence(),
                password: "XXXXXXXX"
            })
            usersPromise.push(newUser.save())
        }
    }
    catch(error){
        console.log(error);
    }
}