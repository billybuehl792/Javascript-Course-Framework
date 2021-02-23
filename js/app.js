
function nextPage() {
    console.log("next page!");
}

function backPage() {
    console.log("back page!");
}


$(document).ready(function() {
    console.log("loaded!");

    $("#next").click(nextPage);
    $("#back").click(backPage);
});
