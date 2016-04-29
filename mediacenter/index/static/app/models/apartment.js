define(['backbone', 'jq-file-download'], function (Backbone) {
    return Backbone.Model.extend({
        urlRoot: '/api/v1/apartment-complex/',
        defaults: {
            name: "",
            city: "",
            street: "",
            house: "",
            structure: "",
            site: "",
            email: "",
            phone: ""
        },

        save: function (values) {
            var that = this,
                def = $.Deferred();

            that.error = [];
            this.constructor.__super__.save.call(this, {}, {
                data: values,
                processData: true,
                success: function (model, data) {
                    if (data.errors) {
                        _.each(data.errors, function(v) {
                            _.each(v, function (error) {
                                that.error.push(error);
                            });
                        });
                        def.reject(that.error);
                    }

                    def.resolve();
                },
                error: function () {
                    def.reject("Server error. Try leter");
                }
            });

            return def.promise();
        },

        upload: function (formData) {
            var def = $.Deferred();
            $.ajax({
                "url": this.url() + "/import/",
                "data": formData,
                "method": "POST",
                "processData": false,
                "contentType": false,
                "async": false,
                "success": function (data) {
                    def.resolve(data);
                },
                error: function () {
                    def.reject("Server error. Try leter");
                }
            });

            return def.promise();
        },

        download: function () {
            $.fileDownload(this.url() + "/export/", {});
        }
    });
});