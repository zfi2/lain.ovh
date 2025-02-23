export class AudioVisualizer {
    constructor(audioElement) {
        this.audio = audioElement;
        this.initVisualizer();
    }

    initVisualizer() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.source = this.audioContext.createMediaElementSource(this.audio);
        
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        
        this.analyser.fftSize = 256;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        
        this.canvas = document.getElementById('visualizer');
        this.ctx = this.canvas.getContext('2d');
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.draw();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = 150;
    }

    draw() {
        requestAnimationFrame(() => this.draw());
        this.analyser.getByteFrequencyData(this.dataArray);

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const barCount = 128;
        const barWidth = this.canvas.width / barCount;
        const spaceBetween = barWidth * 0.2;
    
        for (let i = 0; i < barCount; i++) {
            const value = this.dataArray[Math.floor(i * (this.bufferLength / barCount))];
            const barHeight = (value / 255) * this.canvas.height;

            const gradient = this.ctx.createLinearGradient(0, this.canvas.height, 0, 0);
            gradient.addColorStop(0, 'rgba(200, 200, 200, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                i * (barWidth + spaceBetween),
                this.canvas.height - barHeight,
                barWidth - spaceBetween,
                barHeight
            );
        }
    }
}