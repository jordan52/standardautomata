$(function () {

    var theDiv = $('#threedee');
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage({parent:theDiv.get(0)});
    var scene, camera, renderer;
    var geometry, material, mesh;
    var container, stats;
    var composer;

    var mouse = [.5, .5];
    zoom = 1000;

    function init() {

        container = document.createElement( 'div' );
        theDiv.append( container );

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 1000;

        var light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 0, 1, 1 ).normalize();
        scene.add(light);


        geometry = new THREE.BoxGeometry( 200, 200, 200 , 1, 1, 1);
        material = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( "img/sinkSquare1024x1024.png" ) });
        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        //backGeo = new THREE.BoxGeometry( 1000, 1000, 1, 1, 1, 1);
        //backMat = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( "img/bathroomSquare2048x2048.png" ) });
        //backMesh = new THREE.Mesh (backGeo, backMat)
        //scene.add(backMesh)

        var sphere = new THREE.Mesh(
            new THREE.SphereGeometry(3000, 64, 64),
            new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture('img/bathroomSquare2048x2048.png')
            })
        );
        sphere.scale.x = -1;
        var axis = new THREE.Vector3(0.0,1.0,0);
        sphere.rotateOnAxis(axis, -1.57);
        scene.add(sphere);


        //scene.fog = new THREE.FogExp2( '#FF0000', 0.0002 );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );

        composer = new THREE.EffectComposer( renderer );
        composer.addPass( new THREE.RenderPass( scene, camera ) );

        //var effect = new THREE.ShaderPass( THREE.DotScreenShader );
        //effect.uniforms[ 'scale' ].value = 99;
        //composer.addPass( effect );

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
    function animate() {

        // note: three.js includes requestAnimationFrame shim
        requestAnimationFrame( animate );

        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;

        //renderer.render( scene, camera );
        composer.render();
        stats.update();

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
    animate();
});