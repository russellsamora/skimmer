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

	// https://remysharp.com/2010/07/21/throttling-function-calls
	function throttle(fn, threshhold, scope) {
		threshhold || (threshhold = 250);
		var last
		var deferTimer
		return function () {
			var context = scope || this;
			var now = +new Date
			var args = arguments
			if (last && now < last + threshhold) {
				// hold on to it
				clearTimeout(deferTimer)
				deferTimer = setTimeout(function () {
					last = now
					fn.apply(context, args)
				}, threshhold)
			} else {
				last = now
				fn.apply(context, args)
			}
		}
	}

	const lib = ({ sensitivity = 0.5, delay = 2.5, once = true, trigger = () => {}, update = () => {} }) => {
		// TODO constrain
		const opts = { sensitivity, delay, once, trigger, update }

		const SECOND = 1000
		const SKIM_FACTOR = 10

		let handler = null
		let triggered = false
		let ignoredFirst = false

		const data = {
			scroll: {
				previous: 0,
				net: 0
			},
			time: {
				previous: 0,
				net: 0,
				start: 0
			}
		}

		const fix = (number) => +number.toFixed(2)

		const sendUpdate = (score = 0, elapsed = 0, percent = 0) =>
			opts.update({ score: fix(score), elapsed: fix(elapsed), percent: fix(percent) })

		const reset = () => {
			data.scroll.net = 0
			data.time.net = 0
			data.time.start = new Date().getTime()
			data.time.previous = new Date().getTime()

			sendUpdate()
		}

		const handleScroll = () => {
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
				if (scrollDiff < 0 || timeDiff > SECOND) {
					reset()
					return false
				 }

				// test if we are skimming!
				const secondsElapsed = (data.time.net / SECOND)
				const score = data.scroll.net / secondsElapsed
				
				if (score > opts.sensitivity * SKIM_FACTOR && secondsElapsed > opts.delay) {
					if(!triggered) {
						opts.trigger({ 
							score: fix(score),
							elapsed: fix(secondsElapsed),
							percent: fix(data.scroll.net),
							triggered: true
						})
					}
					if (opts.once) {
						triggered = true
						window.removeEventListener('scroll', handler, false)
					}
				} else {
					sendUpdate(score, secondsElapsed, data.scroll.net)
				}

			} else {
				ignoredFirst = true
			}
		}

		const init = () => {
			reset()

			handler = throttle(handleScroll, SECOND / 4)
			window.addEventListener('scroll', handler, false)
		}

		init()
	}

	return lib

})
