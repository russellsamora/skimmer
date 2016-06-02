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

	const lib = (opts) => {
		opts.rate = opts.rate || 10
		opts.delay = opts.delay || 2.5
		opts.multiple = opts.multiple
		opts.trigger = opts.trigger || (() => {})
		opts.update = opts.update || (() => {})

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

		const sendUpdate = (rate = 0, elapsed = 0, percent = 0) =>
			opts.update({ rate: fix(rate), elapsed: fix(elapsed), percent: fix(percent) })

		const reset = () => {
			data.scroll.net = 0
			data.time.net = 0
			data.time.start = new Date().getTime()
			data.time.previous = new Date().getTime()

			sendUpdate()
		}

		const updateScroll = () => {
			ticking = false
			if (ignoredFirst) {
				const totalHeight = document.documentElement.scrollHeight - window.innerHeight
				const currentScrollPos = window.pageYOffset
				const currentTime = new Date().getTime()

				const scrollDiff = currentScrollPos - data.scroll.previous
				const timeDiff = currentTime - data.time.previous

				data.scroll.net += (scrollDiff / totalHeight * 100)
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
				const rate = Math.min(100, data.scroll.net / secondsElapsed)

				if (rate > opts.rate && secondsElapsed > opts.delay) {
					if (!triggered) {
						opts.trigger({
							rate: fix(rate),
							elapsed: fix(secondsElapsed),
							percent: fix(data.scroll.net),
							triggered: true,
						})
					}
					if (!opts.multiple) {
						triggered = true
						window.removeEventListener('scroll', onScroll, false)
					}
				} else {
					sendUpdate(rate, secondsElapsed, data.scroll.net)
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
