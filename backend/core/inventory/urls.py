from .views import ItemDetailAPIView, ItemDropdownView, ItemListCreateAPIView, ItemPhotoAPIView
from django.urls import path

from .views import (
    ItemListCreateAPIView,
    ItemDetailAPIView,
    ItemDropdownView,
    UnitDropdownView,
    ItemUnitListView,
    ItemUnitCreateView,
    ItemUnitDeleteView,
    ItemUnitSettingsView,
)

urlpatterns = [
    path("items/", ItemListCreateAPIView.as_view(), name="item-list-create"),
    path("items/<int:pk>", ItemDetailAPIView.as_view(), name="item-detail"),
    path("item-dropdowns/", ItemDropdownView.as_view(), name="item-dropdowns"),
    path("units/", UnitDropdownView.as_view()),
    path("items/<int:item_id>/units/", ItemUnitListView.as_view()),
    path("items/<int:item_id>/units/add/", ItemUnitCreateView.as_view()),
    path("item-units/<int:pk>/", ItemUnitDeleteView.as_view()),
    path("items/<int:item_id>/unit-settings/", ItemUnitSettingsView.as_view()),

    path(
        "items/<int:item_id>/photo/",
        ItemPhotoAPIView.as_view(),
        name="item-photo"
    ),
]
