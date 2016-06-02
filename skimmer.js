/*
* skimmer.js library
*/

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory)
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory()
    } else {
        window.skimmer = factory.call(this)
    }
})(() => {

	const lib = ({
		rate = 750,
		delay = 2.5,
		multiple = false,
		trigger = () => {},
		update = () => {},
	}) => {
		const SECOND = 1000
		let triggered = false
		let ignoredFirst = false

		const data = {
			scroll: {
				previous: 0,
				net: 0,
			},
			time: {
				previous: 0,
				net: 0,
				start: 0,
			},
		}

		let ticking = false

		const raf = window.requestAnimationFrame
			|| function(callback) { return setTimeout(callback, 1000 / 60) }

		const fix = (number) => +number.toFixed(2)

		const reset = () => {
			data.scroll.net = 0
			data.time.net = 0
			data.time.start = new Date().getTime()
			data.time.previous = new Date().getTime()

			update({ rate: 0, distance: 0, elapsed: 0 })
		}

		// const onResize = () => {
		// 	viewportHeight = window.innerHeight
		// 	reset()
		// }

		const updateScroll = () => {
			ticking = false
			if (ignoredFirst) {
				const currentScrollPos = window.pageYOffset
				const currentTime = new Date().getTime()

				const scrollDiff = currentScrollPos - data.scroll.previous
				const timeDiff = currentTime - data.time.previous

				data.scroll.net += scrollDiff
				data.time.net = currentTime - data.time.start

				data.time.previous = currentTime
				data.scroll.previous = window.pageYOffset

				// reset if they start going up OR the time jumped more than a second (stopped scrolling)
				if (scrollDiff < 0 || timeDiff > SECOND / 2) {
					reset()
					return false
				}

				// test if we are skimming!
				const secondsElapsed = (data.time.net / SECOND)
				const currentRate = data.scroll.net / secondsElapsed

				if (currentRate > rate && secondsElapsed > delay) {
					if (!triggered) {
						trigger({
							rate: Math.round(currentRate),
							distance: Math.round(data.scroll.net),
							elapsed: fix(secondsElapsed),
						})
					}
					if (!multiple) {
						triggered = true
						window.removeEventListener('scroll', onScroll, false)
					}
				} else {
					update({ 
						rate: Math.round(currentRate),
						distance: Math.round(data.scroll.net),
						elapsed: fix(secondsElapsed),
					})
				}

			} else {
				ignoredFirst = true
			}
			return true
		}

		const onScroll = () => {
			if (!ticking) raf(updateScroll)
			ticking = true
		}

		const init = () => {
			reset()
			window.addEventListener('scroll', onScroll, false)
		}

		init()
	}

	return lib

})
