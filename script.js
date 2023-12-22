var json;
var kategoriak = new Array();
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
if (this.readyState === 4 && this.status === 200) {
        console.log(xmlhttp);
        json = JSON.parse(this.responseText);
        console.log(json);
        main()
    }
};
xmlhttp.open('GET', 'filmek.json');
xmlhttp.send();



function main(){
    kategoriakKigyujtese();
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