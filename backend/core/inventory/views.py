from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Item, ItemGroup, Shelf, Manufacturer
from .serializers import ItemCreateSerializer


class ItemViewSet(ModelViewSet):

    queryset = Item.objects.select_related(
        "group",
        "shelf",
        "manufacturer"
    )

    serializer_class = ItemCreateSerializer



class ItemDropdownView(APIView):

    def get(self, request):

        return Response({
            "behaviours": [
                {
                    "value": value,
                    "label": label
                }
                for value, label
                in Item.Behaviour.choices
            ],

            "statuses": [
                {
                    "value": value,
                    "label": label
                }
                for value, label
                in Item.Status.choices
            ],

            "taxable_statuses": [
                {
                    "value": value,
                    "label": label
                }
                for value, label
                in Item.TaxableStatus.choices
            ],

            "groups": list(
                ItemGroup.objects.values(
                    "id",
                    "name"
                )
            ),

            "shelves": list(
                Shelf.objects.values(
                    "id",
                    "name"
                )
            ),

            "manufacturers": list(
                Manufacturer.objects.values(
                    "id",
                    "name"
                )
            )
        })