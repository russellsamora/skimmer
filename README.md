# skimmer.js

Dependency-free JavaScript library to detect when a user is skimming the a page. [See demo](https://russellgoldenberg.github.io/skimmer/).

## Usage 

```
skimmer({
	trigger: function() {
		console.log('skimming detected')
	}
	})
```

## Options

#### trigger: [function] *required*
Callback function that fires when skimming is detected

#### sensitivity: [number] (0 to 1, defaults to 0.5) *optional*

#### delay: [number] (seconds, defaults to 2.5) *optional*

#### once: [boolean] (defaults to true) *optional*

#### update: [function] *optional*
