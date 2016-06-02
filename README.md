# skimmer.js

Dependency-free JavaScript library to detect when a user is skimming the a page. [See demo](https://russellgoldenberg.github.io/skimmer/).

## Basic usage 

```
skimmer({
	trigger: function() {
		console.log('skimming detected')
	}
})
```

## Advanced usage

```
skimmer({
	trigger: function(data) {
		console.log('skimming detected')
	},
	sensitivity: 0.3,
	delay: 5,
	multiple: true,
	update: function(data) {
		console.log(data)
	}
})
```

## Options

#### trigger: [function] *required*
Callback function that fires when skimming is detected

#### rate: [number] (0 to 100, defaults to 10) *optional*
Minimum rate (percent scrolled per second) needed to trigger

#### delay: [number] (seconds, defaults to 2.5) *optional*
How long to wait for consistent downward progress before allowing trigger

#### multiple: [boolean] (defaults to false) *optional*
Whether to fire one or infinite skim detection triggers

#### update: [function] *optional*
Callback function that fires on scroll with skimmer progress data
