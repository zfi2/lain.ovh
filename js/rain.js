function createRaindrop() {
    const drop = document.createElement('div');
    drop.className = 'raindrop';
    
    const startX = Math.random() * window.innerWidth;

    drop.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: -10px;
        width: 1px;
        height: ${Math.random() * 15 + 10}px;
        background: linear-gradient(transparent, rgba(146, 251, 255, 0.74));
        animation: fall ${Math.random() * 1 + 0.5}s linear infinite;
        z-index: 1000;
    `;
    
    document.body.appendChild(drop);
    
    setTimeout(() => {
        if (document.body.contains(drop)) {
            drop.remove();
        }
    }, 5000);

    drop.addEventListener('animationend', () => {
        if (document.body.contains(drop)) {
            drop.remove();
        }
    });

    return drop;
}

function initRainEffect() {
    const MAX_RAINDROPS = 100;
    let activeDrops = new Set();

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes fall {
            0% {
                transform: translateY(0);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh);
                opacity: 0.3;
            }
        }
    `;
    document.head.appendChild(styleSheet);

    const createRain = () => {
        if (Math.random() < 0.5 && activeDrops.size < MAX_RAINDROPS) {
            const drop = createRaindrop();
            activeDrops.add(drop);
            
            const cleanup = () => {
                activeDrops.delete(drop);
                drop.removeEventListener('animationend', cleanup);
            };
            drop.addEventListener('animationend', cleanup);
        }

        if (activeDrops.size >= MAX_RAINDROPS) {
            for (const drop of activeDrops) {
                if (!document.body.contains(drop)) {
                    activeDrops.delete(drop);
                }
            }
        }
    };

    const intervalId = setInterval(createRain, 200);

    return () => {
        clearInterval(intervalId);
        activeDrops.forEach(drop => drop.remove());
        activeDrops.clear();
    };
}

window.rainEffect = {
    initialize: initRainEffect
};