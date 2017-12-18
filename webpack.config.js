const path = require("path");

module.exports = {
    entry: './src/PullRequest.js',
    output: {
        filename: 'PullRequest.js',
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, "dist")
    },
    target: "node",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env']
                    }
                }
            }
        ]
    }
};
