define([
    'backbone',

    'collections/apartment',

    'models/login',
    'models/apartment',

    'views/apartment-list',
    'views/apartment-add',
    'views/apartment-edit',
    'views/apartment-import',
    'views/login',
    'mdl'
], function (
    Backbone,

    ApartmentCollection,

    LoginModel,
    ApartmentModel,

    ApartmentListView,
    ApartmentAddView,
    ApartmentEditView,
    ApartmentImportView,
    LoginView
) {
    return Backbone.Router.extend({
        $container: $("#site-content"),

        routes: {
            '': 'apartmentList',
            '!/': 'apartmentList',
            '!/new-apartment': 'newApartment',
            '!/edit/:id': 'editApartment',
            '!/import/:id': 'import',
            '!/import/': 'import',
            '!/login': 'loginPage'
        },

        initialize: function () {
            Backbone.history.start();
            // check loged in
            $(document).ajaxError(function (event, response) {
                if (response.status === 403) {
                    Backbone.history.navigate("!/login", {trigger: true});
                }
            });
        },

        apartmentList: function () {
            var apartmentCollection = new ApartmentCollection(),
                apartmentView = new ApartmentListView({
                    collection: apartmentCollection
                });

            this.$container.html(apartmentView.render().el);

            apartmentCollection.fetch({reset: true});
        },

        newApartment: function () {
            var apartmentCollection = new ApartmentCollection(),
                apartmentAddView = new ApartmentAddView({
                    collection: apartmentCollection
                });

            this.$container.html(apartmentAddView.render().el);
            componentHandler.upgradeDom();
        },

        editApartment: function (pk) {
            var apartmentModel = new ApartmentModel({id: pk}),
                apartmentView = new ApartmentEditView({
                    model: apartmentModel
                });

            this.$container.html(apartmentView.render().el);

            apartmentModel.fetch({reset: true});
        },

        import: function (pk) {
            var apartmentModel = new ApartmentModel(pk? {id: pk}: undefined),
                collection = !pk? new ApartmentCollection(): undefined,
                importView = new ApartmentImportView({
                    model: apartmentModel,
                    collection: collection
                });

            this.$container.html(importView.render().el);
            if (collection) {
                collection.fetch({reset: true});
            }
            componentHandler.upgradeDom();
        },

        loginPage: function () {
            var loginModel = new LoginModel(),
                loginView = new LoginView({
                    model: loginModel
                });
            this.$container.html(loginView.render().el);
            componentHandler.upgradeDom();
        }
    });
});