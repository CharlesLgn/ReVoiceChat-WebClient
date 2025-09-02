class PCMCollector extends AudioWorkletProcessor {
    process(inputs) {
        const input = inputs[0][0]; // mono
        if (input) {
            // Send Float32Array (128 samples) to main thread
            this.port.postMessage(new Float32Array(input));
        }
        return true;
    }
}
registerProcessor("PcmCollector", PCMCollector);