module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  testMatch: [
      "**/__tests__/**/*.js?(x)",
      "**/?(*.)+(spec|test).js?(x)"
  ],
  transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  }
};
  
  