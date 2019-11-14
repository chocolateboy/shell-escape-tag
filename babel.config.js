module.exports = {
    presets: [
        ['@babel/preset-env', {
            useBuiltIns: false,

            // set this to true to see the applied transforms and bundled polyfills
            debug: (process.env.NODE_ENV === 'development'),

            targets: 'maintained node versions',
        }]
    ],
}
