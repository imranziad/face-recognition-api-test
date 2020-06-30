$(document).ready(function () {
    let compressedImage = null;

    $("#image-upload").ImageResize({
        maxWidth: 800,
        onImageResized: function (imageData) {
            
        },
        onComplete: function (imageData, isCompleted, src) {
            compressedImage = imageData;
            let originalSize = Math.round(src[0].files[0].size / 1024);
            let compressedSize = Math.round((new Blob([imageData])).size / 1024);
            let shrinkPercentage = 100 - Math.round((compressedSize/originalSize)*100);

            let compressedImageDiv = $('#image-upload-compressed');
            compressedImageDiv.children(".img-body").html($("<img/>", {
                src: imageData,
                height: 200
            }));
            compressedImageDiv.children(".img-desc").html("");
            compressedImageDiv.children(".img-desc")
                .append("Original Image Size: " + originalSize + " KB");
            compressedImageDiv.children(".img-desc")
                .append("<br>Compressed Blob Size: " + compressedSize + " KB" + " (-" + shrinkPercentage + "%)");
        },
        onFailure: function (message) {
            alert(message);
        }
    });

    var Kairos = {
        appId: null,
        appKey: null,
        galleryName: "People",
        threshold: 0.51,
        maxNumResults: 10,

        setAppId: function (appId) {
            this.appId = appId;
            localStorage.setItem("kairos_app_id", appId);
        },
        getAppId: function () {
            if (this.appId == null)
                this.appId = localStorage.getItem("kairos_app_id");
            return this.appId;
        },
        setAppKey: function (appKey) {
            this.appKey = appKey;
            localStorage.setItem("kairos_app_key", appKey);
        },
        getAppKey: function () {
            if (this.appKey == null)
                this.appKey = localStorage.getItem("kairos_app_key");
            return this.appKey;
        },
        setGallery: function (galleryName) {
            this.galleryName = galleryName;
            localStorage.setItem("kairos_gallery_name", galleryName);
        },
        getGallery: function () {
            if (this.galleryName == null)
                this.galleryName = localStorage.getItem("kairos_gallery_name");
            return this.galleryName;
        },
        recognize: function (image, imageName, onFinished) {
            if(image == null) {
                alert("Image not found");
                return ;
            }

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
        },
        enroll: function(image, imageName, subjectId, multipleFaces, onFinished) {
            if(image == null) {
                alert("Image not found");
                return ;
            }

            var form = new FormData();
            let blob = new Blob([image]);
            form.append("image", blob, imageName);
            form.append("gallery_name", this.galleryName);
            form.append("subject_id", subjectId);
            form.append("multiple_faces", multipleFaces);

            var settings = {
                "url": "https://api.kairos.com/enroll",
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

    $("#kairos-enroll-btn").click(function () {
        $('#kairos-enroll').children(".response")
            .html('<div class="alert alert-info mt-3">Sending image for training...</div>');

        let tags = $('#kairos-enroll-tags').val().split(';');
        console.log(tags);

        tags.forEach(t => {
            Kairos.enroll(compressedImage, "photo", t.trim(), true, function (res) {
                console.log(res);
                // get the Div that will display response
                let responseDisplay = $('#kairos-enroll').children(".response");
    
                // check for errors
                if (res.hasOwnProperty("Errors")) {
                    responseDisplay.html('<div class="alert alert-danger mt-3">Failed: ' + res["Errors"][0]["Message"]+'</div>');
                } else {
                    responseDisplay.html('<div class="alert alert-success mt-3">Trained successfully.</div>');
                }
            });
        });        
    });

    window.kairosEnrollFunc = function(subjectId) {
        $('#kairos-enroll').children(".response")
            .html('<div class="alert alert-info mt-3">Sending image for training...</div>');

        Kairos.enroll(compressedImage, "photo", subjectId.trim(), true, function (res) {
            console.log(res);
            // get the Div that will display response
            let responseDisplay = $('#kairos-enroll').children(".response");

            // check for errors
            if (res.hasOwnProperty("Errors")) {
                responseDisplay.html('<div class="alert alert-danger mt-3">Failed: ' + res["Errors"][0]["Message"]+'</div>');
            } else {
                responseDisplay.html('<div class="alert alert-success mt-3">Trained successfully.</div>');
            }
        });
    };

    $("#kairos-recognize-btn").click(function () {
        $('#kairos-recognize').children(".response")
            .html('<li class="list-group-item">Searching...</li>');

        Kairos.recognize(compressedImage, "photo", function (res) {
            console.log(res);
            // get the Div that will display response
            let responseDisplay = $('#kairos-recognize').children(".response");
            responseDisplay.html('');

            // check for errors
            if (res.hasOwnProperty("Errors")) {
                responseDisplay.append('<li class="list-group-item list-group-item-danger">' + res["Errors"][0]["Message"]+'</li>');
            } else {
                // filter candidates and show matches
                var candidates = filterCandidates(res);
                console.log(candidates);
                candidates.forEach(p => {
                    responseDisplay
                        .append('<li class="list-group-item">' + p.name + ' (' + p.confidence + ')'
                        + ' <button type="button" class="btn btn-outline-primary btn-sm" onclick="kairosEnrollFunc(\''+ p.name + '\')">Accept</button>'
                        + '</li>');
                });

                // in case no matches are found
                if(candidates.length === 0)
                    responseDisplay.append('<li class="list-group-item">No matches found</li>');
            }
        });
    });

    $("#kairosAppIdSet").click(function () {
        var appId = $("#inputKairosAppId").val();
        Kairos.setAppId(appId);
        $("#inputKairosAppId").val("");
    });

    $("#kairosAppIdGet").click(function () {
        $("#inputKairosAppId").val(Kairos.getAppId());
    });

    $("#kairosAppKeySet").click(function () {
        var appKey = $("#inputKairosAppKey").val();
        Kairos.setAppKey(appKey);
        $("#inputKairosAppKey").val("");
    });

    $("#kairosAppKeyGet").click(function () {
        $("#inputKairosAppKey").val(Kairos.getAppKey());
    });

    $("#kairosGallerySet").click(function () {
        var gallery = $("#inputKairosGallery").val();
        Kairos.setGallery(gallery);
        $("#inputKairosGallery").val("");
    });

    $("#kairosGalleryGet").click(function () {
        $("#inputKairosGallery").val(Kairos.getGallery());
    });

    window.clearKairosAll = function() {
        $('#image-upload-compressed').children('.img-body').html('');
        $('#image-upload-compressed').children('.img-desc').html('');
        $("#image-upload").val('')
        clearKairosEnroll();
        clearKairosRecognize();
        compressedImage = null;
    }

    window.clearKairosRecognize = function() {
        $('#kairos-recognize').children(".response").html("");
    }

    window.clearKairosEnroll = function() {
        $('#kairos-enroll').children(".response").html("");
    }

    var filterCandidates = function (data) {
        let candidates = [];

        // merge all the candidates in one list
        data.images.forEach(image => {
            if (image.candidates != null)
                candidates = candidates.concat(image.candidates);
        });
        let result = candidates.map((item) => {
            return item == null ? null : {
                name: item['subject_id'],
                confidence: item['confidence']
            }
        });

        // sort in descending order by confidence
        result.sort((a, b) => (a.confidence < b.confidence) ? 1 : -1);

        // remove duplicates
        result = result.filter((item, index, self) =>
            index === self.findIndex(t => item.name === t.name)
        );
        return result;
    };
});