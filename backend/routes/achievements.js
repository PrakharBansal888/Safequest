const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user stats and achievements
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.stats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user stats after story completion
router.post('/update-stats', auth, async (req, res) => {
  try {
    const { safeChoices, totalChoices, isComplete } = req.body;
    const user = await User.findById(req.user.id);

    // Update stats
    if (isComplete) {
      user.stats.storiesCompleted += 1;
    }

    if (safeChoices === totalChoices) {
      user.stats.perfectStories += 1;
      user.stats.safeChoicesStreak += 1;
    } else {
      user.stats.safeChoicesStreak = 0;
    }

    // Check for new achievements
    const achievements = new Set(user.stats.achievements);

    // First story achievement
    if (user.stats.storiesCompleted === 1) {
      achievements.add('FIRST_STORY');
    }

    // Safety streak achievement
    if (user.stats.safeChoicesStreak >= 5) {
      achievements.add('SAFETY_STREAK');
    }

    // Perfect story achievement
    if (user.stats.perfectStories >= 1) {
      achievements.add('PERFECT_SCORE');
    }

    // Story master achievement
    if (user.stats.storiesCompleted >= 5) {
      achievements.add('STORY_MASTER');
    }

    user.stats.achievements = [...achievements];
    await user.save();

    res.json(user.stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;