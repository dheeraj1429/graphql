const gameModel = require('../model/schema/gameSchema');
const { default: mongoose, models } = require('mongoose');

const getSingleGameInfo = async function (args) {
   const { gameId, userId } = args;

   if (!gameId || !userId) {
      throw new Error('Invalid inputs');
   }

   const gameInfo = await gameModel.aggregate([
      {
         $match: {
            _id: new mongoose.Types.ObjectId(gameId),
         },
      },
      {
         $addFields: {
            favoritesSize: { $size: '$favorites' },
            likesSize: { $size: '$likes' },
            gameInFavoritesList: {
               $filter: {
                  input: '$favorites',
                  as: 'favorites',
                  cond: {
                     $eq: [
                        '$$favorites.userId',
                        new mongoose.Types.ObjectId(userId),
                     ],
                  },
               },
            },
            gameInLikeList: {
               $filter: {
                  input: '$likes',
                  as: 'like',
                  cond: {
                     $eq: [
                        '$$like.userId',
                        new mongoose.Types.ObjectId('644616d158822b72a37bf78b'),
                     ],
                  },
               },
            },
         },
      },
      {
         $lookup: {
            from: 'gameproviders',
            localField: 'gameProvider',
            foreignField: '_id',
            as: 'gameProvider',
         },
      },
      { $unwind: '$gameProvider' },
      {
         $group: {
            _id: {
               _id: '$_id',
               name: '$name',
               by: '$by',
               description: '$description',
               aboutGame: '$aboutGame',
               gameImage: '$gameImage',
               url: '$url',
               urlMobile: '$urlMobile',
               previewImages: '$previewImages',
               gameStatus: '$gameStatus',
               favoritesSize: '$favoritesSize',
               gameInFavoritesList: '$gameInFavoritesList',
               gameInLikeList: '$gameInLikeList',
               likesSize: '$likesSize',
               gameBitcontroller: '$gameBitcontroller',
               gameProvider: {
                  _id: '$gameProvider._id',
                  providerName: '$gameProvider.providerName',
                  logo: '$gameProvider.logo',
               },
            },
         },
      },
   ]);

   const info = gameInfo?.[0]?._id;

   if (info) {
      return info;
   } else {
      throw new Error(`single game not found`);
   }
};

module.exports = {
   getSingleGameInfo,
};
