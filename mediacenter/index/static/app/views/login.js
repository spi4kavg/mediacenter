define([
    'backbone',
    'underscore',
    'text!../templates/login.html'
], function (Backbone, _, Template) {
    return Backbone.View.extend({
        template: _.template(Template),

        events: {
            "submit form": "submit"
        },

        render: function () {
            var compiledTemplate = this.template();
            this.$el.html(compiledTemplate);
            return this;
        },

        submit: function (e) {
            e.preventDefault();
            this.model.set({
                "login": this.$el.find("[name='login']").val(),
                "password": this.$el.find("[name='password']").val()
            });

            if (this.model.isValid()) {
                var def = this.model.save();

                def.then(function () {
                    Backbone.history.navigate("!/", {trigger: true});
                });

                def.fail(_.bind(this.errorHandler, this));
            } else {
                this.errorHandler(this.model.error);
            }
        },

        errorHandler: function (error) {
            if (_.isArray(error)) {
                _.each(error, _.bind(this.errorHandler, this));
            } else if (_.isString(error)) {
                var snackbar = this.$el.find("#login-error-snackbar")[0];
                snackbar.MaterialSnackbar.showSnackbar({
                    message: error,
                    timeout: 2000
                });
            }
        }
    });
});