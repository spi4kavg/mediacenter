define([
    'backbone',
    'underscore',
    'text!../templates/apartment-form.html'
], function (Backbone, _, Template) {
    return Backbone.View.extend({
        template: _.template(Template),

        events: {
            "submit form": 'create'
        },

        render: function () {
            this.$el.html(this.template({
                name: "",
                city: "",
                street: "",
                house: "",
                structure: "",
                site: "",
                email: "",
                phone: ""
            }));
            return this;
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
        },

        create: function (e) {
            var name = $("[name='name']").val(),
                city = $("[name='city']").val(),
                street = $("[name='street']").val(),
                house = $("[name='house']").val(),
                structure = $("[name='structure']").val(),
                site = $("[name='site']").val(),
                email = $("[name='email']").val(),
                phone = $("[name='phone']").val();
            
            e.preventDefault();

            def = this.collection.create({
                name: name,
                city: city,
                street: street,
                house: house,
                structure: structure,
                site: site,
                email: email,
                phone: phone
            });

            def.then(function () {
                Backbone.history.navigate("!/", {trigger: true});
            });

            def.fail(_.bind(this.errorHandler, this));
        }
    });
});