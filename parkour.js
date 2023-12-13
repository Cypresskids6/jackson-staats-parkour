import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'

const objects = [];  //list-array
let raycaster; //raygun

let moveForward = false;
let moveBackwards = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now(); //curent time
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let camera, scene, controls, renderer;

init();
animate();
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 10;

    controls = new PointerLockControls(camera, document.body);

    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');

    instructions.addEventListener('click', function () {
        controls.lock();
    })
    controls.addEventListener('lock', function () {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    });
    controls.addEventListener('unlock', function () {
        blocker.style.display = 'block';
        instructions.style.display = ''
    })

    scene.add(controls.getObject());

    const onKeyDown = function (event) {
        switch (event.code) {
            case 'KeyW':
                moveForward = true;
                break;
            case 'KeyA':
                moveLeft = true;
                break;
            case 'KeyS':
                moveBackwards = true;
                break;
            case 'KeyD':
                moveRight = true;
                break;
            case 'Space':
                if (canJump === true) velocity.y += 500;
                canJump = false;
                break;
        }
    }

    const onKeyUp = function (event) {
        switch (event.code) {
            case 'KeyW':
                moveForward = false;
                break;
            case 'KeyA':
                moveLeft = false;
                break;
            case 'KeyS':
                moveBackwards = false;
                break;
            case 'KeyD':
                moveRight = false;
                break;
        }
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10)

    const PlaneGeometry = new THREE.PlaneGeometry(100, 100, 64, 64);
    const PlaneMaterial = new THREE.MeshLambertMaterial({ color: 0x0000FF });
    const plane = new THREE.Mesh(PlaneGeometry, PlaneMaterial);
    scene.add(plane);
    plane.rotateX(-1.57);
    objects.push(plane);

    const light = new THREE.PointLight(0xffffff, 100);
    scene.add(light);
    camera.position.z = 5;
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    camera.position.z = 8;

    const geometry1 = new THREE.BoxGeometry(20, 40, 10,);
    const material1 = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    const cube = new THREE.Mesh(geometry1, material1)
    scene.add(cube)
    objects.push(cube);

    const geometry2 = new THREE.BoxGeometry(20, 40, 10);
    const material2 = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    const cube2 = new THREE.Mesh(geometry2, material2)
    scene.add(cube2)
    objects.push(cube2);
    cube2.position.x = 10
    cube2.position.y = 33
    
    const geometry3 = new THREE.BoxGeometry(20, 40, 10);
    const material3 = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    const cube3 = new THREE.Mesh(geometry3, material3)
    scene.add(cube3)
    cube.position.set()
    objects.push(cube3);
    cube3.position.x = 80
    cube3.position.y = 50

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.domElement)
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
    requestAnimationFrame(animate)
    const time = performance.now();
    if (controls.isLocked === true) {
        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 10;

        const intersections = raycaster.intersectObjects(objects, false);
        const onObject = intersections.length > 0;
        const delta = (time - prevTime) / 1000;
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackwards);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackwards) velocity.z -= direction.z * 500.0 * delta
        if (moveLeft || moveRight) velocity.x -= direction.x * 500.0 * delta

        if(onObject === true) {
            velocity.y = Math.max(0, velocity.y)
            canJump = true;
        }

        controls.moveRight(-velocity.x * delta)
        controls.moveForward(-velocity.z * delta)
        controls.getObject().position.y += (velocity.y * delta);

        if(controls.getObject().position.y < 10) {
            velocity.y = 0;
            controls.getObject().position.y = 10;
            canJump = true;
        }
    }
    prevTime = time;
    renderer.render(scene, camera)
}