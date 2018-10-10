let TextureLoaderSync = function () {
    
};

TextureLoaderSync.getBase64Type = function( buffer ) {
    if ( buffer[0] == 0xFF && 
         buffer[1] == 0xD8 
        ) {
        return 'jpeg';
    }
    if ( buffer[0] == 0x42 && 
         buffer[1] == 0x4D 
        ) {
        return 'bmp';
    }
    if ( buffer[0] == 0x89 && 
         buffer[1] == 0x50 &&
         buffer[2] == 0x4E &&
         buffer[3] == 0x47 &&
         buffer[4] == 0x0D &&
         buffer[5] == 0x0A &&
         buffer[6] == 0x1A &&
         buffer[7] == 0x0A
        ) {
        return 'png';
    }
    if ( buffer[0] == 0x47 && 
         buffer[1] == 0x49 && 
         buffer[2] == 0x46 
        ) {
        return 'gif';
    }
}

TextureLoaderSync.prototype.load = function ( fileName, callback, size ) {
    let data;
    try {
        data = fs.readFileSync( fileName );
    } catch (err) {
        console.log(`no file ${fileName}`);
        return;
    }
    
    let base64Data = data.toString('base64');
    let base64Type = TextureLoaderSync.getBase64Type( data );
    
    let img = new Image();
    img.src = 'data:image/' + base64Type + ';base64,' + base64Data;
    if ( size ) { // scale image to size
        img.width  = size.width;
        img.height = size.height;
        // nearest sampling
        //img.style['image-rendering']  = 'crisp-edges';
    }
    let texture = new THREE.CanvasTexture(img);
    
    callback( texture );
}