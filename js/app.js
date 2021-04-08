// app.js - course web framework

var currentSlide;

class Item {
    // Sequence, Slide, Menu, Link, etc.
    constructor(_title) {
        this.title = _title;
        this.id = this.genID();
    }

    genID() {
        // create unique id for items
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return ("s"+S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }

}

class Sequence extends Item {
    // Sequence of Slides and Menus
    // Item of: Root or Menu
    constructor(_title, _itemConfig, _parent=null, _previous=null, _next=null) {
        super(_title);
        this.type = "sequence";
        this.itemConfig = _itemConfig;
        this.parent = _parent;
        this.previous = _previous;
        this.next = _next;
        this.items = [];
        this.addItems();
    }

    addItems() {
        // adds items from items config to this.items[]
        var previous = null;                    // previous item in sequence (null if first)

        for (let i=0; i<this.itemConfig.length; i++) {
            var itemConf = this.itemConfig[i];
            var item;
            if (itemConf.type === "slide") {
                item = new Slide(itemConf.title, itemConf.options, i, this);
            } else if (itemConf.type === "menu") {
                item = new Menu(itemConf.title, itemConf.options, i, this, itemConf.items);
            }
            
            item.previous = previous;           // set item's previous to previous
            previous = item;                    // set previous to current item
            if (this.items.length > 0) {        // set previous item's next = current item
                this.items[i-1].next = item;
            }
            this.items.push(item);              // push item to array
        }
        
        this.items[0].previous = this.previous;      // set first item previous = sequence previous
        this.items[this.items.length-1].next = this.next; // set last item next = sequence next        
    }

    render() {
        // renders sequence's first item
        if (this.items.length > 0) {
            this.items[0].render();
        }
    }

}

class Slide extends Item {
    // Generic ol' Content Slide
    // Item of: Sequence
    constructor(_title, _options, _slideNum, _parent, _previous=null, _next=null) {
        super(_title);
        this.type = "slide";
        this.options = _options;
        this.previous = _previous;
        this.next = _next;
        this.slideNum = _slideNum;
        this.parent = _parent;
        this.viewed = false;
    }
    
    get slideContentHTML() {

        function slideTextHTML(options) {
            var slideText = document.createElement("div");
            slideText.className = "slide-text";
            if (options) {
                if (options.header) {                              // append header
                    var header = document.createElement("h1");
                    header.innerHTML = options.header;
                    header.className = "slide-header";
                    slideText.appendChild(header);
                }
                if (options.header1) {                              // append header1
                    var header1 = document.createElement("h2");
                    header1.className = "slide-header1"
                    header1.innerHTML = options.header1;
                    slideText.appendChild(header1);
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
                    slideText.appendChild(ul);
                }
            }
    
            return slideText;
        }

        var slideContent = document.createElement("div");
        var slideText = slideTextHTML(this.options);

        slideContent.className = "slide-content";
        slideContent.appendChild(slideText);
        
        return slideContent
    }

    get slideHTML() {

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

        var slideHTML = document.createElement("div");
        var banner = mkBanner(this.title, this.slideNum, this.viewed)

        slideHTML.id = this.id;
        slideHTML.className = "slide";
        
        slideHTML.appendChild(banner);
        slideHTML.appendChild(this.slideContentHTML);

        return slideHTML;
    }

    render() {
        currentSlide = this;
        var slideHTML = this.slideHTML;

        $("#slide-container").html(slideHTML).promise().done(function() {
            $(".slide").animate({
                opacity: "1",
                marginLeft: "0px"
            }, 250, "swing");
        });

        $("#page-number").html(this.slideNum + 1);
        $("#total-pages").html(this.parent.items.length);
        this.viewed = true;
    }

}

class Menu extends Slide {
    // Menu slide connecting sequences and links
    // Item of: Sequence or Menu
    constructor(_title, _options, _slideNum, _parent=null, _itemConfig, _previous=null, _next=null) {
        super(_title, _options, _slideNum, _parent, _previous, _next);
        this.type = "menu";
        this.itemConfig = _itemConfig;
        this.items = [];
        this.addItems();
    }

    addItems() {
        for (var i=0; i<this.itemConfig.length; i++) {
            var itemConf = this.itemConfig[i];
            var item;
            if (itemConf.type === "sequence") {
                item = new Sequence(itemConf.title, itemConf.items, this, this, this);
            } else if (itemConf.type === "external-link") {
                item = new ExternalLink(itemConf.title, itemConf.link);
            }

            // add item to items array
            this.items.push(item);
        }
    }

    get slideContentHTML() {
        var slideContent = super.slideContentHTML;

        function slideMenuHTML(items) {
            var slideMenu = document.createElement("div");

            for (let i=0; i < items.length; i++) {
                var menuItem = document.createElement("div");
                var iconContainer = document.createElement("div");
                var menuTextBox = document.createElement("div");
                var menuItemIcon = document.createElement("img");
                var menuText = document.createElement("h2");
                
                menuItem.classList.add("menu-item");
                switch (items[i].type) {
                    case "sequence":
                        menuItem.classList.add("menu-sequence");
                        break;
                    case "external-link":
                        menuItem.classList.add("menu-link");
                        break;
                    case "menu":
                        menuItem.classList.add("menu-menu");
                        break;
                }
    
                menuItemIcon.src = "img/icon_menuitem.png";
                menuItemIcon.alt = "menu-item-icon";

                menuText.className = "menu-text";
                menuText.innerHTML = items[i].title;
    
                menuTextBox.appendChild(menuText);
                iconContainer.appendChild(menuItemIcon);

                menuItem.onclick = function() {
                    items[i].render();
                }
                menuItem.id = items[i].id;
                menuItem.appendChild(menuTextBox);
                menuItem.appendChild(iconContainer);
                slideMenu.appendChild(menuItem);
            }

            slideMenu.className = "menu";
            return slideMenu;
        }

        var slideMenu = slideMenuHTML(this.items);
        slideContent.appendChild(slideMenu);
        
        return slideContent;
    }

}

class ExternalLink extends Item {
    // Item linking to external doc/ page
    // Item of: Menu
    constructor(_title, _link) {
        super(_title);
        this.link = _link;
        this.viewed = false;
    }

    render() {
        window.open(this.link);
        this.viewed = true;
    }
}


function nextSlide() {
    // onclick "#next" > slide current slide left and next on
    if (currentSlide.next) {
        $(".slide").animate({
            marginLeft: "-150px",
            opacity: "0"
        }, 200, "swing", function() {
            currentSlide.next.render();
        });
    }
}

function prevSlide() {
    // onclick "#back" > slide current slide right and next on
    if (currentSlide.previous) {
        $(".slide").animate({
            marginLeft: "150px",
            opacity: "0"
        }, 200, "swing", function() {
            currentSlide.previous.render();
        });
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
        mainSequence.render();
    });

    $("#next").click(nextSlide);
    $("#back").click(prevSlide);
    $(".menu-item").click(function() {
        console.log("menu item clicked");
    });
});