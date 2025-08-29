const express = require('express');
const { checkIn,setIncognito,finalizeCheckIn,getVenueStats,getLiveVenueStats, submitReview, getReviews } = require('./location.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { body, param } = require('express-validator');
const { isPremium } = require('../middleware/premium.middleware');

const router = express.Router();

// POST /api/location/check-in - İstifadəçinin məkana daxil olması
router.post(
  '/check-in',
  authenticateToken,
  [
    body('latitude').isFloat().withMessage('Enlik (latitude) düzgün deyil'),
    body('longitude').isFloat().withMessage('Uzunluq (longitude) düzgün deyil'),
  ],
  checkIn
);

// POST /api/location/seed - Test üçün databazaya məkanları əlavə edir
router.patch('/incognito', authenticateToken, setIncognito);
router.post(
    '/check-in/finalize',
    authenticateToken,
    [
        body('venueId').isInt().withMessage('Məkan ID-si məcburidir.'),
        body('latitude').isFloat().withMessage('Enlik (latitude) məcburidir və düzgün formatda olmalıdır.'),
        body('longitude').isFloat().withMessage('Uzunluq (longitude) məcburidir və düzgün formatda olmalıdır.'),
    ],
    finalizeCheckIn
);
router.get('/venues/:id/stats', authenticateToken, getVenueStats);
router.get('/venues/:id/live-stats', authenticateToken, isPremium, getLiveVenueStats);

// YENİ ENDPOINTLƏR
router.post(
  '/venues/:id/reviews',
  authenticateToken,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rey 1 ile 5 arasinda olmalidir.'),
    body('comment').optional().isString().trim().isLength({ max: 255 }).withMessage('Rey 255 simvolu keçmemelidir.'),
  ],
  submitReview
);
router.get(
  '/venues/:id/reviews',
  authenticateToken,
  getReviews
);

module.exports = router;