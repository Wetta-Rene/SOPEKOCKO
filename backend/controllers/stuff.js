const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
    sauceObject.like = 0;  //a l'objet sausse on ajoute like à 0
    sauceObject.dislike = 0; //a l'objet sauce on ajoute dislike
    sauceObject.usersLiked = Array(); // déclaration tableau des utilisateur qui aiment
    sauceObject.usersDisliked = Array(); // déclaration tableau des utilisateur qui aiment pas
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {res.status(200).json(sauce);})
      .catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.likeOrDislike = (req, res, next) => {
    if(req.body.like === 1){// utilisateur aime la sauce
        Sauce.updateOne({ _id: req.params.id }, {$push: {usersLiked: req.body.userId}}, {$set: {like: req.body.like++} })
        .then (()=> res.status(200).json({ message: 'Like +1 modifié et user Add to Array Liked!'}))
        .catch(error => res.status(400).json({ error }));
    } else if (req.body.like === -1){
        Sauce.updateOne({ _id: req.params.id }, {$push: {usersDisliked: req.body.userId}}, {$set: {like: req.body.like--} })
        .then (()=> res.status(200).json({ message: 'Like -1 modifié et user Add to Array Disliked!'}))
        .catch(error => res.status(400).json({ error }));
    } else{//like vaut 0
        Sauce.updateOne({ _id: req.params.id }, {$push: {usersDisliked: req.body.userId}}, {$inc: {like: req.body.like} })
        .then (()=> res.status(200).json({ message: 'Like 0 modifié et user Add to Array Disliked!'}))
        .catch(error => res.status(400).json({ error }));
    }
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
                    const filename = sauce.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, 
            () => {
                    Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};