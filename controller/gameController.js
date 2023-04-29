const gameModel = require('../model/schema/gameSchema');
const { default: mongoose } = require('mongoose');
const { ApolloError } = require('apollo-server-express');
const gameProviderModel = require('../model/schema/gameProvidersSchema');

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
      throw new ApolloError('Single game is not found!', 'NOT_FOUND');
   }
};

const getAllGames = async function () {
   const findAllGames = await gameModel
      .find(
         {
            $and: [{ gameStatus: { $eq: 'Publish' } }],
         },
         { gameImage: 1, name: 1, by: 1 }
      )
      .populate('gameProvider', { providerName: 1, logo: 1 })
      .limit(5);

   if (findAllGames) {
      return findAllGames;
   }

   throw new ApolloError('Internal server error', 'INTERNAL_SERVER_ERROR');
};

module.exports = {
   getSingleGameInfo,
   getAllGames,
};
