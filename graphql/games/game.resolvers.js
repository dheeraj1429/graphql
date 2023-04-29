const {
   getSingleGameInfo,
   getAllGames,
} = require('../../controller/gameController');

module.exports = {
   Query: {
      getSingleGameInfo: async (parent, args, ctx) => {
         return getSingleGameInfo(args);
      },
      getAllGames: async () => {
         const games = await getAllGames();
         return games;
      },
   },
   Mutation: {
      insertNewGame: async (parent, args) => {
         console.log(args);
      },
   },
};
