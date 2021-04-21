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

Content Slide:
```
{
    "type": "Slide",
    "title": "Hello This is a Content Slide",
    "options": {
        "header": "Cool Bands",
        "header1": "Here is a list of cool bands I like:",
        "list": [
            "Suburban Lawns",
            "Anons",
            "Kino",
            "Broadcast",
            "Bauhaus"
        ] 
    }
}
```

This will render: 
![Content Slide Example](./media/contentExample.jpg?raw=true "Content Example")

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
