from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import models
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import ValidationError




from .models import Item, ItemGroup, ItemPhoto, ItemUnit, Shelf, Manufacturer, Unit, ItemPrice
from .serializers import (
    ItemCreateSerializer,
    ItemDropdownSerializer,
    ItemDetailSerializer,
    ItemPhotoSerializer,
    ItemUnitSerializer,
    ItemUnitCreateSerializer,
    ItemUnitSettingsSerializer,
    ItemPriceListSerializer,
    ItemPriceSaveSerializer,
)


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

        search = request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                models.Q(name_1__icontains=search)
                | models.Q(item_code__icontains=search)
            )

        serializer = ItemDropdownSerializer(queryset, many=True)

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

        units = []
        for item_unit in item.units.select_related("unit"):
            units.append({
                "unit_id": item_unit.unit_id,
                "unit_name": item_unit.unit.name,
            })

        prices = []
        for item_unit in item.units.select_related("unit"):
            item_price = ItemPrice.objects.filter(
                item=item,
                unit=item_unit.unit
            ).first()
            if item_price:
                prices.append({
                    "unit_id": item_unit.unit_id,
                    "sale_price": item_price.sale_price,
                })

        serializer = ItemDetailSerializer({
            "id": item.id,
            "item_code": item.item_code,
            "name": item.name_1,
            "units": units,
            "prices": prices,
        })

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

        protected_units = {
            "stock": item_unit.is_stock_unit,
            "sales": item_unit.is_sales_unit,
        }

        for unit_type, is_selected in protected_units.items():
            if is_selected:
                return Response(
                    {
                        "detail": f"Cannot delete {unit_type} unit."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        item_unit.delete()

        return Response(
            {
                "message": "Unit deleted"
            }
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

        stock_unit_id = serializer.validated_data["stock_unit"]
        sales_unit_id = serializer.validated_data["sales_unit"]

        stock_item_unit = get_object_or_404(
            ItemUnit,
            item=item,
            unit_id=stock_unit_id
        )

        sales_item_unit = get_object_or_404(
            ItemUnit,
            item=item,
            unit_id=sales_unit_id
        )

        # reset existing flags
        item.units.update(
            is_stock_unit=False,
            is_sales_unit=False
        )

        stock_item_unit.is_stock_unit = True
        stock_item_unit.save(
            update_fields=["is_stock_unit"]
        )

        sales_item_unit.is_sales_unit = True
        sales_item_unit.save(
            update_fields=["is_sales_unit"]
        )

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
    



class ItemPriceView(APIView):

    def get(self, request, item_id):

        item = get_object_or_404(
            Item,
            pk=item_id
        )

        prices = []

        for item_unit in item.units.select_related("unit"):

            item_price = ItemPrice.objects.filter(
                item=item,
                unit=item_unit.unit
            ).first()

            prices.append({
                "unit_id": item_unit.unit.id,
                "unit_code": item_unit.unit.code,
                "sale_price": (
                    item_price.sale_price
                    if item_price else None
                ),
                "minimum_price": (
                    item_price.minimum_price
                    if item_price else None
                ),
            })

        serializer = ItemPriceListSerializer({
            "item_id": item.id,
            "item_code": item.item_code,
            "item_name": item.name_1,
            "prices": prices,
        })

        return Response(serializer.data)
    
    def put(self, request, item_id):

        item = get_object_or_404(
            Item,
            pk=item_id
        )

        serializer = ItemPriceSaveSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        for row in serializer.validated_data["prices"]:

            unit_exists = ItemUnit.objects.filter(
                item=item,
                unit_id=row["unit_id"]
            ).exists()

            if not unit_exists:
                raise ValidationError({
                    "unit_id": (
                        f"Unit {row['unit_id']} "
                        "does not belong to this item."
                    )
                })

            ItemPrice.objects.update_or_create(
                item=item,
                unit_id=row["unit_id"],
                defaults={
                    "sale_price": row["sale_price"],
                    "minimum_price": row["minimum_price"],
                }
            )

        return Response({
            "message": "Prices saved"
        })
    
