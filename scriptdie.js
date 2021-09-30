
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/DragControls.js';
import { PLYLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/PLYLoader.js';
import { LineMaterial } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/lines/LineMaterial.js';
import { ConvexGeometry } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/geometries/ConvexGeometry.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';
/*import { Line2 } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/lines/LineGeometry.js';*/
//import * as dat from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/libs/dat.gui.module.js';

let objectionxoay = [];
let objectiondrag = [];

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Board Kiem tra
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

scene.background = new THREE.Color(0x999999);

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
controls.enableDamping = true

camera.position.set(0,0,camerakhoangcach);

camera.lookAt(0,0,0);
scene.add(camera);
controls.update()


// Materials
const verybasicmat = new THREE.MeshBasicMaterial( {
	color: 0xffffff,
    transparent: true,
    opacity: .8
} );

const vmhmatsurface = new THREE.MeshBasicMaterial( {
	color: 0x999999,
    transparent: true,
    opacity: .3
} );

const wireframemat = new THREE.MeshBasicMaterial({
    color: 0xffffff, 
    wireframe: true,
    transparent: true,
    opacity: 0.1
})

const wireframematgeo = new THREE.LineBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: .3,
})

const vmhlinematold = new THREE.LineDashedMaterial({
    color: 0x0026fc,
    dashSize: .3,
    gapSize: 1,
})

const sangbongmat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, 
    side: THREE.DoubleSide,
    shadowSide: THREE.DoubleSide,
    metalness: 0,
    roughness: 0,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    depthTest: false,
    transmission: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0
})

const sangbongmat1 = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, 
    side: THREE.DoubleSide,
    //shadowSide: THREE.DoubleSide,
    metalness: 0,
    roughness: 0,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    depthTest: false,
    transmission: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0
})

const legomat = new THREE.MeshPhysicalMaterial({
    color: 0x2a9df4, 
    //side: THREE.DoubleSide,
    //shadowSide: THREE.DoubleSide,
    metalness: 0,
    roughness: 0,
    transparent: true,
    opacity: 1,
    //depthWrite: false,
    //depthTest: false,
    transmission: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0
})

// Mesh

// OBJLoad 

// Mat Phang
const planeszwidth = 2/3*aspect*frustum;
const planeszheight = aspect*frustum;
const plane = new THREE.Mesh(new THREE.PlaneGeometry(planeszheight, planeszwidth), new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.FrontSide}));


const planewireframe = new THREE.WireframeGeometry(new THREE.PlaneGeometry(planeszheight, planeszwidth));

const planewire = new THREE.LineSegments(planewireframe, wireframematgeo);
const planegroup = new THREE.Group().add(plane).add(planewire);
planegroup.rotateX(-Math.PI/2);
planegroup.position.set(0,-frustum/2,0);

scene.add(planegroup);

//atb
let a = 4;
let b = 2;
objectload('static/SOUND.ply', sangbongmat, false, true, 0, 0, 5, b, b, b, "cac");
objectload('static/CONSTRAINT.ply', sangbongmat1, false, true, 5, 0, 0, a, a, a, "cac");
objectload('static/PLACE.ply', sangbongmat, false, true, -5, 0, 0, a, a, a, "cac");
objectload('static/SCENT.ply', sangbongmat, false, true, 13, 0, 0, a, a, a, "cac");

//drag atb
const controldrag = new DragControls(objectiondrag, camera, canvas);

controldrag.addEventListener( 'dragstart', function ( event ) {
    
	event.object.material.transparent = false;
    controls.enabled = false;
} );

controldrag.addEventListener( 'dragend', function ( event ) {

	event.object.material.transparent = true;
    controls.enabled = true;
} );


//// Light 2

const pointLight2 = new THREE.PointLight(0x000ff, 8)
pointLight2.position.set(0.85,0.48,0.48);

//// Ambient Light
const ambient = new THREE.AmbientLight( 0xffffff, 20);
scene.add( ambient );

//// DirLight1
const light = new THREE.DirectionalLight(0xFFFFFF, 30);
light.position.set(-1, 2, .1);
scene.add(light);


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
    //alpha: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//renderer.setClearColor(0xe5e5e5);










/**
 * Animate
 */


///////////////////////////////////////////////////////////
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    objectionxoay.forEach((obj) => {
        obj.rotation.y = .5 * elapsedTime;
    });

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
        scene.add(meshobj);
        if (xoayornot) { objectionxoay.push(meshobj); }

        if (dragornot) { objectiondrag.push(meshobj); }
    });
}

/////////////////////////////////////////////
tick()
