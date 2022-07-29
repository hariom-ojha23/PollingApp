let navigator;

const topLevelNavigator = navigationRef => {
  navigator = navigationRef;
};

const navigate = (routeName, params) => {
  navigator.navigate(routeName, params);
  return;
};

export default {
  topLevelNavigator,
  navigate,
};
