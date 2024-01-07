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
    filmekKigyujtese();
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
        input.setAttribute("onchange","filmekKigyujtese()")
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

            joFilmek = joFilmek.filter(movie =>
                movie.cast.some(actor => actor.toLowerCase().includes(input.value.toLowerCase()))
            );

        }
    }
    if (jelenlegKivalasztottKategoriak.length != 0) {
        joFilmek = joFilmek.filter(c => c.genres.some(genre => jelenlegKivalasztottKategoriak.includes(genre)));
    }

    if (radioExtract = document.querySelector('input[name="evek"]:checked')) {
        joFilmek = joFilmek.filter(c => c.year == document.querySelector('input[name="evek"]:checked').id);
    }

    filmekKimutatasa(joFilmek);
    console.log(joFilmek)
}

function filmekKimutatasa(joFilmek){
    var content = document.getElementById("content")
    if (joFilmek.length == 0) {
        content.innerHTML = "<h1>Sajnos nem található a feltételeknek megefelelő film</h1>"
    }
    else{
        content.innerHTML = "";

        for (let i = 0; i < joFilmek.length && i < 50; i++) {
            var el = joFilmek[i];
            var img = document.createElement("img");
            var desc = document.createElement("p")
            var title = document.createElement("h2")
            var cast = document.createElement("ul")

            if (el.hasOwnProperty("thumbnail")) {
                img.src = el.thumbnail;
            }
            desc.innerText = el.extract;
            title.innerText = el.title + " (" + el.year+")";
            for (let j = 0; j < el.cast.length; j++) {
                var li = document.createElement("li");
                li.innerText = el.cast[j];
                cast.appendChild(li);
            }
            var mainDiv = document.createElement("div");
            var imgDiv = document.createElement("div");
            var textDiv = document.createElement("div");
            var a = document.createElement("a");

            a.setAttribute("href","https://en.wikipedia.org/wiki/"+el.href)
            a.setAttribute("target","_blank")

            a.appendChild(img)
            imgDiv.appendChild(a)
            imgDiv.classList += "imgDiv"

            textDiv.appendChild(title)
            textDiv.appendChild(desc)
            textDiv.appendChild(cast)
            textDiv.classList+= "textDiv"

            mainDiv.appendChild(imgDiv);
            mainDiv.appendChild(textDiv);

            mainDiv.classList += "filmek";
            mainDiv.classList += " row";

            content.appendChild(mainDiv);
        }
        if (joFilmek.length > 50) {
            console.log("teszt")
            content.innerHTML += "<h1>Még találtunk tőbb filmet ami megfelel a feltélekenek csak nem tudjuk megjeleniteni, próbálj pontosabban keresni"
        }
    }
}

function mitKeressValtozas(option){
    document.getElementById("szovegesKereses").setAttribute("placeholder",option.options[option.selectedIndex].text)
    filmekKigyujtese();
}
