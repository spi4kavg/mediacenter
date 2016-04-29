module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        appDir: 'app/',
        vendorDir: 'vendor/',
        bowerDir: 'bower_components/',
        sassDir: 'sass/',

        watch: {
            scripts: {
                files: [
                    'Gruntfile.js',
                    '<%= appDir %>**/*.js',
                    '<%= appDir %>**/*.html',
                    '<%= sassDir %>**/*.scss'
                ],
                tasks: ['default'],
                options: {
                    debounceDelay: 250
                }
            }
        },

        requirejs: {
            app_dev: {
                options: {
                    baseUrl: "<%= appDir %>",
                    mainConfigFile: "<%= appDir %>require-conf.js",
                    name: "app",
                    out: "<%= vendorDir %>app.js",
                    optimize: 'none'
                }
            },

            app_prod: {
                options: {
                    baseUrl: "<%= appDir %>",
                    mainConfigFile: "<%= appDir %>require-conf.js",
                    name: "app",
                    out: "<%= vendorDir %>app.js",
                    optimize: 'uglify'
                }   
            }
        },

        sass: {
            dev: {
                files: [{
                    expand: true,
                    cwd: '<%= sassDir %>',
                    src: ['*.scss'],
                    dest: '<%= vendorDir %>css/',
                    ext: '.css'
                }]
            }
        },

        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                "<%= appDir %>**/*.js"
            ]
        },

        uglify: {
            vendors: {
                files: {
                    "<%= vendorDir %>require.min.js": [
                        "<%= bowerDir %>requirejs/require.js"
                    ]
                }
            }
        },

        clean: {
            'vendors': "<%= vendorDir %>"
        },
    });

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask("default", [
        "jshint:all",
        "clean:vendors",
        "uglify:vendors",
        "requirejs:app_dev",
        "sass:dev"
    ]);

    grunt.registerTask("prod", [
        "jshint:all",
        "clean:vendors",
        "uglify:vendors",
        "requirejs:app_prod",
        "sass:prod"
    ]);
};