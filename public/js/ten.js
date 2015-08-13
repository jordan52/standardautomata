var ITEM_COUNT = 10;

var library = {
    items: [
        {img: '/img/green.jpg'},
        {img: '/img/blue.png'},
        {img: '/img/yellow.png'}
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

var initLibrary = function() {
    var libElem = document.createElement("img");
    libElem.className = 'libimage';
    var frag = document.createDocumentFragment();
    for(var i = 0; i < library.items.length; i++){
        var libItem = libElem.cloneNode();
        libItem.src = library.items[i].img;
        frag.appendChild(libItem);
    }
    $('#library').append(frag);
};

var initTimeline = function () {
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


        frag.appendChild(libItem);
    }
    $('#timeline').append(frag);
    resizeTimeline();
}

$(function () {
    initAreas();
    initLibrary();
    initTimeline();
});