// Dropdown with checkboxes
var dropdownMenuMovie = document.getElementById('dropdown-menu-movie')
var dropdownMenuTitle = document.getElementsByClassName('dropdown-menu-title')[0]
var dropdownMenuMovieItems = document.getElementById('dropdown-menu-movie-items')
// Ensure proper width of dropdown movie menu (important to manage overflow with CSS)
onWindowManipulation()
window.addEventListener('resize', onWindowManipulation)
function onWindowManipulation() {
	dropdownMenuTitle.style.width = dropdownMenuMovie.offsetWidth - 35 + 'px'
	dropdownMenuMovieItems.style.width = dropdownMenuMovie.offsetWidth + 'px'
}

// Bind movie checkboxes to selection event
var moviesCheckboxes = document.getElementsByClassName('movie-checkbox')
Array.from(moviesCheckboxes).forEach(function (element, index, array) {
	element.addEventListener('change', onMovieSelectionChange)
})

// Movie selection event
onMovieSelectionChange()
function onMovieSelectionChange() {
	dropdownMenuTitle.style.width = dropdownMenuMovie.offsetWidth - 35 + 'px'
	var title = 'Choose movie(s)...'
	var newTitle = ''
	Array.from(moviesCheckboxes).forEach(function (element, index, array) {
		if (element.checked == true) {
			if (newTitle == '') {
				newTitle = element.parentElement.textContent
			} else {
				newTitle = newTitle.concat('-', element.parentElement.textContent)
			}
		}
	})
	if (newTitle == '') {
		newTitle = title
		dropdownMenuMovie.setAttribute('required', '')
	} else {
		dropdownMenuMovie.removeAttribute('required', '')
	}
	dropdownMenuTitle.textContent = newTitle
}

// Video preview
// Change button size based on resolution
if (screen.width < 768) {
	var videoControlButtonIcon = document.querySelector('i.video-control-button')
	videoControlButtonIcon.classList.remove('fa-4x')
	videoControlButtonIcon.classList.add('fa-2x')
	document.documentElement.style.setProperty('--video-control-icon-half-size', '16px')
}

// Bind elements with their event
var carousel = document.getElementById('carouselMoviePreview')
carousel.addEventListener('mouseenter', onVideoMouseEnter)
carousel.addEventListener('mouseleave', onVideoMouseLeave)
var videoControlButton = document.getElementsByClassName('video-control-button')[0]
videoControlButton.addEventListener('click', function () {
	onVideoClick()
})

bindVideosEnd()
function bindVideosEnd() {
	var videos = document.getElementsByTagName('video')
	Array.from(videos).forEach(function (element, index, array) {
		element.addEventListener('ended', function () {
			stopVideo(element)
		})
	})
}

bindCarouselLinks()
function bindCarouselLinks() {
	Array.from(document.getElementsByClassName('carousel-link')).forEach(function (element, index, array) {
		element.addEventListener('click', function () {
			stopAllRunningVideos()
		})
	})
}

// Event functions
function onVideoMouseEnter() {
	videoControlButton.setAttribute('style', 'opacity:0.8; -moz-opacity:0.8; filter:alpha(opacity=80)')
}
function onVideoMouseLeave() {
	videoControlButton.setAttribute('style', 'opacity:0; -moz-opacity:0; filter:alpha(opacity=0)')
}

var runningVideos = []
function stopAllRunningVideos() {
	Array.from(runningVideos).forEach(function (video, index, array) {
		if (video.paused == false) {
			stopVideo(video)
		}
	})
	runningVideos = []
}

function onVideoClick(video = -1) {
	// Determine proper video element
	let videoElement
	if (video == -1) {
		if (document.getElementsByClassName('carousel-item-next').length == 0) {
			videoElement = document
				.getElementsByClassName('carousel-item active')[0]
				.getElementsByTagName('video')[0]
		} else {
			videoElement = document.getElementsByClassName('carousel-item-next')[0].getElementsByTagName('video')[0]
		}
	} else {
		videoElement = document.getElementsByTagName('video')[video]
	}

	// Take actions
	if (runningVideos.includes(videoElement)) {
		stopAllRunningVideos()
	} else {
		stopAllRunningVideos()
		runningVideos.push(videoElement)
		playVideo(videoElement)
	}
}

// Actions
function playVideo(videoElement) {
	// Stop bootstrap carousel
	$('#carouselMoviePreview').carousel('pause')
	// Change video icon
	videoControlButton.classList.remove('fa-play-circle')
	videoControlButton.classList.add('fa-pause-circle')
	// Start video and add shadows
	videoElement.play()
	carousel.classList.add('playing-shadow')
	// Bind mouse hook
	carousel.addEventListener('mousemove', toggleMoviesCaption)
	toggleMoviesCaption()
}

function stopVideo(videoElement) {
	// Change video icon
	videoControlButton.classList.remove('fa-pause-circle')
	videoControlButton.classList.add('fa-play-circle')
	// Reload video to show poster again
	videoElement.load()
	carousel.classList.remove('playing-shadow')
	// Resume bootstrap carousel
	$('#carouselMoviePreview').carousel('cycle')
	// Unbind mouse hook
	carousel.removeEventListener('mousemove', toggleMoviesCaption)
	toggleMoviesCaption() // Ensure captions will reappear even if mouse didn't move
	clearTimeout(timeout) // Mandatory otherwise the last programmed action will be fired and hide the captions again!
}

// Hide video captions if video is started and mouse doesn't move
var timeout
var carouselIndicators = document.getElementsByClassName('carousel-indicators')[0]
function toggleMoviesCaption() {
	clearTimeout(timeout)
	// Show captions
	if (carouselIndicators.style.visibility != 'visible') {
		carouselIndicators.style.visibility = 'visible'
		Array.from(document.getElementsByClassName('carousel-caption')).forEach(function (caption, index, array) {
			caption.style.visibility = 'visible'
		})
	}
	timeout = setTimeout(function () {
		// Hide captions
		if (carouselIndicators.style.visibility != 'hidden') {
			carouselIndicators.style.visibility = 'hidden'
			Array.from(document.getElementsByClassName('carousel-caption')).forEach(function (
				caption,
				index,
				array
			) {
				caption.style.visibility = 'hidden'
			})
		}
	}, 3000)
}

// Bind play trailer buttons
bindPlayTrailerLinks()
function bindPlayTrailerLinks() {
	Array.from(document.getElementsByClassName('trailer-indicator')).forEach(function (element, index, array) {
		element.addEventListener('click', function () {
			carousel.scrollIntoView({ behavior: 'smooth', block: 'end' })
			var video = element.getAttribute('data-slide-to')
			document.querySelectorAll('.carousel-indicators li')[video].click()
			setTimeout(function () {
				onVideoClick(video)
			}, 1500)
		})
	})
}

// MODAL: show only if form is submitted
document.getElementById('registration-form').addEventListener('submit', function (event) {
	$('#registration-modal').modal('show')
	event.preventDefault()
})

// Navbar logo management
var littleLogo = document.querySelector('.little-logo')
var navBrand = document.querySelector('.navbar-brand')
navBrand.addEventListener('mouseenter', function () {
	littleLogo.src = 'pictures/logos/littleWhite.jpg'
})
navBrand.addEventListener('mouseleave', function () {
	littleLogo.src = 'pictures/logos/littleBlack.jpg'
})

// Appear and disappear on scroll
window.onscroll = function () {
	scrollFunction()
}
var navLogo = document.querySelector('.navbar-brand')
var jumbo = document.querySelector('.jumbotron')
scrollFunction()
function scrollFunction() {
	if (document.body.scroll > jumbo.clientHeight || document.documentElement.scrollTop > jumbo.clientHeight) {
		if (navLogo.style.visibility != 'visible') {
			navLogo.style.visibility = 'visible'
			navLogo.style.opacity = 1
		}
	} else if (navLogo.style.visibility != 'hidden') {
		navLogo.style.opacity = 0
		setTimeout(function () {
			navLogo.style.visibility = 'hidden'
		}, 700)
	}
}

// Menu should collapse after click on mobile
$('.navbar-nav li a').click(function (event) {
	$('.navbar-collapse').collapse('hide')
})
