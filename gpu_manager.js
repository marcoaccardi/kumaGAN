const { exec } = require('child_process');
const m = require('max-api');

// Command to check GPU usage
const cmd = 'nvidia-smi --query-gpu=utilization.gpu,utilization.memory --format=csv -l 1';

let gpuMonitor;

// Add a handler in Max to start monitoring
m.addHandler("startMonitoring", (interval) => {
    if (gpuMonitor) {
        gpuMonitor.kill(); // Stop any existing monitoring
    }

    // Set interval to run nvidia-smi command every 'interval' milliseconds
    gpuMonitor = exec(cmd);

    gpuMonitor.stdout.on('data', (data) => {
        // Output the GPU usage to Max console
        m.outlet("gpu_usage", `GPU | MEM: ${data}`);
    });

    gpuMonitor.stderr.on('data', (err) => {
        // Output any errors
        m.outlet("error", `Error: ${err}`);
    });
});

// Add a handler in Max to stop monitoring
m.addHandler("stopMonitoring", () => {
    if (gpuMonitor) {
        gpuMonitor.kill(); // Stop the monitoring
        m.outlet('Monitoring stopped');
    }
});
