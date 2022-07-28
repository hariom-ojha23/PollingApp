const config = {
  screens: {
    VotePoll: {
      path: 'vote/:id',
      parse: {
        id: id => `${id}`,
      },
    },
  },
};

const linking = {
  prefixes: ['pollingapp://'],
  config,
};

export default linking;
