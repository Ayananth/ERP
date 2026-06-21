from rest_framework.routers import DefaultRouter
from .views import ItemDropdownView, ItemViewSet
from django.urls import path

router = DefaultRouter()

router.register(
    "items",
    ItemViewSet,
    basename="items"
)

urlpatterns = router.urls


urlpatterns += [
    path(
        "item-dropdowns/",
        ItemDropdownView.as_view(),
        name="item-dropdowns",
    )
]