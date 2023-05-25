const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../models');

module.exports = {
  getThoughts(req, res) {
    Thought.find()
      .then(async (thoughts) => {
        const thoughtObj = {
          thoughts,
        };
        return res.json(thoughtObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then(async (thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json({
              thought,
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  async createThought(req, res) {
    try{
      const user = await User.findOne({ _id: req.body.userId })
      if(!user) {
        res.status(404).json({ message: "No user found with that ID"})
      } else {
        const thought = await Thought.create(req.body)
        user.thoughts.push(thought._id)
        await user.save();
        res.json(thought)
      }
    }
    catch(err) {
      res.status(500).json(err);
    }
  },
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
  },
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) => {
        res.json({ message: 'Thought successfully deleted' })
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  async addReaction(req, res) {
    try {
      console.log('You are adding a reaction');
      console.log(req.body);
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      )
      if(!thought){
        res.status(404).json({ message: 'No thought found with that ID :(' })
      } else {
        res.json(thought)
      }
    }
    catch(err) {
      res.status(500).json(err);
    }
  },
  async removeReaction(req, res) {
    try {
      console.log("Removing reaction")
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
      if(!thought){
        res.status(404).json({ message: 'No thought found with that Id :(' })
      } else {
        thought.reactions.pull({ _id: req.body.reactionId })
        await thought.save();
        res.json(thought)
      }
    }
    catch(err) {
      res.status(500).json(err);
    }
  }
};
