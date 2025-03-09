const fs = require("fs");

function saveNote() {
    const text = document.getElementById("notepad").value;
    fs.writeFile("nota.txt", text, (err) => {
        if (err) alert("Error al guardar la nota");
        else alert("Nota guardada!");
    });
}
