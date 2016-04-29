requirejs.config({
    baseUrl: '/static/app/',
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery',
        'backbone': '../bower_components/backbone/backbone',
        'underscore': '../bower_components/underscore/underscore',
        'text': '../bower_components/text/text',
        'mdl': '../bower_components/material-design-lite/material',
        "jq-file-download": "../bower_components/jquery-file-download/src/Scripts/jquery.fileDownload"
    },

    shim: {
        'jquery': {
            'exports': '$'
        },
        'underscore': {
            'exports': '_'
        },
        'backbone': {
            'deps': [
                'jquery',
                'underscore'
            ],
            'exports': 'Backbone'
        },
        'mdl': {
            'exports': 'mdl'
        },
        'jq-file-download': {
            'deps': ['jquery'],
            'exports': '$'
        }
    }
});