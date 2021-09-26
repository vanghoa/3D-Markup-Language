//import { PLYLoader } from './node_modules/three/examples/jsm/loaders/PLYLoader.js';
//import {OrbitControls} from '../node_modules/three/examples/js/controls/OrbitControls.js';
//import * as THREE from '../node_modules/three/build/three.js';
//import {DragControls} from '../node_modules/three/examples/js/controls/DragControls.js';
import { PLYLoader } from 'https://unpkg.com/three/examples/jsm/loaders/PLYLoader.js';

//Loading
const textureLoader = new THREE.TextureLoader();

const normalTexture = textureLoader.load('../static/textures/NormalMap.png');

// Board Kiem tra
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
//scene.background = 0xdddddd;

//environment
scene.background = new THREE.Color(0xcbf4ba);

// Objects
const geometry = new THREE.BoxGeometry(.5, .5, .5);

// Materials
const material = new THREE.MeshPhongMaterial({color: 0x44aa88});

// Mesh
const sphere = new THREE.Mesh(geometry,material);
scene.add(sphere);

var objection = [];
objection.push(sphere);

var objectiondrag = [];
objectiondrag.push(sphere);

//OBJLoad
objectload('../static/Sound-1.ply');

//// Light 2

const pointLight2 = new THREE.PointLight(0x000ff, 8)
pointLight2.position.set(0.85,0.48,0.48);
//scene.add(pointLight2);

//const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, .3);
//scene.add(pointLightHelper2);

const light2 = gui.addFolder('Light 2');

light2.add(pointLight2.position, 'y').min(-3).max(3).step(0.01);
light2.add(pointLight2.position, 'x').min(-6).max(3).step(0.01);
light2.add(pointLight2.position, 'z').min(-3).max(3).step(0.01);
light2.add(pointLight2, 'intensity').min(0).max(20).step(1);

const light2color = {
    color: 0xff0000
}

light2.addColor(light2color, 'color').onChange(() => {
    pointLight2.color.set(light2color.color);
}) 
//// Light 3

const ambient = new THREE.AmbientLight( 0xffffff, .3 );
scene.add( ambient );
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);


///////////////////////////////////////////////////////////

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)

// Controls Orbit
const controls = new THREE.OrbitControls(camera, canvas)
//controls.enableDamping = true

camera.position.set(0,0,3);

camera.lookAt(sphere.position);
scene.add(camera);
controls.update()

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
renderer.setClearColor(0xe5e5e5);










/**
 * Animate
 */


///////////////////////////////////////////////////////////
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    objection.forEach((obj) => {
    obj.rotation.y = .5 * elapsedTime;});

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)




    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

/////////////////////////////////////////////////////////// DRAG
/**/ 
const controldrag = new THREE.DragControls(objectiondrag, camera, canvas );














// add event listener to highlight dragged objects

controldrag.addEventListener( 'dragstart', function ( event ) {

	event.object.material.color.set( 0xaaaaaa );
    controls.enabled = false;

} );

controldrag.addEventListener( 'dragend', function ( event ) {

	event.object.material.color.set( 0xffffff );
    controls.enabled = true;

} );

/**
 * OBJLoad
 */
function objectload(link) {
    let loader = new PLYLoader()
    /*
    let mtlloader = new MTLLoader();

    mtlloader.load(mat, (mtl) => {
        mtl.preload();
        loader.setMaterials(mtl);
    })
    */

    loader.load(link, (objfile) => {
        //let objmesh = new THREE.Mesh(objfile, material);
        //objfile.traverse( function ( child ) {
            //if (child.isMesh) {
                //child.material = new THREE.MeshPhysicalMaterial({
                    //color: 0xffffff, 
                    //metalness: 0,
                    //roughness: 0,
                    //reflectivity: 1,
                    //transparent: true,
                    //emissive: 0,
                    //transmission: 1.0,
                    //side: THREE.DoubleSide,
                    //clearcoat: 1.0,
                    //clearcoatRoughness: 0,
                    //fog: true  
                //});
            //}
        //})

        objfile.computeVertexNormals();

        var meshobj = new THREE.Mesh(objfile, new THREE.MeshPhysicalMaterial({
                    color: 0xffffff, 
                    metalness: 0,
                    roughness: 0,
                    transparent: true,
                    transmission: 1.0,
                    side: THREE.DoubleSide,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0,
        }))

        scene.add(meshobj);

        //scene.add(objfile);
        objectiondrag.push(meshobj);
        console.log(objectiondrag.length);
    });
    
    
    
   
}



/**/
tick()