module.exports = {
    verbose: true,
    moduleFileExtensions: ['js'],
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/jest/__mocks__/fileMock.js",
        "\\.(css|sass)$": "<rootDir>/jest/__mocks__/styleMock.js"
    },
    collectCoverage: true,
    coverageDirectory: '<rootDir>/jest/__jest__/',
    collectCoverageFrom: [
        '<rootDir>/src/*.{js,jsx}',
        '!**/_mocks_/**',
        '!**/__mocks__/**',
        '!**/__tests__/**'
    ],
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    transformIgnorePatterns: ['/node_modules/(?!(ol))'],
    testPathIgnorePatterns: ['node_modules/', '\\.snap$', '\\.glsl$'],
    setupFiles: ['<rootDir>/jest/__jest__/setup.js'],
}
