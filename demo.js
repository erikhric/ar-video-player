// Import JS libraries
import * as THREE from 'three';

// Import THREEVideoPlayer object
import { THREEVideoPlayer } from './source/three-video-player.js';

// Import coffee video
import CoffeeVideo from './coffee.mp4';

// Create THREE JS scene
const scene3 = new THREE.Scene();

// Create THREE JS camera
const camera3 = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
// camera3.position.z = -1;
// Create & initialize THREE JS renderer
const renderer3 = new THREE.WebGLRenderer( { alpha: true } );
renderer3.setSize(window.innerWidth, window.innerHeight);
renderer3.xr.enabled = true;
// renderer3.setClearColor(0x676767, 1);
document.body.appendChild(renderer3.domElement);

// Create groundPlaneObject and add to THREE JS scene
// const groundPlaneObject = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 2000), new THREE.MeshBasicMaterial({
//     color: 0x444444,
//     side: THREE.DoubleSide
// }));
// groundPlaneObject.rotation.x = -Math.PI/2.0;
// scene3.add(groundPlaneObject);

// Create videoPlayerObject and add to THREE JS scene
const videoPlayerObject = new THREEVideoPlayer({
    // source: CoffeeVideo,
    source: "https://cdn.glitch.com/f702252a-b636-466f-bffb-ccb9405c2c77%2F4k_6.mp4",
    play_btn_color: 0x6EABDD
});
// videoPlayerObject.position.y = 0.5;

scene3.add(videoPlayerObject);
const g = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
const cube = new THREE.Mesh( g, material );
// scene3.add(cube);
// cube.position.x += 1;
// Set camera position & look at videoPlayerObject
// camera3.position.z = 2.0;
// camera3.position.y = 0.6;
// camera3.lookAt(videoPlayerObject.position);

// Add "click" event listener to trigger video play / pause
renderer3.domElement.addEventListener('mousedown', function(event){
    // Prevent default event handling
    event.preventDefault();

    // Store event position as THREE JS Vector2
    var mousePosition = new THREE.Vector2((event.clientX/window.innerWidth)*2-1,  -(event.clientY/window.innerHeight)*2+1);

    // Create & configure raycaster
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mousePosition, camera3);

    // Check if event position intersects videoPlayerObject and if videoPlayerObject can play
    var intersects = raycaster.intersectObject(videoPlayerObject, true);
    if(intersects.length > 0 && videoPlayerObject.canPlay()){
        // Play video if paused, pause if playing
        if(videoPlayerObject.isPaused()){
            videoPlayerObject.play();
        } else {
            videoPlayerObject.pause();
        }
    }
});

// Create animation direction variable & set animation constants
var dir = "right";
const RotationSpeed = 0.002;
const RotationMax = 0.4;
var xrReferenceSpace;
navigator.xr.requestSession('immersive-ar', { optionalFeatures: ['local-floor'] }).then((session) => {
    renderer3.xr.setSession(session);
    session.requestReferenceSpace('local-floor').then(function(referenceSpace) {
        xrReferenceSpace = referenceSpace;
        // start rendering
        renderer3.setAnimationLoop(animate);
        videoPlayerObject.y += 2;
    });
});

// Define animation & rendering method
function animate() {
    // Request next frame
    camera3.updateMatrixWorld();

    // Render frame
    renderer3.render(scene3, camera3);
    requestAnimationFrame(animate);
}

// Begin rendering
// animate();
