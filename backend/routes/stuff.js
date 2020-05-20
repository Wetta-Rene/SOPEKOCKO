const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/stuff');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')


router.get('/', stuffCtrl.getAllSauces);  // afficher toutes les sauces de la base Mongo
router.get('/:id', auth, stuffCtrl.getOneSauce);  // afficher une sauce unique
router.post('/', auth, multer, stuffCtrl.createSauce);  // creer un nouvel objet sauce
router.put('/:id', auth, multer, stuffCtrl.modifySauce); // pour mettre a jour l'objet suivant user identifier
router.delete('/:id', auth, stuffCtrl.deleteSauce);  // supprimer la sauce choisie
router.post('/:id/like', auth, stuffCtrl.likeOrDislike); // mise à jour des likes et dislikes

module.exports = router;