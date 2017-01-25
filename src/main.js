// set UI Control
let app = angular.module('app', []);
app.controller('controller', initController);

function initController( $scope ) {
	// 3D settings
    let camera, scene, renderer;
	// render DOM
    let container = document.getElementById( 'container' );
	// mesh
	let mesh;

	init();
	setScene();
	animate();

	function init() {
		let halfWidth  = window.innerWidth / 2;
		let halfHeight = window.innerHeight / 2;

		camera   = new THREE.OrthographicCamera( -halfWidth, halfWidth, halfHeight, -halfHeight, 1, 1000 );
        scene    = new THREE.Scene();
        renderer = new THREE.WebGLRenderer();

		camera.position.z = 1000;

		// set renderer
        renderer.setPixelRatio( window.devicePixelRatio );
        container.appendChild( renderer.domElement );

		// set windows size
        window.addEventListener( 'resize', onWindowResize, false );
		onWindowResize();
	}

	function setScene() {
		let material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
		let geometry = new THREE.PlaneBufferGeometry( 500, 500 );
        mesh     = new THREE.Mesh( geometry, material );
		scene.add( mesh );
	}

	function onWindowResize() {
		let halfWidth  = window.innerWidth / 2;
		let halfHeight = window.innerHeight / 2;

		camera.left   = -halfWidth;
		camera.right  =  halfWidth;
		camera.top    =  halfHeight;
		camera.bottom = -halfHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );
	}

	function animate() {
        requestAnimationFrame( animate );
        render();
    }

	function render() {
		renderer.render( scene, camera );
	}
}
