function onLoad() {
	"use strict";
	console.log('loaded');

	var scene = new THREE.Scene();
	var avatar = new THREE.Object3D();

	var app = new WebVRApplication(scene, {useWebVRBoilerplate: true});

	var camera = app.camera;

	avatar.add(camera);
	scene.add(avatar);
	
	var stuff = addGfxTablet(2560/2, 1600/2, console);

	var paintableMaterial = stuff.paintableMaterial;
	var cursor = stuff.cursor;

	var aspect = 2560 / 1600;
	var scale = 2;

	var canvasMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(scale * aspect, scale), paintableMaterial);
	canvasMesh.position.z = -2;
	canvasMesh.add(cursor);

	scene.add(canvasMesh);

	app.start( ( function () {
		var lt = 0;
		function animate(t) {
			var dt = t - lt;

			app.vrControls.update(dt);
			app.vrManager.render(scene, camera);

			requestAnimationFrame(animate);
		}
		return animate;
	} )() );
}
