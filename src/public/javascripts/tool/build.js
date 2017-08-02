({
    baseUrl: "../",
    mainConfigFile: "../config.js",
    name: 'main',
    out: '../build/main.min.js',
    preserveLicenseComments: false,
    paths: {
        requireLib: '../require'
    },
    include: 'requireLib'
    // optimize: "none"
})