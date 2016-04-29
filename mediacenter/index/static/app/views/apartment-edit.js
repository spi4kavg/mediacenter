define([
    'backbone',
    'underscore',
    'text!../templates/apartment-form.html'
], function (Backbone, _, Template) {
    return Backbone.View.extend({
        template: _.template(Template),

        events: {
            'submit form': 'update'
        },

        initialize: function () {
            this.listenTo(this.model, 'change', _.bind(this.render, this));
        },

        render: function () {
            var compiledTemplate = this.template(this.model.toJSON());
            this.$el.html(compiledTemplate);
            componentHandler.upgradeDom();
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

        update: function (e) {
            var name = $("[name='name']").val(),
                city = $("[name='city']").val(),
                street = $("[name='street']").val(),
                house = $("[name='house']").val(),
                structure = $("[name='structure']").val(),
                site = $("[name='site']").val(),
                email = $("[name='email']").val(),
                phone = $("[name='phone']").val();

            def = this.model.save({
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

            e.preventDefault();
        }
    });
});