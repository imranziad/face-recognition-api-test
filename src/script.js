$(document).ready(function () {
    $(".image-upload").ImageResize({
        maxWidth: 800,
        onImageResized: function (imageData) {
            $(".images").append($("<img/>", {
                src: imageData
            }));
        },
        onComplete: function (imageData, isCompleted, src) {

        },
        onFailure: function (message) {
            alert(message);
        }
    });

    
});

var kairosRcognize = function() {
    var form = new FormData();
    form.append("image", fileInput.files[0], "/C:/Users/Imran Ziad/Desktop/ML/NTB/datasets/download (1).png");
    form.append("gallery_name", "People");
    form.append("threshold", "0.60");
    form.append("max_num_results", "4");

    var settings = {
        "url": "https://api.kairos.com/recognize",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
            "app_id": "05f64948",
            "app_key": "7d5e55812ccd8393caaedf118dafd903"
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}