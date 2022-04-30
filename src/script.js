import './css/style.css'

import * as THREE from 'three'
import gsap from 'gsap'



/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/5.jpg')
gradientTexture.magFilter = THREE.NearestFilter

// Material

const material1 = new THREE.MeshToonMaterial({
    gradientMap: gradientTexture,
    color:0x96ffff
})

const material2 = new THREE.MeshToonMaterial({
    color:0xff96ff,
    gradientMap: gradientTexture
})

const material3 = new THREE.MeshToonMaterial({
    color:0xffff96,
    gradientMap: gradientTexture
})

const material4 = new THREE.MeshToonMaterial({
    color:0x00ff00,
    gradientMap: gradientTexture
})




/* SCSS HEX
$rich-black-fogra-29: #001219ff;
$blue-sapphire: #005f73ff;
$viridian-green: #0a9396ff;
$middle-blue-green: #94d2bdff;
$medium-champagne: #e9d8a6ff;
$gamboge: #ee9b00ff;
$alloy-orange: #ca6702ff;
$rust: #bb3e03ff;
$rufous: #ae2012ff;
$ruby-red: #9b2226ff;*/

// Objects
const mesh1 = new THREE.Mesh(
    //new THREE.TorusGeometry(1, 0.4, 16, 60),
    new THREE.IcosahedronGeometry(2,0),
    material1
)
const mesh2 = new THREE.Mesh(
    new THREE.TetrahedronGeometry(1.5,0),
    material2
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material3
)

const mesh4 = new THREE.Mesh(
    new THREE.SphereGeometry( 1, 64, 16 ),
    material4
)

mesh1.scale.set(1/2,1/2,1/2);
mesh2.scale.set(1/2,1/2,1/2);
mesh3.scale.set(1/2,1/2,1/2);
mesh4.scale.set(1/2,1/2,1/2);

mesh1.position.x = -2
mesh2.position.x = 2.5
mesh3.position.x = -2
mesh4.position.x = 2.5


mesh1.position.y = 0
mesh2.position.y = -3
mesh3.position.y = - 7.5
mesh4.position.y = - 11

scene.add(mesh1, mesh2, mesh3,mesh4)

const sectionMeshes = [ mesh1, mesh2, mesh3, mesh4 ]

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#fdf2e9', 1)
directionalLight.position.set(0, 1, 1)
scene.add(directionalLight)

/**
 * Particles
 */
// Geometry
const particlesCount = 1200
const positions = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = 4 * 0.5 - Math.random() * 4 * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: '#fdf2e9',
    sizeAttenuation: textureLoader,
    size: 0.03
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


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
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)

    if(newSection !== currentSection)
    {
        currentSection = newSection

        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z: '+=1.5'
            }
        )
    }
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate camera
    camera.position.y = - scrollY / sizes.height * 4


    mesh4.rotation.x += deltaTime * 5;
    mesh4.rotation.y += deltaTime * 15;
    // Animate meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()