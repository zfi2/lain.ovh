import { AudioVisualizer } from './visualizer.js';

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const mainContent = document.getElementById('main-content');
    const audio = document.getElementById('background-audio');

    overlay.addEventListener('click', () => {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        
        setTimeout(() => {
            overlay.style.display = 'none';
            mainContent.classList.remove('hidden');

            audio.volume = 0.05;
            audio.play().then(() => {
                const visualizer = new AudioVisualizer(audio);
                visualizer.resize();
                visualizer.draw();
            }).catch(error => {
                console.log('audio playback error:', error);
            });
    
            commentSystem.initialize();
            setTimeout(() => {
                commentSystem.show();
            }, 500);
        }, 500);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const discordLink = document.getElementById('discord-link');
    const copyNotification = document.getElementById('copy-notification');
    
    discordLink.addEventListener('click', async (e) => {
        try {
            await navigator.clipboard.writeText(atob("MWExbg=="));
            
            copyNotification.classList.add('show');
            setTimeout(() => {
                copyNotification.classList.remove('show');
            }, 2000);
            
        } catch (err) {
            console.error('failed to copy:', err);
            alert('failed to copy discord username');
        }
    });
});