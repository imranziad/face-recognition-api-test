$(document).ready(function () {
    var compressedImages = new Array();

    $(".image-upload").ImageResize({
        maxWidth: 800,
        onImageResized: function (imageData) {

        },
        onComplete: function (imageData, isCompleted, src) {
            let imageId = src.attr("id");
            compressedImages[imageId] = imageData;
            let compressedImageDiv = $('#'+imageId+'Compressed');
            compressedImageDiv.html($("<img/>", {
                src: imageData,
                height: 200,
                class: 'd-block'
            }));
            compressedImageDiv.append("Original Image Size: " + Math.round(src[0].files[0].size / 1024) + " KB");
            compressedImageDiv.append("<br>Compressed Blob Size: " + Math.round((new Blob([imageData])).size / 1024) + " KB");
        },
        onFailure: function (message) {
            alert(message);
        }
    });

    var Kairos = {
        appId: null,
        appKey: null,
        galleryName: "People",
        threshold: 0.60,
        maxNumResults: 4,

        setAppId: function(appId) {
            this.appId = appId;
            localStorage.setItem("kairos_app_id", appId);
        },
        getAppId: function() {
            if(this.appId == null)
                this.appId = localStorage.getItem("kairos_app_id");
            return this.appId;
        },
        setAppKey: function(appKey) {
            this.appKey = appKey;
            localStorage.setItem("kairos_app_key", appKey);
        },
        getAppKey: function() {
            if(this.appKey == null)
                this.appKey = localStorage.getItem("kairos_app_key");
            return this.appKey;
        },
        recognize: function(image, imageName, onFinished) {
            var form = new FormData();
            let blob = new Blob([image]);
            form.append("image", blob, imageName);
            form.append("gallery_name", this.galleryName);
            form.append("threshold", this.threshold);
            form.append("max_num_results", this.maxNumResults);
        
            var settings = {
                "url": "https://api.kairos.com/recognize",
                "method": "POST",
                "timeout": 600000,
                "headers": {
                    "app_id": this.getAppId(),
                    "app_key": this.getAppKey()
                },
                "processData": false,
                "contentType": false,
                "data": form
            };
        
            $.ajax(settings).done(onFinished);
        }
    };

    $("#kairosRecognize").click(function() {
        Kairos.recognize(compressedImages["kairosImageRecognize"], "photo", function(res) {
            console.log(res);
        });
    });

    $("#kairosAppIdSet").click(function() {
        var appId = $("#inputKairosAppId").val();
        Kairos.setAppId(appId);
        $("#inputKairosAppId").val("");
    });

    $("#kairosAppIdGet").click(function() {
        $("#inputKairosAppId").val(Kairos.getAppId());
    });

    $("#kairosAppKeySet").click(function() {
        var appKey = $("#inputKairosAppKey").val();
        Kairos.setAppKey(appKey);
        $("#inputKairosAppKey").val("");
    });

    $("#kairosAppKeyGet").click(function() {
        $("#inputKairosAppKey").val(Kairos.getAppKey());
    });
});