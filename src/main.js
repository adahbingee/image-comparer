const dialog = require('electron').remote.dialog;

// set UI Control
let app = angular.module('app', []);
app.controller('controller', initController);

function initController( $scope ) {
	// 3D settings
    let camera, scene, renderer;
	// render DOM
    let container = document.getElementById( 'container' );
	
	let isMouseRightClick = false;
	
	// add event listener
	document.body.addEventListener('mousewheel', onMouseWheel);
	document.body.addEventListener('keydown'   , onKeyDown   );
	document.body.addEventListener('mousedown' , onMouseDown );
	document.body.addEventListener('mouseup'   , onMouseUp );

	init();
	openDialog();
	animate();

	function init() {
		let halfWidth  = window.innerWidth  / 2;
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

	function openDialog() {
		dialog.showOpenDialog({}, onDialogClose);
	}
	
	function onMouseWheel( event ) {
		let delta = event.deltaY;
		if ( delta < 0) camera.zoom *= cfg.zoomStep;
		if ( delta > 0) camera.zoom /= cfg.zoomStep;
		camera.updateProjectionMatrix();
	}
	
	function onKeyDown( event ) {
		let key = event.keyCode;
		switch ( key ) {
			case 79:  // o
				openDialog();
				break;
			default:
				console.log( key );
				break;
		}
	}
	
	function onMouseDown( event ) {
		let x = event.clientX;
		let y = event.clientY;
		if ( event.button == 2 ) isMouseRightClick = true;
		console.log( `mouse: ${isMouseRightClick}` );
	}
	
	function onMouseUp( event ) {
		if ( event.button == 2 ) isMouseRightClick = false;
		console.log( `mouse: ${isMouseRightClick}` );
	}
	
	function onDialogClose( filePaths ) {
		if ( !filePaths )           return;
		if ( filePaths.length < 1 ) return;
		const fileName = filePaths[0];
		
		let loader = new THREE.TextureLoader();
		loader.load(fileName, onTextureLoad);
	}
	
	function onTextureLoad( texture ) {
		const width  = texture.image.width;
		const height = texture.image.height;
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.NearestFilter;
		let material = new THREE.MeshBasicMaterial( {
			map: texture
		});
		let geometry = new THREE.PlaneBufferGeometry( width, height );
		let plane    = new THREE.Mesh( geometry, material );
		scene.add( plane );
	}

	function onWindowResize() {
		let halfWidth  = window.innerWidth  / 2;
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
