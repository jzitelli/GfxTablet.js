function addGfxTablet(width, height) {
    "use strict";
    const DEFAULT_WIDTH = 2560;
    const DEFAULT_HEIGHT = 1600;

    var scale = 2;

    width = (width || DEFAULT_WIDTH) / scale;
    height = (height || DEFAULT_HEIGHT) / scale;

    var socket = new WebSocket('ws://' + document.domain + ':' + location.port + '/gfxtablet');

    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var aspect = canvas.width / canvas.height;

    var texture = new THREE.Texture(canvas, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping,
                                    THREE.LinearFilter, THREE.LinearFilter);

    var paintableMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture});

    var image = paintableMaterial.map.image;
    var ctx = image.getContext('2d');
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    paintableMaterial.map.needsUpdate = true;

    var cursorMaterial = new THREE.MeshBasicMaterial({color: 0xee9966});
    cursorMaterial.transparent = true;
    cursorMaterial.opacity = 0.666;
    var cursor = new THREE.Mesh(new THREE.CircleGeometry(0.02), cursorMaterial);
    cursor.position.z = 0.01;
    cursor.visible = false;

    ctx.lineCap = 'round';
    //ctx.lineJoin = stroke.join;
    //ctx.miterLimit = stroke.miterLimit;

    function drawStroke (points) {
        if (points.length === 0)
            return;
        var start = points[0];
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0,255,50,0.92)'; //stroke.color;
        ctx.lineWidth = start.p * 10; //normalizeLineSize(stroke.size);
        ctx.moveTo(canvas.width * start.x, canvas.height * start.y);
        for (var j = 1; j < points.length; j++) {
            var end = points[j];
            ctx.lineTo(canvas.width * end.x, canvas.height * end.y);
        }
        ctx.stroke();
    }

    function circle(x, y, r, c, o) {
        var opacity = o || 1;
        ctx.beginPath();
        var rad = ctx.createRadialGradient(x, y, r/2, x, y, r);
        rad.addColorStop(0, 'rgba('+c+','+opacity+')');
        rad.addColorStop(0.5, 'rgba('+c+','+opacity+')');
        rad.addColorStop(1, 'rgba('+c+',0)');
        ctx.fillStyle = rad;
        ctx.arc(x, y, r, 0, Math.PI*2, false);
        ctx.fill();
        ctx.closePath();
    }

    socket.onopen = function () {
        console.log("GfxTablet WebSocket opened");
    };
    socket.onerror = function (error) {
        console.log("could not connect to GfxTablet WebSocket");
    };
    var points = [];
    const NP = 3;
    socket.onmessage = function (message) {
        var data = JSON.parse(message.data);
        if (data.p > 0) {
            points.push(data);
            // circle(canvas.width * data.x, canvas.height * data.y,
            //     2 + 50*data.p * data.p, '255,0,0', 0.1 + 0.9 * data.p);
            if (points.length > NP) {
                drawStroke(points);
                paintableMaterial.map.needsUpdate = true;
                points.splice(0, NP);
            }
        }
        if (data.button !== undefined) {
            // button event
            if (data.button === 255) { // how to interpret as signed, i.e. -1?
                if (data.down === 1) {
                    // stylus is in range
                    cursor.visible = true;
                } else {
                    // stylus is out of range
                    cursor.visible = false;
                }
            } else if (data.button === 0) {
                if (data.down === 0) {
                    // stylus lifted
                    drawStroke(points);
                    paintableMaterial.map.needsUpdate = true;
                    points = [];
                    cursor.visible = true;
                } else {
                    // stylus down
                    cursor.visible = false;
                }
            }
            // else {
            //     if (data.down === 0) {
            //         console.log('button ' + data.button + ' released');
            //     } else {
            //         console.log('button ' + data.button + ' pressed');
            //     }
            // }
        }
        if (cursor.visible) {
            cursor.position.x = -aspect * scale / 2 + aspect * scale * data.x;
            cursor.position.y = scale / 2 - scale * data.y;
        }
    };

    return {paintableMaterial: paintableMaterial,
            cursor: cursor};
}
