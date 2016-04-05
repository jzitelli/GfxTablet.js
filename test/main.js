function onLoad() {
	"use strict";
	var scene = new THREE.Scene();
	var avatar = new THREE.Object3D();

	scene.add(avatar);

	var app = new WebVRApp(scene, undefined, undefined);

	var camera = app.camera;

	avatar.add(camera);

	var width = 2560,
		height = 1600;

	var downScale = 2;

	var stuff = GFXTABLET.addGfxTablet(width, height, downScale);

	var paintableMaterial = stuff.paintableMaterial;
	var cursor = stuff.cursor;

	var meshScale = 3;
	var aspect = width / height;
	// scaling should be applied to parent mesh for correct cursor positioning:
	var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), paintableMaterial);
	mesh.scale.x = meshScale * aspect;
	mesh.scale.y = meshScale;
	mesh.add(cursor);

	var cursorSize = 0.02;
	cursor.scale.x = cursorSize / (meshScale * aspect);
	cursor.scale.y = cursorSize / meshScale;

	mesh.position.z = -2;

	scene.add(mesh);

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
