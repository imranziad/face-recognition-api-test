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

    var Kairos = {
        appId: null,
        appKey: null,

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
    };

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
});