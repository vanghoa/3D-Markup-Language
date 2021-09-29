
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/DragControls.js';
import { PLYLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/PLYLoader.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';
//import * as dat from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/libs/dat.gui.module.js';

let objectionxoay = [];
let objectiondrag = [];
let soanchor = 3;
//
let anchortong = new THREE.Object3D();
let objectiondragcontainer = [];
let controlarray = [];
let anchposition = [];
let anchor = [];
//
let vmhhelpercheck = false;

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

//environment
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
//controls.enableDamping = true

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

const wireframemat = new THREE.MeshBasicMaterial({
    color: 0x000000, 
    wireframe: true,
})

const wireframematgeo = new THREE.LineBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: .3,
})

const vmhlinemat = new THREE.LineDashedMaterial({
    color: 0x0026fc,
    dashSize: .3,
    gapSize: 1
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
    clearcoatRoughness: 0,
})

// Mesh

// OBJLoad 
let amb = {
    //sound: objectload('static/Tree.ply', sangbongmat, true)
};

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

//Data
let data = [
    objectload('static/Tree1.ply', sangbongmat, true, planeszheight/2, planegroup.position.y, -planeszwidth/2, .75, .75, .75)
];


// Anchor Container
anchortong.position.set(0,planegroup.position.y + .5, planeszwidth/2 - .5);

/////////////////////////////////////////////// FUCK
function draganchor(n, die) {

    let helpme = [die];
    objectiondragcontainer.push(helpme);

    let controlarray1 = new DragControls(objectiondragcontainer[n], camera, canvas);
    controlarray.push(controlarray1);

    let tramcamqua = new THREE.Vector3();
    objectiondragcontainer[n][0].getWorldPosition(tramcamqua);
    anchposition.push(tramcamqua);

}

function generateanchor(soanchorx) {

            console.log(anchortong.children);
            for (let i = 0; i <= (anchortong.children.length - 1); i++) {
                anchortong.children[i].remove(anchortong.children[i].children[0])
                //anchortong.remove(anchortong.children[i]);
            }

            scene.remove(anchortong);
            objectiondragcontainer = [];
            controlarray = [];
            anchposition = [];
            anchor = [];
            console.log('okla');

            ///////////////////

            for (let dem = -Math.floor(soanchorx/2), colordem = 0, nameanc = 0; dem <= soanchorx -1 -Math.floor(soanchorx/2); dem++, colordem+=.2, nameanc++) {
                anchor.push(wireframeload('static/hop-nhoo.ply', 'static/hop-to-nap.ply', false, dem*2.3,0,0, colordem, nameanc))
            }
            ////////// FUCK2
            for (let k = 0; k <= controlarray.length - 1; k++) 
            {
                controlarray[k].addEventListener('dragstart', function(event){
                    event.object.material.transparent = false;
                    for (let s = 0; s <= controlarray.length - 1; s++){
                        if (s != k) {
                            controlarray[s].enabled = false;
                        }
                    }
                    controls.enabled = false;
                    controldrag.enabled = false;
                });
            
                controlarray[k].addEventListener('drag', function(event){
                    let tramcamqua = new THREE.Vector3();
                    event.object.getWorldPosition(tramcamqua);
                    anchposition[k] = tramcamqua;
                }); 
            
                controlarray[k].addEventListener('dragend', function(event){
                    event.object.material.transparent = true;
                    for (let s = 0; s <= controlarray.length - 1; s++){
                        if (s != k) {
                            controlarray[s].enabled = true;
                        }
                    }
                    controls.enabled = true;
                    controldrag.enabled = true;
                
                    let tramcamqua = new THREE.Vector3();
                    event.object.getWorldPosition(tramcamqua);
                    anchposition[k] = tramcamqua;

                    let tramcamqua2 = new THREE.Vector3();
                    objectiondragcontainer[k][0].getWorldPosition(tramcamqua2);
                
                }); 
            }
            scene.add(anchortong);
}
generateanchor(soanchor);
//////
document.querySelector('#togglehelper').addEventListener('click', function(){
    vmhhelpercheck = !vmhhelpercheck;
});

// Vung Ma Hoa
let vmh;
const slidevmh = document.querySelector('#slidevmh');
const vmhrect = document.querySelector('#vmhrect');
const kickvmh = document.querySelector('#kickhoatvmh');
const vmhtri = document.querySelector('#vmhtri');
const vmhxoa = document.querySelector('#vmhxoa');

function vmhcreate(geometryvmh){
    scene.remove(vmh);
    const wireframe = new THREE.WireframeGeometry(geometryvmh);

    vmh = new THREE.LineSegments(wireframe, wireframematgeo);

    scene.add(vmh);    
}

kickvmh.addEventListener('click', function(){
        vmhcreate(new THREE.OctahedronGeometry(frustum/2,Number(slidevmh.value))); 
});

slidevmh.oninput = function() {
        vmhcreate(new THREE.OctahedronGeometry(frustum/2,Number(slidevmh.value)));
}

vmhrect.addEventListener('click', function(){
        vmhcreate(new THREE.BoxGeometry(frustum, frustum, frustum));
});

vmhtri.addEventListener('click', function(){
        vmhcreate(new THREE.ConeGeometry(planeszwidth/2, frustum, 3));
        vmh.position.z = 0;
});

vmhxoa.addEventListener('click', function(){
        scene.remove(vmh);
});

// Line VMH
let pointline;


function linevmh() {
    scene.remove(pointline);
    let pointgraph = [];

    for (let v = 0; v <= (anchposition.length - 2); v++) {
        for (let t = v + 1; t <= (anchposition.length - 1); t++) {
            pointgraph.push(anchposition[v], anchposition[t]);
        }
    }

    const pointmetry = new THREE.BufferGeometry().setFromPoints(pointgraph);
          pointline = new THREE.Line(pointmetry, vmhlinemat);
          pointline.computeLineDistances();
    scene.add(pointline);
}


//// Light 2

const pointLight2 = new THREE.PointLight(0x000ff, 8)
pointLight2.position.set(0.85,0.48,0.48);
//scene.add(pointLight2);

//const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, .3);
//scene.add(pointLightHelper2);

//const light2 = gui.addFolder('Light 2');

//light2.add(pointLight2.position, 'y').min(-3).max(3).step(0.01);
//light2.add(pointLight2.position, 'x').min(-6).max(3).step(0.01);
//light2.add(pointLight2.position, 'z').min(-3).max(3).step(0.01);
//light2.add(pointLight2, 'intensity').min(0).max(20).step(1);

//const light2color = {
//    color: 0xff0000
//}

//light2.addColor(light2color, 'color').onChange(() => {
//    pointLight2.color.set(light2color.color);
//}) 

//// Ambient Light
const ambient = new THREE.AmbientLight( 0xffffff, .3 );
scene.add( ambient );

//// DirLight1
const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(-1, 2, 4);
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
    objectionxoay.forEach((obj) => {
        obj.rotation.y = .5 * elapsedTime;
    });

    // Update Orbital Controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Line for vmh
    if (vmhhelpercheck) {linevmh();}
    else {scene.remove(pointline);}

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

/////////////////////////////////////////////////////////// DRAG
/**/ 
const controldrag = new DragControls(objectiondrag, camera, canvas);
//controldrag.transformGroup = true;


//const controldragcontainer = new DragControls(objectiondragcontainer, camera, canvas);
//controldrag.transformGroup = true;











// add event listener to highlight dragged objects
/*
let wrld = new THREE.Vector3();
let wrld2 = new THREE.Vector3();
let wrld3 = new THREE.Vector3();

controldragcontainer.addEventListener( 'dragstart', function ( event ) {
    
	event.object.material.transparent = false;
    controls.enabled = false;
    controldrag.enabled = false;
    event.object.getWorldPosition(wrld);
    console.log(wrld);
    anchor[2].getWorldPosition(wrld2);
    console.log(wrld2);  

    let anchorfake = anchortong.getObjectByName('2');
    anchorfake.getWorldPosition(wrld3);
    console.log(wrld3);
} );

controldragcontainer.addEventListener( 'dragend', function ( event ) {

	event.object.material.transparent = true;
    controls.enabled = true;
    controldrag.enabled = true;
    event.object.getWorldPosition(wrld);
    console.log(wrld);
    anchor[2].getWorldPosition(wrld2);
    console.log(wrld2);

    let anchorfake = anchortong.getObjectByName('2');
    anchorfake.getWorldPosition(wrld3);
    console.log(wrld3);
} );
*/

/////////////////
controldrag.addEventListener( 'dragstart', function ( event ) {
    
	event.object.material.transparent = false;
    controls.enabled = false;
    for (let s = 0; s <= controlarray.length - 1; s++){
            controlarray[s].enabled = false;
    }
} );

controldrag.addEventListener( 'dragend', function ( event ) {

	event.object.material.transparent = true;
    controls.enabled = true;
    for (let s = 0; s <= controlarray.length - 1; s++){
            controlarray[s].enabled = true;
    }
} );
/**
 * OBJLoad
 */
function objectload(link, vatlieu, xoayornot, vtx, vty, vtz, scl1, scl2, scl3) {
    let loader = new PLYLoader()

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
        //scene.add(objfile);
        //console.log(objectiondrag.length);

        objfile.computeVertexNormals();

        let meshobj = new THREE.Mesh(objfile, vatlieu);

        meshobj.scale.set(scl1, scl2, scl3);
        meshobj.position.set(vtx,vty,vtz);

        scene.add(meshobj);
        if (xoayornot) { objectionxoay.push(meshobj); }

        objectiondrag.push(meshobj);

        return meshobj;
    });
}

function wireframeload(linkhop, linknap, xoayornot, diemx, diemy, diemz, hslhue, nameanchor) {
    let loader = new PLYLoader()
    let meshtrunggian = new THREE.Object3D();
    let meshcontainer = new THREE.Object3D();
    let meshobjhop;
    let meshobjwirehop;
    let meshobjnap;
    let meshobjwirenap;
    let objectiondragsub = [];
    const vatlieuhop = new THREE.MeshBasicMaterial( {
        transparent: true,
        opacity: .8
    } );
    const vatlieunap = new THREE.MeshBasicMaterial( {
        transparent: true,
        opacity: .8
    } );
    vatlieuhop.color.setHSL(hslhue,1,.5);
    vatlieunap.color.setHSL(hslhue,1,.3);


    loader.load(linknap, (objfile) => {
        objfile.computeVertexNormals();
        meshobjnap = new THREE.Mesh(objfile, wireframemat);
        meshobjwirenap = new THREE.Mesh(objfile, vatlieunap);
        //meshobjnap.position.y = 1;
        meshobjwirenap.position.y = .3;

        meshobjwirenap.add(meshobjnap);
        meshtrunggian.add(meshobjwirenap);


        //meshcontainer.add(meshgroupnap);

    });

    loader.load(linkhop, (objfile) => {
        objfile.computeVertexNormals();
        meshobjhop = new THREE.Mesh(objfile, wireframemat);
        meshobjwirehop = new THREE.Mesh(objfile, vatlieuhop);

        meshobjhop.add(meshtrunggian);
        meshobjwirehop.add(meshobjhop);
        meshcontainer.add(meshobjwirehop);

        //meshcontainer.add(meshgrouphop);

    });


    meshcontainer.position.set(diemx,diemy,diemz);

    if (xoayornot) { objectionxoay.push(meshcontainer); }
    //objectiondragcontainer.push(objectiondragsub.push(meshcontainer));

    anchortong.add(meshcontainer);
/// pos
////////

    meshcontainer.name = String(nameanchor);

    draganchor(nameanchor, meshcontainer);

    return meshcontainer;
}

GLTFloaddata();

function GLTFloaddata() {
    const loader = new GLTFLoader();
    loader.load('static/Tree.glb', function (gltf) {
        scene.add(gltf.scene);
    })
}


/**
 * Doi Goc Nhin
 */
document.querySelector('#rotx').addEventListener('click', function(){changeview('x',1,'y','z')});
document.querySelector('#roty').addEventListener('click', function(){changeview('y',1,'x','z')});
document.querySelector('#rotz').addEventListener('click', function(){changeview('z',1,'x','y')});
document.querySelector('#rot-x').addEventListener('click', function(){changeview('x',-1,'y','z')});
document.querySelector('#rot-y').addEventListener('click', function(){changeview('y',-1,'x','z')});
document.querySelector('#rot-z').addEventListener('click', function(){changeview('z',-1,'x','y')});

function changeview(propertyassign, value, propertyassign1, propertyassign2) {
    camera.position[propertyassign] = value*camerakhoangcach;
    camera.position[propertyassign1] = 0;
    camera.position[propertyassign2] = 0;
    camera.updateProjectionMatrix();
    controls.update(camera.position);
}

document.querySelector('#containerno').addEventListener('click', numbercontainer);

function numbercontainer() {
    let x = Number(document.querySelector('#novalue').value);
    if (x < 10)  {
        generateanchor(x);
    } else {
        alert("Nhiều thế có hiển thị được hết đâu");
    }
}

/**/
tick()