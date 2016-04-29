define([
    'backbone',
    '../models/apartment'
], function (Backbone, ApartmentModel) {
    return Backbone.Collection.extend({
        url: '/api/v1/apartment-complex/',
        model: ApartmentModel,

        create: function (values) {
            var that = this,
                def = $.Deferred();

            that.error = [];
            this.constructor.__super__.create.call(this, {}, {
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
        }
    });
});