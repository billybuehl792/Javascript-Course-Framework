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
                    item = new Slide(itemConf.title, itemConf.options||null, itemConf.custom||null, i, this);
                    break;
                case "menu":
                    item = new Menu(itemConf.title, itemConf.options||null, itemConf.custom||null, i, itemConf.items, this);
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
    constructor(_title, _options, _custom, _slideNum, _parent, _previous=null, _next=null) {
        super(_title, _parent, _previous, _next);
        this.type = "slide";
        //this.format = _format;
        this.options = _options;
        this.custom = _custom;
        this.slideNum = _slideNum;
        this.visited = false;
    }

    get complete() {
        return this.visited;
    }

    get slideText() {

        function slideHeading(heading) {
            // return slide heading HTML
            var slideHead = document.createElement("h2");
            slideHead.innerHTML = heading;
            slideHead.className = "slide-heading";

            return slideHead;
        }

        function slideSubheading(subheading) {
            // return slide subheading HTML
            var slideSub = document.createElement("h3");
            slideSub.innerHTML = subheading;
            slideSub.className = "slide-subheading";

            return slideSub;
        }

        function slideList(list) {
            // return slide list HTML
            var slideList = document.createElement("ul");
            slideList.className = "slide-list";

            var listItem;
            for (let i=0; i<list.length; i++) {
                listItem = document.createElement("li");
                listItem.className = "slide-list-elem";
                listItem.innerHTML = list[i];
                slideList.appendChild(listItem);
            }

            return slideList;
        }

        function slideParagraph(paragraphs) {
            // return slide list HTML
            var div = document.createElement("div");
            div.className = "paragraph";

            var pHTML;
            for (let i=0; i<paragraphs.length; i++) {
                pHTML = document.createElement("p");
                pHTML.innerHTML = paragraphs[i];
                div.appendChild(pHTML);
                div.appendChild(document.createElement("br"));
            }

            return div;
        }

        function slideImage(image) {
            // use Bootstrap 'figure' to display image with optional caption
            var fig = document.createElement("figure");
            fig.className = "figure";
            var img = document.createElement("img");
            img.className = "figure-img img-fluid";
            img.src = image.src;
            (image.alt) ? img.alt = image.alt : img.alt = "Image";
            fig.appendChild(img);
            if (image.caption) {
              var figCaption = document.createElement("figcaption");
              figCaption.className = "figure-caption";
              figCaption.innerHTML = image.caption;
              fig.appendChild(figCaption);
            }

            return fig;
        }

        function slideVideo(video) {
            var container = document.createElement("div");
            container.className = "embed-responsive embed-responsive-16by9";
            var vid = "<video controls poster='"+video.placeholder+"' class='embed-responsive-item'>";
            vid += "<source src='"+video.src+"' type='video/mp4' />";
            vid += "<track kind='captions' label='English Captions' src='"+video.captions+"' />";
            vid += "</video>";
            container.innerHTML = vid;

            return container;
        }

        function slideAlert(alert) {
            // use Bootstrap 'alert' to display text (shadow and icon are optional)
            var slideAlert = document.createElement("div");
            slideAlert.className = "alert shadow "+alert.style; // shadow is optional
            slideAlert.setAttribute("role","alert");
            slideAlert.innerHTML = "<i class='bi bi-arrow-right-circle-fill'></i> "+alert.content; // icon is optional

            return slideAlert;
        }

        function slideCard(card) {
            // use Bootstrap 'card' to display card component
            var slideCard = document.createElement("div");
            slideCard.className = "card shadow w-75"; // shadow and width classes are optional
            var header = document.createElement("div");
            header.className = "card-header bg-warning";
            header.innerHTML = card.header;
            slideCard.appendChild(header);

            var body = document.createElement("div");
            body.className = "card-body";
            var title = document.createElement("p");
            title.className = "card-text";
            title.innerHTML = card.body;
            body.appendChild(title);
            slideCard.appendChild(body);

            var footer = document.createElement("div");
            footer.className = "card-footer text-muted";
            footer.innerHTML = card.footer;
            slideCard.appendChild(footer);

            return slideCard;
        }

        function slideReview(knowledgecheck) {
            // use Bootstrap 'card' component for the knowledge check
            var slideCard = document.createElement("div");
            slideCard.className = "card shadow";
            var header = document.createElement("div");
            header.className = "card-header font-weight-bold";
            header.innerHTML = knowledgecheck.header;
            slideCard.appendChild(header);

            var body = document.createElement("div");
            body.className = "card-body";
            for (let i=0; i<knowledgecheck.body.length; i++) {
              var button = document.createElement('button');
              button.type = 'button';
              button.innerHTML = knowledgecheck.body[i];
              button.className = 'btn btn-outline-secondary btn-block';
              button.onclick = function() {  // need to implement a response (modal?)
                console.log('button '+i+' clicked');
                if (knowledgecheck.answer === (i+1)) { console.log("this is the correct answer"); }
              }
              body.appendChild(button);
            }
            slideCard.appendChild(body);

            var footer = document.createElement("div");
            footer.className = "card-footer text-muted";
            footer.innerHTML = knowledgecheck.footer;
            slideCard.appendChild(footer);

            return slideCard;
        }

        function slideCustom(custom) {
            // return custom HTML
            var customHTML = document.createElement("div");
            customHTML.className = "slide-custom";
            customHTML.innerHTML = custom.join('');

            return customHTML;
        }


        var slideText = null;

        var sectionElements = ['heading','subheading','list','paragraph','image']

        // add slide elements to slideText
        if (this.options) {
          slideText = document.createElement("div");
          slideText.className = "slide-text";

          for (let i=0; i<this.options.length; i++) {
            var section = this.options[i];
            $.each(section, function( key, value ) {
              // for (let j=0; j<sectionElements.length; j++) {
              //   if (key == sectionElements[j]) {
              //     console.log(section[sectionElements[j]]);
              //  WONT WORK unless target functions to get content use one function instead of named ones (i.e. 'slideHeading')
              //     slideText.appendChild(slideHeading(section[sectionElements[j]]));
              //   }
              // }
              if (key == "heading") { slideText.appendChild(slideHeading(section.heading)); }
              if (key == "subheading") { slideText.appendChild(slideHeading(section.subheading)); }
              if (key == "list") { slideText.appendChild(slideList(section.list)); }
              if (key == "paragraph") { slideText.appendChild(slideParagraph(section.paragraph)); }
              if (key == "image") { slideText.appendChild(slideImage(section.image)); }
              if (key == "video") { slideText.appendChild(slideVideo(section.video)); }
              if (key == "alert") { slideText.appendChild(slideAlert(section.alert)); }
              if (key == "card") { slideText.appendChild(slideCard(section.card)); }
              if (key == "knowledgecheck") { slideText.appendChild(slideReview(section.knowledgecheck)); }
              if (key == "custom") { slideText.appendChild(slideCustom(section.custom)); }
            });
          }

        }

        return slideText
    }

    // 1 - one col: no special format, left aligned (DEFAULT)
    // 2 - one col: center aligned
    // 3 - one col: right aligned
    // 4 - one col: left aligned, center content vertically
    // 5 - one col: center aligned, center content vertically (e.g. title slide)
    // 6 - one col: right aligned, center content vertically
    get slideLayout_ORIG() {
      var slideFormat = document.createElement("div");
      var col = document.createElement("div");
      if (this.options.format) {
        switch (this.options.format) {
          case 1:
            slideFormat.className = "row content";
            col.className = "col";
            slideFormat.appendChild(col);
            break;
          case 2:
            slideFormat.className = "row content text-center";
            col.className = "col";
            slideFormat.appendChild(col);
            break;
          case 3: slideFormat.className = "row content text-right";
            col.className = "col";
            slideFormat.appendChild(col);
            break;
          case 4: slideFormat.className = "row content align-items-center";
            col.className = "col";
            slideFormat.appendChild(col);
            break;
          case 5:
            slideFormat.className = "row content text-center align-items-center";
            col.className = "col";
            slideFormat.appendChild(col);
            break;
          case 6:
            slideFormat.className = "row content text-right align-items-center";
            col.className = "col";
            slideFormat.appendChild(col);
            break;
          case 7:
            slideFormat.className = "row content text-center align-items-center";
            col.className = "col-md-10 offset-md-1";
            slideFormat.appendChild(col);
            break;
          default:
            slideFormat.className = "row";
            col.className = "col";
            slideFormat.appendChild(col);
            break;
        }
      }  else {
        slideFormat.className = "row";
        col.className = "col";
        slideFormat.appendChild(col);
      }

      if (this.slideText) {
          slideFormat.lastChild.appendChild(this.slideText);
      }
      // if (this.slideCustom) {
      //     slideFormat.lastChild.appendChild(this.slideCustom);
      // }

      return slideFormat;
    }

    // 1 - one col: no special format, left aligned (DEFAULT)
    // 2 - one col: center aligned
    // 3 - one col: right aligned
    // 4 - one col: left aligned, center content vertically
    // 5 - one col: center aligned, center content vertically (e.g. title slide)
    // 6 - one col: right aligned, center content vertically
    get slideLayout() {
      var slideContent = document.createElement("div");
      slideContent.className = "slide-content col";
      var slideSection,col;

      for (let i=0; i<this.options.length; i++) {
        var section = this.options[i];

        if (section.format) {
          switch (section.format) {
            case 1:
              slideSection = document.createElement("div");
              slideSection.className = "row content";
              col = document.createElement("div");
              col.className = "col";
              slideSection.appendChild(col);
              break;
            case 7:
              slideSection = document.createElement("div");
              slideSection.className = "row content text-center align-items-center";
              col = document.createElement("div");
              col.className = "col-md-10 offset-md-1";
              slideSection.appendChild(col);
              break;
          }
        }
        //     case 7:
        //       slideFormat = document.createElement("div");
        //       slideFormat.className = "row content text-center align-items-center";
        //       col = document.createElement("div");
        //       col.className = "col-md-10 offset-md-1";
        //       slideFormat.appendChild(col);
        //       break;
        //     default:
        //       slideFormat = document.createElement("div");
        //       slideFormat.className = "row";
        //       col = document.createElement("div");
        //       col.className = "col";
        //       slideFormat.appendChild(col);
        //       break;
        //   }
        // }  else {
        //   slideFormat = document.createElement("div");
        //   slideFormat.className = "row";
        //   col = document.createElement("div");
        //   col.className = "col";
        //   slideFormat.appendChild(col);
        // }

      }

      if (this.slideText) {
          slideContent.lastChild.appendChild(this.slideText);
      }
      // if (this.slideCustom) {
      //     slideFormat.lastChild.appendChild(this.slideCustom);
      // }

      return slideContent;
    }


    get slideContent() {
        var slideContent = document.createElement("div");
        slideContent.className = "card outerShadow";
        slideContent.id = "card-container";

        // create header
        var header = document.createElement("div");
        var check = document.createElement("span");
        var title = document.createElement("p");
        check.className = "circled float-left";
        header.className = "card-header bg-step";
        header.id = "card-container-header";
        (this.complete) ? check.innerHTML = "<i class='bi-check'></i>" : check.innerHTML = String(this.slideNum+1);
        title.innerHTML = this.title;
        header.appendChild(check);
        header.appendChild(title);
        slideContent.appendChild(header);

        // create body
        var body = document.createElement("div");
        var row = document.createElement("div");
        var col = document.createElement("div");
        body.className = "card-body";
        row.className = "row";
        //col.className = "slide-content col";

        if (this.type == "slide") {
          var layout = this.slideLayout; // get layout markup and content
          row.appendChild(layout);
        }

        //row.appendChild(col)
        body.appendChild(row);

        slideContent.appendChild(body)

        return slideContent;
    }

    get slideHTML() {
        var html = document.createElement("div");
        html.id = this.id;
        html.className = "slide";
        html.appendChild(this.slideContent);
        //console.log(this);

        return html;
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
            $(".slide-content").animate({
                opacity: "1",
                marginTop: "0px"
            }, 150, "swing");
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
    constructor(_title, _options, _custom, _slideNum, _itemConfig, _parent=null, _previous=null, _next=null) {
        super(_title, _options, _custom, _slideNum, _parent, _previous, _next);
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

    get slideMenu() {
        // return slide menu HTML div

        function menuItem(item) {
            // return menu item HTML

            function menuItemStyle(type) {
                // return class name for menu item
                switch (type) {
                    case "sequence": return "menu-sequence";
                    case "external-link": return "menu-link";
                    case "menu": return "menu-menu";
                }
            }

            function menuItemIcon(type) {
                // return menu item icon HTML
                var iconContainer = document.createElement("div");
                var menuItemIcon = document.createElement("img");

                menuItemIcon.src = `img/icon_${type}.png`;
                menuItemIcon.alt = "menu-item-icon";

                iconContainer.appendChild(menuItemIcon);
                return iconContainer;
            }

            function menuItemText(title) {
                // return menu item textbox
                var menuTextBox = document.createElement("div");
                var menuText = document.createElement("p");

                // add item menu text
                menuTextBox.className = "menu-text";
                menuText.innerHTML = title;
                menuTextBox.appendChild(menuText);

                return menuTextBox;
            }

            var menuItem = document.createElement("div");

            // add style classes
            menuItem.classList.add("menu-item");
            menuItem.classList.add(menuItemStyle(item.type));

            // if complete > show item complete
            if (item.complete) {
                menuItem.classList.add("complete");
            }

            // menu item onclicks
            menuItem.onclick = function() {
              console.log("menu item");
                item.render();
            }

            // set item id + add menuTextBox + menuItemIcon
            menuItem.id = item.id;
            menuItem.appendChild(menuItemText(item.title));
            // menuItem.appendChild(menuItemIcon(item.type));

            return menuItem;
        }

        var slideMenu = document.createElement("div");

        for (let i=0; i<this.items.length; i++) {
            slideMenu.appendChild(menuItem(this.items[i]));
        }

        slideMenu.className = "slide-menu";
        return slideMenu;
    }

    get slideContent() {
        var html = super.slideContent;
        var target = html.querySelector(".slide-content"); // insert menu items inside Bootstrap 'card' body
        target.appendChild(this.slideMenu);

        return html;
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
                    item = new Menu(itemConf.title, itemConf.options||null, itemConf.custom||null, i, itemConf.items, this, this, this);
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
        }, 200, "swing", () => {
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
        }, 200, "swing", () => {
            currentSlide.previous.render();
        });
    }
}

function genSlide(slideTitle, heading, subHeading, format=5) {
    // retrun dict of basic slide
    var basicSlide = {
        "type": "slide",
        "title": slideTitle,
        "options": {
            "heading": heading,
            "subheading": subHeading,
            "format": format
        },
    }
    return basicSlide;
}

$(document).ready(function() {

    // course config JSON
    var configFile = "config/course.json";

    // get JSON config from server
    $.getJSON(configFile, function(result) {

        // config data
        var config = JSON.parse(JSON.stringify(result));
        var main = config.mainSequence;

        // set html tags
        $("title").html(config.courseID);
        $("#course-title").html(config.courseTitle);

        // add intro
        if (config.genIntro) {
            var introSlide = genSlide("Introduction", config.courseTitle, config.courseID)
            main.items.unshift(introSlide);
        }

        // generate and render mainSequence
        mainSequence = new Sequence(main.title, main.items);
        mainSequence.render();
    });

    // next and back buttons
    $("#next").click(nextSlide);
    $("#back").click(prevSlide);

});
