// app.js - course web framework

var currentSlide;

// Sequence of slides and menus
class Sequence {
    constructor(title, itemConfig, previous=null, next=null) {
        this.type = "sequence";
        this.title = title;
        this.itemConfig = itemConfig;
        this.previous = previous;
        this.next = next;
    }

    get items() {
        var items = [];                         // menus or slides in sequence
        var previous = null;                    // previous item in sequence (null if first)

        for (let i=0; i<this.itemConfig.length; i++) {
            var itemConf = this.itemConfig[i];
            var item;
            if (itemConf.type === "slide") {
                item = new Slide(itemConf.title, itemConf.options, i);
            } else if (itemConf.type === "menu") {
                item = new Menu(itemConf.title, itemConf.options, i, itemConf.items);
            }
            
            item.previous = previous;           // set item's previous to previous
            previous = item;                    // set previous to current item
            if (items.length > 0) {             // set previous item's next = current item
                items[i-1].next = item;
            }
            items.push(item);                   // push item to array
        }
        
        items[0].previous = this.previous;      // set first item previous = sequence previous
        items[items.length-1].next = this.next; // set last item next = sequence next

        return items;
    }

    render() {
        // build first item to page
        var slideContainer = $("#container")
    }


}

// Content Slide
class Slide {
    constructor(title, options, slideNum, previous=null, next=null) {
        this.type = "slide";
        this.title = title;
        this.options = options;
        this.previous = previous;
        this.next = next;
        this.slideNum = slideNum;
        this.viewed = false;
    }

    // get slide() {
    //     return this.title;
    // }

    slideOff() {
        $("#slide-container").slideUp(200);
        $("#slide-container").html("");
    }

    slideOn() {
        console.log("slide on!");
        var slideCode = this.buildSlide();
        $("#slide-container").html(slideCode);
        $(".slide").slideDown(200);
    }
    
    // generate slide HTML
    buildSlide() {

        // generate slide banner HTML
        function mkBanner(title, slideNum, viewed) {                          
            var banner = document.createElement("div");
            var statusBox = document.createElement("div");
            var container = document.createElement("div");
            var titleBox = document.createElement("div");
            var slideTitle = document.createElement("h1");
            var status;

            container.className = "container";
            banner.className = "slide-banner";          // banner class name
            statusBox.className = "slide-status";       // statusBox class name
            titleBox.className = "slide-title";         // titleBox class name
            slideTitle.innerHTML = title;               // set slide's title  
            if (status) {                               // if slide visited, render checkmark
                status = document.createElement("img");
                status.src = "img/check-white_1.png";
                status.alt = "checkmark";
            } else {                                    // render slide's number in sequence
                status = document.createElement("h1");
                status.innerHTML = slideNum + 1;
            }
            container.appendChild(status);
            statusBox.appendChild(container);
            titleBox.appendChild(slideTitle);
            banner.appendChild(statusBox);
            banner.appendChild(titleBox);

            return banner;
        }

        // generate slide content HTML
        function mkContent(options) {
            var slideContent = document.createElement("div");
            slideContent.className = "slide-content";
            if (options.header) {                              // append header
                var header = document.createElement("h1");
                header.innerHTML = options.header;
                header.className = "slide-header";
                slideContent.appendChild(header);
            }
            if (options.header1) {                              // append header1
                var header1 = document.createElement("h2");
                header1.className = "slide-header1"
                header1.innerHTML = options.header1;
                slideContent.appendChild(header1);
            }
            if (options.list) {                                 // append list
                var ul = document.createElement("ul");
                var li;
                for (let i=0; i<options.list.length; i++) {
                    li = document.createElement("li");
                    li.innerHTML = options.list[i];
                    ul.appendChild(li);
                }
                slideContent.appendChild(ul);
            }
            return slideContent;
        }

        var slide = document.createElement("div");
        slide.className = "slide";

        // get slide banner
        // get slide content
        var banner = mkBanner(this.title, this.slideNum, this.viewed);
        var slideContent = mkContent(this.options);

        // add banner and slideContent to slide div
        slide.appendChild(banner);
        slide.appendChild(slideContent);

        // change slide to 'visited'
        this.viewed = true;
        return slide;
    }

}

// Menu slide connecting sequences and links
class Menu extends Slide {
    constructor(title, options, slideNum, itemConfig, previous, next) {
        super(title, options, slideNum, previous, next);
        this.type = "menu";
        this.itemConfig = itemConfig;
    }

    get items() {
        var items = [];
        for (var i=0; i<this.itemConfig.length; i++) {
            var itemConf = this.itemConfig[i];
            var item;
            if (itemConf.type === "sequence") {
                item = new Sequence(itemConf.title, itemConf.items, this, this);
            } else if (itemConf.type === "external-link") {
                item = new ExternalLink(itemConf.title, itemConf.link);
            }

            // add item to items array
            items.push(item);
        }
        return items
    }

    render() {
        // generate menu HTML
        this.viewed = true;                     // slide visited
    }

}

// Menu item linking to external doc/ page
class ExternalLink {
    constructor(title, link) {
        this.title = title;
        this.link = link;
        this.viewed = false;
    }
}


// // build slide to page
// function slideOn(slide) {
//     console.log("slide on!");
//     slide.render();
//     $("#slide-container").slideDown(200);
// }

// function slideOff(slide) {
//     $("#slide-container").slideUp(200);
// }

$(document).ready(function() {

    var configFile = "config/course.json";
    
    // get JSON config from server
    $.getJSON(configFile, function(result) {

        // config data
        var config = JSON.parse(JSON.stringify(result));

        // set html tags
        $("title").html(config.courseID);
        $("#course-title").html(config.courseTitle);

        var main = config.mainSequence;
        var mainSequence = new Sequence(main.title, main.items);
        currentSlide = mainSequence.items[2];
        currentSlide.slideOn();
    });


});