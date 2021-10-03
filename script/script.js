
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/DragControls.js';
import { PLYLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/PLYLoader.js';
import { ConvexGeometry } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/geometries/ConvexGeometry.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js'; 

/////////////////////////////
/*
import * as THREE from '../three.js/build/three.module.js';
import { OrbitControls } from '../three.js/examples/jsm/controls/OrbitControls.js';
import { DragControls } from '../three.js/examples/jsm/controls/DragControls.js';
import { PLYLoader } from '../three.js/examples/jsm/loaders/PLYLoader.js';
import { ConvexGeometry } from '../three.js/examples/jsm/geometries/ConvexGeometry.js';
import { GLTFLoader } from '../three.js/examples/jsm/loaders/GLTFLoader.js';
*/
/////////////////////////////
/*
//import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
*/
/////////////////////////////
/*
import { Line2 } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/lines/LineGeometry.js';
*/
/////////////////////////////
//import * as dat from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/libs/dat.gui.module.js';

let objectionxoay = [];
let objectiondrag = [];
let soanchor = 8;
// Anchor
let anchortong = new THREE.Object3D();
let objectiondragcontainer = [];
let controlarray = [];
let anchposition = [];
let anchcolor = [];
let vmhhelpercheck = true;
// Data drag
let datadragable =[];
let controlarraydata = [];

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

let texture = [];

for (let t = 0; t <= 3; t++) {
    texture.push(new THREE.TextureLoader().load('./static/Street View 360 '+ String(t) + '.jpg'));
}

let texturemat = new THREE.MeshBasicMaterial({map: texture[0], transparent: true});
let geoenv = new THREE.SphereGeometry(30,60,40);
geoenv.scale(-1,1,1);
let meshenv = new THREE.Mesh(geoenv, texturemat);
let dibay = 1;
let tanbien = false;
let hienra = false;
let lightness = 1;
scene.add(meshenv)

const dichuyenbtn = document.querySelector('#dichuyen');
dichuyenbtn.addEventListener('click', function(){
    teleport(dibay);
    dibay++;
    if (dibay == 3) {document.querySelector('#dichuyen').innerHTML = 'đến nhà diệu li';}
    if (dibay > 3) {dibay = 0; document.querySelector('#dichuyen').innerHTML = 'quay lại nhà BA nhá';}
    if (dibay == 1) {document.querySelector('#dichuyen').innerHTML = 'lên nhà a M';}
    console.log('1');
})

function teleport(maybay) {
    dichuyenbtn.disabled = true;
    tanbien = true;

    setTimeout(function(){
        tanbien = false;
        meshenv.material.map = texture[maybay];
        hienra = true;

    },2500);

    setTimeout(function(){
        hienra = false;
        dichuyenbtn.disabled = false;
    },5000);
}

/*
scene.background = new THREE.CubeTextureLoader()
	.setPath( 'static/textures/' )
	.load( [
		'px.png',
		'nx.png',
		'py.png',
		'ny.png',
		'pz.png',
		'nz.png'
	] );
*/
//environment
scene.background = new THREE.Color("hsl(0, 0%, 100%)");

/**
 * Camera
 */
// Base camera
let aspect = sizes.width / sizes.height;
const frustum = 10;
const camerakhoangcach = 30;
const camera = new THREE.OrthographicCamera(-aspect * frustum, aspect * frustum, frustum, -frustum, 1, 1000)
camera.zoom = .5;
camera.updateProjectionMatrix();

// Controls Orbit
const controls = new OrbitControls(camera, canvas)
//controls.enableDamping = true

camera.position.set(0,0,camerakhoangcach);

camera.lookAt(0,0,0);
scene.add(camera);
controls.update()


// Materials
const verybasicmat = new THREE.MeshBasicMaterial( {
	color: 0xffffff
} );

const vmhmatsurface = new THREE.MeshBasicMaterial( {
	color: 0x0000ff,
    transparent: true,
    opacity: .16
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

/*
const vmhlinemat = new LineMaterial({
    color: 0x0026fc,
    dashSize: .3,
    gapSize: 1,
    linewidth: .003,
    dashed: true,
    //vertexColors: true,
    //alphaToCoverage: true,
}) 
*/
const vmhlinematold = new THREE.LineDashedMaterial({
    color: 0xffffff,
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
    clearcoatRoughness: 0,
})

const legomat = new THREE.MeshPhysicalMaterial({
    color: 0xbfbf, 
    emissive: 0x383838,
    //side: THREE.DoubleSide,
    //shadowSide: THREE.DoubleSide,
    metalness: 0,
    roughness: .5,
    transparent: true,
    opacity: .7,
    transmission: .4
})

// Ambient

// Mat Phang
let aspectplane = aspect;
if (aspect < 1) {aspectplane = 1/aspect}
if (sizes.width < sizes.height) {aspectplane *= 3/4}

const planeszwidth = aspectplane*frustum;
const planeszheight = aspectplane*frustum;
const plane = new THREE.Mesh(new THREE.PlaneGeometry(planeszheight, planeszwidth), new THREE.MeshStandardMaterial({color: 0x323232, side: THREE.FrontSide, roughness: 0}));

const planewireframe = new THREE.WireframeGeometry(new THREE.PlaneGeometry(planeszheight, planeszwidth));

const planewire = new THREE.LineSegments(planewireframe, wireframematgeo);
const planegroup = new THREE.Group().add(plane).add(planewire);
planegroup.rotateX(-Math.PI/2);
planegroup.position.set(0,-frustum/2,0);

scene.add(planegroup);

//atb

objectload('./static/LEGO-copy.ply', legomat, false, true, -planeszheight/2, planegroup.position.y + 1, -planeszwidth/2, 1.5, 1.5, 1.5, "atb");
objectload('./static/LEGO-cut.ply', legomat, false, true, -planeszheight/2, planegroup.position.y + 2, -planeszwidth/2, 1.5, 1.5, 1.5, "atb");

//drag atb
const controldrag = new DragControls(objectiondrag, camera, canvas);
let atbmatdrag;

controldrag.addEventListener( 'dragstart', function ( event ) {
    
    atbmatdrag = event.object.material;
	event.object.material = verybasicmat;
    controls.enabled = false;
    for (let s = 0; s <= controlarray.length - 1; s++){
            controlarray[s].enabled = false;
    }
    
    for (let s = 0; s <= controlarraydata.length - 1; s++){
        controlarraydata[s].enabled = false;
}
} );

controldrag.addEventListener( 'dragend', function ( event ) {

	event.object.material = atbmatdrag;
    atbmatdrag = null;
    controls.enabled = true;
    for (let s = 0; s <= controlarray.length - 1; s++){
            controlarray[s].enabled = true;
    }
    
    for (let s = 0; s <= controlarraydata.length - 1; s++){
        controlarraydata[s].enabled = true;
}
} );

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
            controlarray.forEach((ele) => {
                ele.dispose();
            })

            for (let i = 0; i <= (anchortong.children.length - 1); i++) {
                anchortong.children[i].remove(anchortong.children[i].children[0])
            }

            scene.remove(anchortong);
            objectiondragcontainer = [];
            controlarray = [];
            anchposition = [];
            //anchcolor = [];

            ///////////////////
            for (let dem = -Math.floor(soanchorx/2), colordem = 0, nameanc = 0; dem <= soanchorx -1 -Math.floor(soanchorx/2); dem++, colordem+=.2, nameanc++) {
                wireframeload('./static/CAINOI2.ply', './static/CAINAP.ply', false, dem*2.3,1,0, colordem, nameanc);
            }
            ////////// FUCK2
            for (let k = 0; k <= controlarray.length - 1; k++) 
            {
                controlarray[k].addEventListener('dragstart', function(event){
                    event.object.material.transparent = false;
                    disenabledrag(controlarray /**array cua ban */, k, controlarraydata /**cac array khac */, false);
                });
            
                controlarray[k].addEventListener('drag', function(event){
                    let tramcamqua = new THREE.Vector3();
                    event.object.getWorldPosition(tramcamqua);
                    anchposition[k] = tramcamqua;
                    /*
                    anchcolor[k] = event.object.material.color.r;
                    anchcolor[(k+1)] = event.object.material.color.g;
                    anchcolor[(k+2)] = event.object.material.color.b;*/
                }); 
            
                controlarray[k].addEventListener('dragend', function(event){
                    event.object.material.transparent = true;
                    disenabledrag(controlarray /**array cua ban */, k, controlarraydata /**cac array khac */, true);
                    /*
                    anchcolor[k] = event.object.material.color.r;
                    anchcolor[(k+1)] = event.object.material.color.g;
                    anchcolor[(k+2)] = event.object.material.color.b;*/


                    let tramcamqua2 = new THREE.Vector3();
                    objectiondragcontainer[k][0].getWorldPosition(tramcamqua2);
                
                }); 
            }
            scene.add(anchortong);
}
generateanchor(soanchor);
//////
const helpervmh = document.querySelector('#togglehelper');

helpervmh.addEventListener('click', function(){
    vmhhelpercheck = !vmhhelpercheck;
    if (vmhhelpercheck) {
        helpervmh.style.backgroundColor = '#0000ff'
    } else {
        helpervmh.style.backgroundColor = '#8585ff'
    }
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
let pointmesh;


function linevmh() {
    scene.remove(pointline);
    scene.remove(pointmesh);
    let pointgraph = [];
    //let colorgraph = [];

    for (let v = 0; v <= (anchposition.length - 2); v++) {
        for (let t = v + 1; t <= (anchposition.length - 1); t++) {
            pointgraph.push(anchposition[v], anchposition[t]);
/*
            pointgraph.push(anchposition[v].x, anchposition[v].y, anchposition[v].z, anchposition[t].x, anchposition[t].y, anchposition[t].z);
            colorgraph.push(anchcolor[v], anchcolor[v+1], anchcolor[v+2], anchcolor[t], anchcolor[t+1], anchcolor[t+2]);
            */
        }
    }
/*
    const pointmetry = new LineGeometry();
    pointmetry.setPositions(pointgraph);
    pointmetry.setColors(colorgraph);
          pointline = new Line2(pointmetry, vmhlinemat); */
          
    if (anchposition.length >= 7) {
    const pointsurface = new ConvexGeometry(anchposition);
    pointmesh = new THREE.Mesh(pointsurface, vmhmatsurface);
    scene.add(pointmesh);
    }
    
    const pointmetry = new THREE.BufferGeometry().setFromPoints(pointgraph);
    pointline = new THREE.Line(pointmetry, vmhlinematold);
    
    pointline.computeLineDistances();
    scene.add(pointline);
}

//// Light 2

const pointLight2 = new THREE.PointLight(0x000ff, 1, 0, 1)
pointLight2.position.set(0,2,5);
scene.add(pointLight2);

//// Light 1
const pointlight1 = new THREE.PointLight(0x00ff00, 1, 0, 1);
pointlight1.position.set(0,2,-5);
scene.add(pointlight1);

//// Light 3

const pointLight3 = new THREE.PointLight(0xff0000, 1, 0, 1)
pointLight3.position.set(5,2,0);
scene.add(pointLight3);

//// Light 4
const pointlight4 = new THREE.PointLight(0xffffff, 1, 0, 1);
pointlight4.position.set(-5,2,0);
scene.add(pointlight4);

// Ambient Light
const ambientlight1 = new THREE.AmbientLight(0x8f388d, 1);
scene.add(ambientlight1);


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

    // Travel
    if (tanbien) {
        texturemat.opacity-=0.01;
        lightness-=0.01;
        scene.background.setHSL(0,0,lightness);
    }
    if (hienra) {
        texturemat.opacity+=0.01;
        lightness+=0.01;
        scene.background.setHSL(0,0,lightness);
    }

    // Update objects
    objectionxoay.forEach((obj) => {
        obj.rotation.y = .5 * elapsedTime;
    });

    // Update Orbital Controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Line for vmh
    if (vmhhelpercheck) {
        linevmh();
    }
    else {
        scene.remove(pointline);
        scene.remove(pointmesh);
    }

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

/////////////////////////////////////////////////////////// DRAG
/**/ 

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

function wireframeload(linkhop, linknap, xoayornot, diemx, diemy, diemz, hslhue, nameanchor) {
    let loader = new PLYLoader()
    let meshtrunggian = new THREE.Object3D();
    let meshcontainer = new THREE.Object3D();
    let meshobjhop;
    let meshobjwirehop;
    let meshobjnap;
    let meshobjwirenap;
    const vatlieuhop = new THREE.MeshBasicMaterial( {
        transparent: true,
        opacity: 1
    } );
    const vatlieunap = new THREE.MeshBasicMaterial( {
        transparent: true,
        opacity: 1
    } );
    vatlieuhop.color.setHSL(hslhue,1,.5);
    vatlieunap.color.setHSL(hslhue,1,.3);
    anchcolor.push(vatlieuhop.color.r, vatlieuhop.color.g, vatlieuhop.color.b);


    loader.load(linknap, (objfile) => {
        objfile.computeVertexNormals();
        meshobjnap = new THREE.Mesh(objfile, wireframemat);
        meshobjwirenap = new THREE.Mesh(objfile, vatlieunap);
        meshobjwirenap.position.y = .7;

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

    anchortong.add(meshcontainer);
/// pos
////////

    meshcontainer.name = String(nameanchor);

    draganchor(nameanchor, meshcontainer);

    //return meshcontainer;
}

const slidedata = document.querySelector("#slidedata");
let cooloff = false;
let datamaterialdrag = [];

slidedata.oninput = function() {
    if (!cooloff) {
        datadragable.forEach((cac) => {
            cac.forEach((lon) => {
                lon.traverse((child) => {
                    if (child.isMesh) {
                        child.geometry.dispose();
                        child.material.dispose();
                    }
                })
            })
        })

        for (let i = 0; i <= (scene.children.length - 1); i++) {
            if (scene.children[i].name == "concac") { 
                scene.remove(scene.children[i]);
            }
        }

        controlarraydata.forEach((elem) => {
            elem.dispose();
        })    

        controlarraydata=[];
        datadragable=[];

        GLTFloaddata('./static/data/'+ slidedata.value + '.glb', 2.5, 2.5, 2.5, 0, planegroup.position.y-1.5, 0, 'concac', true, true, 0);
        cooloff = true;

        document.querySelector('#data').innerHTML = 'Chọn data (chờ 2 giây rồi kéo lại nha &#128549)';
        console.log(slidedata.disabled);
        slidedata.disabled = true;

        setTimeout(function(){
            document.querySelector('#data').innerHTML = 'Chọn data (chờ 1 giây rồi kéo lại nha &#128549)';
        }, 1000);
    
        setTimeout(function(){
            document.querySelector('#data').innerHTML = 'Chọn data';
            cooloff = false;
            slidedata.disabled = false;
        }, 2000);
    } 

}

GLTFloaddata('./static/data/'+ slidedata.value + '.glb', 2.5, 2.5, 2.5, 0, planegroup.position.y-1.5, 0, 'concac', true, true, 0);

function GLTFloaddata(link, sclx, scly, sclz, vtx, vty, vtz, identity, xoayornot, dragornot, thutu) {
    const loader = new GLTFLoader();
    loader.load( link , function (gltf) {
        gltf.scene.scale.set(sclx,scly,sclz);
        gltf.scene.position.set(vtx,vty,vtz);
        gltf.scene.name = String(identity);
        //
        scene.add(gltf.scene);
        if (xoayornot) { objectionxoay.push(gltf.scene); }

        if (dragornot) { 
            datadragable.push([gltf.scene]);
            controlarraydata.push(new DragControls(datadragable[thutu], camera, canvas));
            controlarraydata[thutu].transformGroup = true;

            controlarraydata[thutu].addEventListener( 'dragstart', function ( event ) {
                datamaterialdrag = [];

                event.object.traverse((child) => {
                    if (child.isMesh) {
                        datamaterialdrag.push(child.material);
                        child.material = verybasicmat;
                    }
                })

                disenabledrag(controlarraydata /**array cua ban */, thutu, controlarray /**cac array khac */, false);
            } );
            
            controlarraydata[thutu].addEventListener( 'dragend', function ( event ) {

                let mc = 0;

                event.object.traverse((child) => {
                    if (child.isMesh) {
                        child.material = datamaterialdrag[mc];
                        mc++;
                    }
                })

                datamaterialdrag = [];

                disenabledrag(controlarraydata /**array cua ban */, thutu, controlarray /**cac array khac */, true);
            } );

         }

    })
}

function disenabledrag(arrayofu, thutunao, otherarray, enordis) {
    controldrag.enabled = enordis;
    controls.enabled = enordis;
    for (let s = 0; s <= arrayofu.length - 1; s++){
        if (s != thutunao) {
            arrayofu[s].enabled = enordis;
        }
    }
    for (let s = 0; s <= otherarray.length - 1; s++){
            otherarray[s].enabled = enordis;
    }
    
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
    if (x <= 10 && x >= 4)  {
        generateanchor(x);
    } else if (x > 10) {
        alert("Nhiều thế có hiển thị được hết đâu");
    } else if (x < 4) {
        alert("Phải nhiều hơn hoặc bằng 4 để tạo ra khối đa diện lồi");
    }
}

/**/

// Chuc nang cut
document.addEventListener('keydown', function (e) {
    if (e.code === "KeyB") {  
        chucnangcut();
    } else if (e.code === "KeyN") {

    }
});


function chucnangcut() {
    for (let i = 0; i <= (scene.children.length - 1); i++) {
        if (scene.children[i].name === "concac") {
            scene.children[i].visible = !scene.children[i].visible;
            //scene.children[i].traverse((child) => {
                //if (child.isMesh) {
                    //child.material.visible = false;
                //}
            //});
        }
    }
}



/////////////////////////////////////////////
document.querySelector('#xoamoithu').addEventListener('click', function(){disposeHierarchy(scene, disposeNode)});
console.log(scene);
tick()

function disposeNode (node)
{
    if (node instanceof THREE.Mesh)
    {
        if (node.geometry)
        {
            node.geometry.dispose ();
        }

        if (node.material)
        {
            if (node.material instanceof THREE.MeshFaceMaterial)
            {
                $.each (node.material.materials, function (idx, mtrl)
                {
                    if (mtrl.map)               mtrl.map.dispose ();
                    if (mtrl.lightMap)          mtrl.lightMap.dispose ();
                    if (mtrl.bumpMap)           mtrl.bumpMap.dispose ();
                    if (mtrl.normalMap)         mtrl.normalMap.dispose ();
                    if (mtrl.specularMap)       mtrl.specularMap.dispose ();
                    if (mtrl.envMap)            mtrl.envMap.dispose ();
                    if (mtrl.alphaMap)          mtrl.alphaMap.dispose();
                    if (mtrl.aoMap)             mtrl.aoMap.dispose();
                    if (mtrl.displacementMap)   mtrl.displacementMap.dispose();
                    if (mtrl.emissiveMap)       mtrl.emissiveMap.dispose();
                    if (mtrl.gradientMap)       mtrl.gradientMap.dispose();
                    if (mtrl.metalnessMap)      mtrl.metalnessMap.dispose();
                    if (mtrl.roughnessMap)      mtrl.roughnessMap.dispose();

                    mtrl.dispose ();    // disposes any programs associated with the material
                });
            }
            else
            {
                if (node.material.map)              node.material.map.dispose ();
                if (node.material.lightMap)         node.material.lightMap.dispose ();
                if (node.material.bumpMap)          node.material.bumpMap.dispose ();
                if (node.material.normalMap)        node.material.normalMap.dispose ();
                if (node.material.specularMap)      node.material.specularMap.dispose ();
                if (node.material.envMap)           node.material.envMap.dispose ();
                if (node.material.alphaMap)         node.material.alphaMap.dispose();
                if (node.material.aoMap)            node.material.aoMap.dispose();
                if (node.material.displacementMap)  node.material.displacementMap.dispose();
                if (node.material.emissiveMap)      node.material.emissiveMap.dispose();
                if (node.material.gradientMap)      node.material.gradientMap.dispose();
                if (node.material.metalnessMap)     node.material.metalnessMap.dispose();
                if (node.material.roughnessMap)     node.material.roughnessMap.dispose();

                node.material.dispose ();   // disposes any programs associated with the material
            }
        }
    }
}   // disposeNode

function disposeHierarchy (node, callback)
{
    for (var i = node.children.length - 1; i >= 0; i--)
    {
        var child = node.children[i];
        disposeHierarchy (child, callback);
        callback (child);
    }
}

