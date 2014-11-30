chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js", $);
		// ----------------------------------------------------------
		setUpIfNecessary();
	}
	}, 10);
});

var settings = {
	defaultClassMappings: {
		".broadcaster":"stifle-show",
		".moderator":"stifle-show",
		".subscriber":"stifle-show",
		".turbo":"stifle-show"
	},
	hideClass: "stifle-hide"
};

function setUpIfNecessary() {
	var context = deriveContext();
	console.log("stifle context", context)
	if(isChannelPage(context)) {
		bindChatPanel(context);
	}
}

function deriveContext() {
	var context = {};
	context.classMappings = settings.defaultClassMappings;
	// these class mappings should be derived from
	// the user's settings for this specific channel
	// or base settings if they haven't configured
	// settings for this channel
	return context;
}

function isChannelPage(context) {
	// Assume true for now. This should check some sort of css
	// selector or something to determine that we're actually
	// on a channel page so we don't load this script greedily.
	return true; // #channel ?
}
function bindChatPanel(context) {
  $(".chat-lines").on("DOMNodeInserted", function(e) {
      var target = $(e.target);
			applyRelevantClasses(target, context);
  });
}

function applyRelevantClasses(target, context) {
	if(target.is("li")) {
		var applied = false;

		for(var mapping in context.classMappings) {
			var subNode = target.find(mapping);
			if(subNode.length > 0) {
				console.log("applying: ", mapping, subNode, target);
				applied = true;
				target.addClass(context.classMappings[mapping]);
			}
		}
		if(!applied) {
			target.addClass(settings.hideClass);
		}
	}
}
