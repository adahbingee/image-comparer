const dialog = require('electron').remote.dialog;

// set UI Control
let app = angular.module('app', []);
app.controller('controller', initController);

function initController( $scope ) {
	// 3D settings
    let camera, scene, renderer;
	// render DOM
    let container = document.getElementById( 'container' );
	// control DOM
	let control   = document.getElementById( 'control' );
	// mouse event
	let isMouseRightClick = false;
	let mouseDownX, mouseDownY;
	let mouseMoveX, mouseMoveY;
	let cameraX   , cameraY;
	// control
	let isControlShow = true;
	
	// add event listener
	document.body.addEventListener('keydown'   , onKeyDown   );
	document.body.addEventListener('mousewheel', onMouseWheel);
	document.body.addEventListener('mousedown' , onMouseDown );
	document.body.addEventListener('mouseup'   , onMouseUp   );
	document.body.addEventListener('mousemove' , onMouseMove );
    
    document.ondragover = document.ondrop = (ev) => {
        ev.preventDefault();
    }

    document.body.ondrop = (ev) => {
        for (let i = 0; i < ev.dataTransfer.files.length; ++i) {
            const fileName = ev.dataTransfer.files[i].path;
            loadImage( fileName );
        }
        ev.preventDefault();
    }

	init();
	animate();
    //openDialog();
    
    $scope.cfg = cfg;
    
    $scope.onFileNameClick = function ( idx ) {
        showImage( idx );
    }
    
    function showImage( idx ) {
        if ( idx >= scene.children.length ) return;
        
        // hide all layers
        for(let i = 0; i < scene.children.length; ++i) {
            let o = scene.children[i];
            o.visible = false;
        }
        // show selected layer
        scene.children[idx].visible = true;
    }

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
		dialog.showOpenDialog({properties: ['multiSelections']}, onDialogClose);
	}
	
	function onMouseWheel( event ) {
		let delta = event.deltaY;

		let zoom = camera.zoom;
		if ( delta < 0) zoom *= cfg.zoomStep;
		if ( delta > 0) zoom /= cfg.zoomStep;
		
		let tweenFrom = { zoom: camera.zoom };
		let tweenTo   = { zoom: zoom        };
		let tween     = new TWEEN.Tween( tweenFrom );
		tween.to(tweenTo, 200);
		tween.onUpdate(function () {
			camera.zoom = tweenFrom.zoom;
			camera.updateProjectionMatrix();
		});
		tween.start();
	}
	
	function onKeyDown( event ) {
		let key = event.keyCode;
        
        // 1~9
        if ( key >= 97 && key <= 105 ) {
            showImage( key-97 );
            return;
        }
        
		switch ( key ) {
			case 79:  // o
				openDialog();
				break;
			case 27: // ESC
			    toggleShowControl();
				break;
			case 82: // r
				resetCamera();
				break;
			default:
				console.log( key );
				break;
		}
	}
	
	function onMouseDown( event ) {
		if ( event.button == 2 ) {
			isMouseRightClick = true;
			mouseDownX = event.clientX;
			mouseDownY = event.clientY;
			cameraX    = camera.position.x;
			cameraY    = camera.position.y;
		}
		console.log( `mouse: ${isMouseRightClick}` );
	}
	
	function onMouseUp( event ) {
		if ( event.button == 2 ) isMouseRightClick = false;
		console.log( `mouse: ${isMouseRightClick}` );
	}
	
	function onMouseMove( event ) {
		
		if ( isMouseRightClick ) {
			mouseMoveX = event.clientX;
			mouseMoveY = event.clientY;
			camera.position.x = cameraX -(mouseMoveX - mouseDownX);
			camera.position.y = cameraY + mouseMoveY - mouseDownY;
			camera.updateProjectionMatrix();
		}
	}
	
	function onDialogClose( filePaths ) {
		if ( !filePaths )           return;
		if ( filePaths.length < 1 ) return;
        
        for (let i = 0; i < filePaths.length; ++i) {
            const fileName = filePaths[i];
            loadImage( fileName );
        }
	}
    
    function loadImage( fileName ) {
        // push file name
        cfg.files.push( fileName );
        $scope.$apply();
        
        // load image
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
	
	function resetCamera() {
		camera.position.x = 0;
		camera.position.y = 0;
		camera.zoom       = 1;
		camera.updateProjectionMatrix();
	}
	
	function toggleShowControl() {
		if ( isControlShow ) {
			control.style.visibility = 'hidden'; 
		} else {
			control.style.visibility = 'visible';
		}
		isControlShow = !isControlShow;
	}

	function animate() {
        requestAnimationFrame( animate );
        render();
    }

	function render() {
		TWEEN.update();
		renderer.render( scene, camera );
	}
}
