
var timeline = [
];


$(function () {
    var audioContext;
    var analyser;
    var audio;
    var TIMELINE_SLOTS = 50;
    var curSlot = 0;

    function clockVideo(curSlot){


        //$('#movie').html(time + ' / ' + audio.duration + ' cur slot ' + curSlot);
        $('#slot_'+(curSlot-1)).css('background-color', '');
        $('#slot_'+curSlot).css('background-color', 'red');

        if(timeline[curSlot].image != null){
            var image = $('<img/>',{src:timeline[curSlot].image, class:'slotImage'});
            image.appendTo( $('#movie'));

        }
        return

    }
    function initAudio(){
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        var source;
        audio = new Audio();
        audio.src = '/audio/notAtHome.mp3';
        audio.controls = true;
        audio.autoplay = false;
        audio.loop = false;
        source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        var currenTimeNode = document.querySelector('#current-time');
        audio.addEventListener('timeupdate', function(e) {
            var currTime = audio.currentTime;
            currenTimeNode.textContent = parseInt(currTime / 60) + ':' + parseInt(currTime % 60);

            var intCur = parseInt(currTime);

            if(intCur > curSlot || curSlot > (intCur - 3)){
                curSlot = intCur;
                var curSlot = parseInt(time/(audio.duration/TIMELINE_SLOTS));
                clockVideo(curSlot);
            }

        }, false);

        document.querySelector('#audio-controls').appendChild(audio);
    }

    function initTimeline() {
        for(var i=0;i< TIMELINE_SLOTS;i++) {
            var item = {
                id: 'slot_' + i,
                text: i,
                class: 'slot',
                image: null
            };
            if (i%5 ==0 ){
                item.image = '/img/green.jpg'
            }
            timeline.push(item);
        }
    }
    function drawTimeline() {
        for(var i=0;i< timeline.length;i++){
            var slot = $('<span/>', timeline[i] );
            if(timeline[i].image){
                var image = $('<img/>',{src:timeline[i].image, class:'slotImage'});
                image.appendTo(slot);
            }

            slot.appendTo('#timeline');

            var theSlot = document.querySelector('#slot_'+i);


            theSlot.addEventListener('drop', function (e) {
                if (e.preventDefault)e.preventDefault();
                if (e.stopPropagation)e.stopPropagation();

                console.log('dropped on timeline slot ');
                this.className = "";
                //this.innerHTML = "Dropped " + e.dataTransfer.getData('text');

                var slotHolder = $('<span/>', {
                    id: 'slotHolder_'+this.id,
                    html: e.dataTransfer.getData('text'),
                    class: 'slotHolder'
                });
                console.log('appending ');
                console.log(slotHolder);
                console.log(' to ');
                console.log(slot);
                slotHolder.appendTo(this);
                $('#slotHolder_'+this.id).children().removeClass();
                $('#slotHolder_'+this.id).children().addClass('slotImage');

                return false;
            });
            theSlot.addEventListener('dragenter', function (e) {
                this.className = "slot over";
            });
            theSlot.addEventListener('dragleave', function (e) {
                this.className = "slot";
            });
            theSlot.addEventListener('dragover', function (e) {
                if (e.preventDefault) {
                    e.preventDefault();
                }

                e.dataTransfer.dropEffect = 'copy';
                console.log('slot got a dragover');
                return false;
            });

            console.log(timeline);

        }
    }

    var dropZoneOne = document.querySelector('#drop');
    var dragElements = document.querySelectorAll('#drag-elements li');
    var elementDragged = null;
    for (var i = 0; i < dragElements.length; i++) {
        dragElements[i].addEventListener('dragstart', function (e) {
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('text', this.innerHTML);
            e.dataTransfer.setData('id', this.id);
            elementDragged = this;
        });
        dragElements[i].addEventListener('dragend', function (e) {
            elementDragged = null;
        });
    }
    ;
    dropZoneOne.addEventListener('dragover', function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'copy';
        return false;
    });
    dropZoneOne.addEventListener('dragenter', function (e) {
        this.className = "over";
    });
    dropZoneOne.addEventListener('dragleave', function (e) {
        this.className = "";
    });
    dropZoneOne.addEventListener('drop', function (e) {
        if (e.preventDefault)e.preventDefault();
        if (e.stopPropagation)e.stopPropagation();
        this.className = "";
        this.innerHTML = "Dropped " + e.dataTransfer.getData('text');
        document.querySelector('#drag-elements').removeChild(elementDragged);
        elementDragged = null;
        return false;
    });

    initAudio();
    initTimeline();
    drawTimeline();

    /*
    drop.addEventListener('drop', function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        console.log('this is what we are ' + dragging);
        console.log(e.dataTransfer.getData('text'));
        console.log(e.dataTransfer);
        if(e.dataTransfer.getData("URL")){
            console.log('got a url. it was ' + e.dataTransfer.getData("URL"));
        }

        var fileList = e.dataTransfer.files;

        if (fileList.length > 0) {
            for(var i = 0; i < fileList.length; i++) {
                var file = fileList[i];
                if ("image/jpeg" == file.type ){
                    console.log('viable image type found');
                }
                console.log(fileList[i]);
            }
        }

        return false;
    });*/
});