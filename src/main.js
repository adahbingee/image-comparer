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
	// camera control
	let cameraControl;
	// control
	let isControlShow = true;
	
	// add event listener
	document.body.addEventListener('keydown', onKeyDown);
    
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
		
		// set camera control
		cameraControl = new CameraControl( camera, document.body );

		// set windows size
        window.addEventListener( 'resize', onWindowResize, false );
		onWindowResize();
	}

	function openDialog() {
		dialog.showOpenDialog({properties: ['multiSelections']}, onDialogClose);
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
				cameraControl.reset();
				break;
			default:
				console.log( key );
				break;
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
        let loader = new THREE.TextureLoader();
        loader.load(fileName, function( texture ) {
            // set texture
            onTextureLoad( texture );
            
            // push file name
            cfg.files.push( fileName );
            $scope.$apply();
        });
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
