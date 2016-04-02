function onLoad() {
	"use strict";
	var scene = new THREE.Scene();
	var avatar = new THREE.Object3D();

	scene.add(avatar);

	var app = new WebVRApp(scene, undefined, undefined);

	var camera = app.camera;

	avatar.add(camera);
	
	var stuff = addGfxTablet(2560/2, 1600/2);

	var paintableMaterial = stuff.paintableMaterial;
	var cursor = stuff.cursor;

	var aspect = 2560 / 1600;
	var scale = 2;

	var canvasMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(scale * aspect, scale), paintableMaterial);
	canvasMesh.position.z = -2;
	canvasMesh.add(cursor);

	scene.add(canvasMesh);

	var start = function () {
		var lt = 0;
		function animate(t) {
			var dt = 0.001 * (t - lt);
			app.render();
			requestAnimationFrame(animate);
		}
		animate();
	};

	start();
}
