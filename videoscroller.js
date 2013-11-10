/*!
 * jQuery Video Scroller Plugin
 * Original author: Karim Hmaissi
 * Date: 06/11/13
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = 'VideoScroller',
        defaults = {
            videoPlayerId: "video-player",
            videoSourcesArray: ["animation1.mp4", "animation2.mp4", "animation3.mp4"],
            videoType: "video/mp4",
            height: 750,
            width: "100%",
            scrollInterval: 1000,
            scrollerContent: $("#scroller-content"),
            onVideoChange: function() {},

        };

    function Plugin( element, options ) {

    	console.log("running plugin constructer");
        this.element = element;
        this.$element = $(element);

        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;

        this.$progressBar = null;

        this.videoPlayer = null;
        this.scrollTimer = null;

        //ref to currentley playing index
        //-1 no video playing
        this.currentlyPlayingIndex = -1;
        
        this.init();
    }

    Plugin.prototype = {
    	init: function() {

    		var self = this;

            //hide video player content until video has loaded
            self.options.scrollerContent.css("opacity", "0");

    		console.log("running plugin init");

    		//wait until video is created and init by video.js
    		$.when(self.createVideoPlayer())
    			.done(function() {
    				console.log("calling startVideo");
    				self.zeroVolume();
    				// self.startVideoScroller();
                    
    			});
    		
    	},

    	createVideoPlayer: function() {
    		console.log("running plugin createVideoPlayer");

    		var self = this;

            //create progress bar 
            self.createProgressBar();

            //position the scroller content above the video
            self.setupScrollerContentPositioning();

	    	//create new video player and video source elements and append to root
	    	var videoPlayer = $("<video/>", {
				    id: self.options.videoPlayerId,
				    class: "hide-opacity video-js vjs-default-skin",
				}),
	    		videoSource = $("<source/>", {
	    			src: self.options.videoSourcesArray[0],
	    			type: self.options.videoType
	    		});


    		videoSource.appendTo(videoPlayer);
    		videoPlayer.appendTo(self.$element);

			return self.initVideoJS();

    	}, 

        initVideoJS: function() {

            var self = this, 
                dfd = $.Deferred(),
                width = self.options.width, 
                height = self.options.height;

            videojs(self.options.videoPlayerId, 
                { "controls": false, "autoplay": false, 
                    "preload": "auto", "loop": true, "width": width, "height": height }, 
                function(){
                    // Player (this) is initialized and ready.
                    self.videoPlayer = this;
                    console.log("setup video finished");

                    //when video has loaded some data call onVideoLoaded event
                    self.videoPlayer.on("loadeddata", function() {
                        self.onVideoLoaded(self.currentlyPlayingIndex);
                    });

                    self.currentlyPlayingIndex++;
                    return dfd.promise();

            });
        },

        createProgressBar: function() {
          // <div class="progress">
          // <div class="progress-bar" style="width: 0%;"></div>

            var self = this;

            var $progressBarHolder = $("<div/>", {
                    class: "progress"
                }),
                $progressBar = $("<div/>", {
                    class: "progress-bar",
                    width: "0%"
                });

            $progressBar.appendTo($progressBarHolder);
            $progressBarHolder.appendTo(self.$element);

            self.$progressBar = $progressBar;

        },

        setupScrollerContentPositioning: function() {
            var content = this.options.scrollerContent;
            content.css("position", "absolute")
                    .css("top", "0")
                    .css("width", "100%");
        },



    	startVideoScroller: function() {

    		// The progress bars parent width is split into 10. 
    		// An interval then updates the width by 10% until filled.
    		// When filled the video is changed

    		var self = this;

    		self.startVideo();

    		this.scrollTimer = setInterval(function() {
    			var currentWidth = self.$progressBar.width(),
    			parentWidth = self.$progressBar.offsetParent().width(),
    			widthInterval = parentWidth / 10;

    			if(currentWidth >= (parentWidth - widthInterval)) {

    				//next video
                    self.nextVideo();

    			} else {
                    //if video is about to change
                    if(currentWidth >= (parentWidth - (widthInterval * 2))) {
                        self.onLoadingVideo(self.currentlyPlayingIndex);
                    }
					self.$progressBar.width(currentWidth + widthInterval);
    			}



    		}, self.options.scrollInterval)
    	},

        onLoadingVideo: function(currentlyPlayingIndex) {
            this.options.scrollerContent.animate({
                opacity: 0}, 
                1000);
        },

        onVideoLoaded: function(currentlyPlayingIndex) {
            this.$element.animate({
                opacity: 1}, 
                1000);
            this.options.scrollerContent.animate({
                opacity: 1}, 
                1000);
        },

    	stopVideoScroller: function() {
            console.log("stopped video scroller called");
    		this.stopVideo();
    		clearInterval(this.scrollTimer);
    	},

    	resetVideoScroller: function() {
    		this.$progressBar.width(0);
    		clearInterval(self.scrollTimer);
    		this.startVideoScroller();
    	},

        nextVideo: function() {
            var self = this;

            self.$progressBar.width(0);

            var currentIndex = self.currentlyPlayingIndex;

            if(currentIndex+1 >= self.options.videoSourcesArray.length) {

                self.currentlyPlayingIndex = 0;
                self.changeVideo(self.options.videoType, 
                    self.options.videoSourcesArray[0]);
            } else {

                // console.log("about to call change video");
                // console.log("videoType: " + self.options.videoType);
                // console.log("currentlyPlayingIndex: " + self.currentlyPlayingIndex);
                // console.log("videoSource: " + self.options.videoSourcesArray[self.currentlyPlayingIndex + 1]);
                self.changeVideo(self.options.videoType, 
                    self.options.videoSourcesArray[self.currentlyPlayingIndex + 1]);

                self.currentlyPlayingIndex++;
            }

            
        },

    	startVideo: function() {
    		console.log("called start video");
    		this.videoPlayer.play();
    	},

    	stopVideo: function() {
    		this.videoPlayer.pause();
    	},

    	changeVideo: function(videoType, videoSrc) {

            //console.log("change video called");
	    	// console.log(videoSrc);

			this.videoPlayer.pause();
			this.videoPlayer.src({ type: videoType, src: videoSrc });
			this.videoPlayer.play();
    	},

    	destroyVideo: function() {
    		this.$element.remove("#" + this.options.videoPlayerId);
    	},

    	zeroVolume: function() {
    		this.videoPlayer.volume(0);
    	},
    }

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    // http://stackoverflow.com/questions/12880256/jquery-plugin-creation-and-public-facing-methods
    $.fn.videoScroller = function(options) {
        // slice arguments to leave only arguments after function name
        var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var item = $(this), 
                instance = item.data("plugin_" + pluginName);

            if(!instance) {
                // create plugin instance and save it in data
                item.data("plugin_" + pluginName, new Plugin(this, options));
            } else {
                // if instance already created call method
                if(typeof options === 'string') {
                    instance[options].apply(instance, args);
                }
            }
        });
    }

})( jQuery, window, document );

//bare minimum
// stop and start scroller hook !done
// dynamically add progress bar !done
// place to add main content and add appropiate classes !done
// callback on scroller change 
// callback on scroller start
// callback on scroller stop


//extra features
// animate video change
// animate change in main content on video change !done
// performance upgrades