document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 32) {
        var box = document.getElementById("messageBox");
        box.style.visibility="hidden";
    }
};