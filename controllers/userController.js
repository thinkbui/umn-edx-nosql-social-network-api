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
    try{
      console.log('You are adding an friend');
      const user = await User.findOne({ _id: req.params.userId })
      const friend = await User.findOne({ _id: req.params.friendId })

      if (!user || !friend) {
        res
          .status(404)
          .json({ message: 'No users found with those IDs :(' })
      }
      user.friends.push(friend.id)
      friend.friends.push(user.id)
      await user.save()
      await friend.save()
      res.json(user)
      }
    catch(err) {
      res.status(500).json(err);
    }
  },
};
