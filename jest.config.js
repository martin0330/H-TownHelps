module.exports = {
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest', // Use Babel to transpile JS/JSX files
    },
    moduleFileExtensions: ['js', 'jsx'],
    testEnvironment: 'jsdom', // Ensures compatibility with React
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
    transformIgnorePatterns: [
        '/node_modules/(?!(YOUR_PACKAGE|ANOTHER_PACKAGE)/)',  // Replace with the library causing issues
      ],
  };
  
  
  