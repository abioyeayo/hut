_.provide("App.Views.Images");


App.Views.Images = Backbone.View.extend({
    initialize: function(options) {
        this.state = options.state;
        this.views = options.views;
        this.viewButtons = document.getElementById("button_panel");
        this.pendingPanel = document.getElementById("pending_scans");
        this.addedIds = [];
        this.pendingIds = [];
        this.addedDeepIds = [];
        this.render();

        var self = this;

        this.state.on("change:pendingIds", function () {
            self.updatePendingList();
        });

        this.state.on("change:targetData", function () {
            self.checkForRemoval();
            self.update();
        });

        this.state.on("change:editMode", function () {
            self.checkForNonRemoved();
            self.checkForRemoval();
            self.update();
        });

        this.checkAndUpdateDeepButton();
    },
    reset: function () {
        this.addedIds = [];
        this.pendingIds = [];
        this.render();
    },
    update: function() {
        this.checkAndUpdateDeepButton();
        this.updatePendingList();
        var self = this;
        try {
            var targetData = self.state.getTargetData();
            this.state.targets.each(function (target) {
                var id = target.getId()
                var data = targetData[id];

                if (data !== undefined) {
                    if (!self.addedIds.includes(id)) {
                        console.log("Adding ref: " + id);
                        // A new scan and is deep
                        var button = document.createElement("button");
                        button.id = id;
                        button.innerHTML = id;
                        button.className = "image_select_buttons";
                        self.viewButtons.append(button);

                        button.addEventListener("click", function (event) {
                            MapImageController.triggerImage(id, true);
                            button.focus();
                        });
                        self.addedIds.push(id)

                    } else {
                        // An update to a shallow (just switching image)
                        console.log("Condition 4, unexpected " + id)
                    }

                }
            });

        } catch (e) {
            alert("eee : " + e)
        }

    },
    checkAndUpdateDeepButton: function () {
        if (this.state.getDeepAllowed()) {
            $("#rev_deep").show();
            $("#pending_title").show();
        } else {
            $("#rev_deep").hide();
            $("#pending_title").hide();
        }
    },
    checkForRemoval: function () {
        try {
            var self = this;
            var lim = self.addedIds.length;
            if (lim > 0) {
                for (var i = 0; i < lim; i++) {
                    var found = false;
                    // If it is in the added list but us no longer in the sim state, remove it
                    self.state.targets.each(function (target) {
                        if (target.getId() === self.addedIds[i]) {
                            found = true;
                        }
                    });
                    if (!found) {
                        // TODO Check this. I think we can just leave the iRef there. It becomes lost and I doubt this
                        //  will incur measurable memory leakage unless the number of tasks explodes (remember that
                        //  this array is only storing references
                        this.safeRemoveId(self.addedIds[i])
                    }

                }
            }

        } catch (e) {
            alert("cfr " + e)
        }
    },
    /**
     * This is essentially a manual trash collection on the array. Note the newIndex variable to remove gaps as it updates
     * @param id
     */
    safeRemoveId : function (id) {
        var self = this;
        var newArray = [];
        var newIndex = 0;
        for (var i = 0; i < self.addedIds.length; i++) {
            if (self.addedIds[i] !== id) {
                newArray[newIndex] = self.addedIds[i]
                newIndex++;
            } else {
                var button = document.getElementById(self.addedIds[i]);
                button.remove()
            }
        }
        this.addedIds = newArray;
        MapController.clearReviewImage();
    },
    updatePendingList: function () {
        //console.log("Pending: ")
        var self = this;
        var list = ""
        for (var i = 0; i < self.state.getPendingIds().length; i++) {
            //console.log("--" + self.state.getPendingIds()[i]);
            list = list + self.state.getPendingIds()[i] + "<br />"
            try {
                var button = document.getElementById(self.state.getPendingIds()[i]);
                button.remove()
            } catch (e) {
                
            }
            //button.className = "rev_buttons_greyed";
        }
        //console.log(" ")

        if (list === "") {
            this.pendingPanel.innerHTML = "NONE";
        } else {
            this.pendingPanel.innerHTML = list;
        }

        /*
        console.log("=apb=");
        var self = this;
        var ids = this.state.getPendingIds();
        for (var i = 0; i < ids.length; i++) {
            if (!self.addedIds.includes(ids[i]) && !self.addedPendingIds.includes(ids[i])) {
                console.log("Placing pending button");
                var button = document.createElement("button");
                button.id = ids[i];
                button.innerHTML = ids[i] + "(pending...)";
                button.className = "image_select_buttons_greyed";
                $("#rev_deep").prop('disabled', true);
                self.viewButtons.append(button);
                self.addedPendingIds.push(ids[i]);
            }
        }

         */
    },
    checkForNonRemoved : function() {
        try {
            var buttons = document.getElementsByClassName('image_select_buttons');
            for (var i = 0; i < buttons.length; i++) {
                //console.log(buttons[i]);
                var thisId = buttons[i].id;
                MapTargetController.checkIcon(thisId);
            }
        } catch (e) {
            alert(e);
        }

    }

});
