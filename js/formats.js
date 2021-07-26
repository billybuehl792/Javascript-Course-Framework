
(function( formatter, $, undefined ) {

  /* ===========================
    --- PUBLIC functions
  =========================== */

  // 1 - one col: no special format, left aligned (DEFAULT behavior)
  // 2 - one col: center aligned
  // 3 - one col: right aligned
  // 4 - one col: left aligned, center content vertically
  // 5 - one col: center aligned, center content vertically (e.g. title slide)
  // 6 - one col: right aligned, center content vertically
  // 7 - one col: not full width (about 80%), centered H and V (used for knowledgecheck)
  // 8 - one col: not full width (about 80%)
  // 10 - multiple columns (6 max), equal width
  // 11 - 2 columns: widths={66%,33%}
  // 12 - 2 columns: widths={33%,66%}
  /* ===========================
    getFormat: creates HTML container wrapper for slide Content (based on 'format' value)
      -- then calls slide functions to inject the formatted content
  =========================== */
  formatter.getFormat = function(slide,section) {
    var container = null;
    if (section.format) {
      switch (section.format) {
        case 1:
          container = document.createElement("div");
          container.className = "row";
          col = document.createElement("div");
          col.className = "col";
          container.appendChild(col);
          if (slide.slideText) { container.lastChild.appendChild(slide.slideText); }
          break;
        case 2:
          container = document.createElement("div");
          container.className = "row text-center";
          col = document.createElement("div");
          col.className = "col";
          container.appendChild(col);
          if (slide.slideText) { container.lastChild.appendChild(slide.slideText); }
          break;
        case 3:
          container = document.createElement("div");
          container.className = "row text-right";
          col = document.createElement("div");
          col.className = "col";
          container.appendChild(col);
          if (slide.slideText) { container.lastChild.appendChild(slide.slideText); }
          break;
        case 4:
          container = document.createElement("div");
          container.className = "row content align-items-center";
          col = document.createElement("div");
          col.className = "col";
          container.appendChild(col);
          if (slide.slideText) { container.lastChild.appendChild(slide.slideText); }
          break;
        case 5:
          container = document.createElement("div");
          container.className = "row content text-center align-items-center";
          col = document.createElement("div");
          col.className = "col";
          container.appendChild(col);
          if (slide.slideText) { container.lastChild.appendChild(slide.slideText); }
          break;
        case 6:
          container = document.createElement("div");
          container.className = "row content text-right align-items-center";
          col = document.createElement("div");
          col.className = "col";
          container.appendChild(col);
          if (slide.slideText) { container.lastChild.appendChild(slide.slideText); }
          break;
        case 7:
          container = document.createElement("div");
          container.className = "row content text-center align-items-center";
          col = document.createElement("div");
          col.className = "col-md-10 offset-md-1";
          container.appendChild(col);
          if (slide.slideText) { container.lastChild.appendChild(slide.slideText); }
          break;
        case 8:
          container = document.createElement("div");
          container.className = "row";
          col = document.createElement("div");
          col.className = "col-md-10 offset-md-1";
          container.appendChild(col);
          if (slide.slideText) { container.lastChild.appendChild(slide.slideText); }
          break;
        case 10: // multiple columns (6 max) of equal width
          container = document.createElement("div");
          container.className = "row";
          var colWidth = 12;
          switch (section.columns.length) {
            case 2: colWidth = 6; break;
            case 3: colWidth = 4; break;
            case 4: colWidth = 3; break;
            case 5: colWidth = 2; break;
            case 6: colWidth = 2; break;
          }
          for (let i=0; i<section.columns.length; i++) {
            var c = document.createElement("div");
            (i === 5) ? c.className = "col-md-"+colWidth+" offset-md-1" : c.className = "col-md-"+colWidth;
            slide.getSectionContent(section.columns[i],c);
            container.appendChild(c);
          }
          break;
        case 11: // 2 columns (66%,33%)
          container = document.createElement("div");
          container.className = "row";
          for (let i=0; i<2; i++) { // 2 columns max
            var c = document.createElement("div");
            (i === 0) ? c.className = "col-md-8" : c.className = "col-md-4";
            slide.getSectionContent(section.columns[i],c);
            container.appendChild(c);
          }
          break;
        case 12: // 2 columns (33%,66%)
          container = document.createElement("div");
          container.className = "row";
          for (let i=0; i<2; i++) { // 2 columns max
            var c = document.createElement("div");
            // c.className = "col-md-4 justify-content-end d-flex" // can justify content using these classes
            (i === 0) ? c.className = "col-md-4" : c.className = "col-md-8";
            slide.getSectionContent(section.columns[i],c);
            container.appendChild(c);
          }
          break;
        default:
          container = document.createElement("div");
          container.className = "row";
          col = document.createElement("div");
          col.className = "col";
          container.appendChild(col);
          if (slide.slideText) { container.lastChild.appendChild(slide.slideText); }
          break;
      }
    } else { // no format available, return empty row & col
      container = document.createElement("div");
      container.className = "row";
      col = document.createElement("div");
      col.className = "col";
      container.appendChild(col);
    }
    return container
  }

  formatter.slideHeading = function(heading) {
      // return slide heading HTML
      var slideHead = document.createElement("h2");
      slideHead.innerHTML = heading;
      slideHead.className = "slide-heading";

      return slideHead;
  }

  formatter.slideSubheading = function(subheading) {
      // return slide subheading HTML
      var slideSub = document.createElement("h3");
      slideSub.innerHTML = subheading;
      slideSub.className = "slide-subheading";

      return slideSub;
  }

  formatter.slideList = function(list) {
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

  formatter.slideParagraph = function(paragraph) {
      var pHTML = document.createElement("p");
      (paragraph.style == "bold") ? pHTML.className = "font-weight-bold trailing-space" : pHTML.className = "trailing-space";
      pHTML.innerHTML = paragraph.text;

      return pHTML;
  }

  formatter.slideImage = function(image) {
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

  formatter.slideVideo = function(video) {
      var container = document.createElement("div");
      container.className = "embed-responsive embed-responsive-16by9";
      var vid = "<video controls poster='"+video.placeholder+"' class='embed-responsive-item'>";
      vid += "<source src='"+video.src+"' type='video/mp4' />";
      vid += "<track kind='captions' label='English Captions' src='"+video.captions+"' />";
      vid += "</video>";
      container.innerHTML = vid;

      return container;
  }

  // use Bootstrap 'alert' to display text (shadow and icon are optional)
  //  Note: Bootstrap styles equate to colors ('alert-'+ primary, secondary, success, info, danger, warning, light, dark)
  formatter.slideAlert = function(alert) {

      var slideAlert = document.createElement("div");
      slideAlert.className = "alert shadow "+alert.style; // shadow is optional
      slideAlert.setAttribute("role","alert");
      //slideAlert.innerHTML = "<i class='bi bi-arrow-right-circle-fill'></i> "+alert.content; // icon is optional
      slideAlert.innerHTML = alert.content;

      return slideAlert;
  }

  formatter.slideCard = function(card) {
      // use Bootstrap 'card' to display card component
      var slideCard = document.createElement("div");
      slideCard.className = "card shadow bg-light"; // shadow and style classes could be optional
      var header = document.createElement("div");
      header.className = "card-header";
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

  // creates 'knowledge check' display and button handler answer responses
  formatter.slideReview = function(slide,knowledgecheck) {
      var slideCard = document.createElement("div");
      slideCard.className = "card shadow";
      var header = document.createElement("div");
      header.className = "card-header slide-subheading";
      header.innerHTML = knowledgecheck.header;
      slideCard.appendChild(header);

      var body = document.createElement("div");
      body.className = "card-body";
      for (let i=0; i<knowledgecheck.body.length; i++) {
        var button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = knowledgecheck.body[i];
        button.className = 'btn btn-outline-secondary btn-block font-weight-bold';
        button.onclick = function() {
          var correct = false;
          if (knowledgecheck.answer === (i+1)) { correct = true; }
          slide.showQuestionResponse(correct,knowledgecheck.body[knowledgecheck.answer-1]);
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

  formatter.slideDivider = function(divider) {

      var divider = document.createElement("div");
      divider.innerHTML = '<hr>';

      return divider;
  }

  formatter.slideSpacer = function(spacer) {

      var slideSpacer = document.createElement("div");
      slideSpacer.setAttribute('style','height: '+spacer.height);
      slideSpacer.innerHTML = '<br>';

      return slideSpacer;
  }

  formatter.slideCustom = function(custom) {
      // return custom HTML
      var customHTML = document.createElement("div");
      customHTML.className = "slide-custom";
      customHTML.innerHTML = custom.join('');

      return customHTML;
  }

  /* ===========================
    --- PRIVATE functions
  ============================ */



}( window.formatter = window.formatter || {}, jQuery ));
