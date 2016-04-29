define(['backbone'], function (Backbone) {
    var LoginModel = Backbone.Model.extend({
        url: "/api/v1/login/",

        defaults: {
            "login": "",
            "password": ""
        },

        isValid: function () {
            this.error = "";

            for (var field in this.defaults) {

                if (!this.get(field).length) {
                    this.error = field + " field can't be empty";
                    return false;
                }

                if (/0-9a-zA-Zа-яА-Я/.test(this.get(field))) {
                    this.error = field + " field must include characters and/or numbers";
                    return false;
                }
            }
            return true;
        },

        save: function () {
            var that = this,
                def = $.Deferred();
            that.error = [];
            this.constructor.__super__.save.call(this, {}, {
                "data": this.toJSON(),
                "processData": true,
                "success": function (models, data) {
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
                "error": function () {
                    def.reject("Server error. Try leter");
                }
            });

            return def.promise();
        }
    });

    return LoginModel;
});