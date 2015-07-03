$(function () {

    var theDiv = $('#threedee');
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage({parent:theDiv.get(0)});
    var scene, camera, renderer;

    var container, stats;
    var dotEffect;
    var composer;

    //sceneOne
    var sinkBox;
    var sphere;

    var mouse = [.5, .5];
    var zoom = 1000;

    var audioContext;
    var analyser;

    var currentScene;

    function init() {

        container = document.createElement( 'div' );
        theDiv.append( container );

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 1000;

        var light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 0, 1, 1 ).normalize();
        scene.add(light);

        sceneOne();


        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );

        composer = new THREE.EffectComposer( renderer );
        composer.addPass( new THREE.RenderPass( scene, camera ) );

        dotEffect = new THREE.ShaderPass( THREE.DotScreenShader );
        dotEffect.uniforms[ 'scale' ].value = 99;
        composer.addPass( dotEffect );

        var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
        effect.uniforms[ 'amount' ].value = 0.0015;
        effect.renderToScreen = true;
        composer.addPass( effect );


        container.appendChild( renderer.domElement );

        stats = new Stats();
        stats.domElement.style.margin = '-55px 0px 0px 0px';
        stats.domElement.style.zIndex = 100;
        theDiv.append( stats.domElement );

        var resizeThree	= function(){
            renderer.setSize( window.innerWidth, window.innerHeight );
            camera.aspect	= window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }

        window.addEventListener('resize', resizeThree, false);

        var interact = function (ev){
            mouse[0] = ev.clientX / window.innerWidth;
            mouse[1] = ev.clientY / window.innerHeight;
            camera.position.x = Math.sin(.5 * Math.PI * (mouse[0] - .5)) * zoom;
            camera.position.y = Math.sin(.25 * Math.PI * (mouse[1] - .5)) * zoom;
            camera.position.z = Math.cos(.5 * Math.PI * (mouse[0] - .5)) * zoom;
        }
        window.addEventListener( 'mousemove', interact, false );

    }

    function sceneOne(){
        currentScene = 1;
        var geometry = new THREE.BoxGeometry( 200, 200, 200 , 1, 1, 1);
        var material = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( "img/sinkSquare1024x1024.png" ) });
        sinkBox = new THREE.Mesh( geometry, material );
        scene.add( sinkBox );

        //backGeo = new THREE.BoxGeometry( 1000, 1000, 1, 1, 1, 1);
        //backMat = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( "img/bathroomSquare2048x2048.png" ) });
        //backMesh = new THREE.Mesh (backGeo, backMat)
        //scene.add(backMesh)

        sphere = new THREE.Mesh(
            new THREE.SphereGeometry(8000, 64, 64),
            new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture('img/bathroomSquare2048x2048.png')
            })
        );
        sphere.scale.x = -1;
        var axis = new THREE.Vector3(0.0,1.0,0);
        sphere.rotateOnAxis(axis, -1.57);
        scene.add(sphere);
    }
    function deleteSceneOne(){
        if(currentScene == 1) {
            scene.remove(sphere);
            scene.remove(sinkBox);
        }
    }
    function sceneTwo(){
        currentScene = 2;
        //var geometry = new THREE.BoxGeometry( 200, 200, 200 , 1, 1, 1);
        //var material = new THREE.MeshBasicMaterial( { wireframe: true, color: 0xff000000 });
        //sinkBox = new THREE.Mesh( geometry, material );
        //scene.add( sinkBox );

        var geometry = new THREE.BoxGeometry( 200, 200, 200 , 1, 1, 1);
        var material = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( "img/sinkSquare1024x1024.png" ) });
        sinkBox = new THREE.Mesh( geometry, material );
        scene.add( sinkBox );
    }

    function animate() {

        // note: three.js includes requestAnimationFrame shim
        requestAnimationFrame( animate );

        var freqByteData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(freqByteData); //analyser.getByteTimeDomainData(freqByteData);
        //console.log(freqByteData[52]);
        dotEffect.uniforms[ 'scale' ].value = freqByteData[52];

        sinkBox.rotation.x += freqByteData[52]/1000;
        sinkBox.rotation.y += freqByteData[75]/1000;

        composer.render();
        stats.update();

    }

    function initAudio(){
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        var source;
        var audio = new Audio();
        audio.src = '/audio/notAtHome.mp3';
        audio.controls = true;
        audio.autoplay = true;
        audio.loop = true;
        source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        var currenTimeNode = document.querySelector('#current-time');
        audio.addEventListener('timeupdate', function(e) {
            var currTime = audio.currentTime;
            currenTimeNode.textContent = parseInt(currTime / 60) + ':' + parseInt(currTime % 60);

            console.log(parseInt(currTime%60) );
            if(parseInt(currTime%60) ==  10){
                deleteSceneOne();
                sceneTwo();
            }

        }, false);

        document.body.appendChild(audio);

    }

    $('[data-toggle="popover"]').popover();
    $('#login-submit').click(
        function(){
            $('#login-modal-form-group-username').addClass('has-error');
            $('#login-modal-username-help-block').html('username is awful');
            $('#login-modal-form-group-password').addClass('has-error');
            $('#login-modal-password-help-block').html('password is awful');
            $('#login-modal-footer-span').html('click the X above to close');
            //$('#login-modal').modal('hide');
        });

    init();
    initAudio();

    animate();
});