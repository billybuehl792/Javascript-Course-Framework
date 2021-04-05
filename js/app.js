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

    render() {
        currentSlide = this;
        $("#slide-container").html(this.buildSlide());
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
            if (viewed) {                               // if slide visited, render checkmark
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
            if (options) {
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
                    ul.className = "slide-list";
                    for (let i=0; i<options.list.length; i++) {
                        li = document.createElement("li");
                        li.className = "slide-list-elem";
                        li.innerHTML = options.list[i];
                        ul.appendChild(li);
                    }
                    slideContent.appendChild(ul);
                }
            }

            return slideContent;
        }
        
        // get slide banner
        // get slide content
        var slide = document.createElement("div");
        var banner = mkBanner(this.title, this.slideNum, this.viewed);
        var slideContent = mkContent(this.options);

        // add banner and slideContent to slide div
        slide.className = "slide";
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
        currentSlide = this;
        $("#slide-container").html(this.buildMenu());
    }

    buildMenu() {

        // generate slide banner HTML
        function mkBanner(title, slideNum, viewed) {                          
            var banner = document.createElement("div");
            var statusBox = document.createElement("div");
            var container = document.createElement("div");
            var titleBox = document.createElement("div");
            var slideTitle = document.createElement("h1");
            var status;

            container.className = "container";
            banner.className = "menu-banner";           // banner class name
            statusBox.className = "slide-status";       // statusBox class name
            titleBox.className = "slide-title";         // titleBox class name
            slideTitle.innerHTML = title;               // set slide's title  
            if (viewed) {                               // if slide visited, render checkmark
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
        function mkContent(options, items) {
            var slideContent = document.createElement("div");
            var menuItems = document.createElement("div");

            slideContent.className = "slide-content";
            if (options) {
                if (options.header) {                              // append header
                    var header = document.createElement("h1");
                    header.innerHTML = options.header;
                    header.className = "slide-header";
                    slideContent.appendChild(header);
                }
            }


            for (let i=0; i < items.length; i++) {
                var menuItem = document.createElement("div");
                var iconContainer = document.createElement("div");
                var menuTextBox = document.createElement("div");
                var menuItemIcon = document.createElement("img");
                var menuText = document.createElement("h2");

                menuItems.className = "menu";

                menuText.className = "menu-text";
                menuText.innerHTML = items[i].title;
                
                menuItem.classList.add("menu-item");
                if (items[i].type == "sequence") {
                    menuItem.classList.add("menu-sequence");
                } else if (items[i].type == "menu") {
                    menuItem.classList.add("menu-menu");
                } else if (items[i].type == "external-link") {
                    menuItem.classList.add("menu-link");
                }

                menuItemIcon.src = "img/icon_menuitem.png";
                menuItemIcon.alt = "menu-item-icon";

                menuTextBox.appendChild(menuText);
                iconContainer.appendChild(menuItemIcon);
                menuItem.appendChild(menuTextBox);
                menuItem.appendChild(iconContainer);
                menuItems.appendChild(menuItem);
            }

            slideContent.appendChild(menuItems);
            return slideContent;
        }

        var slide = document.createElement("div");
        slide.className = "slide";

        // get slide banner
        // get slide content
        var banner = mkBanner(this.title, this.slideNum, this.viewed);
        console.log(this.options);
        var slideContent = mkContent(this.options, this.items);

        // add banner and slideContent to slide div
        slide.appendChild(banner);
        slide.appendChild(slideContent);

        // change slide to 'visited'
        this.viewed = true;
        return slide;
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

function interpretControl() {
    if (currentSlide.next) {
        $("#next").prop("disabled", false);
    }
    if (currentSlide.previous) {

    }
}

function nextSlide() {
    currentSlide.viewed = true;
    if (currentSlide.next) {
        currentSlide.next.render();
    } else {
        $("#next").prop("disabled", true);
    }
}

function prevSlide() {
    if (currentSlide.previous) {
        $("#back").prop("disabled", false);
        currentSlide.previous.render();
    } else {
        $("#back").prop("disabled", true);
    }
}

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
        currentSlide = mainSequence.items[0];
        currentSlide.render();
    });

    $("#next").click(nextSlide);
    $("#back").click(prevSlide);

});