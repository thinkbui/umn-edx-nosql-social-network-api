const { ObjectId } = require('mongoose').Types;
const User = require('../models/User.js');

module.exports = {
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        const userObj = {
          users,
        };
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json({
              user,
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) => {
        res.json({ message: 'User successfully deleted' })
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  async addFriend(req, res) {
    console.log('You are adding an friend');
    const ids = [req.params.userId, req.body.friendId]
    const users = await User.find({ _id: ids})

    console.log(users.length)
    if (!users) {
      res
        .status(404)
        .json({ message: 'No users found with those IDs :(' })
    }
    await User.findOneAndUpdate(
      { _id: users[0].id },
      { $addToSet: { friends: users[1].id } },
      { runValidators: true, new: true }
    )
    await User.findOneAndUpdate(
      { _id: users[1].id },
      { $addToSet: { friends: users[0].id } },
      { runValidators: true, new: true }
    )
    res.json(await User.find({ _id: ids}))
  },
};
