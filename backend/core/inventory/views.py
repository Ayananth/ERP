from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status



from .models import Item, ItemGroup, ItemPhoto, ItemUnit, Shelf, Manufacturer, Unit
from .serializers import ItemCreateSerializer, ItemPhotoSerializer, ItemUnitSerializer, ItemUnitCreateSerializer, ItemUnitSettingsSerializer


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


class UnitDropdownView(APIView):

    def get(self, request):

        units = Unit.objects.all()

        data = [
            {
                "id": unit.id,
                "code": unit.code,
                "name": unit.name,
            }
            for unit in units
        ]

        return Response(data)
    


class ItemUnitListView(APIView):

    def get(self, request, item_id):

        item = get_object_or_404(
            Item,
            pk=item_id
        )

        units = item.units.select_related("unit")

        serializer = ItemUnitSerializer(
            units,
            many=True
        )

        stock_unit = units.filter(
            is_stock_unit=True
        ).first()

        sales_unit = units.filter(
            is_sales_unit=True
        ).first()

        # purchase_unit = units.filter(
        #     is_purchase_unit=True
        # ).first()

        return Response({
            "stock_unit": stock_unit.unit_id if stock_unit else None,
            "sales_unit": sales_unit.unit_id if sales_unit else None,
            # "purchase_unit": purchase_unit.unit_id if purchase_unit else None,
            "units": serializer.data,
        })

class ItemUnitCreateView(APIView):

    def post(self, request, item_id):

        item = get_object_or_404(
            Item,
            pk=item_id
        )

        serializer = ItemUnitCreateSerializer(
            data=request.data,
            context={"item": item}
        )

        serializer.is_valid(
            raise_exception=True
        )

        item_unit = ItemUnit.objects.create(
            item=item,
            **serializer.validated_data
        )

        return Response(
            ItemUnitSerializer(item_unit).data,
            status=status.HTTP_201_CREATED
        )
    

class ItemUnitDeleteView(APIView):

    def delete(self, request, pk):

        item_unit = get_object_or_404(
            ItemUnit,
            pk=pk
        )

        item_unit.delete()

        return Response(
            {"message": "Unit deleted"}
        )
    

class ItemUnitSettingsView(APIView):

    def put(self, request, item_id):

        item = get_object_or_404(
            Item,
            pk=item_id
        )

        serializer = ItemUnitSettingsSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        stock_unit = get_object_or_404(
            Unit,
            pk=serializer.validated_data["stock_unit"]
        )

        sales_unit = get_object_or_404(
            Unit,
            pk=serializer.validated_data["sales_unit"]
        )

        item.stock_unit = stock_unit
        item.sales_unit = sales_unit
        item.save()

        return Response({
            "message": "Settings saved"
        })
    

class ItemPhotoAPIView(APIView):

    def get(self, request, item_id):
        item = get_object_or_404(Item, pk=item_id)

        if not hasattr(item, "photo"):
            return Response({"image_url": None})

        serializer = ItemPhotoSerializer(
            item.photo,
            context={"request": request}
        )

        return Response(serializer.data)

    def post(self, request, item_id):
        item = get_object_or_404(Item, pk=item_id)

        image = request.FILES.get("image")

        if not image:
            return Response(
                {"detail": "Image is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        photo, _ = ItemPhoto.objects.get_or_create(
            item=item
        )

        photo.image = image
        photo.save()

        serializer = ItemPhotoSerializer(
            photo,
            context={"request": request}
        )

        return Response(serializer.data)

    def delete(self, request, item_id):
        item = get_object_or_404(Item, pk=item_id)

        if hasattr(item, "photo"):
            item.photo.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )

    def delete(self, request, item_id):

        item = get_object_or_404(Item, pk=item_id)

        if hasattr(item, "photo"):
            item.photo.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )