
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/DragControls.js';
import { PLYLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/PLYLoader.js';
let objectionxoay = [];
let objectiondrag = [];

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//scene.background = new THREE.Color(0x999999);

/**
 * Camera
 */
// Base camera
let aspect = sizes.width / sizes.height;
const frustum = 10;
const camerakhoangcach = 30;
const camera = new THREE.OrthographicCamera(-aspect * frustum, aspect * frustum, frustum, -frustum, 1, 1000)
// Controls Orbit
const controls = new OrbitControls(camera, canvas)
//controls.enableDamping = true

if (sizes.width < sizes.height) {
    camera.position.set(0,camerakhoangcach,0);
    camera.zoom = .8;
} else {
    camera.position.set(0,0,camerakhoangcach);
}

camera.lookAt(0,0,0);

camera.updateProjectionMatrix();
scene.add(camera);

controls.update()

const togglenen = document.querySelector('#background');
let bgvalue = false;

document.querySelector('#toggle').addEventListener('click', function(){
    bgvalue = true;
    canvas.style.pointerEvents = 'auto';
    togglenen.style.display = 'block';
})

togglenen.addEventListener('click', function(){
    bgvalue = false;
    canvas.style.pointerEvents = 'none';
    togglenen.style.display = 'none';
})

console.log(scene.background);

// Materials
const wireframematgeo = new THREE.LineBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: .3,
})

const sangbongmat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, 
    side: THREE.DoubleSide,
    shadowSide: THREE.DoubleSide,
    metalness: 0,
    roughness: .08,
    transparent: true,
    opacity: .4,
    depthWrite: false,
    depthTest: false,
    transmission: .99,
    clearcoat: 1.0,
    clearcoatRoughness: 0
})

// Mesh

// OBJLoad 

// Mat Phang
const planeszwidth = 6.5;
const planeszheight = 25;
const plane = new THREE.Mesh(new THREE.PlaneGeometry(planeszheight, planeszwidth), new THREE.MeshBasicMaterial({
    color: 0x7d7d7d, 
    side: THREE.FrontSide
}));


const planewireframe = new THREE.WireframeGeometry(new THREE.PlaneGeometry(planeszheight, planeszwidth));

const planewire = new THREE.LineSegments(planewireframe, wireframematgeo);
planewire.position.z = -.02;
const planegroup = new THREE.Group().add(plane).add(planewire);
planegroup.rotateX(-Math.PI/2);
planegroup.position.set(0,-frustum*1/3,0);


//atb
let a = 4;
let k = planegroup.position.y;
let objtonghop = new THREE.Object3D;
objectload('static/amb/SOUND.ply', sangbongmat, true, true, -9, k, 0, a, a, a, "cac");
objectload('static/amb/SCENT.ply', sangbongmat, true, true, -4, k, 0, a, a, a, "cac");
objectload('static/amb/PLACE.ply', sangbongmat, true, true, 2.8, k, 0, a, a, a, "cac");
objectload('static/amb/CONSTRAINT.ply', sangbongmat, true, true, 8, k, 0, a, a, a, "cac");
if (sizes.width < sizes.height) {
    objtonghop.rotateY(Math.PI/2);
    planegroup.rotateZ(Math.PI/2);
}

scene.add(planegroup);
scene.add(objtonghop);
//drag atb
const controldrag = new DragControls(objectiondrag, camera, canvas);

controldrag.addEventListener( 'dragstart', function ( event ) {
    
	event.object.material.metalness = 1;
    controls.enabled = false;
} );

controldrag.addEventListener( 'dragend', function ( event ) {

	event.object.material.metalness = 0;
    controls.enabled = true;
} );

//// Light 1

let pointLight = [];

pointLight.push( new THREE.PointLight(0xff0000, 8, 0, 1) )
pointLight[0].position.set(0,5,5);

//// Light 2
pointLight.push( new THREE.PointLight(0x00ff00, 8, 0, 1) )
pointLight[1].position.set(0,5,-5);

//// Light 3

pointLight.push( new THREE.PointLight(0x0000ff, 8, 0, 1) )
pointLight[2].position.set(5,5,0);

//// Light 4
pointLight.push( new THREE.PointLight(0xffffff, 8, 0, 1) )
pointLight[3].position.set(-5,5,0);

// Ambient Light
const ambientlight1 = new THREE.AmbientLight(0x8f388d, 5);
scene.add(ambientlight1);

for (let t = 0; t <= pointLight.length - 1; t++) {
    scene.add(pointLight[t]);
    document.querySelector('#light' + String(t)).addEventListener('click', function(){
        pointLight[t].visible = !pointLight[t].visible;
    })
}

///////////////////////////////////////////////////////////

/**
 * Sizes
 */

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    aspect = sizes.width / sizes.height;

    // Update camera
    camera.left = -aspect * frustum;
    camera.right = aspect * frustum;
    camera.top = frustum;
    camera.bottom = -frustum;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//renderer.setClearColor(0xe5e5e5);










/**
 * Animate
 */
let xoay= true;
let elapseold = 0;
let elapseoffset = 0;
let xoaycheck;
let koxoaycheck;

document.querySelector('#xoay').addEventListener('click', function(){
    xoay = !xoay;
    if (xoay){
        xoaycheck = true;
    } else {
        koxoaycheck = true;
    }
})

///////////////////////////////////////////////////////////
const clock = new THREE.Clock()

const tick = () =>
{      
    if (bgvalue) {
        scene.background = new THREE.Color(0x545454);
        plane.visible = true; 
    }
    else {
        scene.background = null; 
        plane.visible = false;
    }

    // Xoay
    const elapsedTime = clock.getElapsedTime();

    if (xoaycheck) {
        elapseoffset += clock.elapsedTime - elapseold;
        xoaycheck = false;
    }

    if (koxoaycheck) {
        elapseold = clock.elapsedTime;
        koxoaycheck = false;
    }
    // Update objects
    if (xoay) {
        objectionxoay.forEach((obj) => {
            obj.rotation.y = .5 * (elapsedTime - elapseoffset);
        })
    }

    // Update Orbital Controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Line for vmh

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

/**
 * OBJLoad
 */
function objectload(link, vatlieu, xoayornot, dragornot, vtx, vty, vtz, scl1, scl2, scl3, namedata) {
    let loader = new PLYLoader()

    loader.load(link, (objfile) => {

        objfile.computeVertexNormals();

        let meshobj = new THREE.Mesh(objfile, vatlieu);

        meshobj.scale.set(scl1, scl2, scl3);
        meshobj.position.set(vtx,vty,vtz);

        meshobj.name = String(namedata);
        if (xoayornot) { objectionxoay.push(meshobj); }

        if (dragornot) { objectiondrag.push(meshobj); }

        objtonghop.add(meshobj);
    });
}

// Custom CSS
canvas.style.pointerEvents = 'none';
togglenen.style.display = 'none';
/////////////////////////////////////////////
tick()
