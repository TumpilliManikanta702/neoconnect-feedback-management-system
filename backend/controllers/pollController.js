const Poll = require('../models/Poll');
const Vote = require('../models/Vote');

// @desc    Create a new poll
// @route   POST /api/polls
// @access  Private (Secretariat, Admin)
const createPoll = async (req, res) => {
    try {
        const { question, options } = req.body;

        // options should be an array of strings
        const formattedOptions = options.map(opt => ({ text: opt }));

        const poll = await Poll.create({
            question,
            options: formattedOptions,
            createdBy: req.user._id
        });

        res.status(201).json(poll);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all polls with results
// @route   GET /api/polls
// @access  Private
const getPolls = async (req, res) => {
    try {
        const polls = await Poll.find().sort({ createdAt: -1 });

        // For each poll, get the vote counts
        const pollsWithResults = await Promise.all(
            polls.map(async (poll) => {
                // Count total votes and votes per option
                const votes = await Vote.find({ pollId: poll._id });

                const optionsWithVotes = poll.options.map(option => {
                    const voteCount = votes.filter(v => v.selectedOption.toString() === option._id.toString()).length;
                    return {
                        _id: option._id,
                        text: option.text,
                        votes: voteCount
                    };
                });

                // Check if current user voted
                const userVote = votes.find(v => v.userId.toString() === req.user._id.toString());

                return {
                    _id: poll._id,
                    question: poll.question,
                    options: optionsWithVotes,
                    totalVotes: votes.length,
                    hasVoted: !!userVote,
                    userVotedOption: userVote ? userVote.selectedOption : null,
                    createdAt: poll.createdAt
                };
            })
        );

        res.json(pollsWithResults);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Vote in a poll
// @route   POST /api/polls/:id/vote
// @access  Private
const votePoll = async (req, res) => {
    try {
        const { optionId } = req.body;
        const pollId = req.params.id;

        // Check if user already voted
        const existingVote = await Vote.findOne({ pollId, userId: req.user._id });
        if (existingVote) {
            return res.status(400).json({ message: 'You have already voted in this poll' });
        }

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        // Validate option exists
        const validOption = poll.options.find(opt => opt._id.toString() === optionId);
        if (!validOption) {
            return res.status(400).json({ message: 'Invalid option' });
        }

        const vote = await Vote.create({
            pollId,
            userId: req.user._id,
            selectedOption: optionId
        });

        res.status(201).json({ message: 'Vote recorded', vote });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a poll
// @route   DELETE /api/polls/:id
// @access  Private (Admin)
const deletePoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json({ message: 'Poll not found' });

        await Vote.deleteMany({ pollId: poll._id });
        await poll.deleteOne();

        res.json({ message: 'Poll deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createPoll,
    getPolls,
    votePoll,
    deletePoll
};

// Generic vote endpoint to match spec: POST /api/vote
// @access  Private
const votePollByBody = async (req, res) => {
    try {
        const { pollId, optionId } = req.body;

        // Check if user already voted
        const existingVote = await Vote.findOne({ pollId, userId: req.user._id });
        if (existingVote) {
            return res.status(400).json({ message: 'You have already voted in this poll' });
        }

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        // Validate option exists
        const validOption = poll.options.find(opt => opt._id.toString() === optionId);
        if (!validOption) {
            return res.status(400).json({ message: 'Invalid option' });
        }

        const vote = await Vote.create({
            pollId,
            userId: req.user._id,
            selectedOption: optionId
        });

        res.status(201).json({ message: 'Vote recorded', vote });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports.votePollByBody = votePollByBody;
