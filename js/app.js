// app.js - course web framework

var currentSlide;
var mainSequence;
var courseItems = [];

class Item {
    // Sequence, Slide, Menu, Link, etc.
    constructor(_title, _parent=null, _previous=null, _next=null) {
        this.title = _title;
        this.parent = _parent;
        this.previous = _previous;
        this.next = _next;
        this.id = Item.genID();
        this.addCourseItem();
    }

    addCourseItem() {
        // add item to courseItems array
        courseItems.push(this);
    }

    static genID() {
        // create unique id for items
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return ("s"+S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }

    static checkComplete() {
        if (mainSequence.complete) {
            console.log("course complete!");
            alert('course is done, get outta here.');
        } else {
            console.log("incomplete")
        }
    }

}

class Sequence extends Item {
    // Sequence of Slides and Menus | Item of: Root or Menu
    constructor(_title, _itemConfig, _parent=null, _previous=null, _next=null) {
        super(_title, _parent, _previous, _next);
        this.type = "sequence";
        this.itemConfig = _itemConfig;
        this.items = [];
        this.addItems();
    }

    get complete() {
        // return true if all items of sequence are complete
        for (let i=0; i<this.items.length; i++) {
            if (!this.items[i].complete) {
                return false;
            }
        }
        return true;
    }

    addItems() {
        // adds items from items config to this.items[]
        var previous = null;                                // previous item in sequence (null if first)

        for (let i=0; i<this.itemConfig.length; i++) {
            var itemConf = this.itemConfig[i];
            var item;
            switch (itemConf.type) {
                case "slide":
                    item = new Slide(itemConf.title, itemConf.options || null, i, this);
                    break;
                case "menu":
                    item = new Menu(itemConf.title, itemConf.options || null, i, itemConf.items, this);
                    break;
                default:
                    alert("Course configuration error!");
                    throw new Error("Items of 'Sequence' must be either 'slide' or 'menu'");
            }

            item.previous = previous;                       // set item's previous to previous
            previous = item;                                // set previous to current item
            if (this.items.length > 0) {                    // set previous item's next = current item
                this.items[i-1].next = item;
            }
            this.items.push(item);                          // push item to array
        }
        
        if (this.items.length > 0) {
            this.items[0].previous = this.previous;         // set first item previous = sequence previous
            this.items[this.items.length-1].next = this.next;  // set last item next = sequence next        
        } else {
            alert("Course configuration error!");
            throw new Error("Sequences cannot be empty! Why would you even want this?");
        }
    }

    render() {
        // renders sequence's first item
        this.items[0].render();
        Item.checkComplete();
    }

}

class Slide extends Item {
    // Generic ol' Content Slide | Item of: Sequence
    constructor(_title, _options, _slideNum, _parent, _previous=null, _next=null) {
        super(_title, _parent, _previous, _next);
        this.type = "slide";
        this.options = _options;
        this.slideNum = _slideNum;
        this.visited = false;
    }

    get complete() {
        return this.visited;
    }
    
    get slideContentHTML() {

        function slideHeading(heading) {
            // return slide heading HTML
            var headingHTML = document.createElement("h1");
            headingHTML.innerHTML = heading;
            headingHTML.className = "slide-heading";
            return headingHTML;
        }

        function slideSubheading(subheading) {
            // return slide subheading HTML
            var subheadingHTML = document.createElement("h2");
            subheadingHTML.innerHTML = subheading;
            subheadingHTML.className = "slide-subheading";
            return subheadingHTML;
        }

        function slideList(list) {
            // return slide list HTML
            var ulHTML = document.createElement("ul");
            ulHTML.className = "slide-list";

            var liHTML;
            for (let i=0; i<list.length; i++) {
                liHTML = document.createElement("li");
                liHTML.className = "slide-list-elem";
                liHTML.innerHTML = list[i];
                ulHTML.appendChild(liHTML);
            }
            return ulHTML;
        }

        function slideCustom(custom) {
            // return custom HTML
            var customHTML = document.createElement("div");
            customHTML.className = "slide-custom";
            customHTML.innerHTML = custom.join('');
            return customHTML;
        }

        var slideContent = document.createElement("div");
        var slideText = document.createElement("div");
        slideText.className = "slide-text";
        slideContent.className = "slide-content";

        // add slide elements to slideText
        if (this.options) {
            if (this.options.heading) {
                slideText.appendChild(slideHeading(this.options.heading));
            }
            if (this.options.subheading) {
                slideText.appendChild(slideSubheading(this.options.subheading));
            }
            if (this.options.list) {
                slideText.appendChild(slideList(this.options.list));
            }
            if (this.options.custom) {
                slideContent.appendChild(slideCustom(this.options.custom));
            }
        }

        // add slideText to slideContent
        slideContent.insertBefore(slideText, slideContent.childNodes[0]);

        return slideContent
    }

    get slideBannerHTML() {
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
        slideTitle.innerHTML = this.title;               // set slide's title  
        if (this.complete) {                             // if slide visited, render checkmark
            status = document.createElement("img");
            status.src = "img/check-white_1.png";
            status.alt = "checkmark";
        } else {                                    // render slide's number in sequence
            status = document.createElement("h1");
            status.innerHTML = this.slideNum + 1;
        }
        container.appendChild(status);
        statusBox.appendChild(container);
        titleBox.appendChild(slideTitle);
        banner.appendChild(statusBox);
        banner.appendChild(titleBox);

        return banner;
    }

    get slideHTML() {
        var slideHTML = document.createElement("div");

        slideHTML.id = this.id;
        slideHTML.className = "slide";
        
        slideHTML.appendChild(this.slideBannerHTML);
        slideHTML.appendChild(this.slideContentHTML);

        return slideHTML;
    }

    setButtons() {
        // set #next and #back buttons enabled or disabled

        // disable next button
        if (this.next) {
            $("#next").prop("disabled", false);
        } else {
            $("#next").prop("disabled", true);
        }

        // disable back button
        if (currentSlide.previous) {
            $("#back").prop("disabled", false);
        } else {
            $("#back").prop("disabled", true);
        }
    }

    setPageNumbers() {
        // set page numbers
        $("#page-number").html(this.slideNum + 1);
        $("#total-pages").html(this.parent.items.length);
    }

    render() {
        currentSlide = this;
        var slideHTML = this.slideHTML;

        // swap slide-container HTML
        $("#slide-container").html(slideHTML).promise().done(() => {
            $(".slide").animate({
                opacity: "1",
                marginLeft: "0px"
            }, 250, "swing", () => {
                // check whether course is complete
                Item.checkComplete();
            });
        }, () => {
            // set buttons and page numbers
            this.setButtons();
            this.setPageNumbers();
            this.visited = true;
        }); 
    }

}

class Menu extends Slide {
    // Menu slide connecting sequences and links | Item of: Sequence
    constructor(_title, _options, _slideNum, _itemConfig, _parent=null, _previous=null, _next=null) {
        super(_title, _options, _slideNum, _parent, _previous, _next);
        this.type = "menu";
        this.itemConfig = _itemConfig;
        this.items = [];
        this.addItems();
    }

    get complete() {
        // return true if all items in menu are complete
        for (var i=0;i<this.items.length;i++) {
            if (!this.items[i].complete) {
                return false
            }
        }
        return true;
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

                menuTextBox.className = "menu-text";
                menuText.innerHTML = items[i].title;
    
                menuTextBox.appendChild(menuText);
                // iconContainer.appendChild(menuItemIcon);

                if (items[i].complete) {
                    menuItem.classList.add("complete");
                }
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

    addItems() {
        for (var i=0; i<this.itemConfig.length; i++) {
            var itemConf = this.itemConfig[i];
            var item;
            switch (itemConf.type) {
                case "sequence":
                    item = new Sequence(itemConf.title, itemConf.items, this, this, this);
                    break;
                case "external-link":
                    item = new ExternalLink(itemConf.title, itemConf.link);
                    break;
                case "menu":
                    item = new Menu(itemConf.title, itemConf.options || null, i, itemConf.items, this, this, this);
                    break;
                default:
                    alert("Course configuration error!");
                    throw new Error("Items of 'Menu' must be either 'sequence' or 'external-link'");
            }

            // add item to items array
            this.items.push(item);
        }
    }

}

class ExternalLink extends Item {
    // Item linking to external doc/ page | Item of: Menu
    constructor(_title, _link, _parent, _previous=null, _next=null) {
        super(_title, _parent, _previous, _next);
        this.type = "external-link";
        this.link = _link;
        this.complete = false;
    }

    render() {
        window.open(this.link);
        this.complete = true;
        currentSlide.render();
    }
}


function nextSlide() {
    // onclick "#next" > slide current slide left and next slide on
    if (currentSlide.next) {
        $(".slide").animate({
            marginLeft: "-200px",
            opacity: "0"
        }, 200, "swing", function() {
            currentSlide.next.render();
        });
    }
}

function prevSlide() {
    // onclick "#back" > slide current slide right and next slide on
    if (currentSlide.previous) {
        $(".slide").animate({
            marginLeft: "200px",
            opacity: "0"
        }, 200, "swing", function() {
            currentSlide.previous.render();
        });
    }
}


$(document).ready(function() {

    // course config JSON
    var configFile = "config/course.json";
    
    // get JSON config from server
    $.getJSON(configFile, function(result) {

        // config data
        var config = JSON.parse(JSON.stringify(result));
        
        // set html tags
        $("title").html(config.courseID);
        $("#course-title").html(config.courseTitle);

        var main = config.mainSequence;
        mainSequence = new Sequence(main.title, main.items);
        mainSequence.render();
    });

    // next and back buttons
    $("#next").click(nextSlide);
    $("#back").click(prevSlide);

});
