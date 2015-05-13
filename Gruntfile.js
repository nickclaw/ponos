var icons = require('./public/src/style/icons.json'),
    path = require('path');

module.exports = function(grunt) {

    grunt.initConfig({

        watch: {
            scss: {
                files: ["public/src/style/**/*.scss"],
                tasks: ["style:dev"],
                options: {
                    spawn: false
                }
            }
        },

        nodemon: {
            dev: {
                script: 'index.js',
                options: {
                    cwd: __dirname,
                    watch: ['config', 'server', 'index.js', 'Gruntfile.js'],
                    ext: 'js,json',
                    env: {
                        NODE_ENV: 'development'
                    }
                }
            }
        },

        htmlmin: {
            prod: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: 'public/src/template',
                    src: '**/*.html',
                    dest: 'public/build/template/'
                }]
            }
        },

        imagemin: {
            prod: {
                options: {
                    optimizationLevel: 3,
                    progressive: true,
                    interlaced: true
                },
                files: [{
                    expand: true,
                    cwd: 'public/src/image',
                    src: ['**/*.jpg', '**/*.png', '**/*.gif'],
                    dest: 'public/build/image/'
                }]
            }
        },

        webfont: {
            dev: {
                src: icons,
                dest: 'public/src/style/',
                options: {
                    engine: 'node',
                    normalize: true,
                    syntax: 'bootstrap',
                    rename: function(name) {
                        name = path.basename(name, '.svg');
                        name = name.substr(3, name.length - 8);
                        return name;
                    },
                    templateOptions: {
                        classPrefix: 'icon_'
                    }
                }
            },
            prod: {
                src: icons,
                dest: 'public/build/style',
                options: {
                    engine: 'node',
                    normalize: true,
                    syntax: 'bootstrap',
                    rename: function(name) {
                        name = path.basename(name, '.svg');
                        name = name.substr(3, name.length - 8);
                        return name;
                    },
                    templateOptions: {
                        classPrefix: 'icon_'
                    }
                }
            }
        },

        sass: {
            dev: {
                options: {
                    style: 'nested'
                },
                files: {
                    "public/src/style/app.css": "public/src/style/app.scss",
                    "public/src/style/splash.css": "public/src/style/splash.scss"
                }
            },
            prod: {
                options: {
                    style: 'compressed'
                },
                files: {
                    "public/build/style/app.css": "public/src/style/app.scss",
                    "public/build/style/splash.css": "public/src/style/splash.scss"
                }
            }
        },

        autoprefixer: {
            dev: {
                options: {
                    browsers: ['last 3 versions']
                },
                expand: true,
                flatten: true,
                src: 'public/src/style/**/*.css',
                dest: 'public/src/style/'
            },
            prod: {
                options: {
                    browsers: ['last 3 versions']
                },
                expand: true,
                flatten: true,
                src: 'public/build/style/**/*.css',
                dest: 'public/build/style/'
            }
        },

        uglify: {
            prod: {
                options: {
                    compress: {},
                    report: 'min',
                    sourceMap: true,
                    wrap: true
                },
                files: {
                    "public/build/script/app.js": "public/src/script/**/*.js"
                }
            }
        },

        concurrent: {
            options: {
                logConcurrentOutput: true,
                limit: 6
            },

            dev: ['webfont:dev', 'watch:scss', 'nodemon:dev']
        }

    });

    grunt.loadNpmTasks("grunt-autoprefixer");
    grunt.loadNpmTasks("grunt-concurrent");
    grunt.loadNpmTasks("grunt-contrib-htmlmin");
    grunt.loadNpmTasks("grunt-contrib-imagemin");
    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-webfont");
    grunt.loadNpmTasks("grunt-nodemon");

    grunt.registerTask('style:dev', ['sass:dev', 'autoprefixer:dev']);
    grunt.registerTask('style:prod', ['sass:prod', 'autoprefixer:prod']);

    grunt.registerTask('default', ['develop']);
    grunt.registerTask('develop', ['concurrent:dev']);
    grunt.registerTask('build', ['htmlmin:prod', 'imagemin:prod', 'style:prod', 'webfont:prod', 'uglify:prod']);
}
