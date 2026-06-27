from django.urls import path

from .views import (
    CustomerListView,
    SalesOrderDetailAPIView,
    SalesOrderListCreateAPIView,
    SalesOrderPdfView,
    SalesQuotationDetailView,
    SalesQuotationListCreateAPIView,
    SalesQuotationPdfView,
)

urlpatterns = [
    path("customers/", CustomerListView.as_view(), name="customer-list"),
    path(
        "quotations/",
        SalesQuotationListCreateAPIView.as_view(),
        name="quotation-list-create",
    ),
    path(
        "quotations/<int:pk>/",
        SalesQuotationDetailView.as_view(),
        name="quotation-detail",
    ),
    path(
        "quotations/<int:pk>/pdf/",
        SalesQuotationPdfView.as_view(),
        name="quotation-pdf",
    ),
    path(
        "orders/",
        SalesOrderListCreateAPIView.as_view(),
        name="order-list-create",
    ),
    path(
        "orders/<int:pk>/",
        SalesOrderDetailAPIView.as_view(),
        name="order-detail",
    ),
    path(
        "orders/<int:pk>/pdf/",
        SalesOrderPdfView.as_view(),
        name="order-pdf",
    ),
]
