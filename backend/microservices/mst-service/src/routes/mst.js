const express = require('express');
const router = express.Router();
const talentController = require('../controllers/talentController');
const donationController = require('../controllers/donationController');
const insightsController = require('../controllers/insightsController');
const moderationController = require('../controllers/moderationController');

// Talent routes
router.post('/talents', talentController.createTalent);
router.get('/talents/:talentId', talentController.getTalent);
router.delete('/talents/:talentId', talentController.deleteTalent);

// Feed routes
router.get('/feed', talentController.getFeed);

// Creator routes
router.get('/creators/:creatorId/talents', talentController.getCreatorTalents);
router.get('/creators/:creatorId/insights', insightsController.getCreatorInsights);
router.get('/creators/:creatorId/donations', donationController.getCreatorDonations);

// Engagement routes
router.post('/talents/:talentId/engagement', talentController.registerEngagement);
router.post('/talents/:talentId/donate', donationController.makeDonation);

// User routes
router.get('/users/:userId/donations', donationController.getUserDonations);

// Moderation routes (admin)
router.get('/moderation/pending', moderationController.listPendingReviews);
router.post('/moderation/talents/:talentId/review', moderationController.submitReview);
router.get('/moderation/talents/:talentId/history', moderationController.getModerationHistory);
router.get('/moderation/stats', moderationController.getModerationStats);

// Stats routes (admin)
router.get('/stats', insightsController.getGlobalStats);

module.exports = router;
