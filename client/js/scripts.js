function select(id){
    document.getElementById(id).focus();
}

function editExhibit(tourid, exhibitid){
    window.location = "/edit/exhibit/" + tourid + "/" + exhibitid;
}

function editIfFocused(tourid, exhibitid){
    if(document.getElementById(exhibitid) === document.activeElement){
        window.location = "edit/exhibit" + tourid + "/" + exhibitid;
    }
}