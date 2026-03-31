const path = require('path');

module.exports = {
  dependencies: {
    'react-native-safe-area-context': {
      root: path.dirname(
        require.resolve('react-native-safe-area-context/package.json'),
      ),
    },
    'react-native-screens': {
      root: path.dirname(
        require.resolve('react-native-screens/package.json'),
      ),
    },
  },
};
