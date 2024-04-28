
var input = [];
var height;
var width;
var inp = document.getElementById("file1");
var inp2 = document.getElementById("file2");
var mainpage = document.getElementById("mainpage");
var arr1 = [];
var change = document.getElementById("processingpage");

inp.onchange = function (event) {
  for (let i = 0; i < inp.files.length; i++) {
    input.push(inp.files[i]);
  }
  document.querySelector("#loaderDiv").style.visibility = "visible";
  mainpage.style.display = "none";
  extra();
};

function extra() {
  $(".container2 #file1").remove();
  var loaderbox = document.createElement("div");
  loaderbox.id = "loader-box";
  var mainDiv = document.querySelector("#loaderDiv .col");
  mainDiv.insertBefore(loaderbox, mainDiv.childNodes[1]);

  document.querySelector("#loader").innerHTML = '<p id="loadingMessage"></p>';
  document.querySelector("#loadingMessage").innerHTML =
    "Please Wait ,Compressing Your folder ";
  var count = 0;
  var ans = setInterval(function () {
    count = count + 10;
    console.log(count);
    document.querySelector("#upper-loader").style.width = count + "%";
    if (count == 110) {
      document.querySelector("#upper-loader").style.display = "none";
      document.querySelector("#loaderDiv").style.display = "none";
      document.querySelector(".thankyouBox").style.visibility = "visible";
      document.querySelector("#loader-box").style.display = "none";

      clearInterval(ans);
    }
  }, 1000);
  compress();
}

///main compressing coding

function compress() {
  setTimeout(function () {
    for (let m = 0; m < input.length; m++) {
      var a = input[m].webkitRelativePath.match(/^.*\//);
      zip.folder(a).file(input[m]["name"], input[m]);
    }
    zip.generateAsync({ type: "blob" }).then(function (result) {
      var url = window.URL.createObjectURL(result);
      var download = document.getElementById("downloadButton");
      download.onclick = function () {
        var a = document.createElement("a");
        a.href = url;
        a.download = "Safezipkit-CompressedFolder";
        document.body.appendChild(a);
        a.click();
      };
    });
  }, 10000);
  var zip = new JSZip();
}

document.querySelector(".container2").onclick = function () {
  if(document.querySelector("#file1")){
    document.querySelector("#file1").click();
  }
};