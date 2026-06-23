
from django.urls import path

from .views import (
    CustomerListView,
    SalesOrderAPIView,
    SalesOrderDetailAPIView,
    SalesQuotationCreateView,
    SalesQuotationDetailView,
    SalesQuotationListView,
)

urlpatterns = [

    path(
        "customers/",
        CustomerListView.as_view()
    ),

    path(
        "quotations/",
        SalesQuotationListView.as_view()
    ),

    path(
        "quotations/create/",
        SalesQuotationCreateView.as_view()
    ),

    path(
        "quotations/<int:pk>/",
        SalesQuotationDetailView.as_view()
    ),

    path(
        "orders/",
        SalesOrderAPIView.as_view()
    ),

    path(
        "orders/<int:pk>/",
        SalesOrderDetailAPIView.as_view()
    ),
]
