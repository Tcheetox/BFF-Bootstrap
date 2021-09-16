// Dropdown with checkboxes
const dropdownMenuMovie = document.getElementById('dropdown-menu-movie')
const dropdownMenuTitle = document.getElementsByClassName('dropdown-menu-title')[0]
const dropdownMenuMovieItems = document.getElementById('dropdown-menu-movie-items')

// Ensure proper width of dropdown movie menu (important to manage overflow with CSS)
const onWindowManipulation = () => {
	if (dropdownMenuTitle && dropdownMenuMovieItems && dropdownMenuMovie) {
		dropdownMenuTitle.style.width = dropdownMenuMovie.offsetWidth - 35 + 'px'
		dropdownMenuMovieItems.style.width = dropdownMenuMovie.offsetWidth + 'px'
	}
}
onWindowManipulation()
window.addEventListener('resize', onWindowManipulation)

// Movie selection event
const moviesCheckboxes = document.getElementsByClassName('movie-checkbox')
const onMovieSelectionChange = () => {
	dropdownMenuTitle.style.width = dropdownMenuMovie.offsetWidth - 35 + 'px'
	var title = 'Choose movie(s)...'
	var newTitle = ''
	Array.from(moviesCheckboxes).forEach(el => {
		if (el.checked) newTitle = newTitle === '' ? el.parentElement.textContent : newTitle.concat('-', el.parentElement.textContent)
	})
	if (newTitle == '') {
		newTitle = title
		dropdownMenuMovie.setAttribute('required', '')
	} else dropdownMenuMovie.removeAttribute('required', '')
	dropdownMenuTitle.textContent = newTitle
}
onMovieSelectionChange()

// Bind movie checkboxes to selection event
if (moviesCheckboxes) {
	Array.from(moviesCheckboxes).forEach(el => el.addEventListener('change', onMovieSelectionChange))
}

// Video preview
// Change button size based on resolution
if (screen.width < 768) {
	const videoControlButtonIcon = document.querySelector('i.video-control-button')
	if (videoControlButtonIcon) {
		videoControlButtonIcon.classList.remove('fa-4x')
		videoControlButtonIcon.classList.add('fa-2x')
	}
	document.documentElement.style.setProperty('--video-control-icon-half-size', '16px')
}

const onVideoClick = (video = -1) => {
	// Determine proper video element
	let videoElement
	if (video === -1) {
		if (document.getElementsByClassName('carousel-item-next').length === 0)
			videoElement = document.getElementsByClassName('carousel-item active')[0].getElementsByTagName('video')[0]
		else videoElement = document.getElementsByClassName('carousel-item-next')[0].getElementsByTagName('video')[0]
	} else videoElement = document.getElementsByTagName('video')[video]

	// Take actions
	if (runningVideos.includes(videoElement)) stopAllRunningVideos()
	else {
		stopAllRunningVideos()
		runningVideos.push(videoElement)
		playVideo(videoElement)
	}
}

// Bind elements with their event
const carousel = document.getElementById('carouselMoviePreview')
const videoControlButton = document.getElementsByClassName('video-control-button')[0]
if (videoControlButton) {
	videoControlButton.addEventListener('click', () => onVideoClick())
	if (carousel) {
		carousel.addEventListener('mouseenter', () =>
			videoControlButton.setAttribute('style', 'opacity:0.8; -moz-opacity:0.8; filter:alpha(opacity=80)')
		)
		carousel.addEventListener('mouseleave', () =>
			videoControlButton.setAttribute('style', 'opacity:0; -moz-opacity:0; filter:alpha(opacity=0)')
		)
	}
}

let runningVideos = []
const stopAllRunningVideos = () => {
	Array.from(runningVideos).forEach(video => {
		if (video && !video.paused) stopVideo(video)
	})
	runningVideos = []
}

Array.from(document.getElementsByTagName('video')).forEach(el => el.addEventListener('ended', () => stopVideo(el)))
Array.from(document.getElementsByClassName('carousel-link')).forEach(el => el.addEventListener('click', stopAllRunningVideos))

// Actions
const playVideo = videoElement => {
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

const stopVideo = videoElement => {
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
let timeout
const carouselIndicators = document.getElementsByClassName('carousel-indicators')[0]
const toggleMoviesCaption = () => {
	clearTimeout(timeout)
	// Show captions
	if (carouselIndicators && carouselIndicators.style.visibility != 'visible') {
		carouselIndicators.style.visibility = 'visible'
		Array.from(document.getElementsByClassName('carousel-caption')).forEach(caption => (caption.style.visibility = 'visible'))
	}
	timeout = setTimeout(() => {
		// Hide captions
		if (carouselIndicators && carouselIndicators.style.visibility != 'hidden') {
			carouselIndicators.style.visibility = 'hidden'
			Array.from(document.getElementsByClassName('carousel-caption')).forEach(caption => (caption.style.visibility = 'hidden'))
		}
	}, 3000)
}

// Bind play trailer buttons
Array.from(document.getElementsByClassName('trailer-indicator')).forEach(element =>
	element.addEventListener('click', () => {
		carousel.scrollIntoView({ behavior: 'smooth', block: 'end' })
		const video = element.getAttribute('data-slide-to')
		document.querySelectorAll('.carousel-indicators li')[video].click()
		setTimeout(() => onVideoClick(video), 1500)
	})
)

// MODAL: show only if form is submitted
document.getElementById('registration-form').addEventListener('submit', event => {
	$('#registration-modal').modal('show')
	event.preventDefault()
})

// Navbar logo management
const littleLogo = document.querySelector('.little-logo')
const navBrand = document.querySelector('.navbar-brand')
if (navBrand && littleLogo) {
	navBrand.addEventListener('mouseenter', () => (littleLogo.src = 'pictures/logos/littleWhite.jpg'))
	navBrand.addEventListener('mouseleave', () => (littleLogo.src = 'pictures/logos/littleBlack.jpg'))
}

// Appear and disappear on scroll
const navLogo = document.querySelector('.navbar-brand')
const jumbo = document.querySelector('.jumbotron')
const scrollFunction = () => {
	if (document.body.scroll > jumbo.clientHeight || document.documentElement.scrollTop > jumbo.clientHeight) {
		if (navLogo && navLogo.style.visibility != 'visible') {
			navLogo.style.visibility = 'visible'
			navLogo.style.opacity = 1
		}
	} else if (navLogo && navLogo.style.visibility != 'hidden') {
		navLogo.style.opacity = 0
		setTimeout(() => (navLogo.style.visibility = 'hidden'), 700)
	}
}
scrollFunction()
window.onscroll = scrollFunction

// Menu should collapse after click on mobile
$('.navbar-nav li a').click(() => $('.navbar-collapse').collapse('hide'))
