async function startWebcam() {
    try {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        const constraints = {
            video: {
                facingMode: useFrontCamera ? 'user' : 'environment'
            }
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        camOn = true;
        toggleCamBtn.textContent = '🙈';

        updateMirror();
        await document.documentElement.requestFullscreen().catch(() => {
            console.warn("Không thể chuyển sang chế độ toàn màn hình.");
        });

    } catch (err) {
        console.error("Không thể truy cập camera: ", err.message);
    }
}

function updateMirror() {
    if (useFrontCamera) {
        video.style.transform = 'scaleX(-1)';
    } else {
        video.style.transform = 'scaleX(1)';
    }
}

function stopWebcam() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    video.srcObject = null;
    camOn = false;
    toggleCamBtn.textContent = '🙉';

    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
}

function handleOrientation() {
    if (window.innerHeight > window.innerWidth) {
        video.style.transform = useFrontCamera ? "rotate(90deg) scaleX(-1)" : "rotate(90deg) scaleX(1)";
    } else {
        video.style.transform = useFrontCamera ? "scaleX(-1)" : "scaleX(1)";
    }
}
window.addEventListener('load', handleOrientation);
window.addEventListener('resize', handleOrientation);

const video = document.getElementById('webcam');
const toggleCamBtn = document.getElementById('toggleCam');
const switchCamBtn = document.getElementById('switchCam');
let useFrontCamera = true;
let camOn = false;
let stream;

toggleCamBtn.addEventListener('click', () => {
    if (camOn) {
        stopWebcam();
    } else {
        startWebcam();
    }
});

switchCamBtn.addEventListener('click', () => {
    useFrontCamera = !useFrontCamera;
    if (camOn) {
        startWebcam();
    }
});

window.addEventListener('load', () => {
    toggleCamBtn.textContent = '🙉';
});