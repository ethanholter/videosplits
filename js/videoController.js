let video
const slider = document.getElementById("videoslider");
const pausebutton = document.getElementById("pausebutton");
const fileInput = document.getElementById('fileInput');
const sliderResolution = 100;

function playPause() {
  if (video == null) return
  if (video.paused) {
    video.play();
    pausebutton.innerHTML = "Pause"
  } else {
    video.pause();
    pausebutton.innerHTML = "Play"
  }
}

function loadVideo(localFile) {
  let reader = new FileReader();
  let fileURL
  reader.addEventListener("load", function () {

    fileURL = reader.result;

    let videoContainer = document.getElementById("videoContainer");

    if (video) {
      clearInterval(refreshTimer);
      removeEventListener('change', checkSliderChange);
    }

    videoContainer.innerHTML = ''
    video = document.createElement('video');
    video.setAttribute('src', fileURL);
    video.setAttribute('id', 'video');
    videoContainer.appendChild(video);

    video.addEventListener('loadeddata', () => {
      let sliderMax = Math.round(video.duration) * sliderResolution; //mp4s play at 24 fps
      slider.setAttribute("max", sliderMax)
      slider.value = 0;
    })

    updateTimeIndicator()

    var checkSliderChange = slider.addEventListener('input', function () {
      if (!video.paused) video.pause(); pausebutton.innerHTML = "Play";
      video.currentTime = slider.value / sliderResolution;
      updateTimeIndicator()
    })

  }, false);

  reader.readAsDataURL(localFile)
}

function updateTimeIndicator() {
  requestAnimationFrame(() => {
    slider.value = video.currentTime * sliderResolution;
    document.getElementById('timeIndicator').innerHTML = video.currentTime.toLocaleString(undefined,
      { maximumFractionDigits: 2, minimumFractionDigits: 2 });
    updateTimeIndicator()
  })
}

function addTime(num) {
  if (video == null) return
  if (!video.paused) video.pause(); pausebutton.innerHTML = "Play";
  video.currentTime += num
  slider.value = video.currentTime * sliderResolution;
  updateTimeIndicator()
}

//workaround solution to get rid of "No file selected" text for file select
fileInput.firstElementChild.addEventListener('change', () => {
  loadVideo(fileInput.firstElementChild.files[0]);
})
fileInput.lastElementChild.addEventListener('click', () => {
  fileInput.firstElementChild.click();
})

document.getElementById("pausebutton").addEventListener('click', playPause);