var json;
var kategoriak = new Array();
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
if (this.readyState === 4 && this.status === 200) {
        json = JSON.parse(this.responseText);
        console.log(json);
        main()
    }
};
xmlhttp.open('GET', 'filmek.json');
xmlhttp.send();



var jelenlegKivalasztottKategoriak = new Array();

function main(){
    kategoriakKigyujtese();
    dropDownKategoriak();
    evekKigyujtese();
}

function dropDownKategoriak(){
    var div = document.getElementById("dropdown-content");
    for (let i = 0; i < kategoriak.length; i++) {
        var p = document.createElement("p");
        p.innerHTML=kategoriak[i];
        p.setAttribute("onclick","kategoriakKivalasztasa(this)")
        div.appendChild(p);
    }
}

function kategoriakKivalasztasa(p){
    if (p.classList != "") {
        p.classList = "";
        var index = jelenlegKivalasztottKategoriak.indexOf(p.innerHTML)
        jelenlegKivalasztottKategoriak.splice(index,1)
    }
    else{
        p.classList = "kivalasztottKategoria";
        jelenlegKivalasztottKategoriak.push(p.innerHTML)
        console.log(p);
    }
    filmekKigyujtese();
}

function kategoriakKiirasa(){

    var div = document.getElementById("main")
    var ujDiv = document.createElement("div");
    ujDiv.id = "kategoriak";
    console.log(div);

    kategoriak.forEach(element => {
        var input = document.createElement("input");
        input.type = "checkbox"
        input.name = element
        input.id = element
        var label = document.createElement("label")
        label.htmlFor = element;
        label.innerHTML = element
        ujDiv.appendChild(label);
        ujDiv.appendChild(input);
    });
    div.appendChild(ujDiv);
}

function kategoriakKigyujtese(){
    var temp = new Array()
    json.forEach(element =>{
        element.genres.forEach(c=> {
            temp.push(c);
        })
    });
    kategoriak = [...new Set(temp)]
    console.log(kategoriak)
}

function evekKigyujtese(){
    var temp = new Array()
    json.forEach(element =>{
        temp.push(element.year)
    });
    var evek = [...new Set(temp)]
    console.log(evek)
    var div = document.getElementById("year");
    for (let i = 0; i < evek.length; i++) {
        var input = document.createElement("input");
        input.type = "radio"
        input.name = "evek";
        input.id = evek[i];
        var label = document.createElement("label")
        label.htmlFor = evek[i];
        label.innerHTML = evek[i];
        var tempDiv = document.createElement("div");
        tempDiv.classList = "year"
        tempDiv.appendChild(input);
        tempDiv.appendChild(label);
        div.appendChild(tempDiv);
    }
}


function filmekKigyujtese(){
    var input = document.getElementById("szovegesKereses")
    var mitKeresunk = document.getElementById("szovegesKereses").placeholder;

    var joFilmek = json;
    console.log(mitKeresunk)
    if(input.value != ""){
        if (mitKeresunk == "Cím") {
            joFilmek = joFilmek.filter(c => c.title.toLowerCase().includes(input.value.toLowerCase()))
        }
        else{
            // szineszeket keresunk
            joFilmek = joFilmek.filter(c => c.cast.some().includes())


            joFilmek = json.filter(c => c.cast.toLowerCase().some(genre => jelenlegKivalasztottKategoriak.includes(genre)));

        }
    }
    if (jelenlegKivalasztottKategoriak.length != 0) {
        var joFilmek = json.filter(c => c.genres.some(genre => jelenlegKivalasztottKategoriak.includes(genre)));
    }

    console.log(joFilmek)
}


function mitKeressValtozas(option){
    document.getElementById("szovegesKereses").setAttribute("placeholder",option.options[option.selectedIndex].text)

    filmekKigyujtese();
}