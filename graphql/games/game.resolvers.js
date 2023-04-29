const { getSingleGameInfo } = require('../../controller/gameController');

module.exports = {
   Query: {
      getSingleGameInfo: async (parent, args, ctx) => {
         return getSingleGameInfo(args);
      },
   },
   Mutation: {
      insertNewGame: async (parent, args) => {
         console.log(args);
      },
   },
};
