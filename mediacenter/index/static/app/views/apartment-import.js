define([
    'backbone',
    'underscore',
    'text!../templates/import.html'
], function (Backbone, _, Template) {
    return Backbone.View.extend({
        template: _.template(Template),

        events: {
            'submit form': 'upload'
        },

        initialize: function () {
            if (this.collection) {
                this.listenTo(this.collection, 'reset', _.bind(this.render, this));
            }
        },

        upload: function (e) {
            e.preventDefault();
            this.model.set({
                'id': this.$el.find("[name='pk']").val()
            });
            var formData = new FormData(),
                file = this.$el.find("[name='file']")[0],
                def = this.model.upload(new FormData(this.$el.find("form").get(0))),
                that = this;
            def.then(function (data) {
                if (data.loaded_count) {
                    var snackbar = that.$el.find("#uploading-result-snackback")[0];
                    snackbar.MaterialSnackbar.showSnackbar({
                        message: "Загружено апартаментов: " + data.loaded_count,
                        timeout: 2000
                    });
                }
            });
        },

        render: function () {
            this.$el.html(this.template({
                collection: this.collection? this.collection.models: undefined,
                pk: this.model.get('id')
            }));
            componentHandler.upgradeDom();
            return this;
        }
    });
});