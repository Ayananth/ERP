
from django.urls import path

from .views import (
    CustomerListView,
    SalesOrderCreateView,
    SalesOrderDetailAPIView,
    SalesOrderListView,
    SalesOrderPdfView,
    SalesQuotationCreateView,
    SalesQuotationDetailView,
    SalesQuotationListView,
    SalesQuotationPdfView,
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
        "quotations/<int:pk>/pdf/",
        SalesQuotationPdfView.as_view()
    ),

    path(
        "orders/",
        SalesOrderListView.as_view()
    ),

    path(
        "orders/create/",
        SalesOrderCreateView.as_view()
    ),

    path(
        "orders/<int:pk>/",
        SalesOrderDetailAPIView.as_view()
    ),

    path(
        "orders/<int:pk>/pdf/",
        SalesOrderPdfView.as_view()
    ),
]
