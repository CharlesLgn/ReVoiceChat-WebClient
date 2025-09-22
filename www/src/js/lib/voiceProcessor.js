class AudioCollector extends AudioWorkletProcessor {
    process(inputs) {
        const input = inputs[0][0]; // mono
        if (input) {
            // Send Float32Array (128 samples) to main thread
            this.port.postMessage(new Float32Array(input));
        }
        return true;
    }
}

class NoiseGate extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [
            { name: 'threshold', defaultValue: -50 }, // dB
            { name: 'attack', defaultValue: 0.05 },   // seconds
            { name: 'release', defaultValue: 0.2 }    // seconds
        ];
    }

    constructor() {
        super();
        this.gain = 0;
        this.open = false;
        this.sampleRate = sampleRate;
    }

    dBToLinear(db) {
        return Math.pow(10, db / 20);
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0][0]; // mono
        const output = outputs[0][0]; // mono
        const threshold = this.dBToLinear(parameters.threshold[0]);
        const attackSamples = Math.max(1, parameters.attack[0] * this.sampleRate);
        const releaseSamples = Math.max(1, parameters.release[0] * this.sampleRate);

        if (!input || input.length === 0) {
            return true;
        }

        // Compute RMS level
        let sum = 0;
        for (let i = 0; i < input.length; i++) {
            sum += input[i] * input[i];
        }
        const rms = Math.sqrt(sum / input.length);

        // Gate logic
        if (rms > threshold) {
            // Gate opens
            this.gain += (1 - this.gain) / attackSamples;
        } else {
            // Gate closes
            this.gain += (0 - this.gain) / releaseSamples;
        }

        // Apply gain
        for (let i = 0; i < input.length; i++) {
            output[i] = input[i] * this.gain;
        }

        return true;
    }
}

registerProcessor("AudioCollector", AudioCollector);
registerProcessor('NoiseGate', NoiseGate);