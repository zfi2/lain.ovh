document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        audio: document.getElementById("background-audio"),
        socialLinks: document.getElementById("social-links"),
        middleBanner: document.getElementById("middle-banner"),
        songTitle: document.getElementById('song-title'),
        consoleElement: document.createElement('div'),
        blockingOverlay: document.createElement('div'),
        loadingElement: document.createElement('span'),
        cursor: document.createElement('span')
    };

    let didClick = false;
    let consoleMessageComplete = false;

    function initializeElements() {
        elements.consoleElement.classList.add('console');
        elements.blockingOverlay.classList.add('blocking-overlay');
        document.body.appendChild(elements.blockingOverlay);
        document.body.appendChild(elements.consoleElement);
    }

    function handleClick() {
        if (consoleMessageComplete && !didClick) {
            didClick = true;
            removeConsole();
        }
    }
    
    function removeConsole() {
        if (elements.consoleElement.parentNode) {
            elements.consoleElement.remove();
        }
        
        showMainContent();
        removeBlockingOverlay();

        document.removeEventListener("click", handleClick);
    }
    
    function removeBlockingOverlay() {
        if (elements.blockingOverlay.parentNode) {
            elements.blockingOverlay.remove();
        }
    }
    
    function loadAudio() {
        if (elements.audio) {
            elements.audio.volume = 0.1;
            elements.audio.play().catch(error => {
                console.error("Error playing audio:", error);
            });
        }
    }


    function showMainContent() {
        loadAudio();

        const randomNum = Math.random() * 100;
        const imgElement = elements.middleBanner.querySelector('img');
        if (imgElement) {
            if (randomNum < 90) {
                imgElement.src = "other/VisLain.gif";
            } else {
                const images = [
                    "other/bg_306.gif",
                    "other/alpha_04.gif",
                    "other/lets-all-love-lain.gif",
                    "other/lainpattern.gif",
                    "other/patternTV2.gif",
                    "other/lon.gif"
                ];
                const randomImage = images[Math.floor(Math.random() * images.length)];
                imgElement.src = randomImage;
            }
        };

        elements.socialLinks.style.opacity = 1;
        elements.songTitle.style.opacity = 1;
        elements.middleBanner.style.display = "inline-block";

        window.rainEffect.initialize();
        window.commentSystem.initialize();
        window.commentSystem.show();
    }

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function simulateShell(consoleElement, callback) {
        const lines = [
            'su -',
            '<br>Password:',
            '<br>root@lain~$ ',
            'enter-wired',
            '<br>Logging into The Wired...',
            '<br>Access granted. Loading... ',
            '<br>You have successfully entered The Wired.<span style="color: red; opacity: 0.01;"><br>nothing here is real. try to stay yourself.</span>',
            '<br><br>Click anywhere to continue.'
        ];

        const typingSpeed = getRandomNumber(20, 35);
        console.log(typingSpeed);
        const pauseBetweenLines = 500;
        const passwordPause = 1000;

        consoleElement.innerHTML = `
            COMMUNICATION CONSOLE v1.0.5</br>
            for Copland OS Enterprise</br></br>
            Profile ... autoconfigure.cf</br>
            Connecting to ... 218.322.338.1</br>
            Connected! <span style="color: red; opacity: 0.02;">everyone is connected...</span></br></br>

            wired@lain~$ 
        `;

        await delay(1000)
          
        function typeWithCursor(text, speed, callback) {
            let i = 0;
            elements.cursor.classList.add('cursor');
            consoleElement.appendChild(elements.cursor);

            function typeChar() {
                if (i < text.length) {
                    elements.cursor.insertAdjacentText('beforebegin', text.charAt(i));
                    i++;
                    setTimeout(typeChar, speed);
                } else {
                    elements.cursor.remove();
                    callback();
                }
            }

            typeChar();
        }

        function animateLoading(callback) {
            let progress = 0;
            const totalWidth = 20;
            consoleElement.appendChild(elements.loadingElement);

            function updateLoadingBar() {
                if (progress <= totalWidth) {
                    const filled = '█'.repeat(progress);
                    const empty = '░'.repeat(totalWidth - progress);
                    elements.loadingElement.textContent = `[${filled}${empty}] ${Math.floor(progress / totalWidth * 100)}%`;
                    progress++;
                    setTimeout(updateLoadingBar, 50);
                } else {
                    callback();
                }
            }

            updateLoadingBar();
        }

        function typeLine(index = 0) {
            if (index < lines.length) {
                if (index === 0 || index === 3) {
                    typeWithCursor(lines[index], typingSpeed, () => {
                        setTimeout(() => typeLine(index + 1), pauseBetweenLines);
                    });
                } else if (index === 5) {
                    consoleElement.innerHTML += lines[index];
                    animateLoading(() => typeLine(index + 1));
                } else {
                    consoleElement.innerHTML += lines[index];
                    if (index === lines.length - 1) {
                        consoleMessageComplete = true;
                    }
                    setTimeout(() => typeLine(index + 1), index === 1 ? passwordPause : pauseBetweenLines);
                }
            } else {
                callback();
            }
        }
        
        typeLine();
    }

    initializeElements();
    simulateShell(elements.consoleElement, () => {
        consoleFinished = true;
    });
    document.addEventListener("click", handleClick);
});