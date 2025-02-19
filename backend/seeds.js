const { faker, simpleFaker } = require('@faker-js/faker');
const User = require('./Models/userModel');
const Chat = require('./Models/chatModel')
const Message = require('./Models/messageModel')

const createUsers = async (numUsers) => {
    try {
        const usersPromise = [];
        for (let i = 0; i < numUsers; i++) {
            const newUser = new User({
                name: faker.person.fullName(),
                username: faker.internet.username(),
                bio: faker.lorem.sentence(10),
                password: "password",
                avatar: {
                    url: faker.image.avatar(),
                    public_id: faker.string.uuid()
                }
            })
            usersPromise.push(newUser.save())
            console.log("usersCreated", numUsers);
        }
        await Promise.all(usersPromise);
    }
    catch (error) {
        console.log(error);
    }
}

const createSingleChats = async (numChats) => {
    try {
        const users = await User.find().select("_id");
        if (users.length < 2) {
            console.log("Not enough users to create chats");
            return;
        }

        const createdChats = new Set(); // To prevent duplicate chats
        const chatsPromise = [];

        for (let i = 0; i < numChats; i++) {
            const user1 = users[Math.floor(Math.random() * users.length)];
            const user2 = users[Math.floor(Math.random() * users.length)];

            if (user1._id.equals(user2._id) || createdChats.has(`${user1._id}-${user2._id}`)) continue;

            createdChats.add(`${user1._id}-${user2._id}`);
            createdChats.add(`${user2._id}-${user1._id}`);

            const newChat = new Chat({
                name: faker.lorem.words(1),
                members: [user1._id, user2._id],
                creator: user1._id
            });
            chatsPromise.push(newChat.save());

            if (chatsPromise.length === 100) {
                await Promise.all(chatsPromise);
                chatsPromise.length = 0;
            }
        }

        if (chatsPromise.length > 0) {
            await Promise.all(chatsPromise);
        }

        console.log("Chats Created:", createdChats.size / 2);
    } catch (error) {
        console.log(error);
    }
};

const createGroupChats = async (numChats) => {
    try {
        const users = await User.find().select("_id");

        if (users.length < 3) {
            console.log("Not enough users to create group chats");
            return;
        }

        const chatsPromise = [];

        for (let i = 0; i < numChats; i++) {
            const shuffledUsers = users.sort(() => 0.5 - Math.random());
            const numMembers = simpleFaker.number.int({ min: 3, max: users.length });
            const members = shuffledUsers.slice(0, numMembers).map(user => user._id);

            const chat = new Chat({
                name: faker.lorem.words(1),
                members,
                creator: members[0],
                groupChat: true
            });

            chatsPromise.push(chat.save());
        }

        await Promise.all(chatsPromise);
        console.log("Group Chats Created:", numChats);
    } catch (error) {
        console.error(error);
    }
};

const createMessages = async (numMessages) => {
    try {
        const users = await User.find().select("_id");
        const chats = await Chat.find().select("_id");

        const messagesPromise = [];

        for (let i = 0; i < numMessages; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomChat = chats[Math.floor(Math.random() * chats.length)];

            const message = new Message({
                chatId: randomChat,
                sender: randomUser,
                content: faker.lorem.sentence()
            });

            messagesPromise.push(message.save());
        }

        await Promise.all(messagesPromise);
        console.log("Messages Created:", numMessages);
    } catch (error) {
        console.error(error);
    }
};

const createMessagesInChat = async (chatId, numMessages) => {
    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            console.log("Chat not found");
            return;
        }

        const users = await User.find({ _id: { $in: chat.members } });
        const messagesPromise = [];

        for (let i = 0; i < numMessages; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];

            const message = new Message({
                chatId,
                sender: randomUser._id,
                content: faker.lorem.sentence()
            });

            messagesPromise.push(message.save());
        }

        await Promise.all(messagesPromise);
        console.log("Messages Created in Chat:", chatId);
    } catch (error) {
        console.error(error);
    }
};

module.exports = { createUsers, createSingleChats, createGroupChats, createMessages, createMessagesInChat }