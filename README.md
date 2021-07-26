# NSC HTML5 Course Development Framework
## Overview
This framework is used to generate HTML5 courses for the NASA Safety Center. The framework is only a frontend tool that is written entirely in JS. To communicate with the LMS\(Learning Management System\), `app.js` issues GET requests using the SCORM API. Currently, a course must be configured with a manually written config.json file, but in the future a GUI may be available.

## Terminology
### Items
- **Item**: JS object.
##### General
- **Sequence**: Item of Menu Slide. Array of Slides and Menus.
- **Slide**: Item of Sequence. Basic onscreen element of the course. A Slide can be content Slide, Menu, knowledge check, or course complete.

##### Slides
- **Content Slide**: Sequence Item. Slide with text.
- **Custom Slide**: Sequence Item. Renders custom HTML from HTML file.
- **Menu Slide**: Sequence Item. Collection of Sequences and External links.
- **Knowledge Check Slide**: Sequence Item. Slide with questions and selectable answers.
- **Course Complete**: Sequence Item. Displays when user has completed course.

##### External
- **External Links**: Menu Item. Opens link to webpage.
- **External Video**: Menu Item. Opens video.


## How To Create a Course
Creating a course is super easy. The `configTemplate.json` file can be used, or files can be manually written using the following structure:

### Config Setup
Specify the general keys
```
{
    "courseTitle": "COURSE-TITLE",
    "courseID": "COURSE-ID",
    "studyGuidePDF": "COURSE-STUDYGUIDE",
    "studyGuidePrint": "COURSE-PRINTDOC",
    "mainSequence": [
        ...
    ]
}
```
### Add Items to Main Sequence
Only Slides and Menus can be added to the `mainSequence` \(or any other Sequence\), **not** other Sequences \(that wouldn't make much sense anyways!\).

##### Slide Components

Content slides are fully responsive and created by adding various named display items to the 'options' section of an 'items' JSON fields. In general, the named items refer to common web HTML elements (heading, list, paragraph, etc.). Since the Bootstrap library is also included in the framework, some named display items also refer to common Bootstrap components (card, alert, etc.).  Some display items have also been given additional attributes to customize appearance.

Slides may also have multiple sections, with each containing various named display items.  Each section can also be given a 'format' identifier, specifying a particular visual layout and/or alignment preference.

###### Currently supported named display items:
- **heading**
- **subheading**
- **list**
- **paragraph**
- **image**
- **video**
- **alert**
- **card**
- **knowledgecheck**
- **custom**
- **divider**
- **spacer**

Currently about a dozen content formats are supported.  These formats include layouts like simple text alignment, vertically centered content, various multi-column designations and more.  Other formats can be easily added to the framework.

###### Content examples generated from JSON code

```
{
    "type": "slide",
    "title": "Expectations for the Course",
    "options": [
      { "paragraph": { "text": "This course will help you to:", "style": "bold" },
        "list": [
            "Do a better job of developing the SMA portion of acquisition documents",
            "Be more effective at evaluating the SMA aspects of contractor proposals",
            "Provide sound risk-informed input",
            "Become a leading contributor to critical mission acquisitions"
        ],
        "format": 1
      }
    ]
}
```

This will render:
![Content Slide Example](./media/contentExample01.png?raw=true "Content Example")

```
{
    "type": "slide",
    "title": "Two Columns: 66%,33%",
    "options": [
      { "columns": [
          { "subheading": "Here's a subheading",
            "paragraph": { "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac ex magna. Integer egestas arcu nisl, eget tempor purus efficitur et. Etiam imperdiet eros at condimentum molestie. Etiam hendrerit egestas ex at fermentum. Nulla accumsan tempus odio sed posuere. Nulla quis volutpat lorem, id viverra odio. Quisque urna enim, tempus in turpis vitae, porttitor sodales neque. Curabitur dictum sodales nunc, vitae pharetra mauris iaculis eu. Phasellus massa est, suscipit non malesuada id, dapibus ut nunc.", "style": "normal" }
          },
          {
            "image": { "src": "img/_1_1_2.jpg", "alt": "some image", "caption": "Image Caption" }
          }
        ],
        "format": 11
      }
    ]
}
```

This will render:
![Content Slide Example](./media/contentExample02.png?raw=true "Content Example")

```
{
    "type": "slide",
    "title": "Video",
    "options": [
      { "subheading": "Here's a video",
        "video": { "src": "video/NSE_Module_1.mp4", "captions": "video/NSE_Module_1.vtt", "placeholder": "video/placeholder.jpg" },
        "spacer": {"height": "20px"},
        "format": 8
      }
    ]
}
```

This will render:
![Content Slide Example](./media/contentExample03.png?raw=true "Content Example")

```
{
    "type": "slide",
    "title": "Multiple Equal Columns",
    "options": [
      { "heading": "Some Heading to Show Above the Columns",
        "format": 2
      },
      { "columns": [
          { "subheading": "First subheading",
            "alert": { "content": "This is the alert component", "style": "alert-success" },
            "paragraph": { "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac ex magna. Integer egestas arcu nisl, eget tempor purus efficitur et.", "style": "normal" }
          },
          { "subheading": "Second subheading",
            "alert": { "content": "This is the second alert component", "style": "alert-warning" }
          },
          { "subheading": "Third subheading",
            "alert": { "content": "This is the third alert component", "style": "alert-info" }
          }
        ],
        "format": 10
      }
    ]
}
```

This will render:
![Content Slide Example](./media/contentExample04.png?raw=true "Content Example")

_n_ Slide objects can be added in a Sequence. Simply append or insert them into the Sequence's `Items` array in the order you want.

#### Add Menu Item to a Sequence
Menu Items are sort of a hybrid between a Slide and a Sequence. A Menu Item can be rendered to the screen \(unlike a Sequence\), but also contain nested Items \(like a Sequence\).

Menu Slide:
```
{
    "type": "Menu",
    "title": "blah blah blah Menu",
    "Items": [
        {
            "type": "external-link",
            "title": "Must Watch Important Module",
            "link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        }
    ]
}
```

This will render:
![Menu Slide Example](./media/menuExample.jpg?raw=true "Content Example")

This Menu only has one Item, but _n_ Sequence objects \( 'Items'\) or External-Link objects can be added to a Menu's `items` array.

## How It Works
Data from the `course.json` file is retrieved via a GET request to the server. `<title>` and `<h1 id="course-title">` element innerHTMLs are set with the `courseID` and `courseTitle` values, then the `mainSequence` instance is created using the `Sequence` template.

An `addItems` method is called upon the instantiation of a `Sequence` object. This method iterates through the `items` in the Sequence's JSON configuration, and appends `Slide` and `Menu` instances to the `items` instance variable.

When `Menu` instances are created, the `addItems` method is called which \(just like the `Sequence` template\) appends `Sequence` and `ExternalLink` instances to the `items` instance variable.

This process of iterating through items in nested configurations creates an instance of each item in the entire JSON configuration!

As each instance is created, `next`, `previous`, and `parent` instance variables are set with other objects.

The `mainSequence` is then rendered to the viewer \(which only renders its first item: a Slide or Menu\).

When the **Next** or **Back** buttons are clicked, a currently rendered instance's `next` or `previous` object is rendered.
