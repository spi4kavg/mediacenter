from django.conf.urls import url
from views.auth import LoginAPIView, logout
from views.apartment_complex import (
    ApartmentComplexList,
    ApartmentComplexDetail,
    file_import,
    file_export
)


urlpatterns = [
    url(r'login/$', LoginAPIView.as_view(), name="login-api-v1"),
    url(r'logout/$', logout, name="logout-api-v1"),
    url(
        r'apartment-complex/$',
        ApartmentComplexList.as_view(),
        name="apartment-complex-list-v1"
    ),
    url(
        r'apartment-complex/(?P<pk>\d+)$',
        ApartmentComplexDetail.as_view(),
        name="apartment-complex-details-v1"
    ),
    url(
        r'apartment-complex/(?P<pk>\d+)/import/$',
        file_import,
        name="apartment-complex-import-v1"
    ),
    url(
        r'apartment-complex/(?P<pk>\d+)/export/$',
        file_export,
        name="apartment-complex-import-v1"
    ),
]
