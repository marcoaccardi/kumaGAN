inlets = 1; // One inlet to receive function names
outlets = 4; // Four outlets: w1_part1, w1_part2, w2_part1, w2_part2

var w1_part1 = new Array(256);
var w1_part2 = new Array(256);
var w2_part1 = new Array(256);
var w2_part2 = new Array(256);

// Utility function to scale values to range [-1, 1]
function scale(val, in_min, in_max, out_min, out_max) {
    return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// Function to split an array into two parts
function split_array(arr) {
    return [arr.slice(0, 256), arr.slice(256)];
}

// Function to generate random noise between -1 and 1
function random_noise() {
    var w1 = [];
    var w2 = [];
    for (var i = 0; i < 512; i++) {
        w1.push(scale(Math.random(), 0, 1, -1, 1));
        w2.push(scale(Math.random(), 0, 1, -1, 1));
    }
    [w1_part1, w1_part2] = split_array(w1);
    [w2_part1, w2_part2] = split_array(w2);
    outlet(0, w1_part1);
    outlet(1, w1_part2);
    outlet(2, w2_part1);
    outlet(3, w2_part2);
}

// Function to generate smoother noise (Simplex-like)
function simplex_noise() {
    var xoff1 = Math.random();  // Random phase offset for w1
    var xoff2 = Math.random() * 1000;  // Different phase offset for w2
    var step1 = Math.random() * 0.05 + 0.01;  // Step size for w1
    var step2 = Math.random() * 0.07 + 0.02;  // Step size for w2
    var amp1 = Math.random() * 0.5 + 0.5;  // Amplitude for w1
    var amp2 = Math.random() * 0.7 + 0.3;  // Different amplitude for w2

    var w1 = [];
    var w2 = [];

    for (var i = 0; i < 512; i++) {
        // Generate w1 and w2 with contrasting behavior
        w1.push(scale(simplex.noise2D(xoff1 + i * step1, 0) * amp1, -1, 1, -1, 1));
        w2.push(scale(simplex.noise2D(xoff2 + i * step2, 0) * amp2, -1, 1, -1, 1));
    }

    [w1_part1, w1_part2] = split_array(w1);
    [w2_part1, w2_part2] = split_array(w2);
    
    outlet(0, w1_part1);
    outlet(1, w1_part2);
    outlet(2, w2_part1);
    outlet(3, w2_part2);
}


// 1D Perlin Noise
var grad = [1, -1]; // Gradients for Perlin noise

function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(t, a, b) {
    return a + t * (b - a);
}

function perlin_noise(x) {
    var x0 = Math.floor(x);
    var x1 = x0 + 1;
    var sx = fade(x - x0);

    var n0 = grad[x0 % 2] * (x - x0);
    var n1 = grad[x1 % 2] * (x - x1);

    return lerp(sx, n0, n1);
}

// Generate Perlin-like noise
function generate_perlin_noise() {
    var xoff1 = Math.random() * 100;  // Random phase offset for w1
    var xoff2 = Math.random() * 1000; // Different random phase offset for w2
    var freq1 = Math.random() * 0.1 + 0.01; // Frequency for w1
    var freq2 = Math.random() * 0.2 + 0.02; // Different frequency for w2
    var amp1 = Math.random() * 0.5 + 0.5;  // Amplitude for w1
    var amp2 = Math.random() * 0.7 + 0.3;  // Different amplitude for w2

    var w1 = [];
    var w2 = [];

    for (var i = 0; i < 512; i++) {
        // Generate w1 and w2 with contrasting behavior
        w1.push(scale(perlin_noise(xoff1 + i * freq1) * amp1, -1, 1, -1, 1));
        w2.push(scale(perlin_noise(xoff2 + i * freq2) * amp2, -1, 1, -1, 1));
    }
    // Split into two parts and send to outlets
    [w1_part1, w1_part2] = split_array(w1);
    [w2_part1, w2_part2] = split_array(w2);
    
    outlet(0, w1_part1);
    outlet(1, w1_part2);
    outlet(2, w2_part1);
    outlet(3, w2_part2);
}

// Main function to handle input from Max
function msg_float(val) {
    if (val == 1) {
        random_noise(); // Trigger random noise generation
    } else if (val == 2) {
        simplex_noise(); // Trigger simplex noise generation
    } else if (val == 3) {
        generate_perlin_noise(); // Trigger perlin noise generation
    }
}
