define([
    'backbone',
    'underscore',
    'text!../templates/apartment-list.html'
], function (Backbone, _, Template) {
    return Backbone.View.extend({
        template: _.template(Template),

        events: {
            'click .download': 'download'
        },

        initialize: function () {
            this.listenTo(this.collection, 'reset', _.bind(this.render, this));
        },

        download: function (e) {
            var cid = $(e.target).data('cid'),
                model = this.collection.find({id: cid});
            model.download();
            return false;
        },

        render: function () {
            var compiledTempalte = this.template({
                collection: this.collection.models
            });
            this.$el.html(compiledTempalte);
            return this;
        }
    });
});