let CameraControl = function(camera, renderDOM) {
	this.camera    = camera;
	
	renderDOM.addEventListener('mousewheel', this.onMouseWheel.bind(this));
	renderDOM.addEventListener('mousedown' , this.onMouseDown.bind(this));
	renderDOM.addEventListener('mouseup'   , this.onMouseUp.bind(this));
	renderDOM.addEventListener('mousemove' , this.onMouseMove.bind(this));
};

CameraControl.prototype.camera           = null;
CameraControl.prototype.mouseDownX       = 0;
CameraControl.prototype.mouseDownY       = 0;
CameraControl.prototype.cameraX          = 0;
CameraControl.prototype.cameraY          = 0;
CameraControl.prototype.isMouseRightDown = false;

CameraControl.prototype.reset = function() {
	let tweenFrom = { 
	                  zoom: this.camera.zoom,
                      x   : this.camera.position.x,
                      y   : this.camera.position.y
					};
	let tweenTo   = { 
	                  zoom: 1,
                      x   : 0,
                      y   : 0
					};
	let tween     = new TWEEN.Tween( tweenFrom );
	tween.to(tweenTo, 200);
	tween.onUpdate(function () {
		this.camera.zoom       = tweenFrom.zoom;
		this.camera.position.x = tweenFrom.x;
		this.camera.position.y = tweenFrom.y;
		this.camera.updateProjectionMatrix();
	}.bind(this));
	tween.start();
};

CameraControl.prototype.onMouseWheel = function( event ) {
	let delta = event.deltaY;

	let zoom = this.camera.zoom;
	if (delta < 0) zoom *= cfg.zoomStep;
	if (delta > 0) zoom /= cfg.zoomStep;
	
	let tweenFrom = { zoom: this.camera.zoom };
	let tweenTo   = { zoom: zoom        };
	let tween     = new TWEEN.Tween( tweenFrom );
	tween.to(tweenTo, 200);
	tween.onUpdate(function () {
		this.camera.zoom = tweenFrom.zoom;
		this.camera.updateProjectionMatrix();
	}.bind(this));
	tween.start();
};

CameraControl.prototype.onMouseDown = function( event ) {
	if ( event.button == 2 ) {
		this.isMouseRightDown = true;
		this.mouseDownX       = event.clientX;
		this.mouseDownY       = event.clientY;
		this.cameraX          = this.camera.position.x;
		this.cameraY          = this.camera.position.y;
	}
};

CameraControl.prototype.onMouseUp = function( event ) {
	if ( event.button == 2 ) this.isMouseRightDown = false;
};

CameraControl.prototype.onMouseMove = function( event ) {
	if ( this.isMouseRightDown ) {
		let mouseMoveX = event.clientX;
		let mouseMoveY = event.clientY;
		let vecX       =  -(mouseMoveX - this.mouseDownX) / this.camera.zoom;
		let vecY       =   (mouseMoveY - this.mouseDownY) / this.camera.zoom;
		this.camera.position.x = this.cameraX + vecX;
		this.camera.position.y = this.cameraY + vecY;
		this.camera.updateProjectionMatrix();
	}
};