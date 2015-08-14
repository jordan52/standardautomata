var ITEM_COUNT = 10;

var library = {
    items: [
        {id: 'xxyy1', img: '/img/green.jpg'},
        {id: 'xxyy2', img: '/img/blue.png'},
        {id: 'xxyy3', img: '/img/yellow.png'}
    ]
};

var video = {
    name: 'a',
    user: 'willie',
    items: [
        {img: '/img/green.jpg'},
        {img: '/img/blue.png'},
        {},
        {img: '/img/green.jpg'},
        {img: '/img/blue.png'},
        {img: '/img/yellow.png'},
        {img: '/img/green.jpg'},
        {img: '/img/blue.png'},
        {img: '/img/yellow.png'},
        {img: '/img/green.jpg'}
    ]
};

var resizeTimeline = function () {
    $('.timeitem').height(($('#timeline').height()/2) - 3);
    $('.timeitem').width(($('#timeline').width() / 5) - 3);
}

var initAreas = function(){

    var height = ($( window ).height()) - 50; //the 50 is an adjustment for dev

    var half = (height / 2);
    var third = (height / 3);
    var sixth = (height / 6);
    var twelph = (height / 12);

    $('#movie').height((2 * third));
    $('#library').height((2 * third));
    $('#share').height(sixth);
    $('#drop').height(sixth);
    $('#controls').height(sixth - twelph);
    $('#timeline').height((sixth) + twelph);

    resizeTimeline();
};

window.onresize = function() {
    initAreas();
}

var addLibraryItemListeners = function (o) {
    o.addEventListener('dragstart', function (e) {
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('id', this.id);

    });
    o.addEventListener('dragend', function (e) {

    });
}
var initLibrary = function() {
    var libImg = document.createElement("img");
    libImg.className = 'libimage';
    var libItem = document.createElement("li");
    libItem.className = 'libitem';
    libItem.draggable = 'true';
    var frag = document.createDocumentFragment();
    for(var i = 0; i < library.items.length; i++){
        var im = libImg.cloneNode();
        im.src = library.items[i].img;
        var li = libItem.cloneNode();
        li.id = library.items[i].id;
        li.appendChild(im);
        frag.appendChild(li);
        addLibraryItemListeners(li);
    }
    $('#library').append(frag);

};

var addTimelineItemListeners = function(o){
    o.addEventListener('drop', function (e) {
        if (e.preventDefault)e.preventDefault();
        if (e.stopPropagation)e.stopPropagation();
        var libId = e.dataTransfer.getData('id');

        var collection = library.items;
        var property = 'id';
        var values = [libId];
        var frank =  _.filter(collection, function(item) {
            return _.contains(values, item[property]);
        });

        video.items[this.id.split('_')[1]].img = frank[0].img;

        drawTimeline();

        return false;
    });
    o.addEventListener('dragenter', function (e) {
        //this.className = "slot over";
        //console.log('got a dragenter')
    });
    o.addEventListener('dragleave', function (e) {
        //this.className = "slot";
        //console.log('got a dragleave')
    });
    o.addEventListener('dragover', function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        e.dataTransfer.dropEffect = 'copy';
        //console.log('slot got a dragover');
        return false;
    });
    o.addEventListener('click', function () {
        console.log('got a click');
        video.items[this.id.split('_')[1]] = {};
        drawTimeline();
        return false;
    });
}

var drawTimeline = function () {
    var img = document.createElement("img");
    img.className = 'timeimage';
    var item = document.createElement("div");
    item.className = 'timeitem';
    var placeholder = document.createElement("div");
    placeholder.className = 'timeplaceholder'
    placeholder.appendChild( document.createTextNode('drag here'));

    //var placeholder = document.createTextNode('drag here');
    var frag = document.createDocumentFragment();
    for(var i = 0; i < ITEM_COUNT; i++){

        var libItem = item.cloneNode();
        libItem.id = 'item_' +i;

        if(video.items[i]) {
            if(video.items[i].img) {
                var libImage = img.cloneNode();
                libImage.src = video.items[i].img;
                libItem.appendChild(libImage)
            } else {

                libItem.appendChild(placeholder.cloneNode(true));
            }

        }
        addTimelineItemListeners(libItem);


        frag.appendChild(libItem);
    }
    $('#timeline').empty().append(frag);
    resizeTimeline();
}

$(function () {
    initAreas();
    initLibrary();
    drawTimeline();
});