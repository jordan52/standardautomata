var _       = require('lodash-node');

exports = module.exports = function (app){

    app.locals.videos = [
        {
            name: 'a',
            user: 'willie',
            items: [
                {img: '/img/yellow.png'},
                {img: '/img/yellow.png'},
                {},
                {img: '/img/jimWalker.jpg'},
                {img: '/img/yellow.png'},
                {img: '/img/yellow.png'},
                {img: '/img/yellow.png'},
                {img: '/img/sinkSquare1024x1024.png'},
                {img: '/img/6bc8a55b-9272-48bd-b08e-85dc11e15ca6.gif'},
                {img: '/img/green.jpg'}
            ]
        },
        {
            name: 'default',
            user: 'frank',
            items: [
                {img: '/img/55d185b0-be17-42d6-8413-89fc091abcea.gif'},
                {img: '/img/6bc8a55b-9272-48bd-b08e-85dc11e15ca6.gif'},
                {},
                {img: '/img/jimWalker.jpg'},
                {img: '/img/55d185b0-be17-42d6-8413-89fc091abcea.gif'},
                {img: '/img/yellow.png'},
                {img: '/img/55d185b0-be17-42d6-8413-89fc091abcea.gif'},
                {img: '/img/sinkSquare1024x1024.png'},
                {img: '/img/6bc8a55b-9272-48bd-b08e-85dc11e15ca6.gif'},
                {img: '/img/green.jpg'}
            ]
        }

    ]

    return {
        getVideoNames: function() {
            return _.map(_.filter(app.locals.videos,function(video) {return true;}), function(video) { return video.name;});
        },
        getAllVideos: function () {
            // app.locals.videos is set when the persist directory is crawled
            return app.locals.videos;
        },
        getVideoByName : function (name){
            var match = _.where(app.locals.videos,{ name:name });

            if(match.length < 1){
                throw new Error('video not found');
            }

            return match[0];
        },
        saveVideo : function (v){
            //TODO: scrub input here!
            app.locals.videos.push(v);
        }
    }

}