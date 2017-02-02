let CameraControl = function(camera, renderDOM) {
	this.camera    = camera;
	this.renderDOM = renderDOM;
	
	this.renderDOM.addEventListener('mousewheel', this.onMouseWheel.bind(this));
	this.renderDOM.addEventListener('mousedown' , this.onMouseDown.bind(this));
	this.renderDOM.addEventListener('mouseup'   , this.onMouseUp.bind(this));
	this.renderDOM.addEventListener('mousemove' , this.onMouseMove.bind(this));
};

CameraControl.prototype.camera           = null;
CameraControl.prototype.renderDOM        = null;
CameraControl.prototype.mouseDownX       = 0;
CameraControl.prototype.mouseDownY       = 0;
CameraControl.prototype.cameraX          = 0;
CameraControl.prototype.cameraY          = 0;
CameraControl.prototype.isMouseRightDown = false;

CameraControl.prototype.reset = function() {
	this.camera.position.x = 0;
	this.camera.position.y = 0;
	this.camera.zoom       = 1;
	this.camera.updateProjectionMatrix();
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