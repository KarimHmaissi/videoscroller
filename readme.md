#Video Scroller: A jQuery plugin

Video scroller is a jQuery plugin that makes it easy to install a video scroller on your website. As it stands VideoScroller is in beta with additional functionality and robustness planned for development. 

It depends on Video.js so ensure you have a copy. You can check it out here: [Video.js Repo](https://github.com/videojs/video.js/)

##Usage

First load the script as well as jQuery

```html
<script src="jquery.min.js" type="text/javascript"></script>
<script src="videoscroller.js" type="text/javascript"></script>
```

Then ensure you have the following markup in your document

```html
<div class="hero">
        
    <div id="video-player-holder" style="height:750px"></div>

    <div id="scroller-content" >
        <!-- Scroller Content -->
     </div>
</div>
```

Finally call the plugin in your JS

```javascript
$(function(){
    var $video = $("#video-player-holder").videoScroller();
    $video.videoScroller("startVideoScroller");
});
```

##Options
TBC

##Problems
- If more than one video scroller is added to a page, performance is significantly decreased. 
- VS at present does not allow different html content for each video


##Future features and upgrades
- Allow user to override videoscroller events, such as onVideoLoaded
- Performance upgrades 





