# Freeboard.io-Plugins
Plugins for the freeboard.io dashboard ecosystem
- I noticed that the majority (if not all) of the plugins and tools on github for freeboard were based around using freeboard offine, or on your own webserver
- This repo and its examples will be themed towards using the online hosted version of freeboard located at freeboard.io
- These will still work on other implementations, the examples will just not be as helpful

## Installation instructions
- On the freeboard page, top left, click developer console, add a plugin, and paste the link of the plugin you wish to use
- You can use the github source, but this isn't recommended in case a update breaks functionality of your dashboard
- Instead it is recommended to upload it to dropbox and use that link. Make sure the dl option at the end of the dropbox link is set to 1, not 0

## datasource/
- The current datasource implementation on freeboard.io for V2 dweet storage doesn't work, so these plugins are a way to implement dweet V2 usage now.
- All dweet V2 plugins require you to have a DweetPro account, and a locked thing.
- All datasource plugins return a raw JSON output. This means that freeboard will not autocomplete the portions of javascript within a widget.

