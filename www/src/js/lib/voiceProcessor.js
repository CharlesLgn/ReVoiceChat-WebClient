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
        this.smoothRms = 0;
        this.gateFloor = this.dBToLinear(-80);
        this.smoothing = 0.9;
    }

    dBToLinear(db) {
        return Math.pow(10, db / 20);
    }

    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    };

    process(inputs, outputs, parameters) {
        const input = inputs[0][0]; // mono
        const output = outputs[0][0]; // mono
        const threshold = this.dBToLinear(parameters.threshold[0]);
        const attackCoeff = Math.exp(-1 / (parameters.attack[0] * this.sampleRate));
        const releaseCoeff = Math.exp(-1 / (parameters.release[0] * this.sampleRate));

        if (!input || input.length === 0) {
            return false;
        }

        // Compute RMS level
        let sum = 0;
        for (let sample of input) {
            sum += sample ** 2;
        }
        const rms = Math.sqrt(sum / input.length);

        this.smoothRms = this.smoothRms * this.smoothing + rms * (1 - this.smoothing);

        // Gate logic
        if (this.smoothRms > threshold) {
            // Gate open
            this.gain += (1 - this.gain) * attackCoeff;
        } else {
            // Gate close
            this.gain += (0 - this.gain) * releaseCoeff;
        }

        // Clamp gain between gateFloor and 0dB
        this.gain = this.clamp(this.gain, this.gateFloor, 1);

        // Apply gain
        for (let i = 0; i < input.length; i++) {
            output[i] = input[i] * this.gain;
        }

        console.log("RMS : ", rms, " | SRMS : ", this.smoothRms)
        console.log("attackCoeff : ", attackCoeff, " | releaseCoeff : ", releaseCoeff)
        console.log("gain : ", this.gain)

        return true;
    }
}

registerProcessor("AudioCollector", AudioCollector);
registerProcessor('NoiseGate', NoiseGate);