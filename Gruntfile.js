module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        react: {
            options: {
                es6module: true
            },
            files: {
                expand: true,
                        cwd: './src/views',
                        src: ['**/*.jsx'],
                        dest: './src/views',
                        ext: '.js'

            }
        },
        browserify: {
            options: {
                es6module: true,
                transform:  [['babelify', { presets: ["react", "es2015"] }]]//require('grunt-react').browserify ]
            },
            app: {
                src: ['src/**/**/*.js', 'src/views/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        clean: {
            options: {

            },
            files: ['./dist/*.js', './src/views/**/*.js'],
            post: ['./src/views/**/*.js'],
        }
    });

    /*grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');*/
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-browserify');
    //grunt.registerTask('test', ['jshint', 'qunit']);

    grunt.registerTask('default', ['clean:files','react','browserify']);

};