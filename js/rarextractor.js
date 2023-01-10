
import { Archive } from "./done/src/libarchive.js";

Archive.init({
  workerUrl: "/js/done/dist/worker-bundle.js",
});
let file = document.getElementById('file')
let Main_filename = document.getElementById('Main_filename')
let extractingDone = document.querySelector('.extractingDone')

//loader
var fileInfoContainerInner = document.getElementById("fileInfoContainerInner");
var loadingdiv = document.createElement("div");
var img = document.createElement("img");
img.setAttribute("src","/assets/images/loading.gif");
img.setAttribute("height","40");
img.setAttribute("width","40");
loadingdiv.appendChild(img);
loadingdiv.style.marginLeft = "50%"
loadingdiv.style.display = "none"
fileInfoContainerInner.appendChild(loadingdiv);

//drag and drop
var input;
let dropContainer = document.getElementById('dropContainer')
dropContainer.ondragover = function (evt) {
    evt.preventDefault();
};
dropContainer.ondrop = function (evt) {
    evt.preventDefault()
    file.files = evt.dataTransfer.files;
    fileHandler()
}
// restart 
document.getElementById("restrartHandler").addEventListener("click", function () {
    location.reload();
    document.getElementById("upload-icon-section").style.display = "block"
    document.querySelector('.download-reset-button').style.display = "none"
    extracted.style.display = "none"
    Main_filename.style.display = "none"
});

// upload button
document.getElementById("uploadFile").addEventListener("click", function () {
    file.click()
});
file.onchange = function () {
    input = file.files[0];
    Main_filename.innerText = file.files[0].name
    ExtFile(input);
  };
  async function ExtFile(input) {
    $("#file").remove();
    document.getElementById("upload-icon-section").style.display = "none"
    loadingdiv.style.display = "block"
    var file = input;
    const archive = await Archive.open(file);
  
    var fileTree = [];
    var uncompFile = {};
    await archive
      .getFilesArray()
      .then(async (z) => {
        for (var f = 0; f < z.length; f++) {
          var Path = z[f].file._path;
          uncompFile[z[f].file._name] = z[f].file;
          var splitPath = Path.split("/");
          var c = buildTree(splitPath, fileTree);
          fileTree = c;
        }
      })
      .then(function () {
        //show tree on page
        setTimeout(function(){ 
          console.log($("#fileInfoContainerInner"))
          document.getElementById("fileInfoContainerInner").innerHTML=""
          extractingDone.innerText = "Archive  successfully extracted"
          document.getElementById("fileInfoContainerInner").style.display = 'block'
          Main_filename.style.display = "block"
          document.getElementById("uploader").style.background = "#fff"
          document.getElementById("dropContainer").style.background = "#fff"
          document.querySelector(".download-reset-button").style.display = "block"
          $("#fileInfoContainerInner").jstree({ core: { data: fileTree } });
          document.querySelector("#download-all").onclick = function () {
            var pt = document.querySelectorAll("#fileInfoContainerInner a");
            for (let i = 0; i < pt.length; i++) {
              pt[i].click();
            }
          };
          $("#fileInfoContainerInner")
            .on("changed.jstree", async function (e, obj) {
              if (!obj.node.data.dir) {
                console.log(obj.node, uncompFile);
    
                const file = await uncompFile[obj.node.text].extract();
    
                download(file, obj.node.text);
              }
            })
            .jstree();
        }, 3000);
        // create link to download all file
      });
  }
  function buildTree(path, filetree) {
    for (var i = 0; i < path.length; i++) {
      var objFound = filetree.find((obj) => {
        return obj.text === path[0];
      });
  
      if (objFound === undefined) {
        filetree.push({
          text: path[0],
          state: { opened: true },
          data: { dir: i === path.length - 1 ? false : true },
          icon: i === path.length - 1 ? './images/file.png' : 'https://img.icons8.com/material-rounded/24/fa314a/folder-invoices.png',
          children: [],
        });
      } else {
        buildTree(path.slice(1), objFound.children);
      }
    }
    return filetree;
  }

