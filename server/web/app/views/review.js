_.provide("App.Views.Review");


App.Views.Review = Backbone.View.extend({
    initialize: function(options) {
        this.state = options.state;
        this.views = options.views;
        this.canvas = options.canvas;
        this.ctx = options.ctx;

        this.currentImageName = "";
        this.currentImageRef = "";

        this.originalWidth = 0;
        this.originalHeight = 0;

        this.scale = 1;

        this.render();

        this.bind("update", this.update);

    },
    update: function() {

    },
    displayImage: function (id, iRef, update){
        if (update) {
            this.currentImageName = id;
            this.currentImageRef = iRef;
        }
        var self = this;
        self.scale = 1;
        if (self.originalHeight !== 0) {
            // Not the first run, so reset canvas
            $("#image_review_canvas").width(self.originalWidth);
            $("#image_review_canvas").height(self.originalHeight);
        }
        try {
            var img = new Image();
            img.onload = function() {

                self.originalWidth = $("#image_review_canvas").width();
                self.originalHeight = $("#image_review_canvas").height();

                while ($("#image_review_canvas").width() < $("#image_review").width() || $("#image_review_canvas").height() < $("#image_review").height()) {
                    self.scale += 0.25;
                    $("#image_review_canvas").width(self.originalWidth * self.scale);
                    $("#image_review_canvas").height(self.originalHeight * self.scale);

                }

                self.canvas.width = img.width;
                self.canvas.height = img.height;
                self.ctx.drawImage(img, 0, 0, img.width, img.height);
            };
            img.src = iRef;  // Use the argument, so it works regardless of update flag

        } catch (e) {
            alert("update error: " + e)
        }

    },
    clearImage : function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.render();
    },
});
