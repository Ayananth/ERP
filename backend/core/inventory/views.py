from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status



from .models import Item, ItemGroup, Shelf, Manufacturer
from .serializers import ItemCreateSerializer


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
    

class ItemListCreateAPIView(APIView):

    def get(self, request):
        queryset = Item.objects.select_related(
            "group",
            "shelf",
            "manufacturer"
        )

        serializer = ItemCreateSerializer(
            queryset,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):
        serializer = ItemCreateSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )




class ItemDetailAPIView(APIView):

    def get_object(self, pk):
        return get_object_or_404(
            Item.objects.select_related(
                "group",
                "shelf",
                "manufacturer"
            ),
            pk=pk
        )

    def get(self, request, pk):
        item = self.get_object(pk)

        serializer = ItemCreateSerializer(item)

        return Response(serializer.data)

    def put(self, request, pk):
        item = self.get_object(pk)

        serializer = ItemCreateSerializer(
            item,
            data=request.data
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def delete(self, request, pk):
        item = self.get_object(pk)

        item.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )
